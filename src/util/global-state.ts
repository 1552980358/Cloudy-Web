import {InjectionKey} from 'vue'

export const Authorization: InjectionKey<{
    isCompleted: boolean, isAuthorized: boolean
}> = Symbol()