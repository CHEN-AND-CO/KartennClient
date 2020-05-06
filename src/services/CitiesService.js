import http from "../lib/http-common";

export default{
    getCity: (name, create)=>{
        return http.get("/cities/"+name+"?create="+create);
    }
};