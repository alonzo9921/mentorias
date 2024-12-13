<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AnswerQuestion extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'form_answer_options';

    protected $fillable = [
        'form_question_id',
        'option_text'
    ];

    /**
     * Obtiene la pregunta asociada a la respuesta.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */ 
    public function question(){ 
        return $this->belongsTo(FormsQuestion::class); 
    }

    public function responses(){
        return $this->hasMany(Responses::class, 'form_answer_option_id');
    }
}
