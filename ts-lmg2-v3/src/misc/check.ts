function standardTypeEh(value: any, type: any) {
    switch (type) {
        case "number":
            return typeof value === "number";
        case "object":
            return typeof value === "object";
        case "string":
            return typeof value === "string";
        case "boolean":
            return typeof value === "boolean";
        case "function":
            return typeof value === "function";
        case "undefined":
            return typeof value === "undefined";
        case "symbol":
            return typeof value === "symbol";
      default:
        return "error..."
    }
}

function guessCallSite() {
    var error = new Error();
    var stack = (error.stack || error).toString();
    var pat = /at REGLCommand.*\n\s+at.*\((.*)\)/.exec(stack);
    if (pat) {
        return pat[1];
    }
    var pat2 = /at REGLCommand.*\n\s+at\s+(.*)\n/.exec(stack);
    if (pat2) {
        return pat2[1];
    }
    return "unknown";
}

function guessCommand() {
    var error = new Error();
    var stack = (error.stack || error).toString();
    var pat = /compileProcedure.*\n\s*at.*\((.*)\)/.exec(stack);
    if (pat) {
        return pat[1];
    }
    var pat2 = /compileProcedure.*\n\s*at\s+(.*)(\n|$)/.exec(stack);
    if (pat2) {
        return pat2[1];
    }
    return "unknown";
}

// only used for extracting shader names.  if atob not present, then errors
// will be slightly crappier
function decodeB64 (str:any) {
  if (typeof atob !== 'undefined') {
    return atob(str)
  }
  return 'base64:' + str
}

function raise(message:any) {
    var error = new Error("(lmgl) " + message);
    console.error(error);
    throw error;
}

function check(pred: any, message: any) {
    if (!pred) {
        raise(message);
    }
}

function encolon(message:any) {
    if (message) {
        return ": " + message;
    }
    return "";
}

function commandRaise(message: any, command: any) {
    var callSite = guessCallSite();
    raise(message + " in command " + (command || guessCommand()) + (callSite === "unknown" ? "" : " called from " + callSite));
}

function checkCommandType(value: any, type: any, message: any, command: any) {
    if (!standardTypeEh(value, type)) {
        commandRaise("invalid parameter type" + encolon(message) + ". expected " + type + ", got " + typeof value, command || guessCommand());
    }
}

class ShaderFile {
  name: string;
  lines: any[];
  index: {};
  hasErrors: boolean;
  constructor() {
    this.name = "unknown";
    this.lines = [];
    this.index = {};
    this.hasErrors = false;
  }
}

class ShaderLine {
  number: any;
  line: any;
  errors: never[];

  constructor(number:any, line:any) {
    this.number = number;
    this.line = line;
    this.errors = [];
  }
}

class ShaderError{
  file: any;
  line: any;
  message: any;
  constructor(fileNumber:any, lineNumber:any, message:any) {
    this.file = fileNumber;
    this.line = lineNumber;
    this.message = message;
   }
}

function parseSource(source:any, command:any) {
    var lines = source.split("\n");
    var lineNumber = 1;
    var fileNumber = 0;
    var files = {
        unknown: new ShaderFile(),
        0: new ShaderFile()
    };
    files.unknown.name = files[0].name = command || guessCommand();
    files.unknown.lines.push(new ShaderLine(0, ""));
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];
        var parts = /^\s*#\s*(\w+)\s+(.+)\s*$/.exec(line);
        if (parts) {
            switch (parts[1]) {
                case "line":
                    var lineNumberInfo:any = /(\d+)(\s+\d+)?/.exec(parts[2]);
                    if (lineNumberInfo) {
                        lineNumber = lineNumberInfo[1] | 0;
                        if (lineNumberInfo[2]) {
                            fileNumber = lineNumberInfo[2] | 0;
                            if (!(fileNumber in files)) {
                                (files as any)[fileNumber] = new ShaderFile();
                            }
                        }
                    }
                    break;
                case "define":
                    var nameInfo = /SHADER_NAME(_B64)?\s+(.*)$/.exec(parts[2]);
                    if (nameInfo) {
                        (files as any)[fileNumber].name = nameInfo[1] ? decodeB64(nameInfo[2]) : nameInfo[2];
                    }
                    break;
            }
        }
        (files as any)[fileNumber].lines.push(new ShaderLine(lineNumber++, line));
    }
    Object.keys(files).forEach(function (fileNumber) {
        var file = (files as any)[fileNumber];
        file.lines.forEach(function (line:any) {
            file.index[line.number] = line;
        });
    });
    return files;
}

function parseErrorLog(errLog:any) {
    var result:any = [];
    errLog.split("\n").forEach(function (errMsg:any) {
        if (errMsg.length < 5) {
            return;
        }
        var parts:any = /^ERROR:\s+(\d+):(\d+):\s*(.*)$/.exec(errMsg);
        if (parts) {
            result.push(new ShaderError(parts[1] | 0, parts[2] | 0, parts[3].trim()));
        } else if (errMsg.length > 0) {
            result.push(new ShaderError("unknown", 0, errMsg));
        }
    });
    return result;
}

function annotateFiles(files:any, errors:any) {
    errors.forEach(function (error:any) {
        var file = files[error.file];
        if (file) {
            var line = file.index[error.line];
            if (line) {
                line.errors.push(error);
                file.hasErrors = true;
                return;
            }
        }
        files.unknown.hasErrors = true;
        files.unknown.lines[0].errors.push(error);
    });
}
function leftPad(str:any, n:any) {
    str = str + "";
    while (str.length < n) {
        str = " " + str;
    }
    return str;
}

var endl = "\n";

export function checkShaderError(gl: any, shader: any, source: any, type: any, command: any) {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var errLog = gl.getShaderInfoLog(shader);
        var typeName = type === gl.FRAGMENT_SHADER ? "fragment" : "vertex";
        checkCommandType(source, "string", typeName + " shader source must be a string", command);
        var files = parseSource(source, command);
        var errors = parseErrorLog(errLog);
        annotateFiles(files, errors);

        Object.keys(files).forEach(function (fileNumber) {
            var file = (files as any)[fileNumber];
            if (!file.hasErrors) {
                return;
            }

            var strings = [""];
            var styles = [""];

            function push(str:any, style?:any) {
                strings.push(str);
                styles.push(style || "");
            }

            push("file number " + fileNumber + ": " + file.name + "\n", "color:red;text-decoration:underline;font-weight:bold");

            file.lines.forEach(function (line:any) {
                if (line.errors.length > 0) {
                    push(leftPad(line.number, 4) + "|  ", "background-color:yellow; font-weight:bold");
                    push(line.line + endl, "color:red; background-color:yellow; font-weight:bold");

                    // try to guess token
                    var offset = 0;
                    line.errors.forEach(function (error:any) {
                        var message = error.message;
                        var token = /^\s*'(.*)'\s*:\s*(.*)$/.exec(message);
                        if (token) {
                            var tokenPat = token[1];
                            message = token[2];
                            switch (tokenPat) {
                                case "assign":
                                    tokenPat = "=";
                                    break;
                            }
                            offset = Math.max(line.line.indexOf(tokenPat, offset), 0);
                        } else {
                            offset = 0;
                        }

                        push(leftPad("| ", 6));
                        push(leftPad("^^^", offset + 3) + endl, "font-weight:bold");
                        push(leftPad("| ", 6));
                        push(message + endl, "font-weight:bold");
                    });
                    push(leftPad("| ", 6) + endl);
                } else {
                    push(leftPad(line.number, 4) + "|  ");
                    push(line.line + endl, "color:red");
                }
            });
            styles[0] = strings.join("%c");
            console.log.apply(console, styles);
        });

        raise("Error compiling " + typeName + " shader, " + files[0].name);
    }
}
