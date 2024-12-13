import { Card } from 'primereact/card'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { Checkbox } from 'primereact/checkbox'
import { Head, useForm } from '@inertiajs/react'
import InputError from '@/Components/InputError'
import { useEffect } from 'react'

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
const horas = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']

export default function RegistroForm({ careers }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        identifier: '',
        name: '',
        last_name: '',
        email: '',
        career: null,
        phone: '',
        role: 'alumno',
        password: '',
        password_confirmation: '',
        disponibilidad: {}
    })

    function submit(e) {
        e.preventDefault()

        post(route('register.store', data), {
            onSuccess: (res) => { console.log(res) },
            onError: (err) => { console.log(err) }
        });
    }

    const handleHoraChange = (dia, hora) => {
        setData(prev => {
            const nuevasHoras = prev.disponibilidad[dia]?.includes(hora)
                ? prev.disponibilidad[dia].filter(h => h !== hora)
                : [...(prev.disponibilidad[dia] || []), hora]
            return { ...prev, disponibilidad: { ...prev.disponibilidad, [dia]: nuevasHoras } }
        })
    }

    return (
        <>
            <Head title="Registro" />
            <Card title={`Registro de ${data.role === 'mentor' ? 'Mentor' : 'Alumno'}`} subTitle='Completa el formulario para registrarte en Mentorias UJAT.' className="w-full my-7 max-w-2xl mx-auto border-2 shadow-none">
                <form onSubmit={submit}>
                    <div className="space-y-4" >
                        <div className="flex justify-center space-x-4 mb-6">
                            <Button
                                label='Alumno'
                                severity='success'
                                outlined={data.role === 'alumno'}
                                onClick={() => setData('role', 'alumno')}
                            />
                            <Button
                                label='Mentor'
                                severity='success'
                                outlined={data.role === 'mentor'}
                                onClick={() => setData('role', 'mentor')}
                            />
                        </div>

                        <div className="space-y-2 grid grid-cols-1">
                            <label htmlFor="identifier">Matrícula <span className='text-red-600'>*</span></label>
                            <InputText
                                id="identifier"
                                name="identifier"
                                value={data.identifier}
                                onChange={(e) => setData('identifier', e.target.value)}
                                required
                            />
                            <InputError message={errors.identifier} className="mt-2" />
                        </div>

                        <div className="space-y-2 grid grid-cols-1">
                            <label htmlFor="name">Nombre <span className='text-red-600'>*</span></label>
                            <InputText
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="space-y-2 grid grid-cols-1">
                            <label htmlFor="last_name">Apellidos <span className='text-red-600'>*</span></label>
                            <InputText
                                id="last_name"
                                name="last_name"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                required
                            />
                            <InputError message={errors.last_name} className="mt-2" />
                        </div>

                        <div className="space-y-2 grid grid-cols-1">
                            <label htmlFor="email">Correo electrónico <span className='text-red-600'>*</span></label>
                            <InputText
                                id="email"
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="space-y-2 grid grid-cols-1">
                            <label htmlFor="phone">Teléfono <span className='text-red-600'>*</span></label>
                            <InputText
                                id="phone"
                                name="phone"
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                required
                            />
                            <InputError message={errors.phone} className="mt-2" />
                        </div>

                        <div className="space-y-2 grid grid-cols-1">
                            <label htmlFor="password" value="Password">Contraseña <span className='text-red-600'>*</span></label>

                            <InputText
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="space-y-2 grid grid-cols-1">
                            <label htmlFor="password_confirmation" value="Confirm Password">Confirmar contraseña <span className='text-red-600'>*</span></label>

                            <InputText
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                required
                            />

                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <div className="space-y-2 grid grid-cols-1 mb-4">
                            <label htmlFor="licenciatura">Licenciatura <span className='text-red-600'>*</span></label>
                            <Dropdown value={data.career} onChange={(e) => setData('career', e.value)} options={careers.data} optionLabel="name"
                                placeholder="Selecciona tu licenciatura" className="w-full md:w-14rem" />

                            <InputError message={errors.career} className="mt-2" />
                        </div>

                        {data.role === 'mentor' && (
                            <>
                                <div className='mt-5'>
                                    <label>Disponibilidad semanal</label>
                                </div>
                                <div className="space-y-2 bg-gray-100 px-5 pb-8 pt-1">
                                    {diasSemana.map((dia) => (
                                        <div key={dia} className="space-y-2 bg-gray-100">
                                            <div className='mt-8'>
                                                <label>{dia}</label>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {horas.map((hora) => (
                                                    <div key={`${dia}-${hora}`} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            value={`${dia}-${hora}`}
                                                            checked={data.disponibilidad[dia]?.includes(hora)}
                                                            onChange={() => handleHoraChange(dia, hora)}
                                                        />
                                                        <label htmlFor={`${dia}-${hora}`}>{hora}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    <Button severity='success' type="submit" label={`Registrar ${data.role}`} className="w-full" disabled={processing} />
                </form>
            </Card>
        </>
    )
}