import http from "../lib/http-common";

export default{
    getCity: (name, data)=>{
        return http.get("/cities/"+name, data);
    }
};