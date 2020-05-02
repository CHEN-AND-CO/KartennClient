import http from "../lib/http-common";

export default{
    isLogged: ()=>{
        return http.get("/logged");
    }
};