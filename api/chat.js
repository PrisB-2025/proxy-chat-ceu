export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Validação de segurança: só aceita requisições do tipo POST
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    // 1. Pega a mensagem do cliente que veio no corpo da requisição
    const { question } = await request.json();

    // 2. Seus segredos, lidos das Variáveis de Ambiente da Vercel
    const flowiseUrl = process.env.VITE_FLOWISE_URL;
    const flowiseApiKey = process.env.VITE_FLOWISE_API_KEY;

    // Validação de segurança: verifica se os segredos estão configurados
    if (!flowiseUrl || !flowiseApiKey) {
      console.error("Variáveis de ambiente não configuradas!");
      return new Response('Configuration error on server', { status: 500 });
    }

    // 3. Faz a chamada segura para a sua instância real do Flowise
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

    // 4. Retorna a resposta do Flowise diretamente para o chat do cliente
    return new Response(flowiseResponse.body, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
```    *Eu adicionei algumas validações de segurança extras ao código para torná-lo ainda mais robusto.*
