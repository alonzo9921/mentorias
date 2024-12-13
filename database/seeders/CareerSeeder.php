<?php

namespace Database\Seeders;

use App\Models\Career;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CareerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // Desactivar la verificación de claves foráneas
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Eliminar los registros de la tabla careers
        Career::truncate();
        
        // Reactivar la verificación de claves foráneas
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $data = [
            [
                'name' => 'Ingeniería en Sistemas Computacionales',
                'acronym' => 'ISC',
                'academic_division' => 'División Académica de Ciencias y Tecnologías de la Información',
                'academic_division_acronym' => 'DACYTI'
            ],
            [
                'name' => 'Ingeniería en Informática Administrativa',
                'acronym' => 'IIA',
                'academic_division' => 'División Académica de Ciencias y Tecnologías de la Información',
                'academic_division_acronym' => 'DACYTI'
            ],
            [
                'name' => 'Ingeniería en Tecnologías de la Información',
                'acronym' => 'ITI',
                'academic_division' => 'División Académica de Ciencias y Tecnologías de la Información',
                'academic_division_acronym' => 'DACYTI'
            ],
        ];

        foreach ($data as $career) {
            Career::create($career);
        }
    }
}
