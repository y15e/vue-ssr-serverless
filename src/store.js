import Vue from 'vue'
import Vuex from 'vuex'

import config from '../config/client'

Vue.use(Vuex)

//import { fetchItem } from './api'

export function createStore () {
  
  return new Vuex.Store({
    
    state: {
      
      lists: config.lists,
      
      items: {}
    },
    
    actions: {
      fetchItem ({ commit }, id) {
        return fetchItem(id).then(item => {
          commit('setItem', { id, item })
        })
      }
    },
    
    mutations: {
      
      setItem (state, { id, item }) {
        Vue.set(state.items, id, item)
      },
      
      setUser (state, user) {
        console.log('store.js setUser')
        Vue.set(state, 'user', user)
      },

      unsetUser (state) {
        Vue.set(state, 'user', null)
      }
      
    }
  })
}
