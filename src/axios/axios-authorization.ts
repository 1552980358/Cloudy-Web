import axios from 'axios'
import UserCredential from '@/storage/user-credential'

class AxiosAuthorization {

    private static readonly Authorization = 'Authorization'

    static setCredential(userCredential: UserCredential) {
        this.setJWT(userCredential.jwt)
    }

    static setJWT(jwt: string) {
        axios.defaults.headers.common[this.Authorization] = this.jwtHeader(jwt)
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