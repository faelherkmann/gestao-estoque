const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

async function requisicao(caminho, opcoes = {}) {
  let resposta;

  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      ...opcoes,
      headers: opcoes.body ? { 'Content-Type': 'application/json' } : undefined,
    });
  } catch {
    // fetch só rejeita em falha de rede (API desligada, CORS, sem internet)
    throw new Error('Não foi possível conectar à API. Verifique se o backend está rodando.');
  }

  if (resposta.status === 204) {
    return null;
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const mensagem = dados?.detalhes?.join('; ') || dados?.erro || `Erro ${resposta.status}`;
    throw new Error(mensagem);
  }

  return dados;
}

export const produtoService = {
  listar: () => requisicao('/produtos'),

  criar: (produto) =>
    requisicao('/produtos', { method: 'POST', body: JSON.stringify(produto) }),

  atualizar: (id, produto) =>
    requisicao(`/produtos/${id}`, { method: 'PUT', body: JSON.stringify(produto) }),

  remover: (id) => requisicao(`/produtos/${id}`, { method: 'DELETE' }),
};