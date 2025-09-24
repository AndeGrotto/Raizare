<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProdutoRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Permite a atualização; ajuste se houver policies/gates
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => ['required','string','max:255'],
            'tipo' => ['required','string','max:255'],
            'unidade' => ['required','string','max:10'],
            'quantidade_total' => ['required','numeric','min:0.001'],
            'quantidade_restante' => ['nullable','numeric','min:0'],
            'preco_unitario' => ['nullable','numeric','min:0'],
            'preco_total' => ['nullable','numeric','min:0'],
            'vendedor' => ['nullable','string','max:255'],
            'data_compra' => ['nullable','date'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $toNumber = function ($v) {
            if ($v === null || $v === '') return $v;
            $s = str_replace(['.', ','], ['', '.'], (string)$v);
            return is_numeric($s) ? $s : $v;
        };

        $this->merge([
            'quantidade_total' => $toNumber($this->input('quantidade_total')),
            'quantidade_restante' => $toNumber($this->input('quantidade_restante')),
            'preco_unitario' => $toNumber($this->input('preco_unitario')),
            'preco_total' => $toNumber($this->input('preco_total')),
        ]);
    }
}
