<?php

namespace App\Http\Controllers;

use App\Models\LearningUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LearningUnitController extends Controller
{
    //
    public function index()
    {
        $units = LearningUnit::all();
        return Inertia::render('Admin/LearningUnit', [
            'units' => $units,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/LearningUnitForm');
    }

    public function store(Request $request)
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
            return redirect()->route('admin.learning-unit.index');
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
