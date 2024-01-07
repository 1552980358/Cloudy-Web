import {InjectionKey} from 'vue'

const Authorization: InjectionKey<{
    isCompleted: boolean, isAuthorized: boolean
}> = Symbol()

const Account: InjectionKey<{
    id: string | null, username: string | null, nickname: string | null
}> = Symbol()

export default class GlobalState {

    public static get authorization() {
        return Authorization
    }

    public static get account() {
        return Account
    }

}