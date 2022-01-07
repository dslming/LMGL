import { StringDictionary, Nullable } from "..";

export class SceneExternalData {
    private _externalData: StringDictionary<Object>;


   /**
     * Add an externaly attached data from its key.
     * This method call will fail and return false, if such key already exists.
     * If you don't care and just want to get the data no matter what, use the more convenient getOrAddExternalDataWithFactory() method.
     * @param key the unique key that identifies the data
     * @param data the data object to associate to the key for this Engine instance
     * @return true if no such key were already present and the data was added successfully, false otherwise
     */
    public addExternalData<T>(key: string, data: T): boolean {
        if (!this._externalData) {
            this._externalData = new StringDictionary<Object>();
        }
        return this._externalData.add(key, data);
    }

    /**
     * Get an externaly attached data from its key
     * @param key the unique key that identifies the data
     * @return the associated data, if present (can be null), or undefined if not present
     */
    public getExternalData<T>(key: string): Nullable<T> {
        if (!this._externalData) {
            return null;
        }
        return <T>this._externalData.get(key);
    }

    /**
     * Get an externaly attached data from its key, create it using a factory if it's not already present
     * @param key the unique key that identifies the data
     * @param factory the factory that will be called to create the instance if and only if it doesn't exists
     * @return the associated data, can be null if the factory returned null.
     */
    public getOrAddExternalDataWithFactory<T>(key: string, factory: (k: string) => T): T {
        if (!this._externalData) {
            this._externalData = new StringDictionary<Object>();
        }
        return <T>this._externalData.getOrAddWithFactory(key, factory);
    }

    /**
     * Remove an externaly attached data from the Engine instance
     * @param key the unique key that identifies the data
     * @return true if the data was successfully removed, false if it doesn't exist
     */
    public removeExternalData(key: string): boolean {
        return this._externalData.remove(key);
    }
}
