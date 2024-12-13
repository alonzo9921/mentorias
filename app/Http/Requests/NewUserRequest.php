<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class NewUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'identifier' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => 'required|string',
            'career' => 'required_if:role,alumno,mentor',
            'phone' => 'required_if:role,alumno,mentor|string|max:255',
            'disponibilidad' => 'required_if:role,mentor',
        ];
    }


    protected function prepareForValidation()
    {
        $this->merge([
            'role' => $this->input('role', 'alumno'),
        ]);
    }

    public function messages()
    {
        return [
            'identifier.required' => 'Matricula obligatoria.',
            'name.required' => 'Nombre obligatorio.',
            'last_name.required' => 'Apellido obligatorio.',
            'email.required' => 'Correo electrónico obligatorio.',
            'email.unique' => 'Correo electrónico registrado.',
            'password.required' => 'Contraseña obligatoria.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
            'role.required' => 'Rol es obligatorio.',
            'career.required_if' => 'Carrera es obligatorio.',
            'phone.required_if' => 'El teléfono es obligatorio.',
            'disponibilidad.required_if' => 'La disponibilidad es obligatoria.',
        ];
    }
}
