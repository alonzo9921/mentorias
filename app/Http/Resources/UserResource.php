<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'identifier' => $this->identifier,
            'career' => new CareerResource($this->whenLoaded('career')),
            'name' => $this->name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'mentor' => new MentorResource($this->whenLoaded('mentor')),
            'mentors' => UserResource::collection($this->whenLoaded('mentors')),
            'students' => UserResource::collection($this->whenLoaded('students')),
        ];
    }
}
