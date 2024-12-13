<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ResponseResource;
use App\Http\Resources\UserResource;
use App\Models\Forms;
use App\Models\Responses;
use Illuminate\Http\Request;

class MentorController extends Controller
{
    //
    public function myStudents(Request $request)
    {
        $students = $request->user()->students->load(['career']);
        return response()->json([
            'students' => UserResource::collection($students)
        ]);
    }

    public function myAttentionHours(Request $request)
    {
        $mentor = $request->user()->load('mentor');

        return response()->json([
            'attention_hours' => new UserResource($mentor)
        ]);
    }

    public function updateAttentionHours(Request $request)
    {
        $request->validate([
            'disponibilidad' => 'required'
        ]);

        $user = $request->user()->load('mentor');

        $user->mentor->update(['hrs_attention' => $request->disponibilidad]);

        return response()->json([
            'message' => 'Horarios actualizados',
            'attention_hours' => new UserResource($user)
        ]);
    }

    public function myEvaluations(Request $request)
    {
        $mentorId = $request->user()->id;

        $form = Forms::where('active', true)
            ->with(['questions.options.responses' => function ($query) use ($mentorId) {
                $query->where('mentor_id', $mentorId);
            }])->first();

        $responses = [];
        foreach ($form->questions as $question) {
            $questionData = [
                'question' => $question->question,
                'options' => []
            ];

            foreach ($question->options as $option) {
                $questionData['options'][] = [
                    'option_text' => $option->option_text,
                    'responses_count' => $option->responses->count(),
                ];
            }

            $responses[] = $questionData;
        }

        return response()->json([
            'responses' => $responses
        ]);
    }
}
