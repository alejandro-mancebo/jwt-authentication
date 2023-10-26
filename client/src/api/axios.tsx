import axios from 'axios';

export const axiosPublic = axios.create({
  baseURL: 'http://localhost:5000'
});

export const axiosPrivate = axios.create({
  baseURL: 'http://localhost:5500',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

