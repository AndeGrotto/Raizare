<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'tipo',
        'unidade',
        'quantidade_total',
        'quantidade_restante',
        'preco_unitario',
        'preco_total',
        'vendedor',
        'data_compra',
    ];


    protected $casts = [
        'preco_unitario' => 'decimal:2',
        'preco_total' => 'decimal:2',
    ];
}
