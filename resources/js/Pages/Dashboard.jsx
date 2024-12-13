import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DashboardAlumno from './Students/Dashboard'
import DashboardAdmin from './Admin/Dashboard';
import { useState } from 'react';
import DashboardMentor from './Mentor/Dashboard';

export default function Dashboard() {
    const role = usePage().props.auth.role;

    const [selectedTab, setSelectedTab] = useState(role === "alumno" ? "mentores-disponibles" : role === "admin" ? "formularios" : "mis-alumnos")

    return (
        <AuthenticatedLayout selectedTab={selectedTab} setSelectedTab={setSelectedTab}>
            <Head title="Dashboard" />
            <div className="py-12 pb-4 w-ful bg-gray-100">
                <div className=" px-8 pb-4">
                    <div className="bg-white sm:rounded-lg">
                        <div className=" text-gray-900">
                            {role === "alumno" ? <DashboardAlumno selectedTab={selectedTab} /> :
                                role === "admin" ? <DashboardAdmin selectedTab={selectedTab} /> :
                                    <DashboardMentor selectedTab={selectedTab} />}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
