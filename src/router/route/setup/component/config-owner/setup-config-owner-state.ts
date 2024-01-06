import {InjectionKey} from 'vue'

const UiState: InjectionKey<{
    panel: number,
}> = Symbol()

const Fields: InjectionKey<{
    nickname: string | null,
    username: string | null,
    email: string | null,
    password: string | null,
    avatar: string | null,
}> = Symbol()

export default class SetupConfigOwnerState {

    public static get uiState() {
        return UiState
    }

    public static get fields() {
        return Fields
    }

}