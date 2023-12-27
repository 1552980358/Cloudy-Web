import LocalStorage from '@/storage/local-storage'

class AccountCredentialStorage extends LocalStorage<AccountCredential> {

    private static readonly Key = 'AccountCredential'

    protected getKey(): string {
        return AccountCredentialStorage.Key
    }

    protected override readObjectImpl(storageData: string | null): AccountCredential | null {
        if (!!storageData) {
            try {
                const accountCredential = JSON.parse(atob(storageData))
                return Object.assign(new AccountCredential(), accountCredential)
            } catch (e) {
                // Remove wrong data
                super.clear()
            }
        }
        return null
    }

    override writeObject(value: AccountCredential) {
        const base64 = btoa(JSON.stringify(value))
        super.write(base64)
    }

}

const accountCredentialStorage = new AccountCredentialStorage()

export default class AccountCredential {

    public static read(): AccountCredential | null {
        return accountCredentialStorage.readObject()
    }

    public static write(jwt: string, username: string, password: string) {
        const accountCredential = AccountCredential.ofToken(jwt, username, password)
        accountCredentialStorage.writeObject(accountCredential)
    }

    public static ofToken(jwt: string | null = null, username: string, password: string): AccountCredential {
        const accountCredential = new AccountCredential()
        accountCredential.token = jwt
        accountCredential.username = username
        accountCredential.password = password
        return accountCredential
    }

    public token: string | null
    public username: string
    public password: string

    public constructor() {}

    public removeToken() {
        this.token = null
        accountCredentialStorage.writeObject(this)
    }

    public toHeaderOption(): { headers: { Authorization: string } } {
        return { headers: { Authorization: `JWT ${this.token}` } }
    }

}