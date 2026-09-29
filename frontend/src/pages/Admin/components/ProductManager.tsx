import { useEffect, useState } from "react";
import { Toast } from "../../../shared/components/ui/Toast";
import { ConfirmDialog } from "../../../shared/components/ui/ConfirmDialog";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  stock?: number;
};

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

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>(() => {
    return JSON.parse(
      localStorage.getItem("xbr-products") || "[]"
    );
  });

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [toast, setToast] = useState<ToastState | null>(null);
  const [productToDelete, setProductToDelete] =
    useState<Product | null>(null);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(null), 2500);

    return () => clearTimeout(timer);
  }, [toast]);

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

    if (image.trim()) {
      const looksLikeUrl =
        image.trim().startsWith("http://") ||
        image.trim().startsWith("https://") ||
        image.trim().startsWith("/");

      if (!looksLikeUrl) {
        nextErrors.image =
          "A URL da imagem deve começar com http://, https:// ou /.";
      }
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

  const persistProducts = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem("xbr-products", JSON.stringify(updated));
    window.dispatchEvent(new Event("xbr-products-updated"));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const stockValue = stock.trim() ? Number(stock) : undefined;

    if (editingId !== null) {
      const updatedProducts = products.map((product) =>
        product.id === editingId
          ? {
              ...product,
              name: name.trim(),
              category: category.trim(),
              price: Number(price),
              image: image.trim(),
              stock: stockValue,
            }
          : product
      );

      persistProducts(updatedProducts);

      setEditingId(null);
      setToast({
        message: "Produto atualizado com sucesso!",
        type: "success",
      });
    } else {
      const newProduct: Product = {
        id: Date.now(),
        name: name.trim(),
        category: category.trim(),
        price: Number(price),
        image: image.trim(),
        stock: stockValue,
      };

      persistProducts([...products, newProduct]);

      setToast({
        message: "Produto adicionado com sucesso!",
        type: "success",
      });
    }

    setName("");
    setCategory("");
    setPrice("");
    setImage("");
    setStock("");
    setErrors({});
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setCategory(product.category);
    setPrice(product.price.toString());
    setImage(product.image);
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

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setCategory("");
    setPrice("");
    setImage("");
    setStock("");
    setErrors({});
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
  };

  const confirmDelete = () => {
    if (!productToDelete) return;

    const updatedProducts = products.filter(
      (product) => product.id !== productToDelete.id
    );

    persistProducts(updatedProducts);

    if (editingId === productToDelete.id) {
      handleCancelEdit();
    }

    setToast({
      message: `"${productToDelete.name}" foi excluído.`,
      type: "error",
    });

    setProductToDelete(null);
  };

  const cancelDelete = () => {
    setProductToDelete(null);
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
                placeholder="Preço"
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
                type="text"
                placeholder="URL da imagem (opcional)"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                className={inputClass(!!errors.image)}
              />

              {errors.image && (
                <p className="mt-2 text-xs font-medium text-red-400">
                  {errors.image}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <input
                type="number"
                min="0"
                step="1"
                placeholder="Estoque (opcional)"
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
          </div>

          <div className="relative mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-violet-700/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-violet-500/40 active:scale-[0.98]"
            >
              {editingId !== null
                ? "Salvar alterações"
                : "Adicionar produto"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-2xl border border-border bg-background px-7 py-3.5 font-semibold text-muted transition hover:border-violet-500/50 hover:text-text"
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

          {products.length === 0 ? (
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
        onCancel={cancelDelete}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} />
      )}
    </>
  );
}