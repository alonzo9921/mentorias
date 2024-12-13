<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UnitContent extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'learning_unit_contents';

    protected $fillable = [
        'learning_unit_id',
        'title',
        'url_content',
    ];

    public function learningUnit()
    {
        return $this->belongsTo(LearningUnit::class, 'learning_unit_id');
    }   
    
}
