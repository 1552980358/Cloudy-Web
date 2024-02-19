import {inject, InjectionKey, provide, Ref} from 'vue'

interface UiState {
    loading: boolean,
}
type Secret = Ref<string>;

class Key {
    public static UiState: InjectionKey<UiState> = Symbol();
    public static Secret: InjectionKey<Secret> = Symbol();
}

export default class {

    public static set uiState(uiState: UiState) {
        provide(Key.UiState, uiState);
    }
    public static get uiState() {
        return inject(Key.UiState);
    }

    public static set secret(secret: Secret) {
        provide(Key.Secret, secret);
    }
    public static get secret() {
        return inject(Key.Secret);
    }

}