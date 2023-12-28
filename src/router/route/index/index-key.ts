import {InjectionKey} from 'vue'

export const IndexUiState: InjectionKey<
    { isLoading: boolean, panel: number }
> = Symbol()