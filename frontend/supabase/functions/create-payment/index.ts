import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Sessão inválida" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { orderCode, items, customer, address } = body;

    if (!orderCode || !items || items.length === 0) {
      return new Response(JSON.stringify({ error: "Dados incompletos" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accessToken = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN") ?? "";
    const siteUrl = Deno.env.get("SITE_URL") ?? "";

    // Monta o payload da preferência no formato que o MP espera
    const preferencePayload = {
      external_reference: orderCode,
      items: items.map((item: any) => ({
        id: String(item.productId),
        title: item.name,
        quantity: item.quantity,
        unit_price: Number(item.price),
        currency_id: "BRL",
      })),
      payer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone
          ? {
              area_code: customer.phone.replace(/\D/g, "").slice(0, 2),
              number: customer.phone.replace(/\D/g, "").slice(2),
            }
          : undefined,
      },
      back_urls: {
        success: `${siteUrl}/payment/success`,
        failure: `${siteUrl}/payment/failure`,
        pending: `${siteUrl}/payment/pending`,
      },
      auto_return: "approved",
      statement_descriptor: "XBRSTORE",
      payment_methods: {
        installments: 12,
      },
    };

    // Chama a API do Mercado Pago direto (sem SDK)
    const mpResponse = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(preferencePayload),
      }
    );

    const mpData = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error("Erro do Mercado Pago:", mpData);
      return new Response(
        JSON.stringify({
          error: mpData.message ?? "Erro ao criar preferência no Mercado Pago",
          details: mpData,
        }),
        {
          status: mpResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Atualiza o pedido com o ID da preferência
    await supabase
      .from("orders")
      .update({ payment_id: mpData.id })
      .eq("code", orderCode);

    return new Response(
      JSON.stringify({
        init_point: mpData.init_point,
        sandbox_init_point: mpData.sandbox_init_point,
        preference_id: mpData.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erro:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});