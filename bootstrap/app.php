<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\HandleInertiaRequests;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
 
    })

    ->withMiddleware(function ($middleware) {
    $middleware->web([
        // Outros middlewares que você tenha, por exemplo:
        //App\Http\Middleware\EncryptCookies::class,
        //Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        //Illuminate\Session\Middleware\StartSession::class,
        //Illuminate\View\Middleware\ShareErrorsFromSession::class,
        //App\Http\Middleware\VerifyCsrfToken::class,
        //Illuminate\Routing\Middleware\SubstituteBindings::class,

        \App\Http\Middleware\HandleInertiaRequests::class,
        HandleInertiaRequests::class,
    ]);
})
->withExceptions(function ($exceptions) {
        // Exceções padrão ou personalizadas
    })
    ->create();
