import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import piece from './modules/piece'

Vue.use(Vuex)

const store = new Vuex.Store({
    actions,
    getters,
    modules: {
        piece,
    }
})

export default store
