import { useForm, router, Head } from '@inertiajs/react';
import { Link } from '@phosphor-icons/react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useEffect, useState } from 'react';

const EditUnitDialog = ({ visible, setVisible, unidadesApi, editUnidad }) => {
    const [unidades, setUnidades] = useState([editUnidad]);
    // const [unidad, setUnidad] = useState({ ...editUnidad });
    const [nuevosContents, setNuevosContents] = useState({});

    useEffect(() => {
        console.log(unidades);
    }, [unidades])

    const agregarContent = (unidadId) => {
        const nuevoContent = nuevosContents[unidadId];
        if (nuevoContent && nuevoContent.title) {
            setUnidades(unidades.map(unidad => {
                if (unidad.id === unidadId) {
                    return {
                        ...unidad,
                        contents: [...unidad.contents, { id: Date.now(), ...nuevoContent }]
                    };
                }
                return unidad;
            }));
            setNuevosContents({
                ...nuevosContents,
                [unidadId]: { title: '', url_content: '' }
            });
        }
    };

    const eliminarContent = (unidadId, contentId) => {
        setUnidades(unidades.map(unidad => {
            if (unidad.id === unidadId) {
                return {
                    ...unidad,
                    contents: unidad.contents.filter(sub => sub.id !== contentId)
                };
            }
            return unidad;
        }));
    };

    const actualizarNuevoContent = (unidadId, campo, valor) => {
        setNuevosContents({
            ...nuevosContents,
            [unidadId]: {
                ...nuevosContents[unidadId],
                [campo]: valor
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(route('admin.unitLearning.update', editUnidad.id), unidades[0])
            .then(res => {
                unidadesApi('toast', 'editado')
                setVisible(false);
            }).catch(err => {
                console.log(err);
            });
    };

    const footerDialog = (
        <div className="flex justify-end gap-x-2">
            <Button outlined label="Cancelar" icon="pi pi-times" severity='danger' onClick={() => setVisible(false)} />
            <Button outlined label='Guardar Cambios' icon="pi pi-save" onClick={handleSubmit} />
        </div>
    )

    return (
        <Dialog footer={footerDialog} header={`Editando unidad: ${unidades[0].title}`} visible={visible} onHide={() => { if (!visible) return; setVisible(false) }}
            style={{ width: '70vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
            <div className="container mx-auto p-4 flex flex-col gap-y-10 justify-center">
                <Card title={`${unidades[0].title} - ${unidades[0].description}`} key={unidades[0].id} className="relative shadow-none border-2 w-[500px]">
                    <h3 className="font-semibold mb-2">Subtítulos:</h3>
                    <ul className="space-y-2 mb-4">
                        {Object.keys(unidades[0]).length > 0 && unidades[0]?.contents.map((sub) => (
                            <li key={sub.id} className="flex justify-between items-center">
                                <div className='flex'>
                                    <span className='mr-2'>{sub.title}</span>
                                    {sub.url_content && (
                                        <a href={sub.url_content} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 ml-2 text-blue-500 hover:underline">
                                            <Link size={16} />
                                            Enlace
                                        </a>
                                    )}
                                </div>
                                <Button icon="pi pi-trash" severity="danger" rounded outlined onClick={() => eliminarContent(unidades[0].id, sub.id)} />
                            </li>
                        ))}
                    </ul>
                    <div className="space-y-2 flex flex-col">
                        <InputText
                            placeholder="Nuevo subtítulo"
                            value={nuevosContents[unidades[0].id]?.title || ''}
                            onChange={(e) => actualizarNuevoContent(unidades[0].id, 'title', e.target.value)}
                        />
                        <InputText
                            placeholder="Enlace al material de aprendizaje"
                            value={nuevosContents[unidades[0].id]?.url_content || ''}
                            onChange={(e) => actualizarNuevoContent(unidades[0].id, 'url_content', e.target.value)}
                        />
                        <div>
                            <Button icon="pi pi-plus" label="Agregar Subtítulo" rounded onClick={() => agregarContent(unidades[0].id)} />
                        </div>
                    </div>
                </Card>
            </div >
        </Dialog>
    );
}

export default EditUnitDialog