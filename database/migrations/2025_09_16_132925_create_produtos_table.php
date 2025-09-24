<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('produtos', function (Blueprint $table) {
            $table->id();

            $table->string('nome');                       
            $table->string('tipo');    
            $table->string('unidade', 10);  

            $table->decimal('quantidade_total', 15, 3)->default(0); 
            $table->decimal('quantidade_restante', 15, 3)->default(0); 

            $table->decimal('preco_unitario', 15, 2)->nullable(); 
            $table->decimal('preco_total', 15, 2)->nullable(); 

            $table->string('vendedor')->nullable();      
            $table->date('data_compra')->nullable();   

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produtos'); // rollback padrão [web:14]
    }
};
