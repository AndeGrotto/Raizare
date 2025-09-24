<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProdutoSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now()->toDateTimeString();

        DB::table('produtos')->insert([
            [
                'nome' => 'Adubo NPK 10-10-10',
                'tipo' => 'Fertilizante',
                'unidade' => 'kg',
                'quantidade_total' => 50.000,
                'quantidade_restante' => 50.000,
                'preco_unitario' => 12.50,
                'preco_total' => 1500.00,
                'vendedor' => 'Fornecedor A',
                'data_compra' => '2025-09-01',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'nome' => 'Adubo NPK 10-10-10',
                'tipo' => 'Fertilizante',
                'unidade' => 'kg',
                'quantidade_total' => 30.000,
                'quantidade_restante' => 30.000,
                'preco_unitario' => 10,
                'preco_total' => 300.00,
                'vendedor' => 'Fornecedor B',
                'data_compra' => '2025-09-10',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'nome' => 'Semente de Milho Híbrido',
                'tipo' => 'Semente',
                'unidade' => 'saca',
                'quantidade_total' => 5.000,
                'quantidade_restante' => 5.000,
                'preco_unitario' => 250.00,
                'preco_total' => 25.000,
                'vendedor' => 'Fornecedor C',
                'data_compra' => '2025-08-20',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'nome' => 'Herbicida XYZ',
                'tipo' => 'Defensivo',
                'unidade' => 'L',
                'quantidade_total' => 20.000,
                'quantidade_restante' => 20.000,
                'preco_unitario' => 80.00,
                'preco_total' => 16.000,
                'vendedor' => 'Fornecedor D',
                'data_compra' => '2025-09-05',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}
