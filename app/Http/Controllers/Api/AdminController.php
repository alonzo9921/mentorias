<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FormResource;
use App\Http\Resources\LearningUnitResource;
use App\Http\Resources\RecruitResource;
use App\Models\Forms;
use App\Models\LearningUnit;
use App\Models\Recruit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function formIndex()
    {
        $forms = Forms::with('questions.options')->get();
        return response()->json([
            'forms' => FormResource::collection($forms),
        ]);
    }

    public function showForm($id)
    {
        $form = Forms::with('questions.options')->find($id);
        return response()->json([
            'form' => new FormResource($form),
        ]);
    }

    public function storeForm(Request $request)
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
            return response()->json([
                'message' => 'Formulario creado',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function activeForm($id)
    {
        try {
            DB::beginTransaction();
            $form = Forms::find($id);
            $form->update(['active' => true]);

            $forms = Forms::where('id', '!=', $id)->get();
            $forms->each(function ($form) {
                $form->update(['active' => false]);
            });

            DB::commit();
            return response()->json([
                'message' => 'Formulario activado',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function destroyForm($id)
    {
        try {
            DB::beginTransaction();
            $form = Forms::find($id);
            $form->delete();
            DB::commit();
            return response()->json([
                'message' => 'Formulario eliminado',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    //! Learning Unit

    public function indexUnitLearning()
    {
        $unitLearnings = LearningUnit::with('contents')->get();
        return response()->json([
            'unitLearnings' => LearningUnitResource::collection($unitLearnings),
        ]);
    }

    public function storeUnitLearning(Request $request)
    {
        try {
            DB::beginTransaction();
            $units = $request->all();
            foreach ($units['unidades'] as $content) {
                $unit = LearningUnit::create([
                    'title' => $content['title'],
                    'description' => $content['description'],
                ]);

                foreach ($content['contents'] as $subcontent) {
                    $unit->contents()->create([
                        'title' => $subcontent['title'],
                        'url_content' => $subcontent['url_content'],
                    ]);
                }
            }
            DB::commit();
            return response()->json([
                'message' => 'Unidad de aprendizaje creadas',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function showUnitLearning($id)
    {
        $unitLearning = LearningUnit::with('contents')->find($id);
        return response()->json([
            'unitLearning' => new LearningUnitResource($unitLearning),
        ]);
    }

    public function updateUnitLearning(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            $unit = LearningUnit::find($id);
            $unit->update([
                'title' => $request->title,
                'description' => $request->description,
            ]);

            $unit->contents()->delete();
            foreach ($request->contents as $content) {
                $unit->contents()->create([
                    'title' => $content['title'],
                    'url_content' => $content['url_content'],
                ]);
            }

            DB::commit();
            return response()->json([
                'message' => 'Unidad de aprendizaje actualizada',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }
    
    public function destroyUnitLearning($id)
    {
        try {
            DB::beginTransaction();
            $unit = LearningUnit::find($id);
            $unit->delete();
            DB::commit();
            return response()->json([
                'message' => 'Unidad de aprendizaje eliminada',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    public function recruitLast(){
        $recruit = Recruit::latest()->first();
        return response()->json([
            'recruit' => $recruit ? new RecruitResource($recruit) : null,
        ]);
    }
    
    public function storeRecruit(Request $request){
        try {
            DB::beginTransaction();
            $recruit = Recruit::create([
                'url' => $request->url,
            ]);
            DB::commit();
            return response()->json([
                'message' => 'Convocatoria actualizada',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
