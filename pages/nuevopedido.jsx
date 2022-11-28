import React, { useContext, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import AsignarCliente from '../components/pedidos/AsignarCliente'
import AsignarProductos from '../components/pedidos/AsignarProductos'
import ResumenPedido from '../components/pedidos/ResumenPedido'
import Total from '../components/pedidos/Total'
import PedidoContext from '../context/pedidos/PedidoContext'
import {gql, useMutation} from '@apollo/client' 
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

const NUEVO_PEDIDO = gql`
  mutation nuevoPedido ($input: PedidoInput) {
    nuevoPedido(input: $input){
      id
    }
  }
`
const OBTENER_PEDIDOS_VENDEDOR = gql`
  query obtenerPedidosVendedor{
    obtenerPedidosVendedor{
      id
      pedido {
        id
        cantidad
        nombre
      }
      cliente {
        id
        nombre
        apellido
        email
        telefono
      }
      vendedor
      estado
      total
    }
  }
`

const Nuevopedido = () => {
  const [mensaje, setMensaje] = useState(null)
  const { cliente, productos, total } = useContext(PedidoContext)

  const router = useRouter()
  
  const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
    update (cache, {data: {nuevoPedido}}){
      const {obtenerPedidosVendedor} = cache.readQuery({
        query: OBTENER_PEDIDOS_VENDEDOR
      })

      cache.writeQuery({
        query: OBTENER_PEDIDOS_VENDEDOR,
        data: {
          obtenerPedidosVendedor: [...obtenerPedidosVendedor, {...nuevoPedido}]
        }
      })
    }
  })
  
  const validarPedido = ( ) => {
    return !productos.every( producto => producto.cantidad > 0) || total === 0 || Object.keys(cliente).length === 0 
    ? " opacity-50 cursor-not-allowed " : ""
  }
  
  const crearNuevoPedido = async ( ) => {
    const { id } = cliente;

    const pedido = productos.map( ({__typename, existencia, creado,  ...producto}) => producto)
    console.log(pedido)

    try {
      const { data } = await nuevoPedido({
        variables: {
          input: {
            cliente: id,
            total,
            pedido
          }
        }
      })
      router.push('/pedidos')
      Swal.fire(
        'Correcto',
        'El pedido se registró correctamente',
        'success'
      )
    } catch (error) {
      setMensaje(error.message)
      setTimeout(() => {
          setMensaje(null)
      }, 2000);
    }
  }

  const mostrarMensaje = () => {
    return (
      <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
        <p>{mensaje}</p>
      </div>
    )
  }

  return (
    <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Crear Nuevo Pedido</h1>
    
        { mensaje && mostrarMensaje()}

        <div className='flex justify-center mt-5'>
          <div className='w-full max-w-lg'>
            <AsignarCliente/>
            <AsignarProductos/>
            <ResumenPedido/>
            <Total/>

            <button 
              type='button' 
              className={`bg-gray-800 w-full mt-5 p-2 text-white uppercasse font-bold hover:bg-gray-900 ${validarPedido()}`}
              onClick={() => crearNuevoPedido()}
            >
              Registar Pedido
            </button>
          </div>
        </div>
    </Layout>
  )
}

export default Nuevopedido