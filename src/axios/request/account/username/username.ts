import {usernameGet} from '@/axios/request/account/username/username-get'

export default class Username {

    static get get() {
        return usernameGet
    }

}