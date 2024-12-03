import axios from "axios";

const makeRequest = axios.create({
  baseURL: "https://spoturf-backend.onrender.com",
  headers:{
    Authorization:"Bearer secretkey"
  }
});
makeRequest.interceptors.response.use(function(response) {
  return response;
})
export default makeRequest;
