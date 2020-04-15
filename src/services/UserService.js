import http from "../http-common";

export default{
    register: (data)=>{
        return http.post("/register", data);
    },
    authenticate: (data)=>{
        return http.post("/authenticate", data);
    }
};