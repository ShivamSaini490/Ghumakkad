// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8081/users',  // your backend base
  withCredentials: true, // to send cookies for JWT auth
});

export default instance;
