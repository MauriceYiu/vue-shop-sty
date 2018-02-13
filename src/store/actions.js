import * as types from './mutationTypes'

export default {
    setUserInfo({commit},userInfo){
        commit(types.SET_USER_INFO,userInfo);
    },
    setCartCount({commit},cartCount){
        commit(types.SET_CART_COUNT,cartCount);
    },
    initCartCount({commit},cartCount){
        commit(types.INIT_CART_COUNT,cartCount);
    }
}