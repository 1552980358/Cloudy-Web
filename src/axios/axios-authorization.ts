import axios from 'axios'

class AxiosAuthorization {

    private static readonly Authorization = 'Authorization'

    static setToken(jwt: string) {
        axios.defaults.headers.common[this.Authorization] = this.headerContent(jwt)
    }

    static headerConfig(userCredential: UserCredential): { headers: { Authorization: string } } {
        return { headers: { Authorization: this.jwtHeader(userCredential.jwt) } }
    }

    private static jwtHeader(jwt: string): string {
        return `JWT ${jwt}`
    }

    static clear() {
        delete axios.defaults.headers.common[this.Authorization]
    }

}

export default AxiosAuthorization