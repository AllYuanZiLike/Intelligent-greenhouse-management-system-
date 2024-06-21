import axios from 'axios'

const service = axios.create({
    baseURL:'http://localhost:7100',
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": window.sessionStorage.getItem("token") == null ? null : `Bearer ${window.sessionStorage.getItem("token")}`
    }
})

service.interceptors.request.use(config=>{
    if(window.sessionStorage.getItem("token") != null){
        config.headers.Authorization = "Bearer " + window.sessionStorage.getItem("token");
    }
    return config;
})

export default service
