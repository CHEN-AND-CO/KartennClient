import http from "../http-common";

export default{
    register: (data)=>{
        return http.post("/users/register", data);
    },
    authenticate: (data)=>{
        return http.post("/users/authenticate", data);
    }
};