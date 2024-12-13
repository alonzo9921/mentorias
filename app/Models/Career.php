<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Career extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'careers';
    
    protected $fillable = [
        'name', 
        'acronym', 
        'academic_division', 
        'academic_division_acronym'
    ];
}
