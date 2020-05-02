import axios from "axios";
import constants from "./constants";

console.log(constants.api_url);

export default axios.create({
  baseURL: constants.api_url,
  headers: {
    "Content-type": "application/json",
    "x-access-token": localStorage.xtoken,
  }
});