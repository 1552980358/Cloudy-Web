export default abstract class LocalStorage<T> {

    /**
     * Get key for [LocalStorage]
     * @protected
     * @return key
     */
    protected abstract get key(): string

    /**
     * Read string from [LocalStorage]
     **/
    protected read(): string | null {
        return localStorage.getItem(this.key)
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
    protected write(value: string) {
        localStorage.setItem(this.key, value)
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
        localStorage.removeItem(this.key)
    }

}