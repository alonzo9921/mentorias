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
        Schema::create('forms', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->boolean('active')->default(true);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('form_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_id')->nullable()->constrained('forms')->cascadeOnDelete();
            $table->string('question')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('form_answer_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_question_id')->nullable()->constrained('form_questions')->cascadeOnDelete();
            $table->string('option_text')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('form_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('form_id')->nullable()->constrained('forms')->cascadeOnDelete();
            $table->foreignId('form_question_id')->nullable()->constrained('form_questions')->cascadeOnDelete();
            $table->foreignId('form_answer_option_id')->nullable()->constrained('form_answer_options')->cascadeOnDelete();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_responses');
        Schema::dropIfExists('form_answer_options');
        Schema::dropIfExists('form_questions');
        Schema::dropIfExists('forms');
    }
};
