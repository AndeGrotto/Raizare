// resources/js/components/ProdutoRow.jsx
import React, { useState } from 'react';
import { route } from 'ziggy-js';
import { Inertia } from '@inertiajs/inertia';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';

export default function ProdutoRow({ p, onToast, formatNumber, formatCurrency, formatDateISOToBR }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <tr className="hover">
        <td>{p.nome}</td>
        <td>{p.tipo || '-'}</td>
        <td className="text-right">{formatNumber?.(p.quantidade_total) ?? p.quantidade_total}</td>
        <td className="text-right">{formatNumber?.(p.quantidade_restante) ?? p.quantidade_restante}</td>
        <td className="text-right">{formatCurrency?.(p.preco_unitario) ?? p.preco_unitario}</td>
        <td className="text-right">{formatCurrency?.(p.preco_total) ?? p.preco_total}</td>
        <td>{formatDateISOToBR?.(p.data_compra) ?? p.data_compra}</td>
        
        {/* ... suas células com dados e botão editar ... */}
        <td className="text-right space-x-2">
          <button
            type="button"
            className="btn btn-primary btn-sm normal-case"
            onClick={() => Inertia.visit(route('produtos.edit', p.id))} // ou passe onEditar via props
          >
            Editar
          </button>

          <button
            type="button"
            className="btn btn-error btn-sm text-white normal-case bg-red-600"
            onClick={() => setConfirmOpen(true)}
          >
            Excluir
          </button>
        </td>
      </tr>

      <ConfirmDeleteModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        destroyRoute={route('produtos.destroy', p.id)}
        onDone={(status) => onToast?.(status)} // opcional: refletir no toast da página
      />
    </>
  );
}
