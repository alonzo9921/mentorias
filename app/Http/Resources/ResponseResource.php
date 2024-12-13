<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResponseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'form_id' => $this->form_id,
            'form' => new FormResource($this->whenLoaded('form')),
            'mentor_id' => $this->mentor_id,
            'student_id' => $this->student_id,
            'form_question_id' => $this->form_question_id,
            'form_question' => new QuestionResource($this->whenLoaded('question')),
            'form_answer_option_id' => $this->form_answer_option_id,
            'form_answer_option' => new OptionsResource($this->whenLoaded('answer')),
        ];
    }
}
