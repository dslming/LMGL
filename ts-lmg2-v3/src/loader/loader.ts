import { Engine } from "../engines/engine";

export class Loader {
    public rootPath: string;
    public engine: Engine;

    constructor(engine: Engine) {
        this.engine = engine;
        this.rootPath = "";
    }

    setPath(path?: string) {
        this.rootPath = path || "";
        return this;
    }
}
