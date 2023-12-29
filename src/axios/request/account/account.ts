import accountGet from '@/axios/request/account/account-get'
import Username from '@/axios/request/account/username/username'

export default class Account {

    static get get() {
        return accountGet
    }

    static get username() {
        return Username
    }

}