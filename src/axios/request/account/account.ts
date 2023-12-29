import accountGet from '@/axios/request/account/account-get'

export default class Account {

    static get get() {
        return accountGet
    }

}