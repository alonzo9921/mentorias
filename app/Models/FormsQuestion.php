<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FormsQuestion extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'form_questions';

    protected $fillable = [
        'form_id',
        'question'
    ];

    /**
     * Obtiene el formulario asociado a la pregunta.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function form()
    {
        return $this->belongsTo(Forms::class);
    }

    /**
     * Obtiene las opciones de respuesta de la pregunta.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function options(){
        return $this->hasMany(AnswerQuestion::class, 'form_question_id');
    }

    public function responses(){
        return $this->hasMany(Responses::class, 'form_question_id');
    }

}
