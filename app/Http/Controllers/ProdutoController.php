<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use App\Http\Requests\StoreProdutoRequest;
use App\Http\Requests\UpdateProdutoRequest;
use Inertia\Inertia;

class ProdutoController extends Controller
{
    public function index()
    {
        $produtos = Produto::query()
            ->when(request('nome'), fn($q) => $q->where('nome', 'like', '%' . trim(request('nome')) . '%'))
            ->when(request('tipo'), fn($q) => $q->where('tipo', trim(request('tipo'))))
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Produtos/Index', [
            'produtos' => $produtos,
            'filters' => [
                'nome' => request('nome'),
                'tipo' => request('tipo'),
            ],
        ]);
    }

    public function create()
    {
        // Lista opcional para selects/autocomplete
        $nomes = Produto::select('nome')->distinct()->orderBy('nome')->pluck('nome');

        return Inertia::render('Produtos/Create', [
            'nomes' => $nomes,
        ]);
    }

    public function store(StoreProdutoRequest $request)
    {
        $data = $request->validated();

        // Se não informado, restante = total
        if (!array_key_exists('quantidade_restante', $data) || $data['quantidade_restante'] === null || $data['quantidade_restante'] === '') {
            $data['quantidade_restante'] = $data['quantidade_total'];
        }

        Produto::create($data);

        return redirect()->route('produtos.index')->with('success', 'Produto salvo com sucesso!');
    }

    public function edit(Produto $produto)
    {
        $nomes = Produto::select('nome')->distinct()->orderBy('nome')->pluck('nome');

        return Inertia::render('Produtos/Edit', [
            'produto' => $produto,
            'nomes'   => $nomes,
        ]);
    }

    public function update(UpdateProdutoRequest $request, Produto $produto)
    {
        $data = $request->validated();

        if (!array_key_exists('quantidade_restante', $data) || $data['quantidade_restante'] === null || $data['quantidade_restante'] === '') {
            $data['quantidade_restante'] = $data['quantidade_total'];
        }

        $produto->update($data);

        return redirect()->route('produtos.index')->with('success', 'Produto atualizado com sucesso!');
    }

    public function destroy(Produto $produto)
    {
        $produto->delete();

        // Não redireciona; apenas confirma que deu certo
        return response()->noContent(); // 204
    }
}
