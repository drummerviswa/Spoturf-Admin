import axios from "axios";

const makeRequest = axios.create({
  baseURL: "http://localhost:8800",
  headers:{
    Authorization:"Bearer secretkey"
  }
});
makeRequest.interceptors.response.use(function(response) {
  return response;
})
export default makeRequest;