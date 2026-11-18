'use client';

import { useState } from 'react';

const CAMPOS_VAZIOS = { nome: '', preco: '', quantidade: '' };

function camposIniciais(produto) {
  if (!produto) return CAMPOS_VAZIOS;

  return {
    nome: produto.nome,
    preco: produto.preco.toFixed(2),
    quantidade: String(produto.quantidade),
  };
}

function validar(campos) {
  const erros = [];
  const preco = Number(campos.preco);
  const quantidade = Number(campos.quantidade);

  if (campos.nome.trim() === '') {
    erros.push('Informe o nome do produto.');
  }
  if (campos.preco === '' || !Number.isFinite(preco) || preco <= 0) {
    erros.push('Informe um preço maior que zero.');
  }
  if (campos.quantidade === '' || !Number.isInteger(quantidade) || quantidade < 0) {
    erros.push('Informe uma quantidade inteira maior ou igual a zero.');
  }

  return erros;
}

export default function ProdutoForm({ produtoInicial, onSalvar, onCancelar }) {
  const [campos, setCampos] = useState(() => camposIniciais(produtoInicial));
  const [erros, setErros] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const emEdicao = Boolean(produtoInicial);
  const textoBotao = emEdicao ? 'Salvar alterações' : 'Cadastrar produto';

  function handleChange(evento) {
    const { name, value } = evento.target;
    setCampos((atuais) => ({ ...atuais, [name]: value }));
  }

  async function handleSubmit(evento) {
    evento.preventDefault();

    const errosEncontrados = validar(campos);
    if (errosEncontrados.length > 0) {
      setErros(errosEncontrados);
      return;
    }

    setErros([]);
    setEnviando(true);

    try {
      await onSalvar({
        nome: campos.nome.trim(),
        preco: Number(campos.preco),
        quantidade: Number(campos.quantidade),
      });

      if (!emEdicao) {
        setCampos(CAMPOS_VAZIOS);
      }
    } catch (falha) {
      setErros([falha.message]);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <div className="campo">
        <label htmlFor="nome">Nome</label>
        <input
          id="nome"
          name="nome"
          type="text"
          maxLength={120}
          placeholder="Ex.: Arroz Integral 1kg"
          value={campos.nome}
          onChange={handleChange}
          required
        />
      </div>

      <div className="campo">
        <label htmlFor="preco">Preço (R$)</label>
        <input
          id="preco"
          name="preco"
          type="number"
          min="0.01"
          step="0.01"
          inputMode="decimal"
          placeholder="0,00"
          value={campos.preco}
          onChange={handleChange}
          required
        />
      </div>

      <div className="campo">
        <label htmlFor="quantidade">Quantidade</label>
        <input
          id="quantidade"
          name="quantidade"
          type="number"
          min="0"
          step="1"
          inputMode="numeric"
          placeholder="0"
          value={campos.quantidade}
          onChange={handleChange}
          required
        />
      </div>

      {erros.length > 0 && (
        <ul className="erros" role="alert">
          {erros.map((mensagem) => (
            <li key={mensagem}>{mensagem}</li>
          ))}
        </ul>
      )}

      <div className="botoes">
        <button type="submit" className="botao-primario" disabled={enviando}>
          {enviando ? 'Salvando...' : textoBotao}
        </button>
        {emEdicao && (
          <button type="button" onClick={onCancelar} disabled={enviando}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}   