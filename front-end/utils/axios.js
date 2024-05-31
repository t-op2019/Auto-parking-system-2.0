import axios from "axios";

// change this base on ip in your local network ( dont know why this weird thing happend )
const url = "http://10.2.20.164:3000/api/v1";

const axiosInstance = axios.create({
  baseURL: url,
  responseType: "json",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
