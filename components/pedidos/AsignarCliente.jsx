import React, { useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import { gql, useQuery } from '@apollo/client'
import PedidoContext from '../../context/pedidos/PedidoContext'

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

const AsignarCliente = () => {
    const [cliente, setCliente] = useState([])

    const {agregarCliente} = useContext(PedidoContext)

    const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);
    // console.log(agregarCliente)

    useEffect(() => {
        // agregarCliente(cliente)
    }, [agregarCliente, cliente])

    const seleccionarCliente = (cliente) => {
        setCliente(cliente)
        agregarCliente(cliente)

    }

    if (loading) return null

    const { obtenerClientesVendedor } = data
    return (
        <>
            <p className='mt-10 my-2 bg-white border-gray-800 text-gray-700 p-2 text-sm font-bold'>1.- Asigna un Cliente al pedido</p>
            <Select 
                    className='mt-3'
                    options={obtenerClientesVendedor}
                    onChange={ opcion => seleccionarCliente(opcion)}
                    getOptionValue={ opciones => opciones.id}
                    getOptionLabel={ label => label.nombre}
                    placeholder={'Seleccione el cliente'}
                    noOptionsMessage={ () => 'No hay resultados'}
            />
        </>
    )
}

export default AsignarCliente