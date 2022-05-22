export class ShaderProcess {
    static generateDefines(defines: any) {
        if (defines == undefined) return "";

        const chunks = [];

        for (const name in defines) {
            const value = defines[name];

            if (value === false) continue;

            chunks.push("#define " + name + " " + value);
        }

        chunks.push("\r\n");
        return chunks.join("\n");
    }

    static getHead() {
        const header = `#version 300 es
    `;
        return header;
    }
}
