import accountGet from './account-get'
import Find from './find/find'

export default class Account {

    public static get get() {
        return accountGet
    }

    public static get find() {
        return Find
    }

}