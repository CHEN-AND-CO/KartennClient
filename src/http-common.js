import axios from "axios";

export default axios.create({
  baseURL: "http://217.182.204.82:8420/api",
  headers: {
    "Content-type": "application/json"
  }
});