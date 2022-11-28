import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Layout from '../components/Layout'
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client'

const NUEVO_PRODUCTO = gql`
    mutation nuevoProducto($input: ProductoInput) {
        nuevoProducto(input: $input){
        id
        nombre
        existencia
        creado
        }
    } 
`
const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      precio
      existencia
      creado
    }
  }
`

const Nuevoproducto = () => {
    const [ nuevoProducto ] = useMutation(NUEVO_PRODUCTO, {
        update(cache, { data: { nuevoProducto}}) {
            // Obtener el cache que deseamos actualizar
            const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS});

            //Reescrinir el cache (el cache no se debe modificar se debe sobreescribir)
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: [...obtenerProductos, nuevoProducto]
                }
            })
         }
    })

    const [mensaje, setMensaje] = useState(null)
    const router = useRouter()

    const formik = useFormik({
        initialValues: {
            nombre: '',
            existencia: '',
            precio: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            existencia: Yup.number()
                            .required('La cantidad es obligatoria')
                            .positive('No se aceptan números negativos')
                            .integer('Debe ser un número entero'),
            precio: Yup.number().required('El precio es obligatorio').positive('No se aceptan números negativos'),
        }),
        onSubmit: async valores => {
            const { nombre, existencia, precio } = valores;
            // console.log(nombre, existencia, precio )

            try {
                const {data} = await nuevoProducto({
                    variables: {
                        input: {
                            nombre,
                            existencia: Number(existencia), 
                            precio: Number(precio)
                        }
                    }
                })
                // console.log(data)
                setMensaje(`Creando producto...`)
                router.push('/productos')
            } catch (error) {
                setMensaje(error.message)
                setTimeout(() => {
                    setMensaje(null)
                }, 2000);
            }
        }
    })
    const mostrarMensaje = () => {
        return (
            <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
                <p>{mensaje}</p>
            </div>
        )
    }
  return (
    <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Nuevo Producto</h1>
        {mensaje && mostrarMensaje()}
        <div className='flex justify-center mt-5'>
            <div className='w-full max-w-lg'>
                <form 
                    className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
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
                            placeholder='Nombre cliente'
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
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='existencia'>
                            Existencia
                        </label>
                        <input  
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='existencia'
                            type='text'
                            placeholder='existencia cliente'
                            value={formik.values.existencia}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    { formik.touched.existencia && formik.errors.existencia ? (
                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                            <p className='font-bold'>Error</p>
                            <p>{formik.errors.existencia }</p>
                        </div>
                    ) : null }
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='precio'>
                            Precio
                        </label>
                        <input  
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            id='precio'
                            type='text'
                            placeholder='precio cliente'
                            value={formik.values.precio}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    { formik.touched.precio && formik.errors.precio ? (
                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                            <p className='font-bold'>Error</p>
                            <p>{formik.errors.precio }</p>
                        </div>
                    ) : null }
                    <input 
                        type="submit" 
                        className='bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-600' 
                        value="Nuevo producto"
                    />
                </form>
            </div>
        </div>
    </Layout>
  )
}

export default Nuevoproducto