import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    // 1. Pega o body enviado pelo Mercado Pago
    const body = await req.json().catch(() => ({}));

    console.log("🔔 Webhook recebido:", JSON.stringify(body));

    const { type, data } = body;

    // 2. Só processa notificações de pagamento
    if (type !== "payment" || !data?.id) {
      console.log("⏭️ Ignorando: tipo diferente de payment");
      return new Response("ok", { status: 200 });
    }

    const paymentId = data.id;

    // 3. Consulta o pagamento na API do Mercado Pago
    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN") ?? "";

    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const payment = await mpResponse.json();

    console.log("💳 Pagamento consultado:", {
      id: payment.id,
      status: payment.status,
      external_reference: payment.external_reference,
    });

    // 4. Mapeia status do MP pro nosso status
    const statusMap: Record<string, string> = {
      approved: "Pago",
      pending: "Pendente",
      in_process: "Pendente",
      rejected: "Cancelado",
      cancelled: "Cancelado",
      refunded: "Cancelado",
      charged_back: "Cancelado",
    };

    const newStatus = statusMap[payment.status] ?? "Pendente";
    const orderCode = payment.external_reference;

    if (!orderCode) {
      console.log("❌ Sem external_reference, ignorando");
      return new Response("ok", { status: 200 });
    }

    // 5. Atualiza o pedido no Supabase
    // Usa a service_role key (server-side, tem acesso total)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        payment_id: String(payment.id),
        payment_status: payment.status,
        payment_method: payment.payment_method_id ?? null,
      })
      .eq("code", orderCode);

    if (updateError) {
      console.error("❌ Erro ao atualizar pedido:", updateError);
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 500 }
      );
    }

    console.log(`✅ Pedido ${orderCode} atualizado pra: ${newStatus}`);

    return new Response("ok", { status: 200 });
  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    return new Response("error", { status: 500 });
  }
});