<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user() ? User::where('id', $request->user()->id)->first() : null;
        $role = null;

        if($user){
            if($user->hasRole('admin')){
                $role = 'admin';
            }else if($user->hasRole('mentor')){
                $user = $user->load('mentor');
                $role = 'mentor';
            }else if($user->hasRole('alumno')){
                $role = 'alumno';
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'role' => $role,
            ],
        ];
    }
}
