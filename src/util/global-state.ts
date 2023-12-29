import {InjectionKey} from 'vue'

export const Authorization: InjectionKey<{
    isCompleted: boolean, isAuthorized: boolean
}> = Symbol()

export const Account: InjectionKey<{
    id: string | null, username: string | null, nickname: string | null
}> = Symbol()