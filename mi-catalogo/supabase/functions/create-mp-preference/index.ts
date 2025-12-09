// supabase/functions/create-mp-preference/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {  // <--- Agregamos : Request
  // 1. Manejo de CORS (Permite que tu React local hable con esta función)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Recibimos los datos del pedido desde el Frontend
    const { orderId, title, price, quantity } = await req.json()

    // 3. Preparamos el "paquete" para Mercado Pago
    const preferenceData = {
      items: [
        {
          id: orderId,
          title: title,
          quantity: Number(quantity),
          currency_id: "CLP",
          unit_price: Number(price),
        },
      ],
      back_urls: {
        success: "http://localhost:5173/success",
        failure: "http://localhost:5173/failure",
        pending: "http://localhost:5173/pending",
      },
      // auto_return: "approved",  <-- BORRA O COMENTA ESTA LÍNEA
    };

    // 4. Llamamos a la API oficial de Mercado Pago
    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get('MP_ACCESS_TOKEN')}` // Aquí usamos la llave que guardaste en el paso anterior
      },
      body: JSON.stringify(preferenceData),
    });

    const mpData = await mpResponse.json();

    // 5. Devolvemos el link de pago al Frontend
    return new Response(
      JSON.stringify(mpData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error: any) {  // <--- Agrega el : any
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})