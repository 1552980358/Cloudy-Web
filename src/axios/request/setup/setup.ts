import Owner from '@/axios/request/setup/owner/owner'
import {setupGet} from '@/axios/request/setup/setup-get'

export default class Setup {

    public static get owner() {
        return Owner
    }

    public static get get() {
        return setupGet
    }

}