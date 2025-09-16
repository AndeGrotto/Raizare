import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';

export default function Index() {
  const { produtos } = usePage().props;

  function handleDelete(id) {
    if (confirm('Excluir este produto?')) {
      Inertia.delete(route('produtos.destroy', id));
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Produtos</h2>
        <Link href={route('produtos.create')} className="btn btn-success">
          Novo Produto
        </Link>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Qtd Total</th>
            <th>Preço Unitário</th>
            <th>Preço Total</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.length > 0 ? produtos.map(produto => (
            <tr key={produto.id}>
              <td>{produto.nome}</td>
              <td>{produto.tipo || '-'}</td>
              <td>{produto.quantidade_total}</td>
              <td>{formatCurrency(produto.preco_unitario)}</td>
              <td>{formatCurrency(produto.preco_total)}</td>

              <td>
                <Link href={route('produtos.edit', produto.id)} className="btn btn-primary btn-sm me-2">
                  Editar
                </Link>
                <button onClick={() => handleDelete(produto.id)} className="btn btn-danger btn-sm">Excluir</button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" className="text-center">Nenhum produto cadastrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
