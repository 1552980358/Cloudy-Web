import accountGet from './account-get'
import Username from '@/axios/request/account/username/username'
import Find from './find/find'

export default class Account {

    public static get get() {
        return accountGet
    }

    static get username() {
        return Username
    }

    public static get find() {
        return Find
    }

}