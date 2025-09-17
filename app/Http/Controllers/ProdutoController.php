<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class ProdutoController extends Controller
{
    public function index()
    {

        /*$produtos = Produto::orderByDesc('id')->get();
        return Inertia::render('Produtos/Index', compact('produtos'));*/
        $produtos = Produto::all();
    return Inertia::render('Produtos/Index', ['produtos' => $produtos]);
    }

    public function create()
    {
        // Lista distinta de nomes cadastrados para select
        $nomes = Produto::select('nome')->distinct()->pluck('nome');

        return Inertia::render('Produtos/Create', [
            'nomes' => $nomes,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nome' => 'required|string|max:255',
            'tipo' => 'nullable|string|max:255',
            'quantidade_total' => 'required|integer|min:0',
            'preco_unitario' => 'required|numeric|min:0',
            'preco_total' => 'required|numeric|min:0',
        ]);

        // Procurar produto existente nome + tipo iguais
        $produto = Produto::where('nome', $data['nome'])
            ->where('tipo', $data['tipo'])
            ->first();

        if ($produto) {
            // Atualiza quantidade e preço total
            $produto->quantidade_total += $data['quantidade_total'];

            // Atualiza preco total somando
            $produto->preco_total += $data['preco_total'];

            // Recalcula preco unitário médio (preco_total dividido quantidade_total)
            if ($produto->quantidade_total > 0) {
                $produto->preco_unitario = $produto->preco_total / $produto->quantidade_total;
            } else {
                $produto->preco_unitario = 0;
            }
            $produto->save();
        } else {
            Produto::create($data);
        }

        return redirect()->route('produtos.index');
    }


    public function edit(Produto $produto)
    {
        // Lista de nomes para o select
        $nomes = Produto::select('nome')->distinct()->pluck('nome');

        return Inertia::render('Produtos/Edit', compact('produto', 'nomes'));
    }

    public function update(Request $request, Produto $produto)
    {
        $data = $request->validate([
            'nome' => 'required|string|max:255',
            'tipo' => 'nullable|string|max:255',
            'quantidade_total' => 'required|integer|min:0',
            'preco_unitario' => 'required|numeric|min:0',
            'preco_total' => 'required|numeric|min:0',
            'forcar_juncao' => 'nullable|boolean' // campo opcional para forçar junção
        ]);

        // Procura se existe outro produto com o mesmo nome/tipo (excluindo o atual)
        $existe = Produto::where('nome', $data['nome'])
            ->where('tipo', $data['tipo'])
            ->where('id', '!=', $produto->id)
            ->first();

        if ($existe && empty($data['forcar_juncao'])) {
            throw ValidationException::withMessages([
                'juncao_possivel' => ["Já existe um produto com esse nome e tipo. Deseja juntar os dois?"],
                'produto_existente_id' => [$existe->id],
            ]);
        }


        if ($existe && !empty($data['forcar_juncao'])) {
            // Faz a soma dos valores, atualiza o produto existente e deleta o atual
            $existe->quantidade_total += $data['quantidade_total'];
            $existe->preco_total += $data['preco_total'];
            $existe->preco_unitario = $existe->quantidade_total ? ($existe->preco_total / $existe->quantidade_total) : 0;
            $existe->save();

            $produto->delete();

            return redirect()->route('produtos.index')->with('success', 'Produtos juntados com sucesso!');
        }

        // Caso padrão: só atualiza normal
        $produto->update($data);
        return redirect()->route('produtos.index')->with('success', 'Produto atualizado com sucesso!');
    }

    public function destroy(Produto $produto)
    {
        $produto->delete();

        return redirect()->route('produtos.index');
    }
}
