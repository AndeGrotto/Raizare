// resources/js/components/ConfirmDeleteModal.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function ConfirmDeleteModal({ open, onClose, destroyRoute, onDone }) {
    const dialogRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [ok, setOk] = useState(false);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open) {
            if (!dialog.open) dialog.showModal();
        } else {
            if (dialog.open) dialog.close();
        }
    }, [open]);

    function handleCancel() {
        if (loading) return;
        onClose?.();
    }

    function handleConfirm() {
        if (loading) return;
        setLoading(true);

        Inertia.delete(destroyRoute, {
            preserveScroll: true,

            onSuccess: () => {
                console.log('delete ok'); // deve aparecer com status 204
                setOk(true);
                setLoading(false);
                setTimeout(() => {
                    setOk(false);
                    onClose?.();
                    onDone?.('ok');
                }, 1500);
            },

            onError: (e) => {
                console.log('delete err', e); // veja detalhes do erro no console
                setLoading(false);
                onDone?.('err');
                // manter modal aberto ajuda a tentar de novo
            },
        });
    }

    return (
        <dialog ref={dialogRef} className="modal">
            <div className="modal-box max-w-lg">
                {/* Cabeçalho com ícone condicional */}
                <div className="flex flex-col items-center text-center space-y-3">
                    {ok ? (
                        <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center">
                            <svg className="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none">
                                <path d="M20 7L9 18l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    ) : (
                        <div className="rounded-full bg-red-100 w-12 h-12 flex items-center justify-center">
                            <svg className="w-7 h-7 text-red-600" viewBox="0 0 24 24" fill="none">
                                <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
                    <h3 className="text-lg font-semibold">
                        {ok ? 'Excluído com sucesso' : 'Confirmar exclusão'}
                    </h3>
                    {!ok && (
                        <p className="text-base-content/70">
                            Esta ação é permanente e não poderá ser desfeita.
                        </p>
                    )}
                </div>

                {/* Rodapé com botões */}
                <div className="modal-action justify-between">
                    {!ok ? (
                        <>
                            <button
                                className="btn"
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-error text-white"
                                type="button"
                                onClick={handleConfirm}
                                disabled={loading}
                            >
                                {loading ? 'Excluindo...' : 'Confirmar exclusão'}
                            </button>
                        </>
                    ) : (
                        <div className="w-full">
                            <div className="alert alert-success">
                                <span>Registro excluído com sucesso.</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <form method="dialog" className="modal-backdrop" onClick={handleCancel}>
                <button>close</button>
            </form>
        </dialog>
    );
}
