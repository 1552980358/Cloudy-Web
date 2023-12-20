import axios from 'axios'

class AxiosAuthorization {

    private static readonly Authorization = 'Authorization'

    static setToken(jwt: string) {
        axios.defaults.headers.common[this.Authorization] = this.authorization(jwt)
    }

    private static authorization(jwt: string): string {
        return `JWT ${jwt}`
    }

    static clear() {
        delete axios.defaults.headers.common[this.Authorization]
    }

}

export default AxiosAuthorization