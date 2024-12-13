import { useForm, router, Head } from '@inertiajs/react';
import { Link } from '@phosphor-icons/react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useEffect, useState } from 'react';

const CreationUnitDialog = ({ visible, setVisible, unidadesApi }) => {
    const [unidades, setUnidades] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [nuevosContents, setNuevosContents] = useState({});

    const agregarUnidad = () => {
        if (title && description) {
            const nuevaUnidad = {
                id: Date.now(),
                title,
                description,
                contents: []
            };
            setUnidades([...unidades, nuevaUnidad]);
            setTitle('');
            setDescription('');
        }
    };

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

    const eliminarUnidad = (id) => {
        setUnidades(unidades.filter(unidad => unidad.id !== id));
        const { [id]: _, ...restContents } = nuevosContents;
        setNuevosContents(restContents);
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
        axios.post(route('admin.unitLearning.store', { unidades }))
            .then(res => {
                unidadesApi('toast')
                setVisible(false);
            }).catch(err => {
                console.log(err);
            });
    };

    const footerDialog = (
        <div className="flex justify-end gap-x-2">
            <Button outlined label="Cancelar" icon="pi pi-times" severity='danger' onClick={() => setVisible(false)} />
            <Button outlined label='Guardar Unidades' icon="pi pi-save" onClick={handleSubmit} />
        </div>
    )

    return (
        <Dialog footer={footerDialog} header="Crear Unidades de Aprendizaje" visible={visible} onHide={() => { if (!visible) return; setVisible(false) }}
            style={{ width: '70vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
            <div className="container mx-auto p-4 flex flex-col gap-y-10 justify-center">
                {/* <h1 className="text-2xl font-bold mb-4">Formulario de Unidades de Aprendizaje</h1> */}

                <Card title="Agregar Nueva Unidad" className="mb-6 shadow-none border-2 w-[500px]">
                    <div className="space-y-4 flex flex-col">
                        <InputText
                            placeholder="Título de la unidad"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <InputTextarea
                            placeholder="Descripción de la unidad"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div>
                            <Button onClick={agregarUnidad} label="Agregar Unidad" rounded icon="pi pi-plus" />
                        </div>
                    </div>
                </Card>

                {unidades.map((unidad) => (
                    <Card title={`${unidad.title} - ${unidad.description}`} key={unidad.id} className="relative shadow-none border-2 w-[500px]">
                        <Button className='absolute top-4 right-6' icon="pi pi-trash" severity='danger' rounded size="icon" onClick={() => eliminarUnidad(unidad.id)} />
                        <h3 className="font-semibold mb-2">Subtítulos:</h3>
                        <ul className="space-y-2 mb-4">
                            {unidad.contents.map((sub) => (
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
                                    <Button icon="pi pi-trash" severity="danger" rounded outlined onClick={() => eliminarContent(unidad.id, sub.id)} />
                                </li>
                            ))}
                        </ul>
                        <div className="space-y-2 flex flex-col">
                            <InputText
                                placeholder="Nuevo subtítulo"
                                value={nuevosContents[unidad.id]?.title || ''}
                                onChange={(e) => actualizarNuevoContent(unidad.id, 'title', e.target.value)}
                            />
                            <InputText
                                placeholder="Enlace al material de aprendizaje"
                                value={nuevosContents[unidad.id]?.url_content || ''}
                                onChange={(e) => actualizarNuevoContent(unidad.id, 'url_content', e.target.value)}
                            />
                            <div>
                                <Button icon="pi pi-plus" label="Agregar Subtítulo" rounded onClick={() => agregarContent(unidad.id)} />
                            </div>
                        </div>
                    </Card>
                ))
                }
            </div >
        </Dialog>
    );
}

export default CreationUnitDialog