import LocalStorage from './local-storage.ts'

class AccountCredentialStorage extends LocalStorage<AccountCredential> {

    private static readonly Key = 'AccountCredential'

    protected override get key(): string {
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

    public override writeObject(value: AccountCredential) {
        const base64 = btoa(JSON.stringify(value))
        super.write(base64)
    }

}

const accountCredentialStorage = new AccountCredentialStorage()

export default class AccountCredential {

    public static read(): AccountCredential {
        return accountCredentialStorage.readObject() ?? new AccountCredential()
    }

    public static write(jwt: string, username: string, password: string): AccountCredential {
        const accountCredential = new AccountCredential(jwt, username, password)
        accountCredentialStorage.writeObject(accountCredential)
        return accountCredential
    }

    public constructor(
        private _token: string | null = null,
        private _username: string | null = null,
        private _password: string | null = null,
    ) {}

    public set token(token: string | null) {
        if (this._token != token) {
            this._token = token
            accountCredentialStorage.writeObject(this)
        }
    }

    public get token(): string | null {
        return this._token
    }

    public get username(): string | null {
        return this._username
    }

    public get password(): string | null {
        return this._password
    }

    public setCredential(token: string, username: string, password: string) {
        this._username = username
        this._password = password
        this.token = token
    }

}