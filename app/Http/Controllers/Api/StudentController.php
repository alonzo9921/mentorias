<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FormResource;
use App\Http\Resources\UserResource;
use App\Models\Forms;
use App\Models\Responses;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    public function mentorsAvailable(Request $request)
    {
        $userMentors = $request->user()->load('mentors');
        $userMentors = $userMentors->mentors->pluck('id');

        $mentors = User::role('mentor')
            ->whereNotIn('id', $userMentors)
            ->with(['career', 'mentor'])
            ->get();

        return response()->json([
            'message' => 'Mentors available',
            'data' => $mentors
        ]);
    }

    public function assignMentor(Request $request)
    {
        $request->validate([
            'mentor_id' => 'required|exists:users,id'
        ]);

        $user = $request->user();
        $user->mentors()->attach($request->mentor_id);

        return response()->json([
            'message' => 'Mentor seleccionado'
        ]);
    }

    public function removeMentor(Request $request)
    {
        $request->validate([
            'mentor_id' => 'required|exists:users,id'
        ]);

        $user = $request->user();
        $user->mentors()->detach($request->mentor_id);

        return response()->json([
            'message' => 'Mentor removido'
        ]);
    }

    public function mentors(Request $request)
    {
        $mentors = $request->user()->mentors->load(['career', 'mentor']);

        return response()->json([
            'data' => UserResource::collection($mentors)
        ]);
    }

    public function mentorForms(Request $request)
    {
        $form = Forms::where('active', true)->with(['questions.options'])->first();

        $mentors = $request->user()->mentors;

        $mentors = $mentors->filter(function ($mentor) use ($request, $form) {
            return !Responses::where('form_id', $form->id)
                ->where('mentor_id', $mentor->id)
                ->where('student_id', $request->user()->id)
                ->exists();
        });

        return response()->json([
            'form' => new FormResource($form),
            'mentors' => UserResource::collection($mentors)
        ]);
    }

    public function evaluateMentor(Request $request)
    {
        try {
            DB::beginTransaction();
            $data = $request->all();
            $user = $request->user();

            $response = Responses::where('form_id', $data['form_id'])
                ->where('mentor_id', $data['mentor_id'])
                ->where('student_id', $user->id)
                ->exists();

            if ($response) {
                throw new \Exception('Ya has evaluado a este mentor', 500);
            }


            foreach ($data['answers'] as $answer) {
                Responses::create([
                    'form_id' => $data['form_id'],
                    'mentor_id' => $data['mentor_id'],
                    'student_id' => $user->id,
                    'form_question_id' => $answer['question_id'],
                    'form_answer_option_id' => $answer['option_id'],
                ]);
            }

            DB::commit();
            return response()->json([
                'message' => 'Evaluación enviada'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al evaluar al mentor',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
