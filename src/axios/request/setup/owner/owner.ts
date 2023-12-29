import {ownerPost} from '@/axios/request/setup/owner/owner-post'

export default class Owner {

    public static get post() {
        return ownerPost
    }

}