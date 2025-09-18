import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function Index() {
  const { produtos = [] } = usePage().props;

  function handleDelete(id) {
    if (confirm('Excluir este produto?')) {
      Inertia.delete(route('produtos.destroy', id));
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Estoque
        </h2>
      }
    >
      <Head title="Produtos" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-white shadow sm:rounded-lg p-6">
            {produtos.length === 0 && (
              <p>Nenhum produto cadastrado.</p>
            )}
            {produtos.length > 0 && (
              <table className="table-fixed w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Nome</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Tipo</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Quantidade Total</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Quantidade Usada</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Preço Unitário</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Preço Total</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos && produtos.length > 0 ? (
                    produtos.map((produto) => (
                      <tr key={produto.id} className="hover:bg-gray-100">
                        <td className="border border-gray-300 px-4 py-2">{produto.nome}</td>
                        <td className="border border-gray-300 px-4 py-2">{produto.tipo || '-'}</td>
                        <td className="border border-gray-300 px-4 py-2">{produto.quantidade_total}</td>
                        <td className="border border-gray-300 px-4 py-2">{produto.quantidade_usada}</td>
                        <td className="border border-gray-300 px-4 py-2">{formatCurrency(produto.preco_unitario)}</td>
                        <td className="border border-gray-300 px-4 py-2">{formatCurrency(produto.preco_total)}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Link href={route('produtos.edit', produto.id)} className="btn btn-primary btn-sm me-2">Editar</Link>
                          <button onClick={() => handleDelete(produto.id)} className="btn btn-danger btn-sm">Excluir</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">Nenhum produto cadastrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
            <div className="mt-6">
              <Link href={route('produtos.create')} className="bg-blue-600 text-white px-4 py-2 rounded">
                Novo Produto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
