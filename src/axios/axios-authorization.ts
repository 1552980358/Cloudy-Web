import axios from 'axios'

const axiosAuthorization = (jwt: string) => {
    axios.defaults.headers.common['Authorization'] = `JWT ${jwt}`
}

export default axiosAuthorization;