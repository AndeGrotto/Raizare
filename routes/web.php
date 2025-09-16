<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProdutoController;

Route::get('/', function () {
    return Inertia::render('Dashboard');
});

/*Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('produtos', ProdutoController::class);
});*/

Route::resource('produtos', ProdutoController::class);


