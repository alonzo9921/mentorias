<?php

namespace App\Http\Controllers;

use App\Http\Resources\FormResource;
use App\Models\Forms;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FormsController extends Controller
{

    public function index()
    {
        $forms = Forms::all();
        return Inertia::render('Admin/Forms', [
            'forms' => $forms,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/CreationForm');
    }

    public function edit($id)
    {
        $form = Forms::with('questions.options')->find($id);
        return Inertia::render('Admin/CreationForm', [
            'form' => new FormResource($form),
        ]);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $data = $request->all();

            $forms = Forms::all();
            $totalForms = $forms->count();

            if ($totalForms > 0) {
                $forms->each(function ($form) {
                    $form->update(['active' => false]);
                });
            }

            $form = Forms::create([
                'name' => $data['title'],
                'description' => '',
                'active' => true,
            ]);
            foreach ($data['questions'] as $question) {
                $formQuestion = $form->questions()->create([
                    'question' => $question['text'],
                ]);

                foreach ($question['options'] as $option) {
                    $formQuestion->options()->create([
                        'option_text' => $option,
                    ]);
                }
            }

            DB::commit();
            return redirect()->route('admin.form.index');
        } catch (\Throwable $th) {
            //throw $th;
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
