import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';

export default function Authenticated({ header, children, selectedTab, setSelectedTab }) {
    const user = usePage().props.auth.user;
    const role = usePage().props.auth.role;
    const toast = useRef(null);
    const [hideMenu, setHideMenu] = useState(true);

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [visibleConvocatoria, setVisibleConvocatoria] = useState(false);
    const [url, setUrl] = useState('');

    const saveLink = () => {
        axios.post(route('admin.recruit.store', { url: url }))
            .then(res => {
                toast.current.show({ severity: 'success', summary: 'Creado', detail: 'Se ha guardado el link de la convocatoria correctamente', life: 3000 });
                setVisibleConvocatoria(false);
            }).catch(err => {

            })
    }

    return (
        <div className="flex w-full h-full bg-gray-100">
            <Toast ref={toast} />

            <Dialog footer={<Button label='Guardar' icon='pi pi-check' outlined rounded onClick={saveLink} />} header='Convocatoria para mentores' visible={visibleConvocatoria} onHide={() => { if (!visibleConvocatoria) return; setVisibleConvocatoria(false); }}
                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <div className='w-full flex flex-col gap-2'>
                    <h3>Link para la Convocatoria</h3>
                    <InputText onChange={(e) => setUrl(e.target.value)} className='w-full' placeholder='Coloca aqui el link de la convocatoria para mentores' />
                </div>
            </Dialog>
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className='flex w-full h-full'>
                <aside className={`w-72 hidden md:block fixed h-full bg-white shadow-sm rounded-2xl p-2 ${!hideMenu && "block"}`}>
                    <div className="p-4">
                        <h2 className="text-2xl mt-6 md:mt-0 font-bold text-gray-600 text-center">
                            {role === 'admin' ? 'Dashboard Administrador' : role === 'mentor' ? 'Dashboard Mentor' : 'Dashboard Alumno'}
                        </h2>
                    </div>
                    <nav className="mt-6 flex flex-col gap-y-3">
                        {role === 'admin' ? (
                            <>
                                <Button
                                    outlined={selectedTab === "formularios" ? "secondary" : "ghost"}
                                    text={selectedTab !== "formularios"}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedTab("formularios")}
                                    label="Gestión de Formularios"
                                    icon="pi pi-file"
                                />
                                <Button
                                    outlined={selectedTab === "unidades" ? "secondary" : "ghost"}
                                    text={selectedTab !== "unidades"}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedTab("unidades")}
                                    label='Unidades de Aprendizaje'
                                    icon="pi pi-book"
                                />
                                <Button
                                    outlined={selectedTab === "convocatoria" ? "secondary" : "ghost"}
                                    text={selectedTab !== "convocatoria"}
                                    className="w-full justify-start"
                                    onClick={() => { setVisibleConvocatoria(true) }}
                                    label='Convocatoria Mentores'
                                    icon="pi pi-crown"
                                />
                            </>
                        ) : role === 'alumno' ? (
                            <>
                                <Button
                                    // variant={selectedTab === "mentores-disponibles" ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedTab("mentores-disponibles")}
                                    icon='pi pi-users'
                                    outlined={selectedTab === "mentores-disponibles"}
                                    text={selectedTab !== "mentores-disponibles"}
                                    label="Mentores Disponibles"
                                />

                                <Button
                                    // variant={selectedTab === "mis-mentores" ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedTab("mis-mentores")}
                                    icon='pi pi-book'
                                    outlined={selectedTab === "mis-mentores"}
                                    text={selectedTab !== "mis-mentores"}
                                    label="Mis Mentores"
                                />
                                <Button
                                    variant={selectedTab === "calificar-mentores" ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                    outlined={selectedTab === "calificar-mentores"}
                                    text={selectedTab !== "calificar-mentores"}
                                    onClick={() => setSelectedTab("calificar-mentores")}
                                    icon='pi pi-star'
                                    label="Calificar Mentores"
                                />
                            </>
                        ) : (
                            <>
                                <Button
                                    outlined={selectedTab === "mis-alumnos" ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedTab("mis-alumnos")}
                                    icon='pi pi-users'
                                    label='Mis Alumnos'
                                    text={selectedTab !== "mis-alumnos"}
                                />
                                <Button
                                    outlined={selectedTab === "horario" ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedTab("horario")}
                                    icon='pi pi-calendar'
                                    label='Mi Horario'
                                    text={selectedTab !== "horario"}
                                />
                                <Button
                                    outlined={selectedTab === "calificaciones" ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedTab("calificaciones")}
                                    icon='pi pi-star'
                                    label="Mis Calificaciones"
                                    text={selectedTab !== "calificaciones"}
                                />
                            </>
                        )}
                    </nav>
                </aside>
                <div className='w-full h-full min-h-screen md:ml-72 lg:ml-72'>
                    <nav className="border-b border-gray-100 bg-white p-2">
                        <div className="mx-auto max-w-7xl px-4 sm:px-4 lg:px-6">
                            <div className="flex h-16 justify-between">
                                <div className="flex items-center gap-x-4">
                                    <Button icon='pi pi-bars'
                                        className='md:hidden'
                                        size='sm'
                                        outlined
                                        rounded
                                        onClick={() => setHideMenu(!hideMenu)}
                                    />
                                    <div className='w-24 md:w-40'>
                                        <img className='py-2' src="/img/logo_ujat.png" alt="logo" />
                                    </div>
                                    <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                        <h1 className='flex items-center font-bold md:text-2xl text-gray-600'>Mentorias UJAT</h1>
                                    </div>
                                </div>

                                <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                    <div className="relative ms-3">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                                    >
                                                        {user.name}

                                                        <svg
                                                            className="-me-0.5 ms-2 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                {/* <Dropdown.Link
                                                    href={route('profile.edit')}
                                                >
                                                    Perfil
                                                </Dropdown.Link> */}
                                                <Dropdown.Link
                                                    href={route('welcome')}
                                                    method="get"
                                                    as="button"
                                                    className='flex items-center'
                                                >
                                                    <i className='pi pi-home mr-2'></i>
                                                    Página Principal
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className='flex items-center'
                                                >
                                                    <i className='pi pi-sign-out mr-2'></i>
                                                    Cerrar Sesion
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>

                                <div className="-me-2 flex items-center sm:hidden">
                                    <button
                                        onClick={() =>
                                            setShowingNavigationDropdown(
                                                (previousState) => !previousState,
                                            )
                                        }
                                        className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                                    >
                                        <svg
                                            className="h-6 w-6"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                className={
                                                    !showingNavigationDropdown
                                                        ? 'inline-flex'
                                                        : 'hidden'
                                                }
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                            <path
                                                className={
                                                    showingNavigationDropdown
                                                        ? 'inline-flex'
                                                        : 'hidden'
                                                }
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div
                            className={
                                (showingNavigationDropdown ? 'block' : 'hidden') +
                                ' sm:hidden'
                            }
                        >
                            {/* <div className="space-y-1 pb-3 pt-2">
                                <ResponsiveNavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Mentorias UJAT
                                </ResponsiveNavLink>
                            </div> */}

                            <div className="border-t border-gray-200 pb-1 pt-4">
                                <div className="px-4">
                                    <div className="text-base font-medium text-gray-800">
                                        {user.name}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">
                                        {user.email}
                                    </div>
                                </div>

                                <div className="mt-3 space-y-1">
                                    {/* <ResponsiveNavLink href={route('profile.edit')}>
                                        Perfil
                                    </ResponsiveNavLink> */}
                                    <ResponsiveNavLink
                                        method="get"
                                        href={route('welcome')}
                                        as="button"
                                        className='flex items-center'
                                    >
                                        <i className='pi pi-home mr-2'></i>
                                        Página Principal
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                        className='flex items-center'
                                    >
                                        <i className='pi pi-sign-out mr-2'></i>
                                        Cerrar Sesion
                                    </ResponsiveNavLink>
                                </div>
                            </div>
                        </div>
                    </nav>
                    {children}
                </div>
            </main>
        </div>
    );
}
