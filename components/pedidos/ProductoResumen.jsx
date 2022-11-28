import React, { useContext, useEffect, useState } from 'react'
import PedidoContext from '../../context/pedidos/PedidoContext';

const ProductoResumen = ({producto}) => {
    const [cantidad, setCantidad] = useState(0)
    const { cantidadProductos, actualizarTotal } = useContext(PedidoContext)
    // console.log(cantidadProductos)

    useEffect(() => {
        actualizarCantidad()
        actualizarTotal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cantidad])

    const actualizarCantidad = () => {
        const nuevoProducto = {...producto, cantidad: Number(cantidad)}
        cantidadProductos(nuevoProducto)
    }
    
    const { nombre, precio} = producto;
  return (
    <div className='md:flex md:justify-between md:items-center mt-5'>
        <div className='md:w-2/4 md:mb-0 mb-2'>
            <p className='text-sm'>{nombre}</p>
            <p className='text-sm'>$ {precio}</p>
        </div>
        <input 
            type="number" 
            placeholder='Cantidad'
            className='shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4'
            onChange={e => setCantidad(e.target.value) }
            value={cantidad}
            min={0}
        />        
    </div>
  )
}

export default ProductoResumen