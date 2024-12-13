import { useForm, router, Head } from '@inertiajs/react';
import { Link } from '@phosphor-icons/react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useState } from 'react';

export default function Component() {
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
        
        console.log(unidades);
        router.post(route('admin.learning-unit.store', { unidades }), {
            preserveScroll: true,
            onSuccess: (response) => {
                // console.log(response);
                router.push(route('admin.learning-unit.create'));
            }
        })
    };

    return (
        <div className="container mx-auto p-4">
            <Head title="Unidad de aprendizaje" />
            <h1 className="text-2xl font-bold mb-4">Formulario de Unidades de Aprendizaje</h1>

            <Card title="Agregar Nueva Unidad" className="mb-6 shadow-none border-2">
                <div className="space-y-4 grid grid-cols-1">
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
                        <Button onClick={agregarUnidad} label="Agregar Unidad" />
                    </div>
                </div>
            </Card>

            {unidades.map((unidad) => (
                <Card title={unidad.title} key={unidad.id} className="mb-4 relative shadow-none border-2">
                    <Button className='absolute top-8 right-6' icon="pi pi-trash" variant="destructive" size="icon" onClick={() => eliminarUnidad(unidad.id)} />
                    <p className="mb-4">{unidad.description}</p>
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
                                <Button icon="pi pi-trash" severity="danger" onClick={() => eliminarContent(unidad.id, sub.id)} />
                            </li>
                        ))}
                    </ul>
                    <div className="space-y-2 grid grid-cols-1">
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
                            <Button icon="pi pi-plus" label="agregar Subtítulo" onClick={() => agregarContent(unidad.id)} />
                        </div>
                    </div>
                </Card>
            ))
            }
            <div className="flex justify-end">
                <Button onClick={handleSubmit} icon="pi pi-save" label='Guardar' />
            </div>
        </div >
    );
}