<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Forms extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'forms';

    protected $fillable = [
        'name',
        'description',
        'active'
    ];

    /**
     * Obtiene las preguntas asociadas al formulario.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function questions()
    {
        return $this->hasMany(FormsQuestion::class, 'form_id');
    }

    protected function casts(): array
    {
        return [
            'active' => 'boolean',
        ];
    }


    public function responses()
    {
        return $this->hasMany(Responses::class, 'form_id');
    }
}
