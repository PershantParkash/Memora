
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.100.6:5000', 
});

export default axiosInstance;
