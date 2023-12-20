import LocalStorage from '@/storage/local-storage'

class UserCredentialStorage extends LocalStorage<UserCredential> {

    private static readonly Key = 'UserCredential'

    protected getKey(): string {
        return UserCredentialStorage.Key
    }

    protected override readObjectImpl(storageData: string | null): UserCredential | null {
        if (!!storageData) {
            try {
                const userCredential = JSON.parse(atob(storageData))
                return Object.assign(new UserCredential(), userCredential)
            } catch (e) {
                // Remove wrong data
                super.clear()
            }
        }
        return null
    }

    override writeObject(value: UserCredential) {
        const base64 = btoa(JSON.stringify(value))
        super.write(base64)
    }

}

const userCredentialStorage = new UserCredentialStorage()

export default class UserCredential {

    public static read(): UserCredential | null {
        return userCredentialStorage.readObject()
    }

    public static write(jwt: string, username: string, password: string) {
        const userCredential = UserCredential.ofToken(jwt, username, password)
        userCredentialStorage.writeObject(userCredential)
    }

    public static ofToken(jwt: string | null = null, username: string, password: string): UserCredential {
        const userCredential = new UserCredential()
        userCredential.token = jwt
        userCredential.username = username
        userCredential.password = password
        return userCredential
    }

    public token: string | null
    public username: string
    public password: string

    public constructor() {}

    public removeToken() {
        this.token = null
        userCredentialStorage.writeObject(this)
    }

    public toHeaderOption(): { headers: { Authorization: string } } {
        return { headers: { Authorization: `JWT ${this.token}` } }
    }

}