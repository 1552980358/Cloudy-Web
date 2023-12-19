export default abstract class LocalStorage<T> {

    /**
     * Get key for [LocalStorage]
     * @protected
     * @return key
     */
    protected abstract getKey(): string

    /**
     * Check if item exists in [LocalStorage]
     */
    public exists(): boolean {
        return localStorage.hasOwnProperty(this.getKey())
    }

    /**
     * Read string from [LocalStorage]
     **/
    public read(): string | null {
        return localStorage.getItem(this.getKey())
    }

    /**
     * Read string from [LocalStorage]
     * @return T or null
     **/
    public readObject(): T | null {
        return this.readObjectImpl(this.read())
    }
    /**
     * Implementation of [readObject] that convert string to [T]
     * @param storageData
     * @return T or null
     */
    protected abstract readObjectImpl(storageData: string | null): T | null

    /**
     * Write string to [LocalStorage]
     * @param value
     */
    public write(value: string) {
        localStorage.setItem(this.getKey(), value)
    }

    /**
     * Write [T] to [LocalStorage]
     * @param value
     * @return T or null
     */
    public abstract writeObject(value: T): void

    /**
     * Remove item from [LocalStorage]
     */
    public clear() {
        localStorage.removeItem(this.getKey())
    }

}