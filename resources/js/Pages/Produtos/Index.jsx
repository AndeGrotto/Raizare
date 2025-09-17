import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index() {
  const { produtos = [] } = usePage().props;

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Produtos
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
                    <th className="border border-gray-300 px-4 py-2 text-left">Qtd Total</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Qtd Usada</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Preço Unitário</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Preço Total</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((produto) => (
                    <tr key={produto.id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2">{produto.nome}</td>
                      <td className="border border-gray-300 px-4 py-2">{produto.tipo || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2">{produto.quantidade_total}</td>
                      <td className="border border-gray-300 px-4 py-2">{produto.quantidade_usada}</td>
                      <td className="border border-gray-300 px-4 py-2">{produto.preco_unitario}</td>
                      <td className="border border-gray-300 px-4 py-2">{produto.preco_total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-6">
              <Link href="/produtos/create" className="inline-block bg-blue-600 text-white px-4 py-2 rounded">
                Novo Produto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
