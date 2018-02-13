import * as types from './mutationTypes';

export default {
    [types.SET_USER_INFO](state,userInfo){
        state.userInfo = userInfo;
    },
    [types.SET_CART_COUNT](state,cartCount){
        state.cartCount += cartCount;
    },
    [types.INIT_CART_COUNT](state,cartCount){
        state.cartCount = cartCount;
    }
}