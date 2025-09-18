import { useEffect, useState } from "react";
import { usePage, Link, Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const tiposFixos = ["Soja", "Milho", "Adubo", "Agrotóxico", "Outro"];

export default function Create() {
  const { produtos = [], errors = {}, user = {} } = usePage().props || {};


  const nomes = [...new Set(produtos.map((p) => p.nome))];
  const tipos =
    produtos.length > 0 ? [...new Set(produtos.map((p) => p.tipo))] : tiposFixos;

  const [data, setData] = useState({
    nome: "",
    tipo: "",
    quantidade_total: "",
    preco_unitario: "",
    preco_total: "",
  });

  const [lastChanged, setLastChanged] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLastChanged(name);
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFocus = (e) => {
    setLastChanged(e.target.name);
  };
  const handleBlur = () => {
    setLastChanged(null);
  };

  useEffect(() => {
    const qt = parseFloat(data.quantidade_total);
    const pu = parseFloat(data.preco_unitario);
    const pt = parseFloat(data.preco_total);

    if (!qt || qt <= 0) return;

    // Controla se vai atualizar campos para evitar loop infinito
    let shouldUpdate = false;
    const updatedFields = {};

    if ((lastChanged === "preco_unitario" || lastChanged === "quantidade_total") && pu) {
      const computedTotal = (qt * pu).toFixed(2);
      if (data.preco_total !== computedTotal) {
        updatedFields.preco_total = computedTotal;
        shouldUpdate = true;
      }
    }

    if ((lastChanged === "preco_total" || lastChanged === "quantidade_total") && pt) {
      const computedUnit = (pt / qt).toFixed(2);
      if (data.preco_unitario !== computedUnit) {
        updatedFields.preco_unitario = computedUnit;
        shouldUpdate = true;
      }
    }

    if (shouldUpdate) {
      setData((prev) => ({
        ...prev,
        ...updatedFields,
      }));
    }
  }, [data.quantidade_total, data.preco_unitario, data.preco_total, lastChanged]);




  const submit = (e) => {
    e.preventDefault();
    if (!data.nome) {
      alert("Informe o nome do produto.");
      return;
    }
    if (!data.tipo) {
      alert("Informe o tipo do produto.");
      return;
    }
    if (!data.quantidade_total || parseFloat(data.quantidade_total) <= 0) {
      alert("Informe uma quantidade válida maior que zero.");
      return;
    }
    if (
      (!data.preco_unitario || parseFloat(data.preco_unitario) <= 0) &&
      (!data.preco_total || parseFloat(data.preco_total) <= 0)
    ) {
      alert("Informe o preço unitário ou o preço total.");
      return;
    }

    Inertia.post(route("produtos.store"), data);
  };

  return (
    <AuthenticatedLayout user={user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Criar Produto</h2>}>
      <Head title="Criar Produto" />

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
          <form onSubmit={submit} className="space-y-6">
            {/* Nome */}
            <div>
              <label htmlFor="nome" className="block font-medium text-sm text-gray-700 dark:text-gray-300">Nome</label>
              <select
                name="nome"
                id="nome"
                value={data.nome}
                onChange={handleChange}
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Selecione um nome</option>
                {nomes.map((nome) => (
                  <option key={nome} value={nome}>{nome}</option>
                ))}
              </select>
              <input
                type="text"
                name="nome"
                value={data.nome}
                onChange={handleChange}
                placeholder="Ou digite outro nome"
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.nome && <div className="text-red-600 mt-1">{errors.nome}</div>}
            </div>

            {/* Tipo */}
            <div>
              <label htmlFor="tipo" className="block font-medium text-sm text-gray-700 dark:text-gray-300">Tipo</label>
              <select
                name="tipo"
                id="tipo"
                value={data.tipo}
                onChange={handleChange}
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Selecione um tipo</option>
                {tipos.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              {errors.tipo && <div className="text-red-600 mt-1">{errors.tipo}</div>}
            </div>

            {/* Quantidade */}
            <div>
              <label htmlFor="quantidade_total" className="block font-medium text-sm text-gray-700 dark:text-gray-300">Quantidade Total</label>
              <input
                type="number"
                name="quantidade_total"
                id="quantidade_total"
                value={data.quantidade_total}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="0"
              />
              {errors.quantidade_total && <div className="text-red-600 mt-1">{errors.quantidade_total}</div>}
            </div>

            {/* Preço Unitário */}
            <div>
              <label htmlFor="preco_unitario" className="block font-medium text-sm text-gray-700 dark:text-gray-300">Preço Unitário (R$)</label>
              <input
                type="number"
                name="preco_unitario"
                id="preco_unitario"
                step="0.01"
                min="0"
                value={data.preco_unitario}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.preco_unitario && <div className="text-red-600 mt-1">{errors.preco_unitario}</div>}
            </div>

            {/* Preço Total */}
            <div>
              <label htmlFor="preco_total" className="block font-medium text-sm text-gray-700 dark:text-gray-300">Preço Total (R$)</label>
              <input
                type="number"
                name="preco_total"
                id="preco_total"
                step="0.01"
                min="0"
                value={data.preco_total}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.preco_total && <div className="text-red-600 mt-1">{errors.preco_total}</div>}
            </div>

            <div className="flex items-center justify-end space-x-4">
              <Link
                href={route("produtos.index")}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
