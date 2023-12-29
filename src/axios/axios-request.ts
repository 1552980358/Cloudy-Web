import Account from './request/account/account'
import Auth from './request/auth/auth'
import Setup from '@/axios/request/setup/setup'

export default class AxiosRequest {

    public static get account() {
        return Account
    }

    public static get auth() {
        return Auth
    }

    public static get setup() {
        return Setup
    }

}