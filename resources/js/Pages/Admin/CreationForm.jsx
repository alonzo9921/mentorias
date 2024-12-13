import { Head, router } from '@inertiajs/react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

function Component() {
    const [questions, setQuestions] = useState([]);
    const [newQuestionText, setNewQuestionText] = useState('');
    const [formTitle, setFormTitle] = useState('');
    const [editingQuestionId, setEditingQuestionId] = useState(null);

    const addQuestion = () => {
        if (newQuestionText.trim() === '') return;
        const newQuestion = {
            id: Date.now(),
            text: newQuestionText,
            options: ['']
        };
        setQuestions([...questions, newQuestion]);
        setNewQuestionText('');
    };

    const removeQuestion = (id) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const addOption = (questionId) => {
        setQuestions(questions.map(q =>
            q.id === questionId ? { ...q, options: [...q.options, ''] } : q
        ));
    };

    const updateOption = (questionId, optionIndex, value) => {
        setQuestions(questions.map(q =>
            q.id === questionId ? {
                ...q,
                options: q.options.map((opt, idx) => idx === optionIndex ? value : opt)
            } : q
        ));
    };

    const removeOption = (questionId, optionIndex) => {
        setQuestions(questions.map(q =>
            q.id === questionId ? {
                ...q,
                options: q.options.filter((_, idx) => idx !== optionIndex)
            } : q
        ));
    };

    const saveForm = (e) => {
        e.preventDefault();
        axios.post(route('admin.forms.store', { title: formTitle, questions }))
            .then(res => {
                setQuestions([]);
                setFormTitle('');
            }).catch(err => {
                console.log(err);
            });
    }

    const startEditing = (questionId) => {
        setEditingQuestionId(questionId);
    }

    const updateQuestionText = (questionId, newText) => {
        setQuestions(questions.map(q =>
            q.id === questionId ? { ...q, text: newText } : q
        ));
    };

    const finishEditing = () => {
        setEditingQuestionId(null);
    };

    const header = (question) => {
        return (
            <div className='flex justify-between gap-x-2 p-4'>
                {editingQuestionId === question.id ? (
                    <InputText
                        value={question.text}
                        onChange={(e) => updateQuestionText(question.id, e.target.value)}
                        onBlur={finishEditing}
                        autoFocus
                    />
                ) : (
                    <p className="text-lg">{question.text}</p>
                )}
                <div className="flex space-x-2">
                    <Button rounded icon="pi pi-pencil" outlined onClick={() => startEditing(question.id)} />
                    <Button rounded icon="pi pi-trash" severity='danger' onClick={() => removeQuestion(question.id)} />
                </div>
            </div>

        )
    }

    return (
        <AuthenticatedLayout>
            <div className={`${Object.keys(questions).length === 0 ? 'flex h-screen items-center' : 'py-4'}`} >
                <Head title="Crear Formulario" />
                <div className="container mx-auto p-4 max-w-6xl">
                    <Card className="mb-6 shadow-none border-2 border-gray-200">
                        <InputText
                            placeholder="Título del Formulario"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            className="text-xl font-semibold mb-6"
                        />
                        <div className="flex space-x-4">
                            <InputText
                                placeholder="Escribe tu pregunta aquí"
                                value={newQuestionText}
                                onChange={(e) => setNewQuestionText(e.target.value)}
                                className="flex-grow"
                            />
                            <Button label="Agregar Pregunta" onClick={addQuestion} />
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Card title='Editor de Preguntas' className='shadow-none border-2 border-gray-200'>
                            {questions.map((question) => (
                                <Card className='shadow-none border-2 border-gray-200' key={question.id} header={() => header(question)}>
                                    <div className="space-y-2">
                                        {question.options.map((option, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <InputText
                                                    value={option}
                                                    onChange={(e) => updateOption(question.id, index, e.target.value)}
                                                    placeholder={`Opción ${index + 1}`}
                                                />
                                                <Button icon="pi pi-trash" severity="danger" onClick={() => removeOption(question.id, index)} />
                                            </div>
                                        ))}
                                        <div>
                                            <Button label='Agregar Opción' icon="pi pi-plus-circle" onClick={() => addOption(question.id)} className='mt-4' />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </Card>

                        <Card title='Vista Previa del Formulario' className='shadow-none border-2 border-gray-200'>
                            <h2 className="text-2xl font-bold">{formTitle}</h2>
                            {questions.map((question, index) => (
                                <div key={question.id} className="space-y-2">
                                    <h3 className="text-lg font-semibold">
                                        {index + 1}. {question.text}
                                    </h3>
                                    {question.options.map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex items-center space-x-2">
                                            <RadioButton value={option} id={`q${question.id}-option${optionIndex}`} />
                                            <label htmlFor={`q${question.id}-option${optionIndex}`}>{option}</label>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </Card>
                    </div>
                    <div className="w-full flex justify-end">
                        <Button outlined label='Guardar Formulario' icon="pi pi-save" onClick={saveForm} />
                    </div>
                </div>
            </div >
        </AuthenticatedLayout>
    );
}

export default Component;
