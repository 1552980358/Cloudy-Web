import axios from 'axios'

const base = {
    prod: 'api/',
    dev: 'http://localhost:8000/'
}

const Dev = 'development'
const isDevelopment = () => {
    return process.env.NODE_ENV || Dev == Dev
}

const axiosSetup = () => {
    axios.defaults.baseURL = isDevelopment() ? base.dev : base.prod
}

export default axiosSetup