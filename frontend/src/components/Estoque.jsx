'use client';

import { useEffect, useState } from 'react';
import { useProdutos } from '@/hooks/useProdutos';
import ProdutoForm from './ProdutoForm';
import ProdutoTabela from './ProdutoTabela';

const TEMPO_AVISO_MS = 4000;

export default function Estoque() {
  const { produtos, carregando, erro, criar, atualizar, remover } = useProdutos();
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);
  const [aviso, setAviso] = useState(null);

  // Esconde o aviso depois de alguns segundos e limpa o timer se o aviso mudar antes disso
  useEffect(() => {
    if (!aviso) return undefined;

    const timer = setTimeout(() => setAviso(null), TEMPO_AVISO_MS);
    return () => clearTimeout(timer);
  }, [aviso]);

  // Erros aqui sobem para o ProdutoForm, que os exibe dentro do formulário
  async function handleSalvar(dados) {
    if (produtoEmEdicao) {
      await atualizar(produtoEmEdicao._id, dados);
      setProdutoEmEdicao(null);
      setAviso({ tipo: 'sucesso', texto: 'Produto atualizado com sucesso.' });
    } else {
      await criar(dados);
      setAviso({ tipo: 'sucesso', texto: 'Produto cadastrado com sucesso.' });
    }
  }

  async function handleExcluir(produto) {
    const confirmou = window.confirm(`Deseja excluir "${produto.nome}" do estoque?`);
    if (!confirmou) return;

    try {
      await remover(produto._id);
      if (produtoEmEdicao?._id === produto._id) {
        setProdutoEmEdicao(null);
      }
      setAviso({ tipo: 'sucesso', texto: 'Produto excluído.' });
    } catch (falha) {
      setAviso({ tipo: 'erro', texto: falha.message });
    }
  }

  return (
    <main className="container">
      <header className="cabecalho">
        <h1>Gestão de Estoque</h1>
        <p>Cadastre, edite e remova os produtos do supermercado.</p>
      </header>

      <section className="cartao">
        <h2>{produtoEmEdicao ? `Editando: ${produtoEmEdicao.nome}` : 'Novo produto'}</h2>
        {/* A key muda ao trocar de produto, então o React recria o formulário com os dados certos */}
        <ProdutoForm
          key={produtoEmEdicao?._id ?? 'novo'}
          produtoInicial={produtoEmEdicao}
          onSalvar={handleSalvar}
          onCancelar={() => setProdutoEmEdicao(null)}
        />
      </section>

      {aviso && (
        <p className={`aviso aviso-${aviso.tipo}`} role="status">
          {aviso.texto}
        </p>
      )}

      <section className="cartao">
        <h2>Produtos em estoque {!carregando && !erro && <span className="contador">{produtos.length}</span>}</h2>

        {carregando && <p className="vazio">Carregando produtos...</p>}

        {!carregando && erro && (
          <p className="erro-carregamento" role="alert">
            {erro} Depois de iniciar o backend, recarregue a página.
          </p>
        )}

        {!carregando && !erro && (
          <ProdutoTabela
            produtos={produtos}
            idEmEdicao={produtoEmEdicao?._id}
            onEditar={setProdutoEmEdicao}
            onExcluir={handleExcluir}
          />
        )}
      </section>
    </main>
  );
}