import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';
import Swal from 'sweetalert2';

export default function Edit() {
  const { produto, nomes = [] } = usePage().props;
  const tipos = ['Soja', 'Milho', 'Adubo', 'Agrotóxico', 'Outro'];

  const [data, setData] = useState({
    nome: produto.nome || '',
    tipo: produto.tipo || '',
    quantidade_total: produto.quantidade_total || 0,
    preco_unitario: produto.preco_unitario || 0,
    preco_total: produto.preco_total || 0,
  });

  useEffect(() => {
    const { quantidade_total, preco_unitario, preco_total } = data;
    if (quantidade_total && preco_unitario && document.activeElement.name !== 'preco_total') {
      setData(d => ({
        ...d,
        preco_total: (quantidade_total * preco_unitario).toFixed(2),
      }));
    }
    if (quantidade_total && preco_total && document.activeElement.name === 'preco_total') {
      setData(d => ({
        ...d,
        preco_unitario: (preco_total / quantidade_total).toFixed(2),
      }));
    }
  }, [data.quantidade_total, data.preco_unitario, data.preco_total]);

  function onSelectNome(e) {
    setData({ ...data, nome: e.target.value });
  }

  function submit(e) {
    e.preventDefault();

    Inertia.put(route('produtos.update', produto.id), data, {
      onError: (errors) => {
        if (errors.juncao_possivel) {
          Swal.fire({
            title: 'Produto já existe!',
            text: 'Já existe um produto com esse nome e tipo. Deseja juntar os dois registros?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, juntar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              // Faz novo submit do form com forcar_juncao true
              Inertia.put(route('produtos.update', produto.id), {
                ...data,
                forcar_juncao: true
              });
            }
          });
        }
      }
    });
  }

  return (
    <div className="container mt-4">
      <h2>Editar Produto</h2>
      <form onSubmit={submit}>

        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            name="nome"
            type="text"
            className="form-control mb-2"
            value={data.nome}
            onChange={e => setData({ ...data, nome: e.target.value })}
            required
            autoComplete="off"
          />
          {nomes.length > 0 && (
            <select className="form-select mt-1" value="" onChange={onSelectNome}>
              <option value="">(ou selecione um nome já cadastrado)</option>
              {nomes.map((nome, i) => (
                <option key={i} value={nome}>{nome}</option>
              ))}
            </select>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo</label>
          <select
            name="tipo"
            className="form-select"
            value={data.tipo}
            onChange={e => setData({ ...data, tipo: e.target.value })}
            required
          >
            <option value="">Selecione o tipo</option>
            {tipos.map((tipo, i) => (
              <option key={i} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Quantidade Total</label>
          <input
            name="quantidade_total"
            type="number"
            className="form-control"
            value={data.quantidade_total}
            onChange={e => setData({ ...data, quantidade_total: parseInt(e.target.value) || 0 })}
            min="1"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Preço Unitário</label>
          <div className="input-group">
            <span className="input-group-text">R$</span>
            <input
              name="preco_unitario"
              type="number"
              step="0.01"
              className="form-control"
              value={data.preco_unitario}
              onChange={e => setData({ ...data, preco_unitario: parseFloat(e.target.value) || 0 })}
              min="0"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Preço Total</label>
          <div className="input-group">
            <span className="input-group-text">R$</span>
            <input
              name="preco_total"
              type="number"
              step="0.01"
              className="form-control"
              value={data.preco_total}
              onChange={e => setData({ ...data, preco_total: parseFloat(e.target.value) || 0 })}
              min="0"
              required
            />
          </div>
          <div className="form-text">
            Se preencher Quantidade Total e Preço Unitário, o Preço Total será calculado automaticamente.<br />
            Caso altere o Preço Total, o Preço Unitário será ajustado.
          </div>
        </div>

        <button type="submit" className="btn btn-primary me-2">Atualizar</button>
        <Link href={route('produtos.index')} className="btn btn-link">Cancelar</Link>
      </form>
    </div>
  );
}
