import axios from 'axios';

export const base_url = 'http://localhost:8000';
export const client = 'http://localhost:3000';


// const local = 'https://invoice-server-9zx1.onrender.com';
// export const base_url = 'https://invoice-server-9zx1.onrender.com';
// export const client = 'https://invoicebysanto.netlify.app';

// Get the authToken from localStorage
// const authToken = localStorage.getItem('pos_token');

// // Check if authToken is available and then set it in the Authorization header
// if (authToken) {
//   axios.defaults.headers.common['Authorization'] = authToken;
// }


const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true
});


export default api;