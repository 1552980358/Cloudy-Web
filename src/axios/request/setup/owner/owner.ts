import {ownerPost} from './owner-post.ts'
import {ownerGet} from './owner-get.ts'

export default class Owner {

    public static get get() {
        return ownerGet
    }

    public static get post() {
        return ownerPost
    }

}