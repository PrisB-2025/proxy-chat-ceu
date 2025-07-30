export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { question } = await request.json();

    const flowiseUrl = process.env.VITE_FLOWISE_URL;
    const flowiseApiKey = process.env.VITE_FLOWISE_API_KEY;

    if (!flowiseUrl || !flowiseApiKey) {
      console.error("Variáveis de ambiente VITE_FLOWISE_URL ou VITE_FLOWISE_API_KEY não estão configuradas na Vercel.");
      return new Response('Configuration error on server.', { status: 500 });
    }

    const flowiseResponse = await fetch(flowiseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${flowiseApiKey}`,
      },
      body: JSON.stringify({
        question: question,
      }),
    });

    const data = await flowiseResponse.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ text: 'Desculpe, ocorreu um erro interno.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
