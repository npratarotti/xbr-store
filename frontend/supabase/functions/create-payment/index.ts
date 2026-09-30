import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { MercadoPagoConfig, Preference } from "https://esm.sh/mercadopago@2";

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

    const client = new MercadoPagoConfig({
      accessToken: Deno.env.get("MERCADOPAGO_ACCESS_TOKEN") ?? "",
    });

    const preference = new Preference(client);

    const siteUrl = Deno.env.get("SITE_URL") ?? "";

    const result = await preference.create({
      body: {
        external_reference: orderCode,
        items: items.map((item: any) => ({
          id: String(item.productId),
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
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
      },
    });

    await supabase
      .from("orders")
      .update({ payment_id: result.id })
      .eq("code", orderCode);

    return new Response(
      JSON.stringify({
        init_point: result.init_point,
        sandbox_init_point: result.sandbox_init_point,
        preference_id: result.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erro:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});