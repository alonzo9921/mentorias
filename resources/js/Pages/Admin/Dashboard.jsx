import { useEffect, useRef, useState } from "react"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Link } from "@inertiajs/react"
import { Toast } from 'primereact/toast';
import axios from "axios";
import CreationFormDialog from "@/Components/CreationFormDialog"
import CreationUnitDialog from "@/Components/CreationUnitDialog"
import EditUnitDialog from "@/Components/EditUnitDialog"
import { Dialog } from "primereact/dialog";
import { confirmDialog } from 'primereact/confirmdialog';
import PrimeConfirmDialog from "@/Components/PrimeComponents/PrimeConfirmDialog";
import { InputText } from "primereact/inputtext";
import { FileX } from "@phosphor-icons/react";
import { Tooltip } from 'primereact/tooltip';


export default function DashboardAdmin({ selectedTab }) {
    const [formularios, setFormularios] = useState([]);
    const [formShow, setFormShow] = useState({});
    const [unidades, setUnidades] = useState([]);
    const [visibleFormulario, setVisibleFormulario] = useState(false);
    const [visibleFormSelected, setVisibleFormSelected] = useState(false);
    const [visibleUnidad, setVisibleUnidad] = useState(false);
    const [visibleEditUnidad, setVisibleEditUnidad] = useState(false);
    const [id, setId] = useState(null);
    const [action, setAction] = useState(null);
    const [unitShow, setUnitShow] = useState({});
    const [visibleUnitSelected, setVisibleUnitSelected] = useState(false);

    const toast = useRef(null);

    useEffect(() => {
        if (selectedTab === 'formularios') {
            formulariosApi()
        }
        if (selectedTab === 'unidades') {
            unidadesApi()
        }
    }, [selectedTab]);

    const formulariosApi = (toast_message) => {
        axios.get(route('admin.forms.index'))
            .then((response) => {
                toast_message && toast.current.show({ severity: 'success', summary: 'Creado', detail: 'Se ha creado el formulario correctamente', life: 3000 });
                setFormularios(response.data.forms);
            })
            .catch((error) => {
                console.error(error);
            })
    }

    const unidadesApi = (toast_message) => {
        axios.get(route('admin.unitLearning.index'))
            .then((response) => {
                toast_message && toast.current.show({ severity: 'success', summary: 'Creado', detail: 'Se ha creado la unidad correctamente', life: 3000 });
                setUnidades(response.data.unitLearnings);
            })
            .catch((error) => {
                console.error(error);
            })
    }

    const confirm = (id, action, section) => {
        setId(id)
        setAction(action)
        confirmDialog({
            group: 'headless',
            message: action === 'active' && section === 'formularios'
                ? `¿Estas seguro de activar este formulario?`
                : action === 'delete' && section === 'formularios' ? '¿Estas seguro de eliminar este formulario?'
                    : action === 'delete' && section === 'unidades' && '¿Estas seguro de eliminar esta unidad?',
            header: 'Confirmacion',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: action === 'delete' ? () => handleDelete(id, section) : () => handleActive(id),
        });
    };

    const handleActive = (id, section) => {
        axios.put(route('admin.forms.active', id)).then((response) => {
            toast.current.show({ severity: 'success', summary: 'Activado', detail: 'Se ha activado el formulario correctamente', life: 3000 });
            formulariosApi()
        }).catch((error) => {
            console.log(error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al activar el formulario', life: 3000 });
        })
    }

    const handleDelete = (id, section) => {
        if (section === 'formularios') {
            axios.delete(route('admin.forms.active', id)).then((response) => {
                toast.current.show({ severity: 'success', summary: 'Eliminado', detail: 'Se ha eliminado el formulario correctamente', life: 3000 });
                formulariosApi()
            }).catch((error) => {
                console.log(error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al elminiar el formulario', life: 3000 });
            })
        }
        if (section === 'unidades') {
            axios.delete(route('admin.unitLearning.destroy', id)).then((response) => {
                toast.current.show({ severity: 'success', summary: 'Eliminado', detail: 'Se ha eliminado la unidad correctamente', life: 3000 });
                unidadesApi()
            }).catch((error) => {
                console.log(error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al elminiar la unidad', life: 3000 });
            })
        }
    }

    return (
        <div className="flex bg-gray-100">
            <Toast ref={toast} />
            <PrimeConfirmDialog
                handleActive={handleActive}
                handleDelete={handleDelete}
                action={action}
                section={selectedTab}
                id={id}
            />
            <div className="hidden">
                <CreationFormDialog visible={visibleFormulario} setVisible={setVisibleFormulario} formulariosApi={formulariosApi} />
                <CreationUnitDialog visible={visibleUnidad} setVisible={setVisibleUnidad} unidadesApi={unidadesApi} />
                {visibleEditUnidad &&
                    <EditUnitDialog visible={visibleEditUnidad} setVisible={setVisibleEditUnidad} unidadesApi={unidadesApi} editUnidad={unitShow} />
                }
            </div>
            {/* Barra lateral */}

            {/* Contenido principal */}
            <main className="flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-emerald-600">{selectedTab === "formularios" ? "Gestion de Formularios" : selectedTab === "unidades" && "Unidades de Aprendizajes"}</h1>
                    <Button
                        tooltip={selectedTab === "formularios" ? "Crear Formulario" : selectedTab === "unidades" && "Crear Unidad de aprendizaje"}
                        className="mt-2" icon="pi pi-plus"
                        onClick={() => selectedTab === "formularios" ? setVisibleFormulario(true) : setVisibleUnidad(true)}
                        rounded
                        tooltipOptions={{ position: 'left' }}
                    />
                </div>

                {selectedTab === "formularios" && (
                    <>
                        {Object.keys(formularios).length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 justify-center lg:grid-cols-3" >
                                {formularios.map((formulario) => (
                                    <Card className="border border-gray-200 shadow-none w-[350px]" key={formulario.id} title={formulario.name}>
                                        <h5>{'Preguntas: ' + Object.keys(formulario.questions).length}</h5>
                                        <h5 className={`mt-2 font-bold ${formulario?.active && formulario?.active === true ? 'text-green-600' : 'text-red-600'} `}>{'Estatus: ' + formulario?.active && formulario?.active === true ? 'Activado' : 'Desactivado'}</h5>
                                        <div className="grid grid-cols-2 mt-5 justify-center gap-2">
                                            <Button icon="pi pi-eye" outlined rounded label="Ver" onClick={() => { setFormShow(formulario), setVisibleFormSelected(true) }} />
                                            {!formulario?.active && (
                                                <Button icon="pi pi-check-circle" outlined rounded label="Activar" onClick={() => confirm(formulario.id, 'active', 'formularios')} />
                                            )}
                                            <Button icon="pi pi-trash" outlined rounded label="Eliminar" onClick={() => confirm(formulario.id, 'delete', 'formularios')} />
                                        </div>
                                        <Dialog header={`Formulario: ${formShow?.name}`} visible={visibleFormSelected} onHide={() => { if (!visibleFormSelected) return; setVisibleFormSelected(false); }}
                                            style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                                            <div className="text-md font-semibold mb-2 text-center">Estatus del formulario: <span className={formShow?.active && formShow?.active === true ? "text-green-500" : "text-red-500"}>{formShow?.active && formShow?.active === true ? 'Activado' : 'Desactivado'}</span></div>
                                            {Object.keys(formShow).length > 0 && formShow?.questions.map((pregunta, index) => (
                                                <div key={index} className="mt-3 flex flex-col gap-y-2 border border-gray-300 p-4 rounded-xl">
                                                    <div className="font-bold text-xl text-center mb-2">{pregunta?.question}</div>
                                                    {pregunta?.options.map((option, index) => (
                                                        <div key={index}><span className="font-semibold">({index + 1}).- </span>{option?.option_text}</div>
                                                    ))}
                                                </div>
                                            ))}
                                        </Dialog>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="m-auto max-w-md shadow-none border border-gray-200" title='No hay datos disponibles'>
                                <div className="flex flex-col justify-center items-center gap-y-3">
                                    <FileX size={32} />
                                    <p className="text-center text-muted-foreground">
                                        Parece que aún no haz creado formularios para mostrar. Puedes comenzar a crear tu primer formulario.
                                    </p>
                                </div>
                            </Card>
                        )}
                    </>
                )}

                {selectedTab === "unidades" && (
                    <>
                        {Object.keys(unidades).length > 0 ? (

                            <div className="grid gap-4 md:grid-cols-2 justify-center lg:grid-cols-3">
                                {unidades.map((unidad) => (
                                    <Card className="border border-gra200 shadow-none w-[350px]" key={unidad.id} title={unidad.title}>
                                        <h5>{'Temas de la unidad: ' + Object.keys(unidad?.contents).length}</h5>
                                        <div className="grid grid-cols-2 mt-5 justify-center gap-2">
                                            <Button icon="pi pi-eye" outlined rounded label="Ver" onClick={() => { setUnitShow(unidad), setVisibleUnitSelected(true) }} />
                                            <Button icon="pi pi-pencil" outlined rounded label="Editar" onClick={() => { setUnitShow(unidad), setVisibleEditUnidad(true) }} />
                                            <Button icon="pi pi-trash" outlined rounded label="Eliminar" onClick={() => confirm(unidad.id, 'delete', 'unidades')} />
                                        </div>
                                        <Dialog header={'Detalles de la unidad'} visible={visibleUnitSelected} onHide={() => { if (!visibleUnitSelected) return; setVisibleUnitSelected(false); }}
                                            style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                                            <Card title={unidad.title} subTitle={unidad.description} className="h-full border-b-gray-200 border border-x-gray-200 shadow-none rounded-lg" style={{ borderTop: `4px solid #10b981` }}>
                                                <h3 className="font-semibold mb-2">Subtemas:</h3>
                                                <ul className="space-y-2 mb-4">
                                                    {unidad.contents.map((sub) => (
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
                                        </Dialog>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="m-auto max-w-md shadow-none border border-gray-200" title='No hay datos disponibles'>
                                <div className="flex flex-col justify-center items-center gap-y-3">
                                    <FileX size={32} />
                                    <p className="text-center text-muted-foreground">
                                        Parece que aún no haz creado unidades de aprendizajes para mostrar. Puedes comenzar a crear tu primer unidad de aprendizaje.
                                    </p>
                                </div>
                            </Card>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}