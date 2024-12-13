<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Responses extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'form_responses';

    protected $fillable = [
        'form_id',
        'mentor_id',
        'student_id',
        'form_question_id',
        'form_answer_option_id',
    ];

    /**
     * Obtiene el formulario asociado a la respuesta.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function form()  
    {  
        return $this->belongsTo(Forms::class, 'form_id');  
    }

    /**
     * Obtiene el estudiante asociado a la respuesta.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function student(){ 
        return $this->belongsTo(User::class, 'student_id'); 
    }

    /**
     * Obtiene el mentor asociado a la respuesta.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function mentor(){ 
        return $this->belongsTo(User::class, 'mentor_id'); 
    }

    /**
     * Obtiene la pregunta asociada a la respuesta.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function question(){ 
        return $this->belongsTo(FormsQuestion::class, 'form_question_id');
    }

    /**
     * Obtiene la respuesta asociada a la respuesta.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function answer(){ 
        return $this->belongsTo(AnswerQuestion::class, 'form_answer_option_id');
    }
}
