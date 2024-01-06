import {InjectionKey, Ref} from 'vue'

const UiState: InjectionKey<{
    isLoading: boolean,
    panel: number,
}> = Symbol()

const Secret: InjectionKey<Ref<string>> = Symbol()

export default class SetupState {

    public static get uiState() {
        return UiState
    }

    public static get secret() {
        return Secret
    }

}