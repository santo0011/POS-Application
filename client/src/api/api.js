import axios from 'axios';

const local = 'http://localhost:8000';

export const base_url = 'http://localhost:8000';

export const client = 'http://localhost:3000';

// const local = 'https://hotel-booking-server-nisr.onrender.com';

const api = axios.create({
    baseURL: `${local}/api`,
    withCredentials: true
});


export default api;