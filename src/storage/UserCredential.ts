import LocalStorage from '@/storage/LocalStorage'

class UserCredentialStorage extends LocalStorage<UserCredential> {

    private static readonly Key = 'UserCredential'
    protected getKey(): string {
        return UserCredentialStorage.Key
    }

    protected override readObjectImpl(storageData: string | null): UserCredential | null {
        if (!!storageData) {
            try {
                return JSON.parse(atob(storageData))
            } catch (e) {
                // Remove wrong data
                super.clear()
            }
        }
        return null
    }

    writeObject(value: UserCredential) {
        const base64 = btoa(JSON.stringify(value))
        super.write(base64)
    }

}

const userCredentialStorage = new UserCredentialStorage()

export default class UserCredential {

    static exists(): boolean {
        return userCredentialStorage.exists()
    }

    static read(): UserCredential {
        return userCredentialStorage.readObject()
    }

    static write(jwt: string, username: string, password: string) {
        const userCredential = new UserCredential(jwt, username, password)
        userCredentialStorage.writeObject(userCredential)
    }

    static clear() {
        userCredentialStorage.clear()
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