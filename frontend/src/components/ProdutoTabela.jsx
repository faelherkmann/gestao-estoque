import { formatarPreco } from '@/utils/formatadores';

export default function ProdutoTabela({ produtos, idEmEdicao, onEditar, onExcluir }) {
  if (produtos.length === 0) {
    return <p className="vazio">Nenhum produto cadastrado ainda.</p>;
  }

  return (
    <div className="tabela-container">
      <table className="tabela">
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col" className="numero">Preço unitário</th>
            <th scope="col" className="numero">Quantidade em estoque</th>
            <th scope="col" className="acoes">Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto._id} className={produto._id === idEmEdicao ? 'em-edicao' : undefined}>
              <td>{produto.nome}</td>
              <td className="numero">{formatarPreco(produto.preco)}</td>
              <td className={produto.quantidade === 0 ? 'numero sem-estoque' : 'numero'}>
                {produto.quantidade}
              </td>
              <td className="acoes">
                <button type="button" onClick={() => onEditar(produto)}>
                  Editar
                </button>
                <button type="button" className="botao-perigo" onClick={() => onExcluir(produto)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}