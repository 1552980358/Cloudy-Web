import {ownerPost} from '@/axios/request/setup/owner/owner-post'
import {ownerGet} from '@/axios/request/setup/owner/owner-get'

export default class Owner {

    public static get get() {
        return ownerGet
    }

    public static get post() {
        return ownerPost
    }

}