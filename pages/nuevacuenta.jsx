import React, { useState } from 'react'
import Layout from '../components/Layout'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router';

const NUEVA_CUENTA = gql`
    mutation nuevoUsuario($input: UsuarioInput) {
        nuevoUsuario(input: $input) {
        id
        nombre
        apellido
        email
        }
    } 
`

const NuevaCuenta = () => {
    const [mensaje, setMensaje] = useState(null)
    const router = useRouter()

    //MUTATION para crear nuevo usuarios
    const [ nuevoUsuario ] = useMutation(NUEVA_CUENTA)

    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            apellido: Yup.string().required('El apellido es obligatorio'),
            email: Yup.string().email('El email no es válido').required('El email es obligatorio'),
            password: Yup.string().required('El password es obligatorio').min(6, 'El password debe ser de al menos 6 carcteres'),
        }),
        onSubmit: async valores => {
            // console.log('enviando', valores)
            const { nombre, apellido, email, password } = valores;

            try {
                const {data} = await nuevoUsuario({
                    variables: {
                        input: {
                            nombre, apellido, email, password
                        }
                    }
                })
                console.log(data)

                setMensaje(`Se creo correctamente el Usuario: ${data.nuevoUsuario.nombre}`)
                setTimeout(() => {
                    setMensaje(null)
                    router.push('/login')
                }, 1000);

            } catch (error) {
                setMensaje(error.message)
                setTimeout(() => {
                    setMensaje(null)
                }, 3000);
            }
        }
    })

    // if(loading) return 'Cargando...'
    const mostrarMensaje = () => {
        return (
            <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
                <p>{mensaje}</p>
            </div>
        )
    }

  return (
    <Layout>
        {mensaje && mostrarMensaje()}
        <h1 className='text-center text-2xl text-white font-light'>Crear Nueva Cuenta</h1>
        <div className='flex justify-center mt-5'>
            <div className='w-full max-w-sm'>
                <form 
                    className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
                    onSubmit={formik.handleSubmit}    
                >
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>
                            Nombre
                        </label>
                        <input  
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='nombre'
                            type='text'
                            placeholder='Nombre Usuario'
                            value={formik.values.nombre}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    { formik.touched.nombre && formik.errors.nombre ? (
                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                            <p className='font-bold'>Error</p>
                            <p>{formik.errors.nombre }</p>
                        </div>
                    ) : null }

                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='apellido'>
                            Apellido
                        </label>
                        <input  
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='apellido'
                            type='text'
                            placeholder='Apellido Usuario'
                            value={formik.values.apellido}
                            onChange={formik.handleChange}
                        />
                    </div>
                    { formik.touched.apellido && formik.errors.apellido ? (
                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                            <p className='font-bold'>Error</p>
                            <p>{formik.errors.apellido }</p>
                        </div>
                    ) : null }

                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                            Email
                        </label>
                        <input  
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='email'
                            type='email'
                            placeholder='Email Usuario'
                            value={formik.values.email}
                            onChange={formik.handleChange}
                        />
                    </div>
                    { formik.touched.email && formik.errors.nombre ? (
                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                            <p className='font-bold'>Error</p>
                            <p>{formik.errors.email }</p>
                        </div>
                    ) : null }

                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                            Password
                        </label>
                        <input  
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='password'
                            type='password'
                            placeholder='Contraseña'
                            value={formik.values.password}
                            onChange={formik.handleChange}
                        />
                    </div>
                    { formik.touched.password && formik.errors.password ? (
                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                            <p className='font-bold'>Error</p>
                            <p>{formik.errors.password }</p>
                        </div>
                    ) : null }

                    <input 
                        type="submit" 
                        className='bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-600' 
                        value="Crear Cuenta"
                    />
                </form>
            </div>
        </div>
    </Layout>
  )
}

export default NuevaCuenta