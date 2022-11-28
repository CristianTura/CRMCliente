import types from "../../types"


// eslint-disable-next-line import/no-anonymous-default-export
// export default (state, action) => {
//     switch(action.type) {
//         case types.SELECCIONAR_CLIENTE:
//             return {
//                 ...state,
//                 cliente: action.payload
//             }
//         default:
//             return state
//     }
// }

const reducerObject = (state, payload) => ({
    [types.SELECCIONAR_CLIENTE]: {
        ...state,
        cliente: payload
    },
    [types.SELECCIONAR_PRODUCTO]: {
        ...state,
        productos: payload
    },
    [types.CANTIDAD_PRODUCTOS]: {
        ...state,
        productos: state.productos.map( producto => {
            if (producto.id === payload?.id){
                return payload
            } else {
                return producto
            }
        })
    },
    [types.ACTUALIZAR_TOTAL]: {
        ...state,
        total: state.productos.reduce( (nuevoTotal, articulo) => nuevoTotal += articulo.precio * articulo.cantidad , 0)
    }
})

// eslint-disable-next-line import/no-anonymous-default-export
export default (state, action) => {
    return reducerObject(state, action.payload)[action.type] || state
}