import { useMemo, useEffect, useRef, useState } from "react";
import { usePage, Link, Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const TIPOS_FIXOS = ["Soja", "Milho", "Adubo", "Agrotóxico", "Outro"];

export default function Create() {
  // Fallbacks seguros para evitar erros quando props ainda não chegaram
  const { produtos = [], errors = {}, auth: user = {} } = usePage().props || {};

  // Listas únicas para selects
  const nomes = [...new Set(produtos.map((p) => p.nome))];
  const tipos = TIPOS_FIXOS;

  const [modoNovoNome, setModoNovoNome] = useState(false);

  // Estado do formulário
  const [data, setData] = useState({
    nome: "",
    tipo: "",
    quantidade_total: "",
    preco_unitario: "",
    preco_total: "",
  });

  // Qual campo o usuário está editando neste momento
  const [editing, setEditing] = useState(null);

  // Valor bruto que o usuário está digitando no campo monetário atual
  const [rawMoney, setRawMoney] = useState("");


  // Flag para impedir loop ao realizar atualizações programáticas
  const computingRef = useRef(false);

  // fallback seguro caso produtos ainda não tenha carregado
  const listaProdutos = Array.isArray(produtos) ? produtos : [];

  // nome -> tipo (usando o label diretamente)
  const nomeParaTipo = useMemo(() => {
    const map = new Map();
    listaProdutos.forEach((p) => {
      const n = p?.nome?.trim();
      const t = p?.tipo?.trim(); // Ex.: "Soja", "Milho", "Adubo", "Agrotóxico", "Outro"
      if (n && t) map.set(n, t);
    });
    return map;
  }, [listaProdutos]);

  // Handlers de formulário
  function handleFocus(e) {
    setEditing(e.target.name);
  }

  function handleBlur() {
    setEditing(null);
  }

  function handleChange(e) {
    // Se a mudança foi causada por cálculo interno, não tratar como digitação
    if (computingRef.current) return;
    const { name, value } = e.target;
    setEditing(name);
    setData((prev) => ({ ...prev, [name]: value }));
  }

  // Lógica de derivação sem loops:
  // - Se usuário altera preco_unitario: derive preco_total
  // - Se usuário altera preco_total: derive preco_unitario
  // - Se usuário altera quantidade_total: derive a partir do que já existe (PU -> PT, senão PT -> PU)
  useEffect(() => {
    if (computingRef.current) return;

    const qt = Number(data.quantidade_total);
    const pu = Number(data.preco_unitario);
    const pt = Number(data.preco_total);

    if (!isFinite(qt) || qt <= 0) return;

    const next = {};

    if (editing === "preco_unitario") {
      if (isFinite(pu) && pu > 0) {
        const newPT = (qt * pu).toFixed(2);
        if (data.preco_total !== newPT) next.preco_total = newPT;
      }
    } else if (editing === "preco_total") {
      if (isFinite(pt) && pt > 0) {
        const newPU = (pt / qt).toFixed(2);
        if (data.preco_unitario !== newPU) next.preco_unitario = newPU;
      }
    } else if (editing === "quantidade_total") {
      if (isFinite(pu) && pu > 0) {
        const newPT = (qt * pu).toFixed(2);
        if (data.preco_total !== newPT) next.preco_total = newPT;
      } else if (isFinite(pt) && pt > 0) {
        const newPU = (pt / qt).toFixed(2);
        if (data.preco_unitario !== newPU) next.preco_unitario = newPU;
      }
    } else {
      if (isFinite(pu) && pu > 0 && (!isFinite(pt) || pt <= 0)) {
        const newPT = (qt * pu).toFixed(2);
        if (data.preco_total !== newPT) next.preco_total = newPT;
      } else if (isFinite(pt) && pt > 0 && (!isFinite(pu) || pu <= 0)) {
        const newPU = (pt / qt).toFixed(2);
        if (data.preco_unitario !== newPU) next.preco_unitario = newPU;
      }
    }

    if (Object.keys(next).length > 0) {
      computingRef.current = true;
      setData(prev => ({ ...prev, ...next }));
      queueMicrotask(() => { computingRef.current = false; });
    }
  }, [data.quantidade_total, data.preco_unitario, data.preco_total, editing]);


  function submit(e) {
    e.preventDefault();
    const qt = parseFloat(data.quantidade_total);
    const pu = parseFloat(data.preco_unitario);
    const pt = parseFloat(data.preco_total);

    if (!data.nome?.trim()) {
      alert("Informe o nome do produto.");
      return;
    }
    if (!data.tipo?.trim()) {
      alert("Informe o tipo do produto.");
      return;
    }
    if (!isFinite(qt) || qt <= 0) {
      alert("Informe uma quantidade total válida maior que zero.");
      return;
    }
    if ((!isFinite(pu) || pu <= 0) && (!isFinite(pt) || pt <= 0)) {
      alert("Informe preço unitário ou preço total.");
      return;
    }

    Inertia.post(route("produtos.store"), data);
  }

  // "1234567.89" -> "1.234.567,89"
  function formatBR(value) {
    if (value === "" || value === null || value === undefined) return "";
    const n = Number(value);
    if (!isFinite(n)) return "";
    return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Normaliza para "ponto e 2 casas" ou "" se inválido
  function normalize2dec(str) {
    if (str === "" || str === null || str === undefined) return "";
    const n = Number(str);
    if (!isFinite(n)) return "";
    return n.toFixed(2);
  }

  // Máscara ao digitar COM milhares a partir de dígitos -> "1.234.567,89"
  function maskFromDigits(digitsInput) {
    const digits = String(digitsInput || "").replace(/\D/g, "");
    if (!digits) return "";
    const intRaw = digits.slice(0, -2) || "0";
    const frac = digits.slice(-2).padStart(2, "0");
    const int = Number(intRaw).toLocaleString("pt-BR");
    return `${int},${frac}`;
  }

  // Texto pt-BR -> "ponto e 2 casas" para o estado
  function brTextToDot(str) {
    if (!str) return "";
    const s = String(str).replace(/\./g, "").replace(",", ".");
    const n = Number(s);
    if (!isFinite(n)) return "";
    return n.toFixed(2);
  }


  return (
    <AuthenticatedLayout
      user={user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Criar Produto</h2>}
    >
      <Head title="Criar Produto" />

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
          <form onSubmit={submit} className="space-y-6">
            {/* Nome (responsivo 20/80) */}
            <div>
              <label className="block font-medium text-sm text-gray-700 dark:text-gray-300">
                Nome do produto
              </label>

              {/* linha responsiva */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-1">
                {/* Select (20%) — desabilitado quando estiver criando novo */}
                <div className="md:col-span-2">
                  <select
                    id="nome"
                    name="nome"
                    disabled={modoNovoNome}
                    value={data.nome}
                    onChange={(e) => {
                      const nomeSel = e.target.value;
                      const tipoConhecido = nomeParaTipo.get(nomeSel);
                      setData(prev => ({
                        ...prev,
                        nome: nomeSel,
                        ...(nomeSel ? { nome_texto: nomeSel } : {}),
                        ...(tipoConhecido ? { tipo: tipoConhecido } : {}),
                      }));
                    }}
                    className={`mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm ${modoNovoNome ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <option value="">Selecione um nome</option>
                    {nomes.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                {/* Input (80%) — aparece e habilita no modo novo */}
                <div className="md:col-span-3">
                  <input
                    id="nome_texto"
                    name="nome_texto"
                    type="text"
                    placeholder="Ou cadastre um novo nome"
                    disabled={!modoNovoNome}
                    value={data.nome_texto || ""}
                    onChange={(e) => setData(prev => ({ ...prev, nome_texto: e.target.value }))}
                    className={`mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm ${!modoNovoNome ? "opacity-60 cursor-not-allowed" : ""}`}
                  />
                </div>
              </div>

              {/* Controles contextuais */}
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setModoNovoNome(false);
                    // Se havia texto digitado mas vai voltar para select, mantém coerência
                    // opcional: limpar nome_texto quando sair do modo novo
                  }}
                  className={`px-3 py-1 rounded-md text-sm border ${!modoNovoNome ? "bg-indigo-600 text-white border-transparent" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-white border-gray-300"}`}
                >
                  Selecionar existente
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setModoNovoNome(true);
                    // ao entrar no modo novo, opcionalmente limpar o select
                    setData(prev => ({ ...prev, nome: "" }));
                  }}
                  className={`px-3 py-1 rounded-md text-sm border ${modoNovoNome ? "bg-indigo-600 text-white border-transparent" : "bg-white dark:bg-gray-800 text-gray-700 dark:text-white border-gray-300"}`}
                >
                  Cadastrar novo
                </button>
              </div>

              {/* Ajuda: espelha o input quando escolher no select e vice-versa */}
              <p className="mt-1 text-xs text-gray-500">
                Escolha um nome já cadastrado ou clique em “Cadastrar novo” para digitar um diferente. O tipo é preenchido automaticamente quando possível.
              </p>
            </div>


            {/* Tipo */}
            <div>
              <label htmlFor="tipo" className="block font-medium text-sm text-gray-700 dark:text-gray-300">Tipo</label>

              <select
                id="tipo"
                name="tipo"
                value={data.tipo}
                onChange={handleChange}
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Selecione um tipo</option>
                {tipos.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {errors.tipo && <div className="text-red-600 mt-1">{errors.tipo}</div>}
            </div>

            {/* Quantidade Total */}
            <div>
              <label htmlFor="quantidade_total" className="block font-medium text-sm text-gray-700 dark:text-gray-300">
                Quantidade Total
              </label>

              <input
                id="quantidade_total"
                name="quantidade_total"
                type="number"
                min="0"
                value={data.quantidade_total}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />

              {errors.quantidade_total && <div className="text-red-600 mt-1">{errors.quantidade_total}</div>}
            </div>

            {/* Preço Unitário */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-300 pointer-events-none">
                R$
              </span>

              <input
                id="preco_unitario"
                name="preco_unitario"
                type="text"
                inputMode="numeric"
                value={editing === "preco_unitario" ? rawMoney : formatBR(data.preco_unitario)}
                onChange={(e) => {
                  if (computingRef.current) return;
                  setEditing("preco_unitario");
                  const onlyDigits = e.target.value.replace(/\D/g, "");
                  const masked = maskFromDigits(onlyDigits);
                  setRawMoney(masked);
                  const parsed = brTextToDot(masked);
                  setData(prev => ({ ...prev, preco_unitario: parsed }));
                }}
                onFocus={() => {
                  setEditing("preco_unitario");
                  const norm = normalize2dec(data.preco_unitario); // "1234567.89" ou ""
                  setRawMoney(norm ? formatBR(norm) : "");
                }}
                onBlur={() => {
                  setEditing(null);
                  setData(prev => ({ ...prev, preco_unitario: normalize2dec(prev.preco_unitario) }));
                  setRawMoney("");
                }}
                className="pl-9 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />



              {errors.preco_unitario && <div className="text-red-600 mt-1">{errors.preco_unitario}</div>}
            </div>

            {/* Preço Total */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-300 pointer-events-none">
                R$
              </span>

              <input
                id="preco_total"
                name="preco_total"
                type="text"
                inputMode="numeric"
                value={editing === "preco_total" ? rawMoney : formatBR(data.preco_total)}
                onChange={(e) => {
                  if (computingRef.current) return;
                  setEditing("preco_total");
                  const onlyDigits = e.target.value.replace(/\D/g, "");
                  const masked = maskFromDigits(onlyDigits);
                  setRawMoney(masked);
                  const parsed = brTextToDot(masked);
                  setData(prev => ({ ...prev, preco_total: parsed }));
                }}
                onFocus={() => {
                  setEditing("preco_total");
                  const norm = normalize2dec(data.preco_total);
                  setRawMoney(norm ? formatBR(norm) : "");
                }}
                onBlur={() => {
                  setEditing(null);
                  setData(prev => ({ ...prev, preco_total: normalize2dec(prev.preco_total) }));
                  setRawMoney("");
                }}
                className="pl-9 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />



              {errors.preco_total && <div className="text-red-600 mt-1">{errors.preco_total}</div>}
            </div>

            {/* Ações */}
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
