import Owner from './owner/owner.ts'
import {setupGet} from './setup-get.ts'

export default class Setup {

    public static get owner() {
        return Owner
    }

    public static get get() {
        return setupGet
    }

}