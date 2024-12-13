<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LearningUnit extends Model
{
    use HasFactory;
    use SoftDeletes;

    public $table = 'learning_unit';

    protected $fillable = [
        'title',
        'description',
    ];

    public function contents()
    {
        return $this->hasMany(UnitContent::class, 'learning_unit_id');
    }

}
