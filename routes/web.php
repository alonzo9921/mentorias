<?php

use App\Http\Controllers\FormsController;
use App\Http\Controllers\LearningUnitController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/dashboard', function (Request $request) {
    $roles = $request->user()->getRoleNames();

    $role = $roles->first();

    if ($role == 'admin') {
        return redirect()->route('admin.dashboard');
    } elseif ($role == 'mentor') {
        return redirect()->route('mentor.dashboard');
    } elseif ($role == 'alumno') {
        return redirect()->route('alumno.dashboard');
    }
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    Route::name('admin.')->middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Dashboard'); //aquí va la ruta a su dashboard correspondiente
        })->name('dashboard');
    });


    Route::name('mentor.')->middleware('role:mentor')->prefix('mentor')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Dashboard'); //aquí va la ruta a su dashboard correspondiente
        })->name('dashboard');
    });


    Route::name('alumno.')->middleware('role:alumno')->prefix('alumno')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Dashboard'); //aquí va la ruta a su dashboard correspondiente
        })->name('dashboard');
    });
});

Route::get('/convocatoria', function () {
    return Inertia::render('Convocatoria');
})->name('convocatoria');

require __DIR__ . '/auth.php';
