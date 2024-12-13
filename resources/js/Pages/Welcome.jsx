import { Head, Link } from '@inertiajs/react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useEffect, useState } from 'react';
import axios from "axios";
import { BookOpen, Certificate, Laptop, LinkSimple, Medal, NotePencil, Users } from '@phosphor-icons/react';
import { Carousel } from 'primereact/carousel';

export default function Welcome({ auth, laravelVersion, phpVersion }) {

    const [unidades, setUnidades] = useState([])
    const [linkConvocatoria, setLinkConvocatoria] = useState('')

    const responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    useEffect(() => {
        axios.get(route('public.unitLearning.index'))
            .then((response) => {
                setUnidades(response.data.unitLearnings)
            }).catch((error) => {
                console.log(error);
            })
        axios.get(route('public.recruit'))
            .then((response) => {
                setLinkConvocatoria(response.data.recruit.url)
            }).catch((error) => {
                console.log(error);
            })
    }, [])

    const productTemplate = (unidad) => {
        return (
            <Card title={unidad.title} subTitle={unidad.description} className="h-full m-4" style={{ borderTop: `4px solid #10b981` }}>
                <h3 className="font-semibold mb-2">Subtemas:</h3>
                <ul className="space-y-2 mb-4">
                    {Object.keys(unidad?.contents).length > 0 && unidad?.contents.map((sub) => (
                        <li key={sub.id} className="flex items-center">
                            <span>{sub.title}</span>
                            {sub.url_content && (
                                <a href={sub.url_content} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline">
                                    <Button label='Ver material' size='small' icon="pi pi-link" outlined rounded />
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
            </Card>
        );
    };

    return (
        <>
            <Head title="Bienvenido" />
            <div className="flex flex-col min-h-screen">
                <header className="px-4 py-1 lg:px-6 flex items-center">
                    <div className='w-40'>
                        <img className='py-2' src="/img/logo_ujat.png" alt="logo" />
                    </div>
                    <nav className="ml-auto flex gap-4 sm:gap-6">
                        <a className="text-md font-medium hover:underline underline-offset-4" href="#unidades">
                            U. de Aprendizaje
                        </a>
                        <a className="text-md font-medium hover:underline underline-offset-4" href="#convocatoria">
                            Convocatoria
                        </a>
                    </nav>
                </header>
                <main className="flex-1">
                    <section className="w-full flex justify-center py-12 md:py-24 lg:py-30 xl:py-48 bg-emerald-700">
                        <div className="container px-4 md:px-6">
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                                        Bienvenido a Mentorias UJAT
                                    </h1>
                                    <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                                        Conecta con mentores experimentados y recibe orientación personalizada para tu carrera universitaria.
                                    </p>
                                </div>
                                <div className="space-x-4">
                                    {auth.user ? (
                                        <Link href={route('dashboard')}>
                                            <Button label='Dashboard' rounded />
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href={route('login')}>
                                                <Button label='Iniciar Sesion' rounded />
                                            </Link>
                                            <Link href={route('register')}>
                                                <Button label='Registrar Alumno' rounded outlined className='text-white hover:bg-white hover:text-emerald-700' />
                                            </Link>
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="w-full py-12 md:py-24 lg:py-30 bg-gray-100">
                        <div className=" w-full px-4 md:px-6">
                            <h2 className="text-3xl text-emerald-600 font-bold tracking-tighter sm:text-5xl text-center mb-12">Mentorias UJAT</h2>
                            <div className="card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Card className='border-2 border-emerald-500 shadow-none text-center' title="¿Que son las mentorias?" header={<svg xmlns="http://www.w3.org/2000/svg" className='w-36 mx-auto mt-6 rounded-full' width="100" height="100" fill="#10b981" viewBox="0 0 256 256"><path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>} >
                                    <p>Las mentorias UJAT son un programa de acompañamiento academico
                                        y personal ofrecido por la Universidad Juarez Autonoma de Tabasco
                                        (UJAT) a sus estudiantes para que puedan mejorar su rendimiento
                                        academico, desarrollar habilidades personales y profesionales,
                                        y lograr sus metas educativas.
                                    </p>
                                </Card>
                                <Card className='border-2 border-emerald-500 shadow-none text-center' title="¿Como funciona el programa de mentorias UJAT?" header={<svg xmlns="http://www.w3.org/2000/svg" className='w-36 mx-auto mt-6 rounded-full' width="100" height="100" fill="#10b981" viewBox="0 0 256 256"><path d="M232,72H160a40,40,0,0,0-32,16A40,40,0,0,0,96,72H24a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8H96a24,24,0,0,1,24,24,8,8,0,0,0,16,0,24,24,0,0,1,24-24h72a8,8,0,0,0,8-8V80A8,8,0,0,0,232,72ZM96,192H32V88H96a24,24,0,0,1,24,24v88A39.81,39.81,0,0,0,96,192Zm128,0H160a39.81,39.81,0,0,0-24,8V112a24,24,0,0,1,24-24h64ZM89.6,43.19a48,48,0,0,1,76.8,0,8,8,0,0,1-12.79,9.62,32,32,0,0,0-51.22,0A8,8,0,1,1,89.6,43.19Z"></path></svg>} >
                                    <p>Los estudiantes que participan en el programa de mentorias UJAT son asignados
                                        a un mentor, que es estudiante de un semestre superior con un buen rendimiento
                                        academico y experiencia en el programa. El mentor y el estudiante se reunen de
                                        forma regular para trabajar en un plan de accion personalizado que les ayude a
                                        alcanzar sus metas.
                                    </p>
                                </Card>
                                <Card className='border-2 border-emerald-500 shadow-none text-center' title="¿Quienes pueden participar en el programa de mentorias?" header={<svg xmlns="http://www.w3.org/2000/svg" className='w-36 mx-auto mt-6 rounded-full' width="100" height="100" fill="#10b981" viewBox="0 0 256 256"><path d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,0-6.22A8,8,0,0,1,192,112a24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.84,8,57,57,0,0,0-98.16,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z"></path></svg>} >
                                    <p>En las mentorias UJAT pueden participar todos los estudiantes de la UJAT,
                                        independientemente de su carrera o semestre. Sin embargo, el programa esta
                                        dirigido principalmente a estudiantes que se encuentran en situacion de riesgo
                                        academico o que tienen dificultades para adaptarse a la vida universitaria.
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </section>
                    <section id='unidades' className="w-full py-12 px-6 md:py-24 lg:py-32 scroll-smooth">
                        <h2 className="text-3xl text-emerald-600 font-bold tracking-tighter sm:text-5xl text-center mb-12">Unidades de Aprendizaje</h2>
                        <Carousel value={unidades} numVisible={1} numScroll={1} responsiveOptions={responsiveOptions} itemTemplate={productTemplate} />
                    </section>
                    <section id='convocatoria' className='w-full py-12 px-6 md:py-24 lg:py-30 bg-gray-100 scroll-smooth'>
                        <h2 className="text-3xl text-emerald-600 font-bold tracking-tighter sm:text-5xl text-center mb-12">Convocatoria</h2>
                        <Card title="Convocatoria de Mentores" subTitle="Se un mentor de algoritmos y marca la diferencia!" className="border-2 border-emerald-500 shadow-none">
                            <div className="space-y-8">
                                <p className="text-gray-600">
                                    Estamos buscando profesionales experimentados que deseen compartir sus conocimientos y guiar a la próxima generación de talentos. Como mentor, tendrás la oportunidad de hacer una diferencia real en la vida y carrera de otros.
                                    ¿Te apasionan los algoritmos?
                                    ¿Disfrutas resolviendo problemas de porgramacion?
                                    ¿Quieres compartir tus conocimientos y ayudar a tus compañeros a crecer?
                                    ¡Esta es tu oportunidad!
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col items-center text-center">
                                        <BookOpen size={48} color="#10b981" />
                                        <h3 className="font-semibold">Hacer la Diferencia</h3>
                                        <p className="text-sm text-gray-500">Ayuda a tus compañeros a alcanzar sus metas academicas y a desarrollar su pasion por la programacion</p>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <Users size={48} color="#10b981" />
                                        <h3 className="font-semibold">Desarrollo Personal</h3>
                                        <p className="text-sm text-gray-500">Mejora tus habilidades de liderazgo y comunicación</p>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <Certificate size={48} color="#10b981" />
                                        <h3 className="font-semibold">Obtener Reconocimiento</h3>
                                        <p className="text-sm text-gray-500">Recibir reconocimiento por tu contribucion a la comunidad estudiantil</p>
                                    </div>
                                </div>
                                <h3 className="font-semibold text-3xl text-center">Requisitos:</h3>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="flex flex-col items-center text-center">
                                        <Medal size={48} color="#10b981" />
                                        <h3 className="font-semibold">Conocimientos solidos</h3>
                                        <p className="text-sm text-gray-500">Dominio de los conceptos basicos de algoritmos y estructuras de datos</p>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <Laptop size={48} color="#10b981" />
                                        <h3 className="font-semibold">Pasion por la enseñanza</h3>
                                        <p className="text-sm text-gray-500">Disposicion para ayudar a otros y transmitir tus conocimientos de manera clara y concisa</p>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <NotePencil size={48} color="#10b981" />
                                        <h3 className="font-semibold">Disponibilidad</h3>
                                        <p className="text-sm text-gray-500">Compromiso para dedicar tiempo a las actividades de mentoria</p>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex justify-center mt-10'>
                                <a target='_blank' href={linkConvocatoria}>
                                    <Button label='Quiero ser mentor' icon="pi pi-check" rounded outlined></Button>
                                </a>
                            </div>
                        </Card>
                    </section>
                </main>
                <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                    <p className="text-xs text-gray-500">© 2024 UniMentor. Todos los derechos reservados.</p>
                    <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                        <a className="text-xs hover:underline underline-offset-4" href="#">
                            Términos de Servicio
                        </a>
                        <a className="text-xs hover:underline underline-offset-4" href="#">
                            Privacidad
                        </a>
                    </nav>
                </footer>
            </div>
        </>
    );
}
