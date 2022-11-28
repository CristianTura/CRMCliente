import React, { useContext, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import ReactSelect from 'react-select'
import PedidoContext from '../../context/pedidos/PedidoContext'

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

const AsignarProductos = () => {
    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS)
    const [producto, setProducto] = useState([])

    const { agregarProducto } = useContext(PedidoContext)

    const seleccionarProducto = productos => {
        setProducto(productos)
        agregarProducto(productos)
    }
    // console.log(producto)

    if (loading) return null;
  return (
    <>
        <p className='mt-10 my-2 bg-white border-gray-800 text-gray-700 p-2 text-sm font-bold'>2.- Selecciona o busca los prodcutos</p>
        <ReactSelect
                className='mt-3'
                options={data.obtenerProductos}
                onChange={ opcion => seleccionarProducto(opcion)}
                isMulti={true}
                getOptionValue={ opciones => opciones.id}
                getOptionLabel={ label => `${label.nombre} - ${label.existencia} Disponibles`}
                placeholder={'Seleccione el cliente'}
                noOptionsMessage={ () => 'No hay resultados'}
        />
    </>
  )
}

export default AsignarProductos