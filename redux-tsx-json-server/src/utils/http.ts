import axios, { AxiosInstance } from "axios";

class Http {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: "http://localhost:4000",
      timeout: 6000,
    });
  }
}

const http = new Http().instance;

export default http;
