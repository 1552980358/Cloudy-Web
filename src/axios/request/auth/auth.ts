import {authPost} from '@/axios/request/auth/auth-post'

export default class Auth {

    static get post() {
        return authPost
    }

}