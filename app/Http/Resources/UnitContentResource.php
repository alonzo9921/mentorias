<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UnitContentResource extends JsonResource
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
            'learning_unit_id' => $this->learning_unit_id,
            'learning_unit' => new LearningUnitResource($this->whenLoaded('learning_unit')),
            'title' => $this->title,
            'url_content' => $this->url_content,
        ];
    }
}
