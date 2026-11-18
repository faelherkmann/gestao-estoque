import { useEffect, useState } from 'react';
import { produtoService } from '@/services/produtoService';

export function useProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    // Evita atualizar o estado se o componente for desmontado antes da resposta chegar
    let ativo = true;

    produtoService
      .listar()
      .then((lista) => {
        if (ativo) setProdutos(lista);
      })
      .catch((falha) => {
        if (ativo) setErro(falha.message);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  async function criar(dados) {
    const novo = await produtoService.criar(dados);
    setProdutos((atuais) => [novo, ...atuais]);
    return novo;
  }

  async function atualizar(id, dados) {
    const atualizado = await produtoService.atualizar(id, dados);
    setProdutos((atuais) => atuais.map((produto) => (produto._id === id ? atualizado : produto)));
    return atualizado;
  }

  async function remover(id) {
    await produtoService.remover(id);
    setProdutos((atuais) => atuais.filter((produto) => produto._id !== id));
  }

  return { produtos, carregando, erro, criar, atualizar, remover };
}