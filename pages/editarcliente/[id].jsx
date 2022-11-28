import { useRouter } from 'next/router'
import React from 'react'
import Layout from '../../components/Layout';
import { gql, useQuery, useMutation} from '@apollo/client'
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2'

const OBTENER_CLIENTE_USUARIO = gql`
  query obtenerCliente($id: ID!) {
    obtenerCliente(id: $id) {
      nombre
      apellido
      email
      empresa
      telefono
    }
  }
`
const  ACTUALIZAR_CLIENTE = gql`
  mutation actualizarCliente($id: ID!, $input: ClienteInput!){
    actualizarCliente(id: $id, input: $input) {
      nombre
      apellido
      email
      empresa
      telefono
    }
  }
`

const EditarCliente = () => {
  const router = useRouter();
  const { query: { id } } = router;

  const { data, loading, error } = useQuery(OBTENER_CLIENTE_USUARIO, {
    variables: {id}
  });

  const [ actualizarCliente ] = useMutation(ACTUALIZAR_CLIENTE)

  const schemaValidacion = Yup.object({
    nombre: Yup.string().required('El nombre es obligatorio'),
    apellido: Yup.string().required('El apellido es obligatorio'),
    empresa: Yup.string().required('La empresa es obligatoria'),
    email: Yup.string().email('El email no es válido').required('El email es obligatorio'),
  })

  if (loading) return 'Cargando...'

  const { obtenerCliente } = data;

  const actualizarInfoCliente = async valores => {
    const { nombre, apellido, empresa, email, telefono } = valores;
    try {
      const {data} = await actualizarCliente({
          variables: {
            id,
            input: {
              nombre, apellido, empresa, email, telefono 
            }
          }
      })
      Swal.fire(
        'Actualizado!',
        'El cliente se actualizo correctamente',
        'success'
      )
      router.push('/')
    } catch (error) {
        console.log(error.message)
    }
  }

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Editar Cliente</h1>

      <div className='flex justify-center mt-5'>
          <div className='w-full max-w-lg'>
            <Formik 
              validationSchema={schemaValidacion}
              enableReinitialize
              initialValues={ obtenerCliente }
              onSubmit={async(valores) => {
                actualizarInfoCliente(valores)
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
                          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='apellido'>
                              Apellido
                          </label>
                          <input  
                              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                              id='apellido'
                              type='text'
                              placeholder='Apellido cliente'
                              value={props.values.apellido}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                          />
                      </div>
                      { props.touched.apellido && props.errors.apellido ? (
                          <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                              <p className='font-bold'>Error</p>
                              <p>{props.errors.apellido }</p>
                          </div>
                      ) : null }
                      <div className='mb-4'>
                          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='empresa'>
                              Empresa
                          </label>
                          <input  
                              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                              id='empresa'
                              type='text'
                              placeholder='Empresa cliente'
                              value={props.values.empresa}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                          />
                      </div>
                      { props.touched.empresa && props.errors.empresa ? (
                          <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                              <p className='font-bold'>Error</p>
                              <p>{props.errors.empresa }</p>
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
                              value={props.values.email}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                          />
                      </div>
                      { props.touched.email && props.errors.email ? (
                          <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                              <p className='font-bold'>Error</p>
                              <p>{props.errors.email }</p>
                          </div>
                      ) : null }
                      <div className='mb-4'>
                          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='telefono'>
                              Telefono
                          </label>
                          <input  
                              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                              id='telefono'
                              type='tel'
                              placeholder='Telefono cliente'
                              value={props.values.telefono}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                          />
                      </div>
                      { props.touched.telefono && props.errors.telefono ? (
                          <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                              <p className='font-bold'>Error</p>
                              <p>{props.errors.telefono }</p>
                          </div>
                      ) : null }
                      <input 
                          type="submit" 
                          className='bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-600' 
                          value="Editar cliente"
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

export default EditarCliente