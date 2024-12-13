<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\NewUserRequest;
use App\Http\Resources\CareerResource;
use App\Models\Career;
use App\Models\Mentor;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        $career = CareerResource::collection(Career::all());
        return Inertia::render('RegistroForm', [
            'careers' => $career,
        ] );
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(NewUserRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'identifier' => $data['identifier'],
        ]);

        $user->assignRole($request->role);

        if($data['role'] === 'alumno' || $data['role'] === 'mentor') {
            $user->phone = $data['phone'];
            $user->career_id = $data['career']['id'];
            $user->save();
        }

        if ($request->role === 'mentor') {
            Mentor::create([
                'user_id' => $user->id,
                'hrs_attention' => $data['disponibilidad'],
            ]);
        }

        event(new Registered($user));

        Auth::login($user);

        switch ($data['role']) {
            case 'alumno':
                return redirect(route('alumno.dashboard', absolute: false));
            case 'mentor':
                return redirect(route('mentor.dashboard', absolute: false));
        }
    }
}
