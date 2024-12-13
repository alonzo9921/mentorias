import React, { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { usePage } from "@inertiajs/react";
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import axios from "axios";
import PrimeConfirmDialog from "@/Components/PrimeComponents/PrimeConfirmDialog";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { FileX } from "@phosphor-icons/react";

const DashboardAlumno = ({ selectedTab }) => {
    const [mentoresDisponibles, setMentoresDisponibles] = useState([]);
    const [misMentores, setMisMentores] = useState([]);
    const [mentorSelected, setMentorSelected] = useState({});
    const [calificarMentor, setCalificarMentor] = useState([]);
    const [formSelectedMentor, setFormSelectedMentor] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [visibleMisMentores, setVisibleMisMentores] = useState(false);
    const [visibleMentoresDisponibles, setVisibleMentoresDisponibles] = useState(false);

    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    const toast = useRef(null);

    useEffect(() => {
        if (selectedTab === 'mentores-disponibles') {
            mentoresDisponiblesApi()
        }
        if (selectedTab === 'mis-mentores') {
            misMentoresApi()
        }
        if (selectedTab === 'calificar-mentores') {
            calificarMentoresApi()
        }
    }, [selectedTab]);

    const mentoresDisponiblesApi = () => {
        axios.get(route('alumno.mentorsAvailable'))
            .then((response) => {
                setMentoresDisponibles(response.data.data);
            })
            .catch((error) => {
                console.error(error);
            })
    }

    const misMentoresApi = () => {
        axios.get(route('alumno.mentors'))
            .then((response) => {
                setMisMentores(response.data.data);
            })
            .catch((error) => {
                console.error(error);
            })
    }

    const calificarMentoresApi = () => {
        axios.get(route('alumno.evaluateMentor.form'))
            .then((response) => {
                setCalificarMentor(response.data);
                setFormSelectedMentor(response?.data?.mentors[0]);
            })
            .catch((error) => {
                console.error(error);
            })
    }

    const handleAsingn = () => {
        axios.post(route('alumno.assignMentor'), { mentor_id: mentorSelected.id }).then((response) => {
            toast.current.show({ severity: 'success', summary: 'Seleccionado', detail: 'Se ha seleccionado al mentor correctamente', life: 3000 });
            mentoresDisponiblesApi()
            setVisibleMentoresDisponibles(false);
        }).catch((error) => {
            console.log(error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al seleccionr al mentor', life: 3000 });
        })
    }

    const handleDelete = () => {
        axios.post(route('alumno.removeMentor'), { mentor_id: mentorSelected.id }).then((response) => {
            toast.current.show({ severity: 'success', summary: 'Eliminado', detail: 'Se ha eliminado al mentor correctamente', life: 3000 });
            misMentoresApi()
            setVisibleMisMentores(false);
        }).catch((error) => {
            console.log(error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al eliminar al mentor', life: 3000 });
        })
    }

    const handleSave = () => {
        const tempAnswers = {
            form_id: calificarMentor.form.id,
            mentor_id: formSelectedMentor.id,
            answers: answers
        }

        axios.post(route('alumno.evaluateMentor.submit', tempAnswers)).then((response) => {
            toast.current.show({ severity: 'success', summary: 'Calificado', detail: 'Se califico al mentor correctamente', life: 3000 });
            calificarMentoresApi()
        }).catch((error) => {
            console.log(error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al calificar al mentor', life: 3000 });
        })
    }

    const footerDialog = (action) => {
        return (
            <>
                <Button label={action === 'delete' ? "Eliminar de mis mentores" : "Seleccionar mentor"} icon={action === 'delete' ? "pi pi-trash" : "pi pi-check"} outlined rounded onClick={action === 'delete' ? handleDelete : handleAsingn} />
            </>
        );
    };

    return (
        <div className="flex bg-gray-100">

            <Toast ref={toast} />
            {/* Contenido principal */}
            <main className="flex-1">
                <div className="justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-emerald-600">{selectedTab === "mentores-disponibles" ? "Mentores Disponibles" : selectedTab === "calificar-mentores" ? "Calificar Mentores" : "Mis Mentores"}</h1>
                </div>

                {/* Contenido principal */}
                {selectedTab === "mentores-disponibles" && (
                    <>
                        {Object.keys(mentoresDisponibles).length > 0 ? (
                            <div className="px-2 grid gap-4 md:grid-cols-2 justify-center lg:grid-cols-3">
                                {mentoresDisponibles.map((mentor) => (
                                    <Card key={mentor.id} title={`${mentor.name} ${mentor.last_name}`} className="border border-gray-200 shadow-none w-[350px]">
                                        <div className="text-lg font-bold mb-2">{mentor.career.academic_division_acronym}</div>
                                        <div>{mentor.identifier}</div>
                                        <div>{mentor.email}</div>
                                        <div>{mentor.phone}</div>
                                        <div className="flex justify-center">
                                            <Button className="mt-4" icon="pi pi-eye" outlined rounded label="Ver Perfil" onClick={() => { setMentorSelected(mentor), setVisibleMentoresDisponibles(true) }} />
                                        </div>
                                        <Dialog footer={() => footerDialog('asingn')} header="Datos del mentor" visible={visibleMentoresDisponibles} onHide={() => { if (!visibleMentoresDisponibles) return; setVisibleMentoresDisponibles(false); }}
                                            style={{ width: '40vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                                            <div className="text-md font-semibold mb-2 text-center">{mentorSelected?.career?.academic_division}</div>
                                            <div className="text-lg font-bold mb-2 text-center text-green-500">{mentorSelected?.career?.academic_division_acronym}</div>
                                            <div className="text-sm font-bold mb-2 text-center">{mentorSelected?.career?.name}</div>
                                            <div className="mt-3 flex flex-col gap-y-2 border border-gray-300 p-4 rounded-xl">
                                                <div className="font-bold text-xl text-center mb-2">{mentorSelected?.name + ' ' + mentorSelected?.last_name}</div>
                                                <div><span className="font-semibold">Matricula: </span>{mentorSelected?.identifier}</div>
                                                <div><span className="font-semibold">Correo: </span>{mentorSelected?.email}</div>
                                                <div><span className="font-semibold">Telefono: </span>{mentorSelected?.phone}</div>
                                            </div>
                                            <div className="mt-3 space-y-4 p-4 border border-gray-300 rounded-xl">
                                                <h5 className="font-semibold text-center mb-2">Horario disponible para atencion</h5>
                                                {dias.map((dia, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <span>{dia}</span>
                                                        <span>{mentorSelected?.mentor?.hrs_attention[dia] ? mentorSelected?.mentor?.hrs_attention[dia].join(" - ") : "No disponible"}</span>
                                                    </div>
                                                ))}
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
                                        Parece que aún no hay mentores disponibles para mostrar. No desesperes, pronto habran disponibles.
                                    </p>
                                </div>
                            </Card>
                        )}
                    </>
                )}

                {selectedTab === "mis-mentores" && (
                    <>
                        {Object.keys(misMentores).length > 0 ? (
                            <div className="px-2 grid gap-4 justify-center md:grid-cols-2 lg:grid-cols-3">
                                {misMentores.map((mentor) => (
                                    <Card key={mentor.id} title={`${mentor.name} ${mentor.last_name}`} className="border border-gray-200 shadow-none w-[350px]">
                                        <div className="text-lg font-bold mb-2">{mentor.career.academic_division_acronym}</div>
                                        <div>{mentor.identifier}</div>
                                        <div>{mentor.email}</div>
                                        <div>{mentor.phone}</div>
                                        <div className="flex justify-center">
                                            <Button className="mt-4" icon="pi pi-eye" outlined rounded label="Ver Perfil" onClick={() => { setMentorSelected(mentor), setVisibleMisMentores(true) }} />
                                        </div>
                                        <Dialog footer={() => footerDialog('delete')} header="Datos del mentor" visible={visibleMisMentores} onHide={() => { if (!visibleMisMentores) return; setVisibleMisMentores(false); }}
                                            style={{ width: '40vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                                            <div className="text-md font-semibold mb-2 text-center">{mentorSelected?.career?.academic_division}</div>
                                            <div className="text-lg font-bold mb-2 text-center text-green-500">{mentorSelected?.career?.academic_division_acronym}</div>
                                            <div className="text-sm font-bold mb-2 text-center">{mentorSelected?.career?.name}</div>
                                            <div className="mt-3 flex flex-col gap-y-2 border border-gray-300 p-4 rounded-xl">
                                                <div className="font-bold text-xl text-center mb-2">{mentorSelected?.name + ' ' + mentorSelected?.last_name}</div>
                                                <div><span className="font-semibold">Matricula: </span>{mentorSelected?.identifier}</div>
                                                <div><span className="font-semibold">Correo: </span>{mentorSelected?.email}</div>
                                                <div><span className="font-semibold">Telefono: </span>{mentorSelected?.phone}</div>
                                            </div>
                                            <div className="mt-3 space-y-4 p-4 border border-gray-300 rounded-xl">
                                                <h5 className="font-semibold text-center mb-2">Horario disponible para atencion</h5>
                                                {dias.map((dia, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <span>{dia}</span>
                                                        <span>{mentorSelected?.mentor?.hrs_attention[dia] ? mentorSelected?.mentor?.hrs_attention[dia].join(" - ") : "No disponible"}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div></div>
                                        </Dialog>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="m-auto max-w-md shadow-none border border-gray-200" title='No hay datos disponibles'>
                                <div className="flex flex-col justify-center items-center gap-y-3">
                                    <FileX size={32} />
                                    <p className="text-center text-muted-foreground">
                                        Parece que aún no te haz asignado un mentor. ¿Que tal si revisas los mentores disponibles y te asignas uno?.
                                    </p>
                                </div>
                            </Card>
                        )}
                    </>
                )}

                {selectedTab === "calificar-mentores" && (
                    <>
                        {Object.keys(calificarMentor).length > 0 && Object.keys(calificarMentor?.mentors).length > 0 ? (
                            <div className="flex flex-col gap-y-6 border border-gray-300 rounded-2xl p-4 bg-white">
                                <h2 className="text-4xl font-bold mb-3 text-center text-gray-600">{calificarMentor?.form?.name}</h2>
                                <div className="flex flex-col gap-y-2">
                                    <label className="text-gray-700 font-medium">Mentor a calificar</label>
                                    <Dropdown value={formSelectedMentor} onChange={(e) => setFormSelectedMentor(e.value)} options={calificarMentor?.mentors} optionLabel="name"
                                        placeholder="Selecciona mentor" className="w-full md:w-14rem" />
                                </div>
                                <Card title={`Calificando Mentor: ${formSelectedMentor?.name}`} className='shadow-none border-2 border-gray-200'>
                                    <div className="space-y-4">
                                        {calificarMentor?.form?.questions.map((question, index) => (
                                            <div key={question.id} className="space-y-2">
                                                <h3 className="text-lg font-semibold">
                                                    {index + 1}. {question.question}
                                                </h3>
                                                {question.options.map((option, optionIndex) => (
                                                    <div key={optionIndex} className="flex items-center space-x-2">
                                                        <RadioButton name='option' value={option} checked={answers[question.id]?.option_id === option.id}
                                                            onChange={(e) =>
                                                                setAnswers((prev) => ({ ...prev, [question.id]: { question_id: question.id, option_id: e.value.id } }))
                                                            } inputId={`q${question.id}-option${optionIndex}`} />
                                                        <label htmlFor={`q${question.id}-option${optionIndex}`}>{option.option_text}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <Button outlined rounded icon="pi pi-send" onClick={handleSave} label="Enviar" />
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <Card className="m-auto max-w-md shadow-none border border-gray-200" title='No hay datos disponibles'>
                                <div className="flex flex-col justify-center items-center gap-y-3">
                                    <FileX size={32} />
                                    <p className="text-center text-muted-foreground">
                                        Ya no quedan mentores para calificar. Cuando te asignes otro mentor lo podras calificar aqui.
                                    </p>
                                </div>
                            </Card>
                        )}
                    </>
                )}
            </main >
        </div >
    );
};

export default DashboardAlumno;