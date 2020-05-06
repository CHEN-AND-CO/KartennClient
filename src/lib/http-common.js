import axios from "axios";
import constants from "../constants";

const http = axios.create({
  baseURL: constants.api_url,
  headers: {
    "Content-type": "application/json"
  }
})

http.interceptors.request.use(
  async (config) => {
    const token = await localStorage.getItem('xtoken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default http
