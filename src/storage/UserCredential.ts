import {readStorage, removeStorage, writeStorage} from '@/storage/LocalStorage'

export default class UserCredential {

    private static readonly KEY = 'UserCredential'

    static read(): UserCredential {
        const rawData = readStorage(this.KEY)
        if (!!rawData) {
            try {
                return JSON.parse(atob(rawData))
            } catch (e) {
                // Remove wrong data
                this.clear()
            }
        }
        return null
    }

    static write(jwt: string, username: string, password: string) {
        const userCredential = new UserCredential(jwt, username, password)
        const base64 = btoa(JSON.stringify(userCredential))
        writeStorage(this.KEY, base64)
    }

    static clear() {
        removeStorage(this.KEY)
    }

    jwt: string
    username: string
    password: string

    constructor(jwt: string, username: string, password: string) {
        this.jwt = jwt
        this.username = username
        this.password = password
    }

}