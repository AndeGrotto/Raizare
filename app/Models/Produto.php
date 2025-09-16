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
        'quantidade_total',
        'quantidade_usada',
        'preco_unitario',
        'preco_total',
    ];

    protected $casts = [
        'preco_unitario' => 'decimal:2',
        'preco_total' => 'decimal:2',
    ];
}
