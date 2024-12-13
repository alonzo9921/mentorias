<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('learning_unit', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description');
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('learning_unit_contents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('learning_unit_id')->nullable()->constrained('learning_unit')->cascadeOnDelete();
            $table->string('title');
            $table->string('url_content');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_unit_contents');
        Schema::dropIfExists('learning_unit');
    }
};
