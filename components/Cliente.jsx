import React from 'react'
import { useMutation, gql } from '@apollo/client'
import Swal from 'sweetalert2'
import Router from 'next/router'

const ELIMINAR_CLIENTE = gql`
    mutation eliminarCliente ($id: ID!){
        eliminarCliente(id: $id)
    }
`
const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
    }
  }
`

const Cliente = ({ cliente }) => {
    const { nombre, apellido, empresa, email, id} = cliente;

    const [ eliminarCliente ] = useMutation(ELIMINAR_CLIENTE, {
        update(cache) {
            // obtener una copiadel objeto de cache
            const {obtenerClientesVendedor} = cache.readQuery({query: OBTENER_CLIENTES_USUARIO});

            // Reescribir el cache
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor: obtenerClientesVendedor.filter( clienteActual => clienteActual.id !== id)
                }
            })
        }
    })

    const confirmarEliminarCliente =  (id) => {
        Swal.fire({
            title: '¿Deseas eliminar a este cliente?',
            text: "Esta acción no se puede deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!',
            cancelButtonText: 'No, Cancelar'
        }).then(async(result) => {
            if (result.isConfirmed) {
                try {
                    const {data} = await eliminarCliente({
                        variables: {id}
                    })
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarCliente,
                        'success'
                    )
                } catch (error) {
                    console.log(error)
                }
            }
        })
            
    }

    const editarCliente = () => {
        Router.push({
            pathname: "editarcliente/[id]",
            query: { id }
        })
    }
  return (
    <tr>
        <td className='border px-4 py-2'>{nombre} {apellido}</td>
        <td className='border px-4 py-2'>{empresa}</td>
        <td className='border px-4 py-2'>{email}</td>
        <td className='border px-4 py-2'>
            <button 
                type='button'
                className='flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white text-xs rounded uppercase font-bold'
                onClick={() => confirmarEliminarCliente(id)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
        </td>
        <td className='border px-4 py-2'>
            <button 
                type='button'
                className='flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white text-xs rounded uppercase font-bold'
                onClick={() => editarCliente()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
            </button>
        </td>
    </tr>
  )
}

export default Cliente