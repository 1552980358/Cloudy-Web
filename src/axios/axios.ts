import axios from 'axios';

const Dev = 'development';
const isDev = () => {
    return process.env.NODE_ENV || Dev == Dev;
}

axios.defaults.baseURL = isDev() ? 'http://localhost:8000' : 'api';