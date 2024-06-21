import { createStore } from 'vuex'

export default createStore({
  state: {
    isLogin:false,
    userInfo:{
      id:"",
      username:"",
      role:1,
      phone:""
    }
  },
  getters: {
  },
  mutations: {
    getLogin(state,value){
      console.log(state,value)
      state.isLogin = value
    },
    getUserInfo(state,value){
      state.userInfo = value
    }
  },
  actions: {
  },
  modules: {
  }
})
