import axios from "axios";

export default axios.create({
  baseURL: "http://217.182.204.82:8420",
  //baseURL: "http://localhost:8420",
  headers: {
    "Content-type": "application/json"
  }
});