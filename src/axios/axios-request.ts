import Account from './request/account/account.ts'
import Auth from './request/auth/auth.ts'
import Setup from './request/setup/setup.ts'

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