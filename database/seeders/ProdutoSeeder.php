<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Produto;

class ProdutoSeeder extends Seeder
{
    public function run()
    {
        Produto::create([
            'nome' => 'Produto Teste 1',
            'tipo' => 'Material',
            'quantidade_total' => 100,
            'quantidade_usada' => 20,
            'preco_unitario' => 15.50,
            'preco_total' => 1550.00,
        ]);

        Produto::create([
            'nome' => 'Produto Teste 2',
            'tipo' => 'Ferramenta',
            'quantidade_total' => 50,
            'quantidade_usada' => 5,
            'preco_unitario' => 100.00,
            'preco_total' => 5000.00,
        ]);
    }
}
