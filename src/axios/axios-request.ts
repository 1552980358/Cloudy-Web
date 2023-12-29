import Account from './request/account/account'
import Auth from './request/auth/auth'

export default class AxiosRequest {

    static get account() {
        return Account
    }

    static get auth() {
        return Auth
    }

}