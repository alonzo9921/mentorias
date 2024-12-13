import { useEffect, useRef, useState } from "react"
import { Card } from "primereact/card"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { Checkbox } from "primereact/checkbox"
import { Toast } from "primereact/toast"
import { Chart } from 'primereact/chart';
import { FileX } from "@phosphor-icons/react"

export default function DashboardMentor({ selectedTab }) {
    const [misAlumnos, setMisAlumnos] = useState([])
    const [alumnoSelected, setAlumnoSelected] = useState({})
    const [horarioDisponible, setHorarioDisponible] = useState([])
    const [visibleHorario, setVisibleHorario] = useState(false);
    const [visibleAlumnos, setVisibleAlumnos] = useState(false);
    const toast = useRef(null);

    const [dataCharts, setDataCharts] = useState([]);

    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    const horas = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']

    useEffect(() => {
        if (selectedTab === 'mis-alumnos') {
            axios.get(route('mentor.myStudents'))
                .then((response) => {
                    setMisAlumnos(response.data.students)
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        if (selectedTab === 'horario') {
            axios.get(route('mentor.myAttentionHours'))
                .then((response) => {
                    setHorarioDisponible(response.data.attention_hours.mentor.hrs_attention)
                })
                .catch((error) => {
                    console.error(error);
                })
        }
        if (selectedTab === 'calificaciones') {
            axios.get(route('mentor.myEvaluations'))
                .then((response) => {
                    const processedData = processResponse(response.data.responses);
                    setDataCharts(processedData);
                })
                .catch((error) => {
                    console.error(error);
                })
        }
    }, [selectedTab]);

    const handleHoraChange = (dia, hora) => {
        setHorarioDisponible((prev) => {
            const horasDia = prev[dia] || [];
            const nuevaDisponibilidad = horasDia.includes(hora)
                ? horasDia.filter((h) => h !== hora) // Eliminar la hora si ya está seleccionada
                : [...horasDia, hora]; // Agregar la hora si no está seleccionada
            return { ...prev, [dia]: nuevaDisponibilidad };
        });
    };

    const handleSave = () => {
        axios.post(route('mentor.updateAttentionHours'), { disponibilidad: horarioDisponible }).then((response) => {
            toast.current.show({ severity: 'success', summary: 'Editado', detail: 'Se editado el horario correctamente', life: 3000 });
            setVisibleHorario(false);
        }).catch((error) => {
            console.log(error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al editar el horario', life: 3000 });
        })

    };

    const footerContent = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setVisibleHorario(false)} className="p-button-text" />
            <Button label="Editar" icon="pi pi-check" onClick={handleSave} autoFocus />
        </div>
    );


    const processResponse = (response) => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = response.map(question => ({
            question: question.question,
            data: {
                labels: question.options.map(option => option.option_text),
                datasets: [
                    {
                        data: question.options.map(option => option.responses_count),
                        backgroundColor: [
                            documentStyle.getPropertyValue('--blue-500'),
                            documentStyle.getPropertyValue('--yellow-500'),
                            documentStyle.getPropertyValue('--green-500'),
                            documentStyle.getPropertyValue('--red-500'),
                            documentStyle.getPropertyValue('--orange-500'),
                            documentStyle.getPropertyValue('--gray-500'),
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue('--blue-400'),
                            documentStyle.getPropertyValue('--yellow-400'),
                            documentStyle.getPropertyValue('--green-400'),
                            documentStyle.getPropertyValue('--red-400'),
                            documentStyle.getPropertyValue('--orange-400'),
                            documentStyle.getPropertyValue('--gray-400'),
                        ]
                    }
                ]
            },
            options: {
                cutout: '60%'
            }
        }));
        return data;
    };


    return (
        <div className="flex bg-gray-100">
            <Toast ref={toast} />
            {/* Contenido principal */}
            <main className="flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-emerald-600">{selectedTab === "mis-alumnos" ? "Mis Alumnos" : selectedTab === "horario" ? "Mi Horario" : "Mis Estadisticas"}</h1>
                </div>

                {selectedTab === "mis-alumnos" && (
                    <>
                        {Object.keys(misAlumnos).length > 0 ? (

                            <div className="grid gap-4 md:grid-cols-2 justify-center lg:grid-cols-3">
                                {misAlumnos.map((alumno) => (
                                    <Card className="border border-gray-200 shadow-none w-[350px]" key={alumno.id} title={`${alumno.name} ${alumno.last_name}`}>
                                        <div className="text-lg font-bold mb-2">{alumno.career.academic_division_acronym}</div>
                                        <div>{alumno.identifier}</div>
                                        <div>{alumno.email}</div>
                                        <div>{alumno.phone}</div>
                                        <div className="flex justify-center">
                                            <Button className="mt-4" label="Ver Perfil" icon="pi pi-eye" outlined rounded onClick={() => { setAlumnoSelected(alumno), setVisibleAlumnos(true) }} />
                                        </div>
                                        <Dialog header="Datos del alumno" visible={visibleAlumnos} onHide={() => { if (!visibleAlumnos) return; setVisibleAlumnos(false); }}
                                            style={{ width: '30vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                                            <div className="text-md font-semibold mb-2 text-center">{alumnoSelected?.career?.academic_division}</div>
                                            <div className="text-lg font-bold mb-2 text-center text-green-500">{alumnoSelected?.career?.academic_division_acronym}</div>
                                            <div className="text-sm font-bold mb-2 text-center">{alumnoSelected?.career?.name}</div>
                                            <div className="mt-3 flex flex-col gap-y-2 border border-gray-300 p-4 rounded-xl">
                                                <div className="font-bold text-xl text-center mb-2">{alumnoSelected?.name + ' ' + alumnoSelected?.last_name}</div>
                                                <div><span className="font-semibold">Matricula: </span>{alumnoSelected?.identifier}</div>
                                                <div><span className="font-semibold">Correo: </span>{alumnoSelected?.email}</div>
                                                <div><span className="font-semibold">Telefono: </span>{alumnoSelected?.phone}</div>
                                            </div>
                                        </Dialog>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="m-auto max-w-md shadow-none border border-gray-200" title='No hay datos disponibles'>
                                <div className="flex flex-col justify-center items-center gap-y-3">
                                    <FileX size={32} />
                                    <p className="text-center text-muted-foreground">
                                        Parece que aún no hay tienes alumnos asigandos. No desesperes, pronto se te asignaran.
                                    </p>
                                </div>
                            </Card>
                        )}
                    </>
                )}
                {selectedTab === "horario" && (
                    <Card className="border border-gra200 shadow-none" title="Mi Horario de Atención" subTitle="Aquí puedes ver y editar tu horario disponible" >
                        <div className="flex justify-end items-center mb-6">
                            <Button outlined rounded icon="pi pi-pencil" label="Editar Horario" onClick={() => setVisibleHorario(true)} />
                        </div>
                        <div className="space-y-4 px-4">
                            {dias.map((dia, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span>{dia}</span>
                                    <span>{horarioDisponible[dia] ? horarioDisponible[dia].join(" - ") : "No disponible"}</span>
                                </div>
                            ))}
                        </div>
                        <Dialog header="Editando mi horario" visible={visibleHorario} style={{ width: '50vw' }} onHide={() => { if (!visibleHorario) return; setVisibleHorario(false); }} footer={footerContent}>
                            <h5 className="text-lg font-semibold mb-4">Disponibilidad semanal</h5>
                            <div className="space-y-2 bg-gray-100 px-5 pb-8 pt-1">
                                {dias.map((dia) => (
                                    <div key={dia} className="space-y-2 bg-gray-100">
                                        <div className='mt-4'>
                                            <label>{dia}</label>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {horas.map((hora) => (
                                                <div key={`${dia}-${hora}`} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        value={`${dia}-${hora}`}
                                                        checked={horarioDisponible[dia]?.includes(hora)}
                                                        onChange={() => handleHoraChange(dia, hora)}
                                                    />
                                                    <label htmlFor={`${dia}-${hora}`}>{hora}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Dialog>
                    </Card>
                )}
                {selectedTab === "calificaciones" && (
                    <>
                        {Object.keys(dataCharts).length > 0 ? (

                            <div className="overflow-y-auto max-h-screen grid grid-cols-1 md:grid-cols-2 gap-4 justify-center">
                                {dataCharts.length > 0 && dataCharts.map((dataChart, index) => (
                                    <Card key={index} title={dataChart.question} subTitle="Calificaciones de tus alumnos">
                                        <div className="card flex justify-content-center overflow-hidden">
                                            <Chart type="doughnut" data={dataChart.data} options={dataChart.option} className="w-full md:w-30rem" />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="m-auto max-w-md shadow-none border border-gray-200" title='No hay datos disponibles'>
                                <div className="flex flex-col justify-center items-center gap-y-3">
                                    <FileX size={32} />
                                    <p className="text-center text-muted-foreground">
                                        Parece que aún no haz recibido calificacions de tus alumnos. No desesperes, pronto te calificaran.
                                    </p>
                                </div>
                            </Card>
                        )}
                    </>
                )}
            </main>
        </div >
    )
}