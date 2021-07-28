import Vue from "vue";
import Vuex from "vuex"

Vue.use(Vuex);


const store = new Vuex.Store({
    state: {
        authorization: -1,
    }
})

export default store