import { useEffect, useRef, useState } from "react";
import { Toast } from "../../../shared/components/ui/Toast";
import { ConfirmDialog } from "../../../shared/components/ui/ConfirmDialog";
import { useProducts, type Product } from "../../../shared/hooks/useProducts";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
  type ProductInput,
} from "../../../shared/hooks/useProductsAdmin";

type FormErrors = {
  name?: string;
  category?: string;
  price?: string;
  image?: string;
  stock?: string;
};

type ToastState = {
  message: string;
  type: "success" | "error";
};

function formatInstallment(price: number) {
  const value = price / 12;
  return `12x de ${value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}`;
}

export function ProductManager() {
  const { products, loading, error: fetchError } = useProducts();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [stock, setStock] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [toast, setToast] = useState<ToastState | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-dismiss do toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Auto-dismiss de erro do fetch
  useEffect(() => {
    if (fetchError) {
      setToast({ message: fetchError, type: "error" });
    }
  }, [fetchError]);

  // Preview da imagem (a partir do arquivo OU da URL)
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }

    setImagePreview(imageUrl);
  }, [imageFile, imageUrl]);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Informe o nome do produto.";
    } else if (name.trim().length < 2) {
      nextErrors.name = "O nome precisa ter pelo menos 2 caracteres.";
    }

    if (!category.trim()) {
      nextErrors.category = "Informe a categoria.";
    } else if (category.trim().length < 2) {
      nextErrors.category = "A categoria precisa ter pelo menos 2 caracteres.";
    }

    const parsedPrice = Number(price);

    if (!price.trim()) {
      nextErrors.price = "Informe o preço.";
    } else if (Number.isNaN(parsedPrice)) {
      nextErrors.price = "O preço precisa ser um número.";
    } else if (parsedPrice <= 0) {
      nextErrors.price = "O preço precisa ser maior que zero.";
    }

    if (!imageFile && !imageUrl.trim()) {
      nextErrors.image = "Envie uma imagem ou informe a URL.";
    }

    if (stock.trim()) {
      const parsedStock = Number(stock);

      if (Number.isNaN(parsedStock) || !Number.isInteger(parsedStock)) {
        nextErrors.stock = "O estoque precisa ser um número inteiro.";
      } else if (parsedStock < 0) {
        nextErrors.stock = "O estoque não pode ser negativo.";
      }
    }

    return nextErrors;
  };

  const resetForm = () => {
    setName("");
    setCategory("");
    setPrice("");
    setImageUrl("");
    setImageFile(null);
    setImagePreview("");
    setStock("");
    setEditingId(null);
    setErrors({});

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "A imagem deve ter no máximo 2 MB.",
      }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        image: "Envie apenas arquivos de imagem.",
      }));
      return;
    }

    setImageFile(file);
    setImageUrl("");
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrl("");
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      // 1. Faz upload da imagem se for arquivo novo
      let finalImageUrl = imageUrl;

      if (imageFile) {
        finalImageUrl = await uploadProductImage(imageFile);
      }

      const stockValue = stock.trim() ? Number(stock) : null;
      const parsedPrice = Number(price);

      const input: ProductInput = {
        name: name.trim(),
        category: category.trim(),
        price: parsedPrice,
        image_url: finalImageUrl,
        installment: formatInstallment(parsedPrice),
        rating: 5,
        badge: null,
        stock: stockValue,
      };

      // 2. Atualiza ou cria
      if (editingId !== null) {
        // Se trocou a imagem, deleta a antiga do Storage
        const currentProduct = products.find((p) => p.id === editingId);
        if (
          currentProduct &&
          imageFile &&
          currentProduct.image !== finalImageUrl
        ) {
          try {
            await deleteProductImage(currentProduct.image);
          } catch {
            // ignora erro de delete — o produto já foi atualizado
          }
        }

        await updateProduct(editingId, input);

        setToast({
          message: "Produto atualizado com sucesso!",
          type: "success",
        });
      } else {
        await createProduct(input);

        setToast({
          message: "Produto adicionado com sucesso!",
          type: "success",
        });
      }

      resetForm();
    } catch (err) {
      setToast({
        message:
          err instanceof Error
            ? err.message
            : "Erro ao salvar produto. Tente novamente.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setCategory(product.category);
    setPrice(product.price.toString());
    setImageUrl(product.image);
    setImageFile(null);
    setStock(
      typeof product.stock === "number" ? product.stock.toString() : ""
    );
    setErrors({});

    requestAnimationFrame(() => {
      document
        .getElementById("form-produto")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleCancelEdit = () => resetForm();

  const handleDelete = (product: Product) => setProductToDelete(product);

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setIsSubmitting(true);

    try {
      // Deleta o produto
      await deleteProduct(productToDelete.id);

      // Tenta deletar a imagem do Storage (silencioso se falhar)
      try {
        await deleteProductImage(productToDelete.image);
      } catch {
        // ignora
      }

      if (editingId === productToDelete.id) {
        resetForm();
      }

      setToast({
        message: `"${productToDelete.name}" foi excluído.`,
        type: "error",
      });
    } catch (err) {
      setToast({
        message:
          err instanceof Error ? err.message : "Erro ao excluir produto.",
        type: "error",
      });
    } finally {
      setProductToDelete(null);
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-2xl border bg-background px-5 py-3.5 text-text outline-none placeholder:text-muted transition ${
      hasError
        ? "border-red-500/60 focus:border-red-500"
        : "border-border focus:border-violet-500"
    }`;

  return (
    <>
      <section id="gestao-produtos" className="mt-10">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
            Catálogo
          </span>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-text">
            Gestão de{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              produtos
            </span>
          </h2>
          <p className="mt-2 text-sm text-muted">
            Cadastre, edite e gerencie os produtos da sua loja.
          </p>
        </div>

        <form
          id="form-produto"
          onSubmit={handleSubmit}
          noValidate
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface to-background p-6 scroll-mt-6"
        >
          <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl" />

          <div className="relative mb-5 flex items-center gap-2">
            <span className="text-lg">
              {editingId !== null ? "✏️" : "➕"}
            </span>
            <p className="text-sm font-semibold text-text/80">
              {editingId !== null ? "Editando produto" : "Novo produto"}
            </p>
          </div>

          <div className="relative grid gap-5 md:grid-cols-2">
            <div>
              <input
                type="text"
                placeholder="Nome do produto"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={inputClass(!!errors.name)}
              />
              {errors.name && (
                <p className="mt-2 text-xs font-medium text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Categoria"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className={inputClass(!!errors.category)}
              />
              {errors.category && (
                <p className="mt-2 text-xs font-medium text-red-400">
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Preço (R$)"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className={inputClass(!!errors.price)}
              />
              {errors.price && (
                <p className="mt-2 text-xs font-medium text-red-400">
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="Estoque (vazio = ilimitado)"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                className={inputClass(!!errors.stock)}
              />
              {errors.stock ? (
                <p className="mt-2 text-xs font-medium text-red-400">
                  {errors.stock}
                </p>
              ) : (
                <p className="mt-2 text-xs text-muted/70">
                  Deixe vazio para estoque ilimitado.
                </p>
              )}
            </div>

            {/* Upload de imagem */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-muted">
                Imagem do produto *
              </label>

              {imagePreview ? (
                <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-4">
                  <img
                    src={imagePreview}
                    alt="Prévia"
                    className="mx-auto max-h-48 object-contain"
                  />

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute right-3 top-3 rounded-full border border-border bg-background/90 px-3 py-1 text-xs font-semibold text-text backdrop-blur transition hover:border-red-500/50 hover:text-red-400"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background px-5 py-8 text-sm text-muted transition hover:border-violet-500/50 hover:text-violet-400">
                  <span>📷</span>
                  <span>Escolher imagem (até 2 MB)</span>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}

              {errors.image && (
                <p className="mt-2 text-xs font-medium text-red-400">
                  {errors.image}
                </p>
              )}

              <p className="mt-2 text-xs text-muted/70">
                Ou cole uma URL externa abaixo (opcional)
              </p>

              <input
                type="text"
                placeholder="https://... (URL externa)"
                value={imageUrl}
                onChange={(event) => {
                  setImageUrl(event.target.value);
                  if (event.target.value) setImageFile(null);
                }}
                className={`mt-2 ${inputClass(false)}`}
              />
            </div>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-violet-700/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}
              {isSubmitting
                ? "Salvando..."
                : editingId !== null
                  ? "Salvar alterações"
                  : "Adicionar produto"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
                className="rounded-2xl border border-border bg-background px-7 py-3.5 font-semibold text-muted transition hover:border-violet-500/50 hover:text-text disabled:opacity-60"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-violet-500" />
            <p className="text-sm text-muted">
              <span className="font-bold text-text">{products.length}</span>{" "}
              produto{products.length !== 1 ? "s" : ""} cadastrado
              {products.length !== 1 ? "s" : ""}
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-3xl border border-border bg-surface/60"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-3xl border border-border bg-surface/60 px-6 py-16 text-center">
              <div className="text-5xl">📦</div>

              <p className="mt-4 font-semibold text-text">
                Nenhum produto cadastrado
              </p>

              <p className="mt-2 text-sm text-muted">
                Os produtos adicionados aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface to-background p-5 transition-all duration-500 hover:-translate-y-1 hover:border-violet-500/30 md:flex-row md:items-center"
                >
                  <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl transition-all duration-500 group-hover:bg-violet-600/25" />

                  <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-background">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-3xl">📦</span>
                    )}
                  </div>

                  <div className="relative min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                      {product.category}
                    </p>

                    <h3 className="mt-1 truncate text-lg font-bold text-text">
                      {product.name}
                    </h3>

                    <p className="mt-2 text-lg font-black text-text">
                      {product.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>

                    {typeof product.stock === "number" && (
                      <p
                        className={`mt-1 text-xs font-semibold ${
                          product.stock === 0
                            ? "text-red-400"
                            : product.stock <= 5
                              ? "text-amber-400"
                              : "text-muted"
                        }`}
                      >
                        {product.stock === 0
                          ? "Esgotado"
                          : `${product.stock} em estoque`}
                      </p>
                    )}
                  </div>

                  <div className="relative flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      className="rounded-2xl border border-violet-500/20 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-400 transition hover:bg-violet-500/20"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                    >
                      Excluir
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={productToDelete !== null}
        title="Excluir produto?"
        description={
          productToDelete
            ? `Tem certeza que deseja excluir "${productToDelete.name}"? Essa ação não pode ser desfeita.`
            : undefined
        }
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setProductToDelete(null)}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}