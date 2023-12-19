export const hasStoredKey = (key: string): boolean => {
    return localStorage.hasOwnProperty(key)
}

export const readStorage = (key: string): string | null => {
    return localStorage.getItem(key)
}

export const writeStorage = (key: string, value: string) => {
    localStorage.setItem(key, value)
}

export const removeStorage = (key: string) => {
    localStorage.removeItem(key)
}