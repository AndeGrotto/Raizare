import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import ProdutoRow from '@/Components/ProdutoRow';

export default function Index() {
  const { produtos, filters = {} } = usePage().props;

  const { data, setData, get, processing } = useForm({
    nome: filters.nome || '',
    tipo: filters.tipo || '',
  });

  // Toast opcional (para aviso curto na página)
  const [toast, setToast] = useState(null); // 'ok' | 'err' | null
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast === 'ok' ? 2200 : 3500);
    return () => clearTimeout(t);
  }, [toast]);

  function submit(e) {
    e.preventDefault();
    get(route('produtos.index'), { preserveState: true, preserveScroll: true });
  }

  function handleDelete(id) {
    if (confirm('Excluir este produto?')) {
      Inertia.delete(route('produtos.destroy', id), { preserveScroll: true });
    }
  }

  function formatCurrency(value) {
    if (value === null || value === undefined || value === '') return '-';
    const n = Number(value);
    if (!Number.isFinite(n)) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
  }

  function formatNumber(value, maxDigits = 3) {
    if (value === null || value === undefined || value === '') return '-';
    const n = Number(value);
    if (!Number.isFinite(n)) return '-';
    return n.toLocaleString('pt-BR', { maximumFractionDigits: maxDigits });
  }

  function formatDateISOToBR(value) {
    if (!value) return '-';
    const [y, m, d] = String(value).split('-');
    if (!y || !m || !d) return value;
    return `${d}/${m}/${y}`;
  }

  const hasItems = produtos && produtos.data && produtos.data.length > 0;

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800">Produtos</h2>
          <Link href={route('produtos.create')} className="btn btn-success">Novo Produto</Link>
        </div>
      }
    >
      <Head title="Produtos" />

      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <form onSubmit={submit} className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nome</label>
                <input
                  className="input input-bordered w-full"
                  name="nome"
                  value={data.nome}
                  onChange={(e) => setData('nome', e.target.value)}
                  placeholder="Buscar por nome"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tipo</label>
                <input
                  className="input input-bordered w-full"
                  name="tipo"
                  value={data.tipo}
                  onChange={(e) => setData('tipo', e.target.value)}
                  placeholder="Buscar por tipo"
                />
              </div>
              <div className="flex items-end gap-2">
                <button className="btn btn-primary" disabled={processing}>Filtrar</button>
                <Link href={route('produtos.index')} className="btn btn-ghost" preserveState preserveScroll>
                  Limpar
                </Link>
              </div>
            </form>

            {!hasItems && (
              <p className="text-gray-600">Nenhum produto cadastrado.</p>
            )}

            {hasItems && (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Tipo</th>
                      <th className="text-right">Quantidade total</th>
                      <th className="text-right">Quantidade restante</th>
                      <th className="text-right">Preço unitário</th>
                      <th className="text-right">Preço total</th>
                      <th>Data de compra</th>
                      <th className="text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.data.map((p) => (
                      <ProdutoRow
                        key={p.id}
                        p={p}
                        onToast={setToast}
                        formatNumber={formatNumber}
                        formatCurrency={formatCurrency}
                        formatDateISOToBR={formatDateISOToBR}
                      />
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 flex flex-wrap gap-2">
                  {produtos.links.map((l, i) => (
                    <Link
                      key={i}
                      href={l.url || '#'}
                      preserveScroll
                      className={`btn btn-sm ${l.active ? 'btn-primary' : ''} ${!l.url ? 'btn-disabled' : ''}`}
                      dangerouslySetInnerHTML={{ __html: l.label }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
