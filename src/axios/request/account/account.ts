import accountGet from './account-get.ts'
import Find from './find/find.ts'

export default class Account {

    public static get get() {
        return accountGet
    }

    public static get find() {
        return Find
    }

}