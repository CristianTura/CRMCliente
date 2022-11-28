import { useRouter } from 'next/router'
import React from 'react'
import Layout from '../../components/Layout';
import { gql, useQuery, useMutation} from '@apollo/client'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2'

const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id: ID!){
        obtenerProducto(id: $id){
        id
        nombre
        precio
        existencia
        creado
        }
    }
`
const  ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput) {
        actualizarProducto(id: $id, input: $input){
        id
        nombre
        existencia
        precio
        }
    }
`

const EditarProducto = () => {
  const router = useRouter();
  const { query: { id } } = router;

  const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
    variables: {id}
  });

  const [ actualizarProducto ] = useMutation(ACTUALIZAR_PRODUCTO)

  const schemaValidacion = Yup.object({
    nombre: Yup.string().required('El nombre es obligatorio'),
    existencia: Yup.number().required('La cantidad es obligatoria'),
    precio: Yup.number().required('El precio es obligatorio'),
  })

  if (loading) return 'Cargando...'
  if (!data) return 'Acción no permitida'

  const { obtenerProducto } = data;

  const actualizarInfoProducto = async valores => {
    const { nombre, existencia, precio } = valores;
    try {
      const {data} = await actualizarProducto({
          variables: {
            id,
            input: {
                nombre,
                existencia: Number(existencia), 
                precio: Number(precio)
            }
          }
      })
      Swal.fire(
        'Actualizado!',
        'El producto se actualizo correctamente',
        'success'
      )
      router.push('/productos')
    } catch (error) {
        console.log(error.message)
    }
  }

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Editar Producto</h1>

      <div className='flex justify-center mt-5'>
          <div className='w-full max-w-lg'>
            <Formik 
              validationSchema={schemaValidacion}
              enableReinitialize
              initialValues={ obtenerProducto }
              onSubmit={async(valores) => {
                actualizarInfoProducto(valores)
              }}
            >
              { props => {
                // console.log(props)
                return (
                  <form 
                      className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                      onSubmit={props.handleSubmit}   
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
                              value={props.values.nombre}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                          />
                      </div>
                      { props.touched.nombre && props.errors.nombre ? (
                          <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                              <p className='font-bold'>Error</p>
                              <p>{props.errors.nombre }</p>
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
                              value={props.values.existencia}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                          />
                      </div>
                      { props.touched.existencia && props.errors.existencia ? (
                          <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                              <p className='font-bold'>Error</p>
                              <p>{props.errors.existencia }</p>
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
                              value={props.values.precio}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                          />
                      </div>
                      { props.touched.precio && props.errors.precio ? (
                          <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                              <p className='font-bold'>Error</p>
                              <p>{props.errors.precio }</p>
                          </div>
                      ) : null }
                      <input 
                          type="submit" 
                          className='bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-600' 
                          value="Editar producto"
                      />
                  </form>
                )
              }}
            </Formik>
          </div>
      </div>
    </Layout>
  )
}

export default EditarProducto