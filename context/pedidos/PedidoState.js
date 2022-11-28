import { useReducer } from "react";
import types from "../../types";
import PedidoContext from "./PedidoContext";
import PedidoReducer from "./PedidoReducer";


const PedidoState = ({children}) => {

    const initialState = {
        cliente: {},
        productos: [],
        total: 0
    }

    const [state, dispatch] = useReducer(PedidoReducer, initialState)

    // Modifica el cliente
    const agregarCliente = cliente => {
        // console.log(cliente)
        dispatch({
            type: types.SELECCIONAR_CLIENTE,
            payload: cliente
        })
    }

    //Modifica los productos
    const agregarProducto = productosSeleccionados => {
        let nuevoState;
        if(state.productos.length > 0){
            nuevoState = productosSeleccionados.map( producto => {
                const nuevoObjeto = state.productos.find( productosState => productosState.id === producto.id)
                return {...producto, ...nuevoObjeto}
            })
        } else {
            nuevoState = productosSeleccionados;
        }

        dispatch({
            type: types.SELECCIONAR_PRODUCTO,
            payload: nuevoState
        })
    }

    // Modifica las cantidades de los productos
    const cantidadProductos = nuevoProducto => {
        dispatch({
            type: types.CANTIDAD_PRODUCTOS,
            payload: nuevoProducto
        })
    }

    const actualizarTotal = () => {
        dispatch({
            type: types.ACTUALIZAR_TOTAL,
        })
    }

    return (
        <PedidoContext.Provider
            value={{
                cliente: state.cliente,
                productos: state.productos,
                total: state.total,
                agregarCliente,
                agregarProducto,
                cantidadProductos,
                actualizarTotal,
            }}
        >
            {children}
        </PedidoContext.Provider>
    )
}

export default PedidoState;