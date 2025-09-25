import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function ProdutoRow({ p, formatNumber, formatCurrency, formatDateISOToBR, onToast }) {
  const dlgRef = useRef(null);

  function abrir() {
    dlgRef.current?.showModal();
  }
  function fechar() {
    dlgRef.current?.close();
  }
  function excluir() {
    Inertia.delete(route('produtos.destroy', p.id), {
      preserveScroll: true,
      onSuccess: () => { fechar(); onToast?.('ok'); },
      onError: () => { onToast?.('err'); },
    });
  }

  return (
    <>
      <Link href={route('produtos.edit', p.id)} className="btn btn-sm btn-primary mr-2">
        Editar
      </Link>
      <button onClick={abrir} className="btn btn-sm btn-error">
        Excluir
      </button>

      <dialog ref={dlgRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirmar exclusão</h3>
          <p className="py-4">Excluir “{p.nome}” permanentemente?</p>
          <div className="modal-action">
            <button className="btn" onClick={fechar}>Cancelar</button>
            <button className="btn btn-error" onClick={excluir}>Excluir</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={fechar}>close</button>
        </form>
      </dialog>
    </>
  );
}
