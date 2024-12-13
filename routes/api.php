<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\MentorController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::name('admin.')->prefix('admin')->group(function () {
        Route::get('/forms', [AdminController::class, 'formIndex'])->name('forms.index');
        Route::get('/forms/{id}', [AdminController::class, 'formShow'])->name('forms.show');
        Route::get('/forms/{id}/edit', [AdminController::class, 'formEdit'])->name('forms.edit');
        Route::post('/forms', [AdminController::class, 'storeForm'])->name('forms.store');
        Route::put('/forms/{id}', [AdminController::class, 'activeForm'])->name('forms.active');
        Route::delete('/forms/{id}', [AdminController::class, 'destroyForm'])->name('forms.destroy');

        Route::get('/unit-learning', [AdminController::class, 'indexUnitLearning'])->name('unitLearning.index');
        Route::get('/unit-learning/{id}', [AdminController::class, 'showUnitLearning'])->name('unitLearning.show');
        Route::get('/unit-learning/{id}/edit', [AdminController::class, 'editUnitLearning'])->name('unitLearning.edit');
        Route::post('/unit-learning', [AdminController::class, 'storeUnitLearning'])->name('unitLearning.store');
        Route::put('/unit-learning/{id}', [AdminController::class, 'updateUnitLearning'])->name('unitLearning.update');
        Route::delete('/unit-learning/{id}', [AdminController::class, 'destroyUnitLearning'])->name('unitLearning.destroy');

        Route::post('/recruit', [AdminController::class, 'storeRecruit'])->name('recruit.store');
    });

    Route::name('mentor.')->prefix('mentor')->group(function () {
        Route::get('/my-students', [MentorController::class, 'myStudents'])->name('myStudents');
        Route::get('/my-attention-hours', [MentorController::class, 'myAttentionHours'])->name('myAttentionHours');
        Route::post('/update-attention-hours', [MentorController::class, 'updateAttentionHours'])->name('updateAttentionHours');
        Route::get('/my-evaluations', [MentorController::class, 'myEvaluations'])->name('myEvaluations');
    });

    
    Route::name('alumno.')->prefix('alumno')->group(function () {
        Route::get('/mentors-available', [StudentController::class, 'mentorsAvailable'])->name('mentorsAvailable');
        Route::get('/mentors', [StudentController::class, 'mentors'])->name('mentors');
        Route::post('/assign-mentor', [StudentController::class, 'assignMentor'])->name('assignMentor');
        Route::post('/remove-mentor', [StudentController::class, 'removeMentor'])->name('removeMentor');
        Route::get('/evaluate-mentor', [StudentController::class, 'mentorForms'])->name('evaluateMentor.form');
        Route::post('/evaluate-mentor', [StudentController::class, 'evaluateMentor'])->name('evaluateMentor.submit');
    });
});

Route::name('public.')->group(function () {
    Route::get('/unit-learning', [AdminController::class, 'indexUnitLearning'])->name('unitLearning.index');
    
    Route::get('/recruit', [AdminController::class, 'recruitLast'])->name('recruit');
});

// Route::post('/login', [AuthenticatedSessionController::class, 'createToken'])->name('login.token');