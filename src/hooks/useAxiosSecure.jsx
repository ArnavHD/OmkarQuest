// import axios from 'axios';
// // import React from 'react';

// const axiosSecure = axios.create({
//   baseURL: `http://localhost:5000/`,
// });

// const useAxiosSecure = () => {
//     return axiosSecure;
// };

// export default useAxiosSecure;

import axios from "axios";
import { auth } from "../firebase/firebase.init";


const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

axiosSecure.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;