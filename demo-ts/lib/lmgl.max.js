/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/lmgl.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/_tslib@2.3.1@tslib/tslib.es6.js":
/*!******************************************************!*\
  !*** ./node_modules/_tslib@2.3.1@tslib/tslib.es6.js ***!
  \******************************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __createBinding, __exportStar, __values, __read, __spread, __spreadArrays, __spreadArray, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__createBinding", function() { return __createBinding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArray", function() { return __spreadArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldGet", function() { return __classPrivateFieldGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldSet", function() { return __classPrivateFieldSet; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}


/***/ }),

/***/ "./src/application.ts":
/*!****************************!*\
  !*** ./src/application.ts ***!
  \****************************/
/*! exports provided: Application */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Application", function() { return Application; });
/* harmony import */ var _cameras_PerspectiveCamera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cameras/PerspectiveCamera */ "./src/cameras/PerspectiveCamera.ts");
/* harmony import */ var _renderer_renderer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderer/renderer */ "./src/renderer/renderer.ts");


class Application {
    constructor(engine, scene) {
        this.engine = engine;
        this.scene = scene;
        this.camera = new _cameras_PerspectiveCamera__WEBPACK_IMPORTED_MODULE_0__["PerspectiveCamera"](45, 1, 0.01, 5000);
        this.renderer = new _renderer_renderer__WEBPACK_IMPORTED_MODULE_1__["default"](engine);
        this.loop = this.loop.bind(this);
        this.handleResize(this.engine.renderingCanvas.clientWidth, this.engine.renderingCanvas.clientHeight);
        this.camera.position.set(0, 0, 10);
        window.onresize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            this.handleResize(width, height);
        };
    }
    handleResize(width, height) {
        const canvas = this.engine.renderingCanvas;
        const ratio = window.devicePixelRatio;
        canvas.width = width;
        canvas.height = height;
        this.camera.aspect = width / height;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
    }
    loop() {
        this.renderer.renderScene(this.scene, this.camera);
        window.requestAnimationFrame(this.loop);
    }
}


/***/ }),

/***/ "./src/cameras/PerspectiveCamera.ts":
/*!******************************************!*\
  !*** ./src/cameras/PerspectiveCamera.ts ***!
  \******************************************/
/*! exports provided: PerspectiveCamera */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PerspectiveCamera", function() { return PerspectiveCamera; });
/* harmony import */ var _maths_math_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../maths/math.constants */ "./src/maths/math.constants.ts");
/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./camera */ "./src/cameras/camera.ts");


class PerspectiveCamera extends _camera__WEBPACK_IMPORTED_MODULE_1__["Camera"] {
    constructor(fov = 50, aspect = 1, near = 0.1, far = 2000) {
        super();
        this.useRightHandedSystem = true;
        this.type = "PerspectiveCamera";
        this.fov = fov;
        this.zoom = 1;
        this.near = near;
        this.far = far;
        this.focus = 10;
        this.aspect = aspect;
        this.view = null;
        this.filmGauge = 35; // width of the film (default in millimeters)
        this.filmOffset = 0; // horizontal film offset (same unit as gauge)
        this.updateProjectionMatrix();
    }
    // copy(source, recursive) {
    //   super.copy(source, recursive);
    //   this.fov = source.fov;
    //   this.zoom = source.zoom;
    //   this.near = source.near;
    //   this.far = source.far;
    //   this.focus = source.focus;
    //   this.aspect = source.aspect;
    //   this.view = source.view === null ? null : Object.assign({}, source.view);
    //   this.filmGauge = source.filmGauge;
    //   this.filmOffset = source.filmOffset;
    //   return this;
    // }
    /**
     * Sets the FOV by focal length in respect to the current .filmGauge.
     *
     * The default film gauge is 35, so that the focal length can be specified for
     * a 35mm (full frame) camera.
     *
     * Values for focal length and film gauge must have the same unit.
     */
    setFocalLength(focalLength) {
        /** see {@link http://www.bobatkins.com/photography/technical/field_of_view.html} */
        const vExtentSlope = (0.5 * this.getFilmHeight()) / focalLength;
        this.fov = _maths_math_constants__WEBPACK_IMPORTED_MODULE_0__["RAD2DEG"] * 2 * Math.atan(vExtentSlope);
        this.updateProjectionMatrix();
    }
    /**
     * Calculates the focal length from the current .fov and .filmGauge.
     */
    getFocalLength() {
        const vExtentSlope = Math.tan(_maths_math_constants__WEBPACK_IMPORTED_MODULE_0__["DEG2RAD"] * 0.5 * this.fov);
        return (0.5 * this.getFilmHeight()) / vExtentSlope;
    }
    getEffectiveFOV() {
        return _maths_math_constants__WEBPACK_IMPORTED_MODULE_0__["RAD2DEG"] * 2 * Math.atan(Math.tan(_maths_math_constants__WEBPACK_IMPORTED_MODULE_0__["DEG2RAD"] * 0.5 * this.fov) / this.zoom);
    }
    getFilmWidth() {
        // film not completely covered in portrait format (aspect < 1)
        return this.filmGauge * Math.min(this.aspect, 1);
    }
    getFilmHeight() {
        // film not completely covered in landscape format (aspect > 1)
        return this.filmGauge / Math.max(this.aspect, 1);
    }
    /**
     * Sets an offset in a larger frustum. This is useful for multi-window or
     * multi-monitor/multi-machine setups.
     *
     * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
     * the monitors are in grid like this
     *
     *   +---+---+---+
     *   | A | B | C |
     *   +---+---+---+
     *   | D | E | F |
     *   +---+---+---+
     *
     * then for each monitor you would call it like this
     *
     *   const w = 1920;
     *   const h = 1080;
     *   const fullWidth = w * 3;
     *   const fullHeight = h * 2;
     *
     *   --A--
     *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
     *   --B--
     *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
     *   --C--
     *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
     *   --D--
     *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
     *   --E--
     *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
     *   --F--
     *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
     *
     *   Note there is no reason monitors have to be the same size or in a grid.
     */
    setViewOffset(fullWidth, fullHeight, x, y, width, height) {
        this.aspect = fullWidth / fullHeight;
        if (this.view === null) {
            this.view = {
                enabled: true,
                fullWidth: 1,
                fullHeight: 1,
                offsetX: 0,
                offsetY: 0,
                width: 1,
                height: 1,
            };
        }
        this.view.enabled = true;
        this.view.fullWidth = fullWidth;
        this.view.fullHeight = fullHeight;
        this.view.offsetX = x;
        this.view.offsetY = y;
        this.view.width = width;
        this.view.height = height;
        this.updateProjectionMatrix();
    }
    clearViewOffset() {
        if (this.view !== null) {
            this.view.enabled = false;
        }
        this.updateProjectionMatrix();
    }
    updateProjectionMatrix() {
        const near = this.near;
        let top = (near * Math.tan(_maths_math_constants__WEBPACK_IMPORTED_MODULE_0__["DEG2RAD"] * 0.5 * this.fov)) / this.zoom;
        let height = 2 * top;
        let width = this.aspect * height;
        let left = -0.5 * width;
        const view = this.view;
        if (this.view !== null && this.view.enabled) {
            const fullWidth = view.fullWidth, fullHeight = view.fullHeight;
            left += (view.offsetX * width) / fullWidth;
            top -= (view.offsetY * height) / fullHeight;
            width *= view.width / fullWidth;
            height *= view.height / fullHeight;
        }
        const skew = this.filmOffset;
        if (skew !== 0)
            left += (near * skew) / this.getFilmWidth();
        if (this.useRightHandedSystem === true) {
            this.projectionMatrix.makePerspectiveRH(left, left + width, top, top - height, near, this.far);
        }
        else {
            this.projectionMatrix.makePerspectiveLH(left, left + width, top, top - height, near, this.far);
        }
        this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
    }
    getViewMatrix() {
        return this.matrixWorldInverse;
    }
    getProjectionMatrix() {
        this.updateProjectionMatrix();
        return this.projectionMatrix;
    }
}
PerspectiveCamera.prototype.isPerspectiveCamera = true;



/***/ }),

/***/ "./src/cameras/camera.ts":
/*!*******************************!*\
  !*** ./src/cameras/camera.ts ***!
  \*******************************/
/*! exports provided: Camera */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Camera", function() { return Camera; });
/* harmony import */ var _maths_math_mat4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../maths/math.mat4 */ "./src/maths/math.mat4.ts");
/* harmony import */ var _object3D__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../object3D */ "./src/object3D.ts");


class Camera extends _object3D__WEBPACK_IMPORTED_MODULE_1__["Object3D"] {
    constructor() {
        super();
        this.type = "Camera";
        this.matrixWorldInverse = new _maths_math_mat4__WEBPACK_IMPORTED_MODULE_0__["Mat4"]();
        this.projectionMatrix = new _maths_math_mat4__WEBPACK_IMPORTED_MODULE_0__["Mat4"]();
        this.projectionMatrixInverse = new _maths_math_mat4__WEBPACK_IMPORTED_MODULE_0__["Mat4"]();
    }
    toJSON(meta) {
        throw new Error("Method not implemented.");
    }
    copy(source, recursive) {
        super.copy(source, recursive);
        this.matrixWorldInverse.copy(source.matrixWorldInverse);
        this.projectionMatrix.copy(source.projectionMatrix);
        this.projectionMatrixInverse.copy(source.projectionMatrixInverse);
        return this;
    }
    getWorldDirection(target) {
        this.updateWorldMatrix(true, false);
        const e = this.matrixWorld.data;
        return target.set(-e[8], -e[9], -e[10]).normalize();
    }
    updateMatrixWorld() {
        // super.updateMatrixWorld(force);
        this.matrixWorld.copy(this.matrix);
        this.matrixWorldInverse.copy(this.matrixWorld).invert();
    }
    updateWorldMatrix(updateParents, updateChildren) {
        super.updateWorldMatrix(updateParents, updateChildren);
        this.matrixWorldInverse.copy(this.matrixWorld).invert();
    }
    updateProjectionMatrix() { }
    clone() {
        // return new Camera().copy(this);
    }
}
Camera.prototype.isCamera = true;



/***/ }),

/***/ "./src/cameras/index.ts":
/*!******************************!*\
  !*** ./src/cameras/index.ts ***!
  \******************************/
/*! exports provided: PerspectiveCamera */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PerspectiveCamera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PerspectiveCamera */ "./src/cameras/PerspectiveCamera.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PerspectiveCamera", function() { return _PerspectiveCamera__WEBPACK_IMPORTED_MODULE_0__["PerspectiveCamera"]; });




/***/ }),

/***/ "./src/engines/engine.draw.ts":
/*!************************************!*\
  !*** ./src/engines/engine.draw.ts ***!
  \************************************/
/*! exports provided: PrimitiveType, EngineDraw */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PrimitiveType", function() { return PrimitiveType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EngineDraw", function() { return EngineDraw; });
var PrimitiveType;
(function (PrimitiveType) {
    PrimitiveType[PrimitiveType["PRIMITIVE_POINTS"] = 0] = "PRIMITIVE_POINTS";
    PrimitiveType[PrimitiveType["PRIMITIVE_LINES"] = 1] = "PRIMITIVE_LINES";
    PrimitiveType[PrimitiveType["PRIMITIVE_LINELOOP"] = 2] = "PRIMITIVE_LINELOOP";
    PrimitiveType[PrimitiveType["PRIMITIVE_LINESTRIP"] = 3] = "PRIMITIVE_LINESTRIP";
    PrimitiveType[PrimitiveType["PRIMITIVE_TRIANGLES"] = 4] = "PRIMITIVE_TRIANGLES";
    PrimitiveType[PrimitiveType["PRIMITIVE_TRISTRIP"] = 5] = "PRIMITIVE_TRISTRIP";
    PrimitiveType[PrimitiveType["PRIMITIVE_TRIFAN"] = 6] = "PRIMITIVE_TRIFAN";
})(PrimitiveType || (PrimitiveType = {}));
class EngineDraw {
    constructor(engine) {
        this._engine = engine;
        const { gl } = this._engine;
        this._glPrimitive = [gl.POINTS, gl.LINES, gl.LINE_LOOP, gl.LINE_STRIP, gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN];
    }
    /**
     * Gets the current render width
     * @returns a number defining the current render width
     */
    getRenderWidth() {
        return this._engine.gl.drawingBufferWidth;
    }
    /**
     * Gets the current render height
     * @returns a number defining the current render height
     */
    getRenderHeight() {
        return this._engine.gl.drawingBufferHeight;
    }
    draw(primitive) {
        if (!primitive.type) {
            throw new Error("error primitive type");
        }
        if (primitive.count === undefined) {
            throw new Error("error primitive count");
        }
        const mode = this._glPrimitive[primitive.type];
        const count = primitive.count;
        const { gl } = this._engine;
        //  gl.cullFace(gl.FRONT_AND_BACK);
        //  gl.disable(gl.CULL_FACE);
        if (primitive.indexed) {
            gl.drawElements(mode, count, gl.UNSIGNED_SHORT, 0);
        }
    }
    /**
     * Clear the current render buffer or the current render target (if any is set up)
     * @param color defines the color to use
     * @param backBuffer defines if the back buffer must be cleared
     * @param depth defines if the depth buffer must be cleared
     * @param stencil defines if the stencil buffer must be cleared
     */
    // public clear(color: Nullable<IColor4Like>, backBuffer: boolean, depth: boolean, stencil: boolean = false): void {
    //     const { gl } = this._engine;
    //     var mode = 0;
    //     if (backBuffer && color) {
    //         gl.clearColor(color.r, color.g, color.b, color.a !== undefined ? color.a : 1.0);
    //         mode |= gl.COLOR_BUFFER_BIT;
    //     }
    //     if (depth) {
    //         mode |= gl.DEPTH_BUFFER_BIT;
    //     }
    //     if (stencil) {
    //         gl.clearStencil(0);
    //         mode |= gl.STENCIL_BUFFER_BIT;
    //     }
    //     gl.clear(mode);
    // }
    clear(color) {
        const { gl } = this._engine;
        var mode = 0;
        gl.clearColor(color.r, color.g, color.b, color.a !== undefined ? color.a : 1.0);
        mode |= gl.COLOR_BUFFER_BIT;
        gl.clear(mode);
    }
}


/***/ }),

/***/ "./src/engines/engine.enum.ts":
/*!************************************!*\
  !*** ./src/engines/engine.enum.ts ***!
  \************************************/
/*! exports provided: UniformsType, TextureFormat, TextureFilter, TextureAddress, CompareFunc */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UniformsType", function() { return UniformsType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextureFormat", function() { return TextureFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextureFilter", function() { return TextureFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextureAddress", function() { return TextureAddress; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CompareFunc", function() { return CompareFunc; });
var UniformsType;
(function (UniformsType) {
    UniformsType[UniformsType["Texture"] = 0] = "Texture";
    UniformsType[UniformsType["Float"] = 1] = "Float";
    UniformsType[UniformsType["Vector2"] = 2] = "Vector2";
    UniformsType[UniformsType["Vector3"] = 3] = "Vector3";
    UniformsType[UniformsType["Vector4"] = 4] = "Vector4";
    UniformsType[UniformsType["Matrix3"] = 5] = "Matrix3";
    UniformsType[UniformsType["Matrix4"] = 6] = "Matrix4";
    UniformsType[UniformsType["Struct"] = 7] = "Struct";
    UniformsType[UniformsType["Array"] = 8] = "Array";
})(UniformsType || (UniformsType = {}));
var TextureFormat;
(function (TextureFormat) {
    /**
     * 8-bit alpha.
     */
    TextureFormat[TextureFormat["PIXELFORMAT_A8"] = 0] = "PIXELFORMAT_A8";
    /**
     * 8-bit luminance.
     */
    TextureFormat[TextureFormat["PIXELFORMAT_L8"] = 1] = "PIXELFORMAT_L8";
    /**
     * 8-bit luminance with 8-bit alpha.
     */
    TextureFormat[TextureFormat["PIXELFORMAT_L8_A8"] = 2] = "PIXELFORMAT_L8_A8";
    /**
     * 16-bit RGB (5-bits for red channel, 6 for green and 5 for blue).
     */
    TextureFormat[TextureFormat["PIXELFORMAT_R5_G6_B5"] = 3] = "PIXELFORMAT_R5_G6_B5";
    /**
     * 16-bit RGBA (5-bits for red channel, 5 for green, 5 for blue with 1-bit alpha).
     */
    TextureFormat[TextureFormat["PIXELFORMAT_R5_G5_B5_A1"] = 4] = "PIXELFORMAT_R5_G5_B5_A1";
    /**
     * 16-bit RGBA (4-bits for red channel, 4 for green, 4 for blue with 4-bit alpha).
     */
    TextureFormat[TextureFormat["PIXELFORMAT_R4_G4_B4_A4"] = 5] = "PIXELFORMAT_R4_G4_B4_A4";
    /**
     * 24-bit RGB (8-bits for red channel, 8 for green and 8 for blue).
     */
    TextureFormat[TextureFormat["PIXELFORMAT_R8_G8_B8"] = 6] = "PIXELFORMAT_R8_G8_B8";
    /**
     * 32-bit RGBA (8-bits for red channel, 8 for green, 8 for blue with 8-bit alpha).
     */
    TextureFormat[TextureFormat["PIXELFORMAT_R8_G8_B8_A8"] = 7] = "PIXELFORMAT_R8_G8_B8_A8";
    /**
     * Block compressed format storing 16 input pixels in 64 bits of output, consisting of two 16-bit
     * RGB 5:6:5 color values and a 4x4 two bit lookup table.
     */
    TextureFormat[TextureFormat["PIXELFORMAT_DXT1"] = 8] = "PIXELFORMAT_DXT1";
    /**
     * Block compressed format storing 16 input pixels (corresponding to a 4x4 pixel block) into 128
     * bits of output, consisting of 64 bits of alpha channel data (4 bits for each pixel) followed by
     * 64 bits of color data, encoded the same way as DXT1.
     */
    TextureFormat[TextureFormat["PIXELFORMAT_DXT3"] = 9] = "PIXELFORMAT_DXT3";
    /**
     * Block compressed format storing 16 input pixels into 128 bits of output, consisting of 64 bits
     * of alpha channel data (two 8 bit alpha values and a 4x4 3 bit lookup table) followed by 64 bits
     * of color data (encoded the same way as DXT1).
     */
    TextureFormat[TextureFormat["PIXELFORMAT_DXT5"] = 10] = "PIXELFORMAT_DXT5";
    /**
     * 16-bit floating point RGB (16-bit float for each red, green and blue channels).
     */
    TextureFormat[TextureFormat["PIXELFORMAT_RGB16F"] = 11] = "PIXELFORMAT_RGB16F";
    /**
     * 16-bit floating point RGBA (16-bit float for each red, green, blue and alpha channels).
     */
    TextureFormat[TextureFormat["PIXELFORMAT_RGBA16F"] = 12] = "PIXELFORMAT_RGBA16F";
    /**
     * 32-bit floating point RGB (32-bit float for each red, green and blue channels).
     */
    TextureFormat[TextureFormat["PIXELFORMAT_RGB32F"] = 13] = "PIXELFORMAT_RGB32F";
    /**
     * 32-bit floating point RGBA (32-bit float for each red, green, blue and alpha channels).
     */
    TextureFormat[TextureFormat["PIXELFORMAT_RGBA32F"] = 14] = "PIXELFORMAT_RGBA32F";
    /**
     * 32-bit floating point single channel format (WebGL2 only).
     */
    TextureFormat[TextureFormat["PIXELFORMAT_R32F"] = 15] = "PIXELFORMAT_R32F";
    /**
     * A readable depth buffer format.
     */
    TextureFormat[TextureFormat["PIXELFORMAT_DEPTH"] = 16] = "PIXELFORMAT_DEPTH";
    /**
     * A readable depth/stencil buffer format (WebGL2 only).
     */
    TextureFormat[TextureFormat["PIXELFORMAT_DEPTHSTENCIL"] = 17] = "PIXELFORMAT_DEPTHSTENCIL";
    /**
     * A floating-point color-only format with 11 bits for red and green channels and 10 bits for the
     * blue channel (WebGL2 only).
     */
    TextureFormat[TextureFormat["PIXELFORMAT_111110F"] = 18] = "PIXELFORMAT_111110F";
    /**
     * Color-only sRGB format (WebGL2 only).
     */
    TextureFormat[TextureFormat["PIXELFORMAT_SRGB"] = 19] = "PIXELFORMAT_SRGB";
    /**
     * Color sRGB format with additional alpha channel (WebGL2 only).
     */
    TextureFormat[TextureFormat["PIXELFORMAT_SRGBA"] = 20] = "PIXELFORMAT_SRGBA";
    /**
     * ETC1 compressed format.
     */
    TextureFormat[TextureFormat["PIXELFORMAT_ETC1"] = 21] = "PIXELFORMAT_ETC1";
    /**
     * ETC2 (RGB) compressed format.
     */
    TextureFormat[TextureFormat["PIXELFORMAT_ETC2_RGB"] = 22] = "PIXELFORMAT_ETC2_RGB";
    /**
     * ETC2 (RGBA) compressed format.
     */
    TextureFormat[TextureFormat["PIXELFORMAT_ETC2_RGBA"] = 23] = "PIXELFORMAT_ETC2_RGBA";
    /**
     * PVRTC (2BPP RGB) compressed format.
     */
    TextureFormat[TextureFormat["PIXELFORMAT_PVRTC_2BPP_RGB_1"] = 24] = "PIXELFORMAT_PVRTC_2BPP_RGB_1";
    /**
     * PVRTC (2BPP RGBA) compressed format.
     */
    TextureFormat[TextureFormat["PIXELFORMAT_PVRTC_2BPP_RGBA_1"] = 25] = "PIXELFORMAT_PVRTC_2BPP_RGBA_1";
    /**
     * PVRTC (4BPP RGB) compressed format.
     */
    TextureFormat[TextureFormat["PIXELFORMAT_PVRTC_4BPP_RGB_1"] = 26] = "PIXELFORMAT_PVRTC_4BPP_RGB_1";
    /**
     * PVRTC (4BPP RGBA) compressed format.
     */
    TextureFormat[TextureFormat["PIXELFORMAT_PVRTC_4BPP_RGBA_1"] = 27] = "PIXELFORMAT_PVRTC_4BPP_RGBA_1";
    /**
     * ATC compressed format with alpha channel in blocks of 4x4.
     */
    TextureFormat[TextureFormat["PIXELFORMAT_ASTC_4x4"] = 28] = "PIXELFORMAT_ASTC_4x4";
    /**
     * ATC compressed format with no alpha channel.
     */
    TextureFormat[TextureFormat["PIXELFORMAT_ATC_RGB"] = 29] = "PIXELFORMAT_ATC_RGB";
    /**
     * ATC compressed format with alpha channel.
     */
    TextureFormat[TextureFormat["PIXELFORMAT_ATC_RGBA"] = 30] = "PIXELFORMAT_ATC_RGBA";
})(TextureFormat || (TextureFormat = {}));
var TextureFilter;
(function (TextureFilter) {
    /**
     * Point sample filtering.
     */
    TextureFilter[TextureFilter["FILTER_NEAREST"] = 0] = "FILTER_NEAREST";
    /**
     * Bilinear filtering.
     */
    TextureFilter[TextureFilter["FILTER_LINEAR"] = 1] = "FILTER_LINEAR";
    /**
     * Use the nearest neighbor in the nearest mipmap level.
     */
    TextureFilter[TextureFilter["FILTER_NEAREST_MIPMAP_NEAREST"] = 2] = "FILTER_NEAREST_MIPMAP_NEAREST";
    /**
     * Linearly interpolate in the nearest mipmap level.
     */
    TextureFilter[TextureFilter["FILTER_NEAREST_MIPMAP_LINEAR"] = 3] = "FILTER_NEAREST_MIPMAP_LINEAR";
    /**
     * Use the nearest neighbor after linearly interpolating between mipmap levels.
     */
    TextureFilter[TextureFilter["FILTER_LINEAR_MIPMAP_NEAREST"] = 4] = "FILTER_LINEAR_MIPMAP_NEAREST";
    /**
     * Linearly interpolate both the mipmap levels and between texels.
     */
    TextureFilter[TextureFilter["FILTER_LINEAR_MIPMAP_LINEAR"] = 5] = "FILTER_LINEAR_MIPMAP_LINEAR";
})(TextureFilter || (TextureFilter = {}));
var TextureAddress;
(function (TextureAddress) {
    /**
     * Ignores the integer part of texture coordinates, using only the fractional part.
     */
    TextureAddress[TextureAddress["ADDRESS_REPEAT"] = 0] = "ADDRESS_REPEAT";
    /**
     * Clamps texture coordinate to the range 0 to 1.
     */
    TextureAddress[TextureAddress["ADDRESS_CLAMP_TO_EDGE"] = 1] = "ADDRESS_CLAMP_TO_EDGE";
    /**
     * Texture coordinate to be set to the fractional part if the integer part is even. If the integer
     * part is odd, then the texture coordinate is set to 1 minus the fractional part.
     */
    TextureAddress[TextureAddress["ADDRESS_MIRRORED_REPEAT"] = 2] = "ADDRESS_MIRRORED_REPEAT";
})(TextureAddress || (TextureAddress = {}));
var CompareFunc;
(function (CompareFunc) {
    /**
     * Never pass.
     */
    CompareFunc[CompareFunc["FUNC_NEVER"] = 0] = "FUNC_NEVER";
    /**
     * Pass if (ref & mask) < (stencil & mask).
     */
    CompareFunc[CompareFunc["FUNC_LESS"] = 1] = "FUNC_LESS";
    /**
     * Pass if (ref & mask) == (stencil & mask).
     */
    CompareFunc[CompareFunc["FUNC_EQUAL"] = 2] = "FUNC_EQUAL";
    /**
     * Pass if (ref & mask) <= (stencil & mask).
     */
    CompareFunc[CompareFunc["FUNC_LESSEQUAL"] = 3] = "FUNC_LESSEQUAL";
    /**
     * Pass if (ref & mask) > (stencil & mask).
     */
    CompareFunc[CompareFunc["FUNC_GREATER"] = 4] = "FUNC_GREATER";
    /**
     * Pass if (ref & mask) != (stencil & mask).
     */
    CompareFunc[CompareFunc["FUNC_NOTEQUAL"] = 5] = "FUNC_NOTEQUAL";
    /**
     * Pass if (ref & mask) >= (stencil & mask).
     */
    CompareFunc[CompareFunc["FUNC_GREATEREQUAL"] = 6] = "FUNC_GREATEREQUAL";
    /**
     * Always pass.
     */
    CompareFunc[CompareFunc["FUNC_ALWAYS"] = 7] = "FUNC_ALWAYS";
})(CompareFunc || (CompareFunc = {}));


/***/ }),

/***/ "./src/engines/engine.programs.ts":
/*!****************************************!*\
  !*** ./src/engines/engine.programs.ts ***!
  \****************************************/
/*! exports provided: EngineProgram */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EngineProgram", function() { return EngineProgram; });
// 查询信息类型
var SHADER_INFO_TYPE;
(function (SHADER_INFO_TYPE) {
    SHADER_INFO_TYPE["DELETE_STATUS"] = "DELETE_STATUS";
    SHADER_INFO_TYPE["COMPILE_STATUS"] = "COMPILE_STATUS";
    SHADER_INFO_TYPE["SHADER_TYPE"] = "SHADER_TYPE";
})(SHADER_INFO_TYPE || (SHADER_INFO_TYPE = {}));
// shader 类型
var SHADER_TYPE;
(function (SHADER_TYPE) {
    SHADER_TYPE["VERTEX_SHADER"] = "VERTEX_SHADER";
    SHADER_TYPE["FRAGMENT_SHADER"] = "FRAGMENT_SHADER";
})(SHADER_TYPE || (SHADER_TYPE = {}));
class EngineProgram {
    constructor(engine) {
        this._engine = engine;
    }
    _getShader(type, source) {
        const { gl } = this._engine;
        // 创建
        const shader = gl.createShader(gl[type]);
        if (!shader) {
            throw new Error("Something went wrong while compile the shader.");
        }
        // 指定源码
        gl.shaderSource(shader, source);
        // 编译
        gl.compileShader(shader);
        //检测是否编译正常。
        let success = this._getShaderInfo(shader, SHADER_INFO_TYPE.COMPILE_STATUS);
        if (success) {
            return shader;
        }
        console.error(gl.getShaderInfoLog(shader), source);
        this._deleteShader(shader);
        return true;
    }
    _getShaderInfo(shader, type) {
        const { gl } = this._engine;
        return gl.getShaderParameter(shader, gl[type]);
    }
    _deleteShader(shader) {
        const { gl } = this._engine;
        gl.deleteShader(shader);
    }
    _createProgram(vertexShader, fragmentShader) {
        const { gl } = this._engine;
        const program = gl.createProgram();
        if (!program) {
            throw new Error("Unable to create program");
        }
        // 连接shader, shader对是否编译没有要求
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        // 链接
        gl.linkProgram(program);
        let result = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (result) {
            // console.log('着色器程序创建成功');
            this._deleteShader(vertexShader);
            this._deleteShader(fragmentShader);
            return program;
        }
        let errorLog = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw errorLog;
    }
    createProgram(shaderSource) {
        const { vertexShader: vs, fragmentShader: fs } = shaderSource;
        //创建顶点着色器
        const vertexShader = this._getShader(SHADER_TYPE.VERTEX_SHADER, vs);
        //创建片元着色器
        let fragmentShader = this._getShader(SHADER_TYPE.FRAGMENT_SHADER, fs);
        //创建着色器程序
        return this._createProgram(vertexShader, fragmentShader);
    }
    deleteProgram(program) {
        this._engine.gl.deleteProgram(program);
    }
    useProgram(program) {
        this._engine.gl.useProgram(program);
    }
}


/***/ }),

/***/ "./src/engines/engine.renderTarget.ts":
/*!********************************************!*\
  !*** ./src/engines/engine.renderTarget.ts ***!
  \********************************************/
/*! exports provided: EngineRenderTarget */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EngineRenderTarget", function() { return EngineRenderTarget; });
class EngineRenderTarget {
    constructor(engine) {
        this._engine = engine;
        this.maxRenderBufferSize = this._engine.capabilities.maxRenderBufferSize;
    }
    /**
     * Binds the specified framebuffer object.
     *
     * @param {WebGLFramebuffer} fb - The framebuffer to bind.
     * @ignore
     */
    setFramebuffer(fb) {
        const { gl } = this._engine;
        if (this.activeFramebuffer !== fb) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            this.activeFramebuffer = fb;
        }
        if (gl.getError() != gl.NO_ERROR) {
            throw "Some WebGL error occurred while trying to create framebuffer.";
        }
    }
    /**
     * Initialize render target before it can be used.
     *
     * @param {RenderTarget} target - The render target to be initialized.
     * @ignore
     */
    initRenderTarget(target) {
        if (target.glFrameBuffer)
            return;
        const { gl, webgl2 } = this._engine;
        // ##### Create main FBO #####
        target.glFrameBuffer = gl.createFramebuffer();
        this.setFramebuffer(target.glFrameBuffer);
        // --- Init the provided color buffer (optional) ---
        const colorBuffer = target.colorBuffer;
        if (colorBuffer) {
            if (!colorBuffer.glTexture) {
                // Clamp the render buffer size to the maximum supported by the device
                colorBuffer.width = Math.min(colorBuffer.width, this.maxRenderBufferSize);
                colorBuffer.height = Math.min(colorBuffer.height, this.maxRenderBufferSize);
                this._engine.engineTexture.setTexture(colorBuffer, 0);
            }
            // Attach the color buffer
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorBuffer.glTexture, 0);
        }
        // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    setRenderTarget(target) {
        const { gl } = this._engine;
        if (target !== null) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, target.glFrameBuffer);
            if (target.depth) {
                gl.bindRenderbuffer(gl.RENDERBUFFER, target.glDepthBuffer);
            }
        }
        else {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    }
}


/***/ }),

/***/ "./src/engines/engine.texture.ts":
/*!***************************************!*\
  !*** ./src/engines/engine.texture.ts ***!
  \***************************************/
/*! exports provided: EngineTexture */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EngineTexture", function() { return EngineTexture; });
/* harmony import */ var _engine_enum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./engine.enum */ "./src/engines/engine.enum.ts");

class EngineTexture {
    constructor(engine) {
        this._engine = engine;
        this.textureUnit = -1;
        this.textureUnits = [];
        this.targetToSlot = {};
        const { gl } = this._engine;
        this.targetToSlot[gl.TEXTURE_2D] = 0;
        this.targetToSlot[gl.TEXTURE_CUBE_MAP] = 1;
        this.targetToSlot[gl.TEXTURE_3D] = 2;
        this.glFilter = [gl.NEAREST, gl.LINEAR, gl.NEAREST_MIPMAP_NEAREST, gl.NEAREST_MIPMAP_LINEAR, gl.LINEAR_MIPMAP_NEAREST, gl.LINEAR_MIPMAP_LINEAR];
        this.glAddress = [gl.REPEAT, gl.CLAMP_TO_EDGE, gl.MIRRORED_REPEAT];
        this.glComparison = [gl.NEVER, gl.LESS, gl.EQUAL, gl.LEQUAL, gl.GREATER, gl.NOTEQUAL, gl.GEQUAL, gl.ALWAYS];
    }
    /**
     * Allocate WebGL resources for a texture and add it to the array of textures managed by this
     * device.
     *
     * @param {Texture} texture - The texture to allocate WebGL resources for.
     * @ignore
     */
    initializeTexture(texture) {
        const { gl, webgl2 } = this._engine;
        texture.glTexture = gl.createTexture();
        texture.glTarget = texture.cubemap ? gl.TEXTURE_CUBE_MAP : texture.volume ? gl.TEXTURE_3D : gl.TEXTURE_2D;
        switch (texture.format) {
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_A8:
                texture.glFormat = gl.ALPHA;
                texture.glInternalFormat = gl.ALPHA;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_L8:
                texture.glFormat = gl.LUMINANCE;
                texture.glInternalFormat = gl.LUMINANCE;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_L8_A8:
                texture.glFormat = gl.LUMINANCE_ALPHA;
                texture.glInternalFormat = gl.LUMINANCE_ALPHA;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_R5_G6_B5:
                texture.glFormat = gl.RGB;
                texture.glInternalFormat = gl.RGB;
                texture.glPixelType = gl.UNSIGNED_SHORT_5_6_5;
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_R5_G5_B5_A1:
                texture.glFormat = gl.RGBA;
                texture.glInternalFormat = gl.RGBA;
                texture.glPixelType = gl.UNSIGNED_SHORT_5_5_5_1;
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_R4_G4_B4_A4:
                texture.glFormat = gl.RGBA;
                texture.glInternalFormat = gl.RGBA;
                texture.glPixelType = gl.UNSIGNED_SHORT_4_4_4_4;
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_R8_G8_B8:
                texture.glFormat = gl.RGB;
                texture.glInternalFormat = webgl2 ? gl.RGB8 : gl.RGB;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_R8_G8_B8_A8:
                texture.glFormat = gl.RGBA;
                texture.glInternalFormat = webgl2 ? gl.RGBA8 : gl.RGBA;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_RGB32F:
                // definition varies between WebGL1 and 2
                texture.glFormat = gl.RGB;
                if (webgl2) {
                    texture.glInternalFormat = gl.RGB32F;
                }
                else {
                    texture.glInternalFormat = gl.RGB;
                }
                texture.glPixelType = gl.FLOAT;
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_RGBA32F:
                // definition varies between WebGL1 and 2
                texture.glFormat = gl.RGBA;
                if (webgl2) {
                    texture.glInternalFormat = gl.RGBA32F;
                }
                else {
                    texture.glInternalFormat = gl.RGBA;
                }
                texture.glPixelType = gl.FLOAT;
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_R32F: // WebGL2 only
                texture.glFormat = gl.RED;
                texture.glInternalFormat = gl.R32F;
                texture.glPixelType = gl.FLOAT;
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_DEPTH:
                if (webgl2) {
                    // native WebGL2
                    texture.glFormat = gl.DEPTH_COMPONENT;
                    texture.glInternalFormat = gl.DEPTH_COMPONENT32F; // should allow 16/24 bits?
                    texture.glPixelType = gl.FLOAT;
                }
                else {
                    // using WebGL1 extension
                    texture.glFormat = gl.DEPTH_COMPONENT;
                    texture.glInternalFormat = gl.DEPTH_COMPONENT;
                    texture.glPixelType = gl.UNSIGNED_SHORT; // the only acceptable value?
                }
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_DEPTHSTENCIL: // WebGL2 only
                texture.glFormat = gl.DEPTH_STENCIL;
                texture.glInternalFormat = gl.DEPTH24_STENCIL8;
                texture.glPixelType = gl.UNSIGNED_INT_24_8;
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_111110F: // WebGL2 only
                texture.glFormat = gl.RGB;
                texture.glInternalFormat = gl.R11F_G11F_B10F;
                texture.glPixelType = gl.UNSIGNED_INT_10F_11F_11F_REV;
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_SRGB: // WebGL2 only
                texture.glFormat = gl.RGB;
                texture.glInternalFormat = gl.SRGB8;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_SRGBA: // WebGL2 only
                texture.glFormat = gl.RGBA;
                texture.glInternalFormat = gl.SRGB8_ALPHA8;
                texture.glPixelType = gl.UNSIGNED_BYTE;
                break;
        }
    }
    /**
     * Activate the specified texture unit.
     *
     * @param {number} textureUnit - The texture unit to activate.
     * @ignore
     */
    activeTexture(textureUnit) {
        const { gl } = this._engine;
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        if (this.textureUnit !== textureUnit) {
            this.textureUnit = textureUnit;
        }
    }
    /**
     * If the texture is not already bound on the currently active texture unit, bind it.
     *
     * @param {Texture} texture - The texture to bind.
     * @ignore
     */
    bindTexture(texture) {
        const { gl } = this._engine;
        const textureTarget = texture.glTarget;
        const textureObject = texture.glTexture;
        const textureUnit = this.textureUnit;
        // const slot = this.targetToSlot[textureTarget];
        // if (this.textureUnits[textureUnit][slot] !== textureObject) {
        //     gl.bindTexture(textureTarget, textureObject);
        //     this.textureUnits[textureUnit][slot] = textureObject;
        // }
        gl.bindTexture(textureTarget, textureObject);
    }
    /**
     * Update the texture parameters for a given texture if they have changed.
     *
     * @param {Texture} texture - The texture to update.
     * @ignore
     */
    setTextureParameters(texture) {
        const { gl, webgl2 } = this._engine;
        const flags = texture.parameterFlags;
        const target = texture.glTarget;
        if (flags & 1) {
            let filter = texture.minFilter;
            gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, this.glFilter[filter]);
        }
        if (flags & 2) {
            gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, this.glFilter[texture.magFilter]);
        }
        if (flags & 4) {
            if (webgl2) {
                gl.texParameteri(target, gl.TEXTURE_WRAP_S, this.glAddress[texture.addressU]);
            }
            else {
                // WebGL1 doesn't support all addressing modes with NPOT textures
                gl.texParameteri(target, gl.TEXTURE_WRAP_S, this.glAddress[texture.pot ? texture.addressU : _engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureAddress"].ADDRESS_CLAMP_TO_EDGE]);
            }
        }
        if (flags & 8) {
            if (webgl2) {
                gl.texParameteri(target, gl.TEXTURE_WRAP_T, this.glAddress[texture.addressV]);
            }
            else {
                // WebGL1 doesn't support all addressing modes with NPOT textures
                gl.texParameteri(target, gl.TEXTURE_WRAP_T, this.glAddress[texture.pot ? texture.addressV : _engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureAddress"].ADDRESS_CLAMP_TO_EDGE]);
            }
        }
        if (flags & 32) {
            if (webgl2) {
                gl.texParameteri(target, gl.TEXTURE_COMPARE_MODE, texture.compareOnRead ? gl.COMPARE_REF_TO_TEXTURE : gl.NONE);
            }
        }
        if (flags & 64) {
            if (webgl2) {
                gl.texParameteri(target, gl.TEXTURE_COMPARE_FUNC, this.glComparison[texture.compareFunc]);
            }
        }
    }
    /**
     * Sets the specified texture on the specified texture unit.
     *
     * @param {Texture} texture - The texture to set.
     * @param {number} textureUnit - The texture unit to set the texture on.
     * @ignore
     */
    setTexture(texture, textureUnit) {
        if (!texture.glTexture)
            this.initializeTexture(texture);
        if (texture.needsUpload) {
            // Ensure the specified texture unit is active
            this.activeTexture(textureUnit);
            // Ensure the texture is bound on correct target of the specified texture unit
            this.bindTexture(texture);
            if (texture.parameterFlags) {
                this.setTextureParameters(texture);
                texture.parameterFlags = 0;
            }
            this.uploadTexture(texture);
            texture.needsUpload = false;
        }
        else {
            // Ensure the texture is currently bound to the correct target on the specified texture unit.
            // If the texture is already bound to the correct target on the specified unit, there's no need
            // to actually make the specified texture unit active because the texture itself does not need
            // to be updated.
            this.bindTextureOnUnit(texture, textureUnit);
        }
    }
    /**
     * Updates a texture's vertical flip.
     *
     * @param {boolean} flipY - True to flip the texture vertically.
     * @ignore
     */
    setUnpackFlipY(flipY) {
        const { gl, webgl2 } = this._engine;
        if (this.unpackFlipY !== flipY) {
            this.unpackFlipY = flipY;
            // Note: the WebGL spec states that UNPACK_FLIP_Y_WEBGL only affects
            // texImage2D and texSubImage2D, not compressedTexImage2D
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
        }
    }
    /**
     * Updates a texture to have its RGB channels premultiplied by its alpha channel or not.
     *
     * @param {boolean} premultiplyAlpha - True to premultiply the alpha channel against the RGB
     * channels.
     * @ignore
     */
    setUnpackPremultiplyAlpha(premultiplyAlpha) {
        const { gl } = this._engine;
        if (this.unpackPremultiplyAlpha !== premultiplyAlpha) {
            this.unpackPremultiplyAlpha = premultiplyAlpha;
            // Note: the WebGL spec states that UNPACK_PREMULTIPLY_ALPHA_WEBGL only affects
            // texImage2D and texSubImage2D, not compressedTexImage2D
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha);
        }
    }
    uploadTexture(texture) {
        const { gl } = this._engine;
        let mipLevel = 0;
        // Upload the image, canvas or video
        this.setUnpackFlipY(texture.flipY);
        this.setUnpackPremultiplyAlpha(texture.premultiplyAlpha);
        if (texture.source) {
            gl.texImage2D(gl.TEXTURE_2D, mipLevel, texture.glInternalFormat, texture.glFormat, texture.glPixelType, texture.source);
            gl.generateMipmap(texture.glTarget);
        }
        else {
            // gl.texImage2D(gl.TEXTURE_2D, mipLevel, texture.glFormat, texture.width, texture.height, 0, texture.glFormat, texture.glPixelType, null);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texture.width, texture.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
    }
    /**
     * If the texture is not bound on the specified texture unit, active the texture unit and bind
     * the texture to it.
     *
     * @param {Texture} texture - The texture to bind.
     * @param {number} textureUnit - The texture unit to activate and bind the texture to.
     * @ignore
     */
    bindTextureOnUnit(texture, textureUnit) {
        const { gl } = this._engine;
        const textureTarget = texture.glTarget;
        const textureObject = texture.glTexture;
        this.activeTexture(textureUnit);
        gl.bindTexture(textureTarget, textureObject);
    }
}


/***/ }),

/***/ "./src/engines/engine.ts":
/*!*******************************!*\
  !*** ./src/engines/engine.ts ***!
  \*******************************/
/*! exports provided: Engine */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Engine", function() { return Engine; });
/* harmony import */ var _engine_draw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./engine.draw */ "./src/engines/engine.draw.ts");
/* harmony import */ var _engine_programs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./engine.programs */ "./src/engines/engine.programs.ts");
/* harmony import */ var _engine_renderTarget__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./engine.renderTarget */ "./src/engines/engine.renderTarget.ts");
/* harmony import */ var _engine_texture__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./engine.texture */ "./src/engines/engine.texture.ts");
/* harmony import */ var _engine_uniformBuffer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./engine.uniformBuffer */ "./src/engines/engine.uniformBuffer.ts");
/* harmony import */ var _engine_uniforms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./engine.uniforms */ "./src/engines/engine.uniforms.ts");
/* harmony import */ var _engine_vertex__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./engine.vertex */ "./src/engines/engine.vertex.ts");
/* harmony import */ var _engine_viewPort__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./engine.viewPort */ "./src/engines/engine.viewPort.ts");








class Engine {
    constructor(canvas) {
        this._contextWasLost = false;
        this.webgl2 = true;
        if (!canvas)
            return;
        this.renderingCanvas = canvas;
        try {
            this.gl = canvas.getContext("webgl2", {
                antialias: true,
                alpha: true,
            });
        }
        catch (err) {
            throw new Error("仅支持 webgl2.0");
        }
        this._initializeCapabilities();
        this.engineDraw = new _engine_draw__WEBPACK_IMPORTED_MODULE_0__["EngineDraw"](this);
        this.engineViewPort = new _engine_viewPort__WEBPACK_IMPORTED_MODULE_7__["EngineViewPort"](this);
        this.enginePrograms = new _engine_programs__WEBPACK_IMPORTED_MODULE_1__["EngineProgram"](this);
        this.engineUniform = new _engine_uniforms__WEBPACK_IMPORTED_MODULE_5__["EngineUniform"](this);
        this.engineVertex = new _engine_vertex__WEBPACK_IMPORTED_MODULE_6__["EngineVertex"](this);
        this.engineTexture = new _engine_texture__WEBPACK_IMPORTED_MODULE_3__["EngineTexture"](this);
        this.engineUniformBuffer = new _engine_uniformBuffer__WEBPACK_IMPORTED_MODULE_4__["EngineUniformBuffer"](this);
        this.engineRenderTarget = new _engine_renderTarget__WEBPACK_IMPORTED_MODULE_2__["EngineRenderTarget"](this);
    }
    _initializeCapabilities() {
        const gl = this.gl;
        const contextAttribs = gl.getContextAttributes();
        this.capabilities = {
            supportsMsaa: contextAttribs === null || contextAttribs === void 0 ? void 0 : contextAttribs.antialias,
            supportsStencil: contextAttribs.stencil,
            maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
            maxCubeMapSize: gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),
            maxRenderBufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
            maxTextures: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
            maxCombinedTextures: gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
            maxVertexTextures: gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
            vertexUniformsCount: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
            fragmentUniformsCount: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
            maxDrawBuffers: gl.getParameter(gl.MAX_DRAW_BUFFERS),
            maxColorAttachments: gl.getParameter(gl.MAX_COLOR_ATTACHMENTS),
            maxVolumeSize: gl.getParameter(gl.MAX_3D_TEXTURE_SIZE),
            maxSamples: gl.getParameter(gl.SAMPLES),
            supportsAreaLights: true,
        };
    }
}


/***/ }),

/***/ "./src/engines/engine.uniformBuffer.ts":
/*!*********************************************!*\
  !*** ./src/engines/engine.uniformBuffer.ts ***!
  \*********************************************/
/*! exports provided: EngineUniformBuffer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EngineUniformBuffer", function() { return EngineUniformBuffer; });
/* harmony import */ var _engine_enum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./engine.enum */ "./src/engines/engine.enum.ts");

class EngineUniformBuffer {
    constructor(engine) {
        this._engine = engine;
    }
    _getUniformBlockCatch(uniformBlock, name) {
        const { gl } = this._engine;
        if (!uniformBlock.blockCatch.has(name)) {
            const ubb = uniformBlock.blockIndex;
            const ubo = gl.createBuffer();
            uniformBlock.blockCatch.set(name, {
                ubb,
                ubo,
            });
            uniformBlock.blockIndex += 1;
        }
        return uniformBlock.blockCatch.get(name);
    }
    _getBufferData(keys, content) {
        let len = 0;
        let offset = [0];
        for (let i = 0; i < keys.length; i++) {
            const propName = keys[i];
            const { type } = content[propName];
            if (type == _engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Float) {
                len += 4;
            }
            if (type == _engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Vector2) {
                len += 4;
            }
            if (type == _engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Vector3) {
                len += 4;
            }
            if (type == _engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Vector4) {
                len += 4;
            }
            offset.push(len);
        }
        const result = new Float32Array(len);
        for (let i = 0; i < keys.length; i++) {
            const propName = keys[i];
            const { value, type } = content[propName];
            if (type == _engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Float) {
                result.set([0, 0, 0, value.x], offset[i]);
            }
            if (type == _engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Vector2) {
                result.set([0, 0, value.x, value.y], offset[i]);
            }
            if (type == _engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Vector3) {
                result.set([0, value.x, value.y, value.z], offset[i]);
            }
            if (type == _engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Vector4) {
                result.set([value.x, value.y, value.z, value.w], offset[i]);
            }
        }
        return result;
    }
    handleUniformBlock(program, blockName, content, uniformBlock) {
        const { gl } = this._engine;
        const ubi = gl.getUniformBlockIndex(program, blockName);
        const { ubb, ubo } = this._getUniformBlockCatch(uniformBlock, blockName);
        gl.uniformBlockBinding(program, ubi, ubb);
        gl.bindBuffer(gl.UNIFORM_BUFFER, ubo);
        const keys = Object.keys(content);
        const result = this._getBufferData(keys, content);
        gl.bufferData(gl.UNIFORM_BUFFER, result, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, ubb, ubo);
    }
}


/***/ }),

/***/ "./src/engines/engine.uniforms.ts":
/*!****************************************!*\
  !*** ./src/engines/engine.uniforms.ts ***!
  \****************************************/
/*! exports provided: EngineUniform */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EngineUniform", function() { return EngineUniform; });
/* harmony import */ var _engine_enum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./engine.enum */ "./src/engines/engine.enum.ts");
// import { bindCubeTexture, bindTexture, activeTexture } from "./texture.js";

class EngineUniform {
    constructor(engine) {
        this._engine = engine;
    }
    getUniformLocation(program, name) {
        const { gl } = this._engine;
        return gl.getUniformLocation(program, name);
    }
    setUniform(program, name, value, type) {
        const { gl } = this._engine;
        if (value == null) {
            return;
        }
        // const subName = `${name}_${meshName}`
        // 变量地址
        const addr = gl.getUniformLocation(program, name);
        if (addr == null) {
            return;
        }
        switch (type) {
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Float:
                gl.uniform1f(addr, value);
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Vector2:
                gl.uniform2f(addr, value.x, value.y);
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Vector3:
                gl.uniform3f(addr, value.x, value.y, value.z);
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Vector4:
                gl.uniform4f(addr, value.x, value.y, value.z, value.w);
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Matrix3:
                gl.uniformMatrix3fv(addr, false, new Float32Array(value));
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Matrix4:
                gl.uniformMatrix4fv(addr, false, new Float32Array(value));
                break;
            case _engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Texture:
                this._engine.engineTexture.setTexture(value, 0);
                gl.uniform1i(addr, 0);
                break;
            default:
                console.error("error", type, name);
                break;
        }
    }
    // 数组
    handleUniformArray(program, name, content) {
        const array = content;
        for (let i = 0; i < array.length; i++) {
            let baseName = `${name}[${i}]`;
            const item = array[i];
            if (item.type == _engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Struct) {
                const keys = Object.keys(item.value);
                for (let j = 0; j < keys.length; j++) {
                    const key = keys[j];
                    const properties = item.value[key];
                    const { value, type } = properties;
                    const addrName = baseName + `.${key}`;
                    this.setUniform(program, addrName, value, type);
                }
            }
            else {
                this.setUniform(program, baseName, item.value, item.type);
            }
        }
    }
}


/***/ }),

/***/ "./src/engines/engine.vertex.ts":
/*!**************************************!*\
  !*** ./src/engines/engine.vertex.ts ***!
  \**************************************/
/*! exports provided: EngineVertex */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EngineVertex", function() { return EngineVertex; });
class EngineVertex {
    constructor(engine) {
        this._engine = engine;
    }
    _unbindVertexArrayObject() {
        const { gl } = this._engine;
        if (!this._cachedVertexArrayObject) {
            return;
        }
        this._cachedVertexArrayObject = null;
        gl.bindVertexArray(null);
    }
    createVertexArray() {
        const { gl } = this._engine;
        return gl.createVertexArray();
    }
    bindVertexArray(vao) {
        const { gl } = this._engine;
        gl.bindVertexArray(vao);
    }
    deleteVertexArray(vao) {
        const { gl } = this._engine;
        gl.deleteVertexArray(vao);
    }
    createBuffer() {
        const { gl } = this._engine;
        return gl.createBuffer();
    }
    setIndicesBuffer(indicesBuffer, indices) {
        const { gl } = this._engine;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
        const arrayBuffer = ArrayBuffer.isView(indicesBuffer) ? indicesBuffer : new Uint16Array(indices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, arrayBuffer, gl.STATIC_DRAW);
    }
    setAttribBuffer(program, buffer, param) {
        const { gl } = this._engine;
        const { attribureName, attriburData, itemSize } = param;
        // 属性使能数组
        const attribure = gl.getAttribLocation(program, attribureName);
        if (attribure == -1) {
            // error.catchError({
            //     info: `"error"`,
            //     moduleName: moduleName,
            //     subName: attribureName,
            // });
            // console.error("error...");
            return;
        }
        // 创建缓冲区
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        const arrayBuffer = ArrayBuffer.isView(attriburData) ? attriburData : new Float32Array(attriburData);
        // 缓冲区指定数据
        gl.bufferData(gl.ARRAY_BUFFER, arrayBuffer, gl.STATIC_DRAW);
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        // 绑定顶点缓冲区对象,传送给GPU
        gl.vertexAttribPointer(attribure, itemSize, type, normalize, stride, offset);
        // error.clear(moduleName, attribureName);
        gl.enableVertexAttribArray(attribure);
    }
    getAttribLocation(program, name) {
        const { gl } = this._engine;
        return gl.getAttribLocation(program, name);
    }
    disableVertexAttribArray(attribure) {
        const { gl } = this._engine;
        gl.disableVertexAttribArray(attribure);
    }
    setBuffers() {
    }
}


/***/ }),

/***/ "./src/engines/engine.viewPort.ts":
/*!****************************************!*\
  !*** ./src/engines/engine.viewPort.ts ***!
  \****************************************/
/*! exports provided: EngineViewPort */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EngineViewPort", function() { return EngineViewPort; });
class EngineViewPort {
    constructor(engine) {
        this.viewportCached = { x: 0, y: 0, width: 0, height: 0 };
        this._engine = engine;
    }
    /**
     * Set the WebGL's viewport
     * @param viewport defines the viewport element to be used
     * @param requiredWidth defines the width required for rendering. If not provided the rendering canvas' width is used
     * @param requiredHeight defines the height required for rendering. If not provided the rendering canvas' height is used
     */
    setViewport(viewport, requiredWidth, requiredHeight) {
        // var width = requiredWidth || this._engine.engineDraw.getRenderWidth();
        // var height = requiredHeight || this._engine.engineDraw.getRenderHeight();
        // var x = viewport.x || 0;
        // var y = viewport.y || 0;
        // this._viewport(x * width, y * height, width * viewport.width, height * viewport.height);
        this._engine.gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
    }
    _viewport(x, y, width, height) {
        if (x !== this.viewportCached.x || y !== this.viewportCached.y || width !== this.viewportCached.width || height !== this.viewportCached.height) {
            this.viewportCached.x = x;
            this.viewportCached.y = y;
            this.viewportCached.width = width;
            this.viewportCached.height = height;
            this._engine.gl.viewport(x, y, width, height);
        }
    }
}


/***/ }),

/***/ "./src/engines/index.ts":
/*!******************************!*\
  !*** ./src/engines/index.ts ***!
  \******************************/
/*! exports provided: Engine, UniformsType, TextureFormat, TextureFilter, TextureAddress, CompareFunc */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./engine */ "./src/engines/engine.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Engine", function() { return _engine__WEBPACK_IMPORTED_MODULE_0__["Engine"]; });

/* harmony import */ var _engine_enum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./engine.enum */ "./src/engines/engine.enum.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UniformsType", function() { return _engine_enum__WEBPACK_IMPORTED_MODULE_1__["UniformsType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TextureFormat", function() { return _engine_enum__WEBPACK_IMPORTED_MODULE_1__["TextureFormat"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TextureFilter", function() { return _engine_enum__WEBPACK_IMPORTED_MODULE_1__["TextureFilter"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TextureAddress", function() { return _engine_enum__WEBPACK_IMPORTED_MODULE_1__["TextureAddress"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CompareFunc", function() { return _engine_enum__WEBPACK_IMPORTED_MODULE_1__["CompareFunc"]; });





/***/ }),

/***/ "./src/geometry/builder.ts":
/*!*********************************!*\
  !*** ./src/geometry/builder.ts ***!
  \*********************************/
/*! exports provided: boxBuilder, sphereBuilder, planeBuilder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "boxBuilder", function() { return boxBuilder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sphereBuilder", function() { return sphereBuilder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "planeBuilder", function() { return planeBuilder; });
/* harmony import */ var _maths_math_vec3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../maths/math.vec3 */ "./src/maths/math.vec3.ts");

const primitiveUv1Padding = 4.0 / 64;
const primitiveUv1PaddingScale = 1.0 - primitiveUv1Padding * 2;
function boxBuilder(opts) {
    // Check the supplied options and provide defaults for unspecified ones
    const he = opts && opts.halfExtents !== undefined ? opts.halfExtents : new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_0__["Vec3"](0.5, 0.5, 0.5);
    const ws = opts && opts.widthSegments !== undefined ? opts.widthSegments : 1;
    const ls = opts && opts.lengthSegments !== undefined ? opts.lengthSegments : 1;
    const hs = opts && opts.heightSegments !== undefined ? opts.heightSegments : 1;
    const corners = [
        new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_0__["Vec3"](-he.x, -he.y, he.z),
        new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_0__["Vec3"](he.x, -he.y, he.z),
        new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_0__["Vec3"](he.x, he.y, he.z),
        new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_0__["Vec3"](-he.x, he.y, he.z),
        new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_0__["Vec3"](he.x, -he.y, -he.z),
        new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_0__["Vec3"](-he.x, -he.y, -he.z),
        new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_0__["Vec3"](-he.x, he.y, -he.z),
        new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_0__["Vec3"](he.x, he.y, -he.z),
    ];
    const faceAxes = [
        [0, 1, 3],
        [4, 5, 7],
        [3, 2, 6],
        [1, 0, 4],
        [1, 4, 2],
        [5, 0, 6], // LEFT
    ];
    const faceNormals = [
        [0, 0, 1],
        [0, 0, -1],
        [0, 1, 0],
        [0, -1, 0],
        [1, 0, 0],
        [-1, 0, 0], // LEFT
    ];
    let Sides;
    (function (Sides) {
        Sides[Sides["FRONT"] = 0] = "FRONT";
        Sides[Sides["BACK"] = 1] = "BACK";
        Sides[Sides["TOP"] = 2] = "TOP";
        Sides[Sides["BOTTOM"] = 3] = "BOTTOM";
        Sides[Sides["RIGHT"] = 4] = "RIGHT";
        Sides[Sides["LEFT"] = 5] = "LEFT";
    })(Sides || (Sides = {}));
    const positions = new Array();
    const normals = new Array();
    const uvs = new Array();
    const uvs1 = new Array();
    const indices = new Array();
    let vcounter = 0;
    const generateFace = (side, uSegments, vSegments) => {
        const temp1 = new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_0__["Vec3"]();
        const temp2 = new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_0__["Vec3"]();
        const temp3 = new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_0__["Vec3"]();
        const r = new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_0__["Vec3"]();
        for (let i = 0; i <= uSegments; i++) {
            for (let j = 0; j <= vSegments; j++) {
                temp1.lerp(corners[faceAxes[side][0]], corners[faceAxes[side][1]], i / uSegments);
                temp2.lerp(corners[faceAxes[side][0]], corners[faceAxes[side][2]], j / vSegments);
                temp3.sub2(temp2, corners[faceAxes[side][0]]);
                r.add2(temp1, temp3);
                let u = i / uSegments;
                let v = j / vSegments;
                positions.push(r.x, r.y, r.z);
                normals.push(faceNormals[side][0], faceNormals[side][1], faceNormals[side][2]);
                uvs.push(u, 1 - v);
                // pack as 3x2. 1/3 will be empty, but it's either that or stretched pixels
                // TODO: generate non-rectangular lightMaps, so we could use space without stretching
                u = u * primitiveUv1PaddingScale + primitiveUv1Padding;
                v = v * primitiveUv1PaddingScale + primitiveUv1Padding;
                u /= 3;
                v /= 3;
                u += (side % 3) / 3;
                v += Math.floor(side / 3) / 3;
                uvs1.push(u, 1 - v);
                if (i < uSegments && j < vSegments) {
                    indices.push(vcounter + vSegments + 1, vcounter + 1, vcounter);
                    indices.push(vcounter + vSegments + 1, vcounter + vSegments + 2, vcounter + 1);
                }
                vcounter++;
            }
        }
    };
    generateFace(Sides.FRONT, ws, hs);
    generateFace(Sides.BACK, ws, hs);
    generateFace(Sides.TOP, ws, ls);
    generateFace(Sides.BOTTOM, ws, ls);
    generateFace(Sides.RIGHT, ls, hs);
    generateFace(Sides.LEFT, ls, hs);
    return {
        positions: positions,
        normals: normals,
        uvs: uvs,
        // uvs1: uvs1,
        indices: indices,
    };
}
function sphereBuilder(opts) {
    // Check the supplied options and provide defaults for unspecified ones
    const radius = opts && opts.radius !== undefined ? opts.radius : 0.5;
    const latitudeBands = opts && opts.latitudeBands !== undefined ? opts.latitudeBands : 16;
    const longitudeBands = opts && opts.longitudeBands !== undefined ? opts.longitudeBands : 16;
    const calcTangents = opts && opts.calculateTangents !== undefined ? opts.calculateTangents : false;
    // Variable declarations
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];
    for (let lat = 0; lat <= latitudeBands; lat++) {
        const theta = (lat * Math.PI) / latitudeBands;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);
        for (let lon = 0; lon <= longitudeBands; lon++) {
            // Sweep the sphere from the positive Z axis to match a 3DS Max sphere
            const phi = (lon * 2 * Math.PI) / longitudeBands - Math.PI / 2;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);
            const x = cosPhi * sinTheta;
            const y = cosTheta;
            const z = sinPhi * sinTheta;
            const u = 1 - lon / longitudeBands;
            const v = 1 - lat / latitudeBands;
            positions.push(x * radius, y * radius, z * radius);
            normals.push(x, y, z);
            uvs.push(u, 1 - v);
        }
    }
    for (let lat = 0; lat < latitudeBands; ++lat) {
        for (let lon = 0; lon < longitudeBands; ++lon) {
            const first = lat * (longitudeBands + 1) + lon;
            const second = first + longitudeBands + 1;
            indices.push(first + 1, second, first);
            indices.push(first + 1, second + 1, second);
        }
    }
    return {
        positions: positions,
        normals: normals,
        uvs: uvs,
        // uvs1: uvs, // UV1 = UV0 for sphere
        indices: indices,
    };
    // return createMesh(device, positions, options);
}
// export function planeBuilder(opts?: any): iGeometryBuilder {
//     // Check the supplied options and provide defaults for unspecified ones
//     const he = opts && opts.halfExtents !== undefined ? opts.halfExtents : new Vec2(0.5, 0.5);
//     const ws = opts && opts.widthSegments !== undefined ? opts.widthSegments : 5;
//     const ls = opts && opts.lengthSegments !== undefined ? opts.lengthSegments : 5;
//     const calcTangents = opts && opts.calculateTangents !== undefined ? opts.calculateTangents : false;
//     // Variable declarations
//     const positions: Array<number> = [];
//     const normals: Array<number> = [];
//     const uvs: Array<number> = [];
//     const indices: Array<number> = [];
//     // Generate plane as follows (assigned UVs denoted at corners):
//     // (0,1)x---------x(1,1)
//     //      |         |
//     //      |         |
//     //      |    O--X |length
//     //      |    |    |
//     //      |    Z    |
//     // (0,0)x---------x(1,0)
//     // width
//     let vcounter = 0;
//     for (let i = 0; i <= ws; i++) {
//         for (let j = 0; j <= ls; j++) {
//             const x = -he.x + (2 * he.x * i) / ws;
//             const y = 0.0;
//             const z = -(-he.y + (2 * he.y * j) / ls);
//             const u = i / ws;
//             const v = j / ls;
//             positions.push(x, y, z);
//             normals.push(0, 1, 0);
//             uvs.push(u, 1 - v);
//             if (i < ws && j < ls) {
//                 indices.push(vcounter + ls + 1, vcounter + 1, vcounter);
//                 indices.push(vcounter + ls + 1, vcounter + ls + 2, vcounter + 1);
//             }
//             vcounter++;
//         }
//     }
//     return {
//         positions: positions,
//         normals: normals,
//         uvs: uvs,
//         // uvs1: uvs, // UV1 = UV0 for plane
//         indices: indices,
//     };
//     // return createMesh(device, positions, options);
// }
function planeBuilder(width, height) {
    if (width == undefined) {
        width = 1;
    }
    if (height == undefined) {
        height = 1;
    }
    const vert = [-width, height, 0, -width, -height, 0, width, -height, 0, width, height, 0];
    const indices = [0, 1, 2, 2, 3, 0];
    const normal = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
    return {
        positions: vert,
        normals: normal,
        uvs: [0, 1, 0, 0, 1, 0, 1, 1],
        indices: indices,
    };
}


/***/ }),

/***/ "./src/geometry/geometry.ts":
/*!**********************************!*\
  !*** ./src/geometry/geometry.ts ***!
  \**********************************/
/*! exports provided: Geometry */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Geometry", function() { return Geometry; });
/* harmony import */ var _engines_engine_draw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../engines/engine.draw */ "./src/engines/engine.draw.ts");
/* harmony import */ var _misc_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../misc/logger */ "./src/misc/logger.ts");
// import { Sphere } from '../math/Sphere.js';
// import { Box3 } from '../math/Box3.js';
// import { Vector3 } from '../math/Vector3.js';
// import Attribute from './Attribute.js'


class Geometry {
    constructor(engine, geometryInfo) {
        this._attributeBuffer = new Map();
        this._engine = engine;
        this._geometryInfo = geometryInfo;
        if (!this._geometryInfo.attributes) {
            _misc_logger__WEBPACK_IMPORTED_MODULE_1__["Logger"].Warn("geometry no attributes");
        }
        if (!this._geometryInfo.type) {
            this._geometryInfo.type = _engines_engine_draw__WEBPACK_IMPORTED_MODULE_0__["PrimitiveType"].PRIMITIVE_TRIANGLES;
        }
        // 三角形数量
        if (this._geometryInfo.indices) {
            this._geometryInfo.count = this._geometryInfo.indices.length;
        }
        else {
            this._geometryInfo.count = 0;
        }
        this._createVertexArray();
    }
    get geometryInfo() {
        return this._geometryInfo;
    }
    /**
     * 创建VAO
     */
    _createVertexArray() {
        this._VAO = this._engine.engineVertex.createVertexArray();
        this._engine.engineVertex.bindVertexArray(this._VAO);
        for (let name in this._geometryInfo.attributes) {
            this._attributeBuffer.set(name, this._engine.engineVertex.createBuffer());
        }
        // 创建顶点缓冲区
        this._indicesBuffer = this._engine.engineVertex.createBuffer();
        this._engine.engineVertex.bindVertexArray(null);
    }
    setBuffers(program) {
        // 绑定VAO
        this._engine.engineVertex.bindVertexArray(this._VAO);
        const { _attributeBuffer, _indicesBuffer } = this;
        for (let name in this._geometryInfo.attributes) {
            const attribute = this._geometryInfo.attributes[name];
            const { value, itemSize } = attribute;
            this._engine.engineVertex.setAttribBuffer(program, _attributeBuffer.get(name), {
                attribureName: name,
                attriburData: value,
                itemSize: itemSize,
            });
        }
        // 绑定顶点索引
        if (this._geometryInfo.indices.length > 0) {
            this._engine.engineVertex.setIndicesBuffer(_indicesBuffer, this._geometryInfo.indices);
        }
    }
    disableVertexAttrib(program) {
        for (let name in this._geometryInfo.attributes) {
            const attribure = this._engine.engineVertex.getAttribLocation(program, name);
            attribure != -1 && this._engine.engineVertex.disableVertexAttribArray(attribure);
        }
    }
}


/***/ }),

/***/ "./src/geometry/index.ts":
/*!*******************************!*\
  !*** ./src/geometry/index.ts ***!
  \*******************************/
/*! exports provided: boxBuilder, sphereBuilder, planeBuilder, Geometry */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _builder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./builder */ "./src/geometry/builder.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "boxBuilder", function() { return _builder__WEBPACK_IMPORTED_MODULE_0__["boxBuilder"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "sphereBuilder", function() { return _builder__WEBPACK_IMPORTED_MODULE_0__["sphereBuilder"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "planeBuilder", function() { return _builder__WEBPACK_IMPORTED_MODULE_0__["planeBuilder"]; });

/* harmony import */ var _geometry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./geometry */ "./src/geometry/geometry.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Geometry", function() { return _geometry__WEBPACK_IMPORTED_MODULE_1__["Geometry"]; });





/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: Engine, UniformsType, TextureFormat, TextureFilter, TextureAddress, CompareFunc, PerspectiveCamera, boxBuilder, sphereBuilder, planeBuilder, Geometry, Material, Mesh, Scene, TextureLoader, Texture, RenderTarget, Application */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _engines_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./engines/index */ "./src/engines/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Engine", function() { return _engines_index__WEBPACK_IMPORTED_MODULE_0__["Engine"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UniformsType", function() { return _engines_index__WEBPACK_IMPORTED_MODULE_0__["UniformsType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TextureFormat", function() { return _engines_index__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TextureFilter", function() { return _engines_index__WEBPACK_IMPORTED_MODULE_0__["TextureFilter"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TextureAddress", function() { return _engines_index__WEBPACK_IMPORTED_MODULE_0__["TextureAddress"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CompareFunc", function() { return _engines_index__WEBPACK_IMPORTED_MODULE_0__["CompareFunc"]; });

/* harmony import */ var _cameras_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cameras/index */ "./src/cameras/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PerspectiveCamera", function() { return _cameras_index__WEBPACK_IMPORTED_MODULE_1__["PerspectiveCamera"]; });

/* harmony import */ var _geometry_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./geometry/index */ "./src/geometry/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "boxBuilder", function() { return _geometry_index__WEBPACK_IMPORTED_MODULE_2__["boxBuilder"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "sphereBuilder", function() { return _geometry_index__WEBPACK_IMPORTED_MODULE_2__["sphereBuilder"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "planeBuilder", function() { return _geometry_index__WEBPACK_IMPORTED_MODULE_2__["planeBuilder"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Geometry", function() { return _geometry_index__WEBPACK_IMPORTED_MODULE_2__["Geometry"]; });

/* harmony import */ var _material_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./material/index */ "./src/material/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Material", function() { return _material_index__WEBPACK_IMPORTED_MODULE_3__["Material"]; });

/* harmony import */ var _mesh_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mesh/index */ "./src/mesh/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Mesh", function() { return _mesh_index__WEBPACK_IMPORTED_MODULE_4__["Mesh"]; });

/* harmony import */ var _scene_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./scene/index */ "./src/scene/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Scene", function() { return _scene_index__WEBPACK_IMPORTED_MODULE_5__["Scene"]; });

/* harmony import */ var _loader_index__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./loader/index */ "./src/loader/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TextureLoader", function() { return _loader_index__WEBPACK_IMPORTED_MODULE_6__["TextureLoader"]; });

/* harmony import */ var _texture_index__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./texture/index */ "./src/texture/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Texture", function() { return _texture_index__WEBPACK_IMPORTED_MODULE_7__["Texture"]; });

/* harmony import */ var _renderer_index__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./renderer/index */ "./src/renderer/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RenderTarget", function() { return _renderer_index__WEBPACK_IMPORTED_MODULE_8__["RenderTarget"]; });

/* harmony import */ var _application__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./application */ "./src/application.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Application", function() { return _application__WEBPACK_IMPORTED_MODULE_9__["Application"]; });













/***/ }),

/***/ "./src/lmgl.ts":
/*!*********************!*\
  !*** ./src/lmgl.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./src/index.ts");
// 挂载到window对象;

window.lmgl = _index__WEBPACK_IMPORTED_MODULE_0__;


/***/ }),

/***/ "./src/loader/index.ts":
/*!*****************************!*\
  !*** ./src/loader/index.ts ***!
  \*****************************/
/*! exports provided: TextureLoader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _texture_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./texture.loader */ "./src/loader/texture.loader.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TextureLoader", function() { return _texture_loader__WEBPACK_IMPORTED_MODULE_0__["TextureLoader"]; });




/***/ }),

/***/ "./src/loader/texture.loader.ts":
/*!**************************************!*\
  !*** ./src/loader/texture.loader.ts ***!
  \**************************************/
/*! exports provided: TextureLoader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextureLoader", function() { return TextureLoader; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/_tslib@2.3.1@tslib/tslib.es6.js");
/* harmony import */ var _misc_fileTools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../misc/fileTools */ "./src/misc/fileTools.ts");
/* harmony import */ var _texture__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../texture */ "./src/texture/index.ts");



class TextureLoader {
    constructor(engine) {
        this._engine = engine;
    }
    load(url) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                const image = yield _misc_fileTools__WEBPACK_IMPORTED_MODULE_1__["FileTools"].LoadImage(url);
                const texture = new _texture__WEBPACK_IMPORTED_MODULE_2__["Texture"](this._engine);
                texture.source = image;
                return resolve(texture);
            }));
        });
    }
}


/***/ }),

/***/ "./src/material/index.ts":
/*!*******************************!*\
  !*** ./src/material/index.ts ***!
  \*******************************/
/*! exports provided: Material */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _material__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./material */ "./src/material/material.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Material", function() { return _material__WEBPACK_IMPORTED_MODULE_0__["Material"]; });




/***/ }),

/***/ "./src/material/material.ts":
/*!**********************************!*\
  !*** ./src/material/material.ts ***!
  \**********************************/
/*! exports provided: Material */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Material", function() { return Material; });
/* harmony import */ var _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../engines/engine.enum */ "./src/engines/engine.enum.ts");
/* harmony import */ var _misc_tool__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../misc/tool */ "./src/misc/tool.ts");


class Material {
    constructor(engine, materialInfo) {
        this._engine = engine;
        // let mat = matInfo;
        this.inputVertexShader = JSON.parse(JSON.stringify(materialInfo.vertexShader));
        this.inputFragmentShader = JSON.parse(JSON.stringify(materialInfo.fragmentShader));
        this.uniforms = Object(_misc_tool__WEBPACK_IMPORTED_MODULE_1__["cloneUniforms"])(materialInfo.uniforms || {});
        const header = `#version 300 es
      precision mediump float;
    `;
        this.uniformBlock = {
            blockCatch: new Map(),
            blockIndex: 0,
        };
        this.vertexShader = header + this.inputVertexShader;
        this.fragmentShader = header + this.inputFragmentShader;
        this.program = engine.enginePrograms.createProgram({
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
        });
        // this.blending = false;
        // this.blendingType = BLENDING_TYPE.RGBA;
        // this.blendRGBASrc = BLENDING_FACTOR.ONE;
        // this.blendRGBADst = BLENDING_FACTOR.ONE;
        // this.blendRGB_ASrc = BLENDING_FACTOR.SRC_ALPHA;
        // this.blendRGB_ADst = BLENDING_FACTOR.ONE_MINUS_SRC_ALPHA;
        // this.depthTest = true;
        // this.side = SIDE.FrontSide;
        // 是否需要每帧更新uniform变量
        this.needUpdate = true;
        this.setUniform();
    }
    _handleUniform(obj) {
        const { program } = this;
        let textureId = 0;
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            const name = keys[i];
            const { value, type } = obj[name];
            if (type == _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Array) {
                this._engine.engineUniform.handleUniformArray(program, name, value);
            }
            else if (type == _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Struct) {
                this._engine.engineUniformBuffer.handleUniformBlock(program, name, value, this.uniformBlock);
            }
            else {
                this._engine.engineUniform.setUniform(program, name, value, type);
            }
            if (type == _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Texture) {
                textureId += 1;
            }
        }
    }
    setUniform() {
        const { program, uniforms } = this;
        // const gl = dao.getData("gl");
        this._engine.enginePrograms.useProgram(program);
        this._handleUniform(uniforms);
    }
    clone() {
        return new Material(this._engine, {
            vertexShader: this.inputVertexShader,
            fragmentShader: this.inputFragmentShader,
            uniforms: this.uniforms,
        });
    }
}


/***/ }),

/***/ "./src/maths/math.color.ts":
/*!*********************************!*\
  !*** ./src/maths/math.color.ts ***!
  \*********************************/
/*! exports provided: Color3, Color4, TmpColors */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Color3", function() { return Color3; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Color4", function() { return Color4; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TmpColors", function() { return TmpColors; });
/* harmony import */ var _math_scalar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.scalar */ "./src/maths/math.scalar.ts");
/* harmony import */ var _math_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./math.constants */ "./src/maths/math.constants.ts");
/* harmony import */ var _misc_arrayTools__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../misc/arrayTools */ "./src/misc/arrayTools.ts");
/* harmony import */ var _misc_typeStore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../misc/typeStore */ "./src/misc/typeStore.ts");




/**
 * Class used to hold a RBG color
 */
class Color3 {
    /**
     * Creates a new Color3 object from red, green, blue values, all between 0 and 1
     * @param r defines the red component (between 0 and 1, default is 0)
     * @param g defines the green component (between 0 and 1, default is 0)
     * @param b defines the blue component (between 0 and 1, default is 0)
     */
    constructor(
    /**
     * Defines the red component (between 0 and 1, default is 0)
     */
    r = 0, 
    /**
     * Defines the green component (between 0 and 1, default is 0)
     */
    g = 0, 
    /**
     * Defines the blue component (between 0 and 1, default is 0)
     */
    b = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    /**
     * Creates a string with the Color3 current values
     * @returns the string representation of the Color3 object
     */
    toString() {
        return "{R: " + this.r + " G:" + this.g + " B:" + this.b + "}";
    }
    /**
     * Returns the string "Color3"
     * @returns "Color3"
     */
    getClassName() {
        return "Color3";
    }
    /**
     * Compute the Color3 hash code
     * @returns an unique number that can be used to hash Color3 objects
     */
    getHashCode() {
        let hash = (this.r * 255) | 0;
        hash = (hash * 397) ^ ((this.g * 255) | 0);
        hash = (hash * 397) ^ ((this.b * 255) | 0);
        return hash;
    }
    // Operators
    /**
     * Stores in the given array from the given starting index the red, green, blue values as successive elements
     * @param array defines the array where to store the r,g,b components
     * @param index defines an optional index in the target array to define where to start storing values
     * @returns the current Color3 object
     */
    toArray(array, index = 0) {
        array[index] = this.r;
        array[index + 1] = this.g;
        array[index + 2] = this.b;
        return this;
    }
    /**
     * Update the current color with values stored in an array from the starting index of the given array
     * @param array defines the source array
     * @param offset defines an offset in the source array
     * @returns the current Color3 object
     */
    fromArray(array, offset = 0) {
        Color3.FromArrayToRef(array, offset, this);
        return this;
    }
    /**
     * Returns a new Color4 object from the current Color3 and the given alpha
     * @param alpha defines the alpha component on the new Color4 object (default is 1)
     * @returns a new Color4 object
     */
    toColor4(alpha = 1) {
        return new Color4(this.r, this.g, this.b, alpha);
    }
    /**
     * Returns a new array populated with 3 numeric elements : red, green and blue values
     * @returns the new array
     */
    asArray() {
        var result = new Array();
        this.toArray(result, 0);
        return result;
    }
    /**
     * Returns the luminance value
     * @returns a float value
     */
    toLuminance() {
        return this.r * 0.3 + this.g * 0.59 + this.b * 0.11;
    }
    /**
     * Multiply each Color3 rgb values by the given Color3 rgb values in a new Color3 object
     * @param otherColor defines the second operand
     * @returns the new Color3 object
     */
    multiply(otherColor) {
        return new Color3(this.r * otherColor.r, this.g * otherColor.g, this.b * otherColor.b);
    }
    /**
     * Multiply the rgb values of the Color3 and the given Color3 and stores the result in the object "result"
     * @param otherColor defines the second operand
     * @param result defines the Color3 object where to store the result
     * @returns the current Color3
     */
    multiplyToRef(otherColor, result) {
        result.r = this.r * otherColor.r;
        result.g = this.g * otherColor.g;
        result.b = this.b * otherColor.b;
        return this;
    }
    /**
     * Determines equality between Color3 objects
     * @param otherColor defines the second operand
     * @returns true if the rgb values are equal to the given ones
     */
    equals(otherColor) {
        return otherColor && this.r === otherColor.r && this.g === otherColor.g && this.b === otherColor.b;
    }
    /**
     * Determines equality between the current Color3 object and a set of r,b,g values
     * @param r defines the red component to check
     * @param g defines the green component to check
     * @param b defines the blue component to check
     * @returns true if the rgb values are equal to the given ones
     */
    equalsFloats(r, g, b) {
        return this.r === r && this.g === g && this.b === b;
    }
    /**
     * Multiplies in place each rgb value by scale
     * @param scale defines the scaling factor
     * @returns the updated Color3
     */
    scale(scale) {
        return new Color3(this.r * scale, this.g * scale, this.b * scale);
    }
    /**
     * Multiplies the rgb values by scale and stores the result into "result"
     * @param scale defines the scaling factor
     * @param result defines the Color3 object where to store the result
     * @returns the unmodified current Color3
     */
    scaleToRef(scale, result) {
        result.r = this.r * scale;
        result.g = this.g * scale;
        result.b = this.b * scale;
        return this;
    }
    /**
     * Scale the current Color3 values by a factor and add the result to a given Color3
     * @param scale defines the scale factor
     * @param result defines color to store the result into
     * @returns the unmodified current Color3
     */
    scaleAndAddToRef(scale, result) {
        result.r += this.r * scale;
        result.g += this.g * scale;
        result.b += this.b * scale;
        return this;
    }
    /**
     * Clamps the rgb values by the min and max values and stores the result into "result"
     * @param min defines minimum clamping value (default is 0)
     * @param max defines maximum clamping value (default is 1)
     * @param result defines color to store the result into
     * @returns the original Color3
     */
    clampToRef(min = 0, max = 1, result) {
        result.r = _math_scalar__WEBPACK_IMPORTED_MODULE_0__["Scalar"].Clamp(this.r, min, max);
        result.g = _math_scalar__WEBPACK_IMPORTED_MODULE_0__["Scalar"].Clamp(this.g, min, max);
        result.b = _math_scalar__WEBPACK_IMPORTED_MODULE_0__["Scalar"].Clamp(this.b, min, max);
        return this;
    }
    /**
     * Creates a new Color3 set with the added values of the current Color3 and of the given one
     * @param otherColor defines the second operand
     * @returns the new Color3
     */
    add(otherColor) {
        return new Color3(this.r + otherColor.r, this.g + otherColor.g, this.b + otherColor.b);
    }
    /**
     * Stores the result of the addition of the current Color3 and given one rgb values into "result"
     * @param otherColor defines the second operand
     * @param result defines Color3 object to store the result into
     * @returns the unmodified current Color3
     */
    addToRef(otherColor, result) {
        result.r = this.r + otherColor.r;
        result.g = this.g + otherColor.g;
        result.b = this.b + otherColor.b;
        return this;
    }
    /**
     * Returns a new Color3 set with the subtracted values of the given one from the current Color3
     * @param otherColor defines the second operand
     * @returns the new Color3
     */
    subtract(otherColor) {
        return new Color3(this.r - otherColor.r, this.g - otherColor.g, this.b - otherColor.b);
    }
    /**
     * Stores the result of the subtraction of given one from the current Color3 rgb values into "result"
     * @param otherColor defines the second operand
     * @param result defines Color3 object to store the result into
     * @returns the unmodified current Color3
     */
    subtractToRef(otherColor, result) {
        result.r = this.r - otherColor.r;
        result.g = this.g - otherColor.g;
        result.b = this.b - otherColor.b;
        return this;
    }
    /**
     * Copy the current object
     * @returns a new Color3 copied the current one
     */
    clone() {
        return new Color3(this.r, this.g, this.b);
    }
    /**
     * Copies the rgb values from the source in the current Color3
     * @param source defines the source Color3 object
     * @returns the updated Color3 object
     */
    copyFrom(source) {
        this.r = source.r;
        this.g = source.g;
        this.b = source.b;
        return this;
    }
    /**
     * Updates the Color3 rgb values from the given floats
     * @param r defines the red component to read from
     * @param g defines the green component to read from
     * @param b defines the blue component to read from
     * @returns the current Color3 object
     */
    copyFromFloats(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        return this;
    }
    /**
     * Updates the Color3 rgb values from the given floats
     * @param r defines the red component to read from
     * @param g defines the green component to read from
     * @param b defines the blue component to read from
     * @returns the current Color3 object
     */
    set(r, g, b) {
        return this.copyFromFloats(r, g, b);
    }
    /**
     * Compute the Color3 hexadecimal code as a string
     * @returns a string containing the hexadecimal representation of the Color3 object
     */
    toHexString() {
        var intR = (this.r * 255) | 0;
        var intG = (this.g * 255) | 0;
        var intB = (this.b * 255) | 0;
        return "#" + _math_scalar__WEBPACK_IMPORTED_MODULE_0__["Scalar"].ToHex(intR) + _math_scalar__WEBPACK_IMPORTED_MODULE_0__["Scalar"].ToHex(intG) + _math_scalar__WEBPACK_IMPORTED_MODULE_0__["Scalar"].ToHex(intB);
    }
    /**
     * Computes a new Color3 converted from the current one to linear space
     * @returns a new Color3 object
     */
    toLinearSpace() {
        var convertedColor = new Color3();
        this.toLinearSpaceToRef(convertedColor);
        return convertedColor;
    }
    /**
     * Converts current color in rgb space to HSV values
     * @returns a new color3 representing the HSV values
     */
    toHSV() {
        let result = new Color3();
        this.toHSVToRef(result);
        return result;
    }
    /**
     * Converts current color in rgb space to HSV values
     * @param result defines the Color3 where to store the HSV values
     */
    toHSVToRef(result) {
        var r = this.r;
        var g = this.g;
        var b = this.b;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h = 0;
        var s = 0;
        var v = max;
        var dm = max - min;
        if (max !== 0) {
            s = dm / max;
        }
        if (max != min) {
            if (max == r) {
                h = (g - b) / dm;
                if (g < b) {
                    h += 6;
                }
            }
            else if (max == g) {
                h = (b - r) / dm + 2;
            }
            else if (max == b) {
                h = (r - g) / dm + 4;
            }
            h *= 60;
        }
        result.r = h;
        result.g = s;
        result.b = v;
    }
    /**
     * Converts the Color3 values to linear space and stores the result in "convertedColor"
     * @param convertedColor defines the Color3 object where to store the linear space version
     * @returns the unmodified Color3
     */
    toLinearSpaceToRef(convertedColor) {
        convertedColor.r = Math.pow(this.r, _math_constants__WEBPACK_IMPORTED_MODULE_1__["ToLinearSpace"]);
        convertedColor.g = Math.pow(this.g, _math_constants__WEBPACK_IMPORTED_MODULE_1__["ToLinearSpace"]);
        convertedColor.b = Math.pow(this.b, _math_constants__WEBPACK_IMPORTED_MODULE_1__["ToLinearSpace"]);
        return this;
    }
    /**
     * Computes a new Color3 converted from the current one to gamma space
     * @returns a new Color3 object
     */
    toGammaSpace() {
        var convertedColor = new Color3();
        this.toGammaSpaceToRef(convertedColor);
        return convertedColor;
    }
    /**
     * Converts the Color3 values to gamma space and stores the result in "convertedColor"
     * @param convertedColor defines the Color3 object where to store the gamma space version
     * @returns the unmodified Color3
     */
    toGammaSpaceToRef(convertedColor) {
        convertedColor.r = Math.pow(this.r, _math_constants__WEBPACK_IMPORTED_MODULE_1__["ToGammaSpace"]);
        convertedColor.g = Math.pow(this.g, _math_constants__WEBPACK_IMPORTED_MODULE_1__["ToGammaSpace"]);
        convertedColor.b = Math.pow(this.b, _math_constants__WEBPACK_IMPORTED_MODULE_1__["ToGammaSpace"]);
        return this;
    }
    /**
     * Convert Hue, saturation and value to a Color3 (RGB)
     * @param hue defines the hue
     * @param saturation defines the saturation
     * @param value defines the value
     * @param result defines the Color3 where to store the RGB values
     */
    static HSVtoRGBToRef(hue, saturation, value, result) {
        var chroma = value * saturation;
        var h = hue / 60;
        var x = chroma * (1 - Math.abs((h % 2) - 1));
        var r = 0;
        var g = 0;
        var b = 0;
        if (h >= 0 && h <= 1) {
            r = chroma;
            g = x;
        }
        else if (h >= 1 && h <= 2) {
            r = x;
            g = chroma;
        }
        else if (h >= 2 && h <= 3) {
            g = chroma;
            b = x;
        }
        else if (h >= 3 && h <= 4) {
            g = x;
            b = chroma;
        }
        else if (h >= 4 && h <= 5) {
            r = x;
            b = chroma;
        }
        else if (h >= 5 && h <= 6) {
            r = chroma;
            b = x;
        }
        var m = value - chroma;
        result.set((r + m), (g + m), (b + m));
    }
    /**
     * Creates a new Color3 from the string containing valid hexadecimal values
     * @param hex defines a string containing valid hexadecimal values
     * @returns a new Color3 object
     */
    static FromHexString(hex) {
        if (hex.substring(0, 1) !== "#" || hex.length !== 7) {
            return new Color3(0, 0, 0);
        }
        var r = parseInt(hex.substring(1, 3), 16);
        var g = parseInt(hex.substring(3, 5), 16);
        var b = parseInt(hex.substring(5, 7), 16);
        return Color3.FromInts(r, g, b);
    }
    /**
     * Creates a new Color3 from the starting index of the given array
     * @param array defines the source array
     * @param offset defines an offset in the source array
     * @returns a new Color3 object
     */
    static FromArray(array, offset = 0) {
        return new Color3(array[offset], array[offset + 1], array[offset + 2]);
    }
    /**
     * Creates a new Color3 from the starting index element of the given array
     * @param array defines the source array to read from
     * @param offset defines the offset in the source array
     * @param result defines the target Color3 object
     */
    static FromArrayToRef(array, offset = 0, result) {
        result.r = array[offset];
        result.g = array[offset + 1];
        result.b = array[offset + 2];
    }
    /**
     * Creates a new Color3 from integer values (< 256)
     * @param r defines the red component to read from (value between 0 and 255)
     * @param g defines the green component to read from (value between 0 and 255)
     * @param b defines the blue component to read from (value between 0 and 255)
     * @returns a new Color3 object
     */
    static FromInts(r, g, b) {
        return new Color3(r / 255.0, g / 255.0, b / 255.0);
    }
    /**
     * Creates a new Color3 with values linearly interpolated of "amount" between the start Color3 and the end Color3
     * @param start defines the start Color3 value
     * @param end defines the end Color3 value
     * @param amount defines the gradient value between start and end
     * @returns a new Color3 object
     */
    static Lerp(start, end, amount) {
        var result = new Color3(0.0, 0.0, 0.0);
        Color3.LerpToRef(start, end, amount, result);
        return result;
    }
    /**
     * Creates a new Color3 with values linearly interpolated of "amount" between the start Color3 and the end Color3
     * @param left defines the start value
     * @param right defines the end value
     * @param amount defines the gradient factor
     * @param result defines the Color3 object where to store the result
     */
    static LerpToRef(left, right, amount, result) {
        result.r = left.r + ((right.r - left.r) * amount);
        result.g = left.g + ((right.g - left.g) * amount);
        result.b = left.b + ((right.b - left.b) * amount);
    }
    /**
     * Returns a Color3 value containing a red color
     * @returns a new Color3 object
     */
    static Red() { return new Color3(1, 0, 0); }
    /**
     * Returns a Color3 value containing a green color
     * @returns a new Color3 object
     */
    static Green() { return new Color3(0, 1, 0); }
    /**
     * Returns a Color3 value containing a blue color
     * @returns a new Color3 object
     */
    static Blue() { return new Color3(0, 0, 1); }
    /**
     * Returns a Color3 value containing a black color
     * @returns a new Color3 object
     */
    static Black() { return new Color3(0, 0, 0); }
    /**
      * Gets a Color3 value containing a black color that must not be updated
      */
    static get BlackReadOnly() {
        return Color3._BlackReadOnly;
    }
    /**
     * Returns a Color3 value containing a white color
     * @returns a new Color3 object
     */
    static White() { return new Color3(1, 1, 1); }
    /**
     * Returns a Color3 value containing a purple color
     * @returns a new Color3 object
     */
    static Purple() { return new Color3(0.5, 0, 0.5); }
    /**
     * Returns a Color3 value containing a magenta color
     * @returns a new Color3 object
     */
    static Magenta() { return new Color3(1, 0, 1); }
    /**
     * Returns a Color3 value containing a yellow color
     * @returns a new Color3 object
     */
    static Yellow() { return new Color3(1, 1, 0); }
    /**
     * Returns a Color3 value containing a gray color
     * @returns a new Color3 object
     */
    static Gray() { return new Color3(0.5, 0.5, 0.5); }
    /**
     * Returns a Color3 value containing a teal color
     * @returns a new Color3 object
     */
    static Teal() { return new Color3(0, 1.0, 1.0); }
    /**
     * Returns a Color3 value containing a random color
     * @returns a new Color3 object
     */
    static Random() { return new Color3(Math.random(), Math.random(), Math.random()); }
}
// Statics
Color3._BlackReadOnly = Color3.Black();
/**
 * Class used to hold a RBGA color
 */
class Color4 {
    /**
     * Creates a new Color4 object from red, green, blue values, all between 0 and 1
     * @param r defines the red component (between 0 and 1, default is 0)
     * @param g defines the green component (between 0 and 1, default is 0)
     * @param b defines the blue component (between 0 and 1, default is 0)
     * @param a defines the alpha component (between 0 and 1, default is 1)
     */
    constructor(
    /**
     * Defines the red component (between 0 and 1, default is 0)
     */
    r = 0, 
    /**
     * Defines the green component (between 0 and 1, default is 0)
     */
    g = 0, 
    /**
     * Defines the blue component (between 0 and 1, default is 0)
     */
    b = 0, 
    /**
     * Defines the alpha component (between 0 and 1, default is 1)
     */
    a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    // Operators
    /**
     * Adds in place the given Color4 values to the current Color4 object
     * @param right defines the second operand
     * @returns the current updated Color4 object
     */
    addInPlace(right) {
        this.r += right.r;
        this.g += right.g;
        this.b += right.b;
        this.a += right.a;
        return this;
    }
    /**
     * Creates a new array populated with 4 numeric elements : red, green, blue, alpha values
     * @returns the new array
     */
    asArray() {
        var result = new Array();
        this.toArray(result, 0);
        return result;
    }
    /**
     * Stores from the starting index in the given array the Color4 successive values
     * @param array defines the array where to store the r,g,b components
     * @param index defines an optional index in the target array to define where to start storing values
     * @returns the current Color4 object
     */
    toArray(array, index = 0) {
        array[index] = this.r;
        array[index + 1] = this.g;
        array[index + 2] = this.b;
        array[index + 3] = this.a;
        return this;
    }
    /**
     * Update the current color with values stored in an array from the starting index of the given array
     * @param array defines the source array
     * @param offset defines an offset in the source array
     * @returns the current Color4 object
     */
    fromArray(array, offset = 0) {
        Color4.FromArrayToRef(array, offset, this);
        return this;
    }
    /**
     * Determines equality between Color4 objects
     * @param otherColor defines the second operand
     * @returns true if the rgba values are equal to the given ones
     */
    equals(otherColor) {
        return otherColor && this.r === otherColor.r && this.g === otherColor.g && this.b === otherColor.b && this.a === otherColor.a;
    }
    /**
     * Creates a new Color4 set with the added values of the current Color4 and of the given one
     * @param right defines the second operand
     * @returns a new Color4 object
     */
    add(right) {
        return new Color4(this.r + right.r, this.g + right.g, this.b + right.b, this.a + right.a);
    }
    /**
     * Creates a new Color4 set with the subtracted values of the given one from the current Color4
     * @param right defines the second operand
     * @returns a new Color4 object
     */
    subtract(right) {
        return new Color4(this.r - right.r, this.g - right.g, this.b - right.b, this.a - right.a);
    }
    /**
     * Subtracts the given ones from the current Color4 values and stores the results in "result"
     * @param right defines the second operand
     * @param result defines the Color4 object where to store the result
     * @returns the current Color4 object
     */
    subtractToRef(right, result) {
        result.r = this.r - right.r;
        result.g = this.g - right.g;
        result.b = this.b - right.b;
        result.a = this.a - right.a;
        return this;
    }
    /**
     * Creates a new Color4 with the current Color4 values multiplied by scale
     * @param scale defines the scaling factor to apply
     * @returns a new Color4 object
     */
    scale(scale) {
        return new Color4(this.r * scale, this.g * scale, this.b * scale, this.a * scale);
    }
    /**
     * Multiplies the current Color4 values by scale and stores the result in "result"
     * @param scale defines the scaling factor to apply
     * @param result defines the Color4 object where to store the result
     * @returns the current unmodified Color4
     */
    scaleToRef(scale, result) {
        result.r = this.r * scale;
        result.g = this.g * scale;
        result.b = this.b * scale;
        result.a = this.a * scale;
        return this;
    }
    /**
     * Scale the current Color4 values by a factor and add the result to a given Color4
     * @param scale defines the scale factor
     * @param result defines the Color4 object where to store the result
     * @returns the unmodified current Color4
     */
    scaleAndAddToRef(scale, result) {
        result.r += this.r * scale;
        result.g += this.g * scale;
        result.b += this.b * scale;
        result.a += this.a * scale;
        return this;
    }
    /**
     * Clamps the rgb values by the min and max values and stores the result into "result"
     * @param min defines minimum clamping value (default is 0)
     * @param max defines maximum clamping value (default is 1)
     * @param result defines color to store the result into.
     * @returns the cuurent Color4
     */
    clampToRef(min = 0, max = 1, result) {
        result.r = _math_scalar__WEBPACK_IMPORTED_MODULE_0__["Scalar"].Clamp(this.r, min, max);
        result.g = _math_scalar__WEBPACK_IMPORTED_MODULE_0__["Scalar"].Clamp(this.g, min, max);
        result.b = _math_scalar__WEBPACK_IMPORTED_MODULE_0__["Scalar"].Clamp(this.b, min, max);
        result.a = _math_scalar__WEBPACK_IMPORTED_MODULE_0__["Scalar"].Clamp(this.a, min, max);
        return this;
    }
    /**
      * Multipy an Color4 value by another and return a new Color4 object
      * @param color defines the Color4 value to multiply by
      * @returns a new Color4 object
      */
    multiply(color) {
        return new Color4(this.r * color.r, this.g * color.g, this.b * color.b, this.a * color.a);
    }
    /**
     * Multipy a Color4 value by another and push the result in a reference value
     * @param color defines the Color4 value to multiply by
     * @param result defines the Color4 to fill the result in
     * @returns the result Color4
     */
    multiplyToRef(color, result) {
        result.r = this.r * color.r;
        result.g = this.g * color.g;
        result.b = this.b * color.b;
        result.a = this.a * color.a;
        return result;
    }
    /**
     * Creates a string with the Color4 current values
     * @returns the string representation of the Color4 object
     */
    toString() {
        return "{R: " + this.r + " G:" + this.g + " B:" + this.b + " A:" + this.a + "}";
    }
    /**
     * Returns the string "Color4"
     * @returns "Color4"
     */
    getClassName() {
        return "Color4";
    }
    /**
     * Compute the Color4 hash code
     * @returns an unique number that can be used to hash Color4 objects
     */
    getHashCode() {
        let hash = (this.r * 255) | 0;
        hash = (hash * 397) ^ ((this.g * 255) | 0);
        hash = (hash * 397) ^ ((this.b * 255) | 0);
        hash = (hash * 397) ^ ((this.a * 255) | 0);
        return hash;
    }
    /**
     * Creates a new Color4 copied from the current one
     * @returns a new Color4 object
     */
    clone() {
        return new Color4(this.r, this.g, this.b, this.a);
    }
    /**
     * Copies the given Color4 values into the current one
     * @param source defines the source Color4 object
     * @returns the current updated Color4 object
     */
    copyFrom(source) {
        this.r = source.r;
        this.g = source.g;
        this.b = source.b;
        this.a = source.a;
        return this;
    }
    /**
     * Copies the given float values into the current one
     * @param r defines the red component to read from
     * @param g defines the green component to read from
     * @param b defines the blue component to read from
     * @param a defines the alpha component to read from
     * @returns the current updated Color4 object
     */
    copyFromFloats(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        return this;
    }
    /**
     * Copies the given float values into the current one
     * @param r defines the red component to read from
     * @param g defines the green component to read from
     * @param b defines the blue component to read from
     * @param a defines the alpha component to read from
     * @returns the current updated Color4 object
     */
    set(r, g, b, a) {
        return this.copyFromFloats(r, g, b, a);
    }
    /**
     * Compute the Color4 hexadecimal code as a string
     * @param returnAsColor3 defines if the string should only contains RGB values (off by default)
     * @returns a string containing the hexadecimal representation of the Color4 object
     */
    toHexString(returnAsColor3 = false) {
        var intR = (this.r * 255) | 0;
        var intG = (this.g * 255) | 0;
        var intB = (this.b * 255) | 0;
        if (returnAsColor3) {
            return "#" + _math_scalar__WEBPACK_IMPORTED_MODULE_0__["Scalar"].ToHex(intR) + _math_scalar__WEBPACK_IMPORTED_MODULE_0__["Scalar"].ToHex(intG) + _math_scalar__WEBPACK_IMPORTED_MODULE_0__["Scalar"].ToHex(intB);
        }
        var intA = (this.a * 255) | 0;
        return "#" + _math_scalar__WEBPACK_IMPORTED_MODULE_0__["Scalar"].ToHex(intR) + _math_scalar__WEBPACK_IMPORTED_MODULE_0__["Scalar"].ToHex(intG) + _math_scalar__WEBPACK_IMPORTED_MODULE_0__["Scalar"].ToHex(intB) + _math_scalar__WEBPACK_IMPORTED_MODULE_0__["Scalar"].ToHex(intA);
    }
    /**
     * Computes a new Color4 converted from the current one to linear space
     * @returns a new Color4 object
     */
    toLinearSpace() {
        var convertedColor = new Color4();
        this.toLinearSpaceToRef(convertedColor);
        return convertedColor;
    }
    /**
     * Converts the Color4 values to linear space and stores the result in "convertedColor"
     * @param convertedColor defines the Color4 object where to store the linear space version
     * @returns the unmodified Color4
     */
    toLinearSpaceToRef(convertedColor) {
        convertedColor.r = Math.pow(this.r, _math_constants__WEBPACK_IMPORTED_MODULE_1__["ToLinearSpace"]);
        convertedColor.g = Math.pow(this.g, _math_constants__WEBPACK_IMPORTED_MODULE_1__["ToLinearSpace"]);
        convertedColor.b = Math.pow(this.b, _math_constants__WEBPACK_IMPORTED_MODULE_1__["ToLinearSpace"]);
        convertedColor.a = this.a;
        return this;
    }
    /**
     * Computes a new Color4 converted from the current one to gamma space
     * @returns a new Color4 object
     */
    toGammaSpace() {
        var convertedColor = new Color4();
        this.toGammaSpaceToRef(convertedColor);
        return convertedColor;
    }
    /**
     * Converts the Color4 values to gamma space and stores the result in "convertedColor"
     * @param convertedColor defines the Color4 object where to store the gamma space version
     * @returns the unmodified Color4
     */
    toGammaSpaceToRef(convertedColor) {
        convertedColor.r = Math.pow(this.r, _math_constants__WEBPACK_IMPORTED_MODULE_1__["ToGammaSpace"]);
        convertedColor.g = Math.pow(this.g, _math_constants__WEBPACK_IMPORTED_MODULE_1__["ToGammaSpace"]);
        convertedColor.b = Math.pow(this.b, _math_constants__WEBPACK_IMPORTED_MODULE_1__["ToGammaSpace"]);
        convertedColor.a = this.a;
        return this;
    }
    // Statics
    /**
     * Creates a new Color4 from the string containing valid hexadecimal values
     * @param hex defines a string containing valid hexadecimal values
     * @returns a new Color4 object
     */
    static FromHexString(hex) {
        if (hex.substring(0, 1) !== "#" || hex.length !== 9) {
            return new Color4(0.0, 0.0, 0.0, 0.0);
        }
        var r = parseInt(hex.substring(1, 3), 16);
        var g = parseInt(hex.substring(3, 5), 16);
        var b = parseInt(hex.substring(5, 7), 16);
        var a = parseInt(hex.substring(7, 9), 16);
        return Color4.FromInts(r, g, b, a);
    }
    /**
     * Creates a new Color4 object set with the linearly interpolated values of "amount" between the left Color4 object and the right Color4 object
     * @param left defines the start value
     * @param right defines the end value
     * @param amount defines the gradient factor
     * @returns a new Color4 object
     */
    static Lerp(left, right, amount) {
        var result = new Color4(0.0, 0.0, 0.0, 0.0);
        Color4.LerpToRef(left, right, amount, result);
        return result;
    }
    /**
     * Set the given "result" with the linearly interpolated values of "amount" between the left Color4 object and the right Color4 object
     * @param left defines the start value
     * @param right defines the end value
     * @param amount defines the gradient factor
     * @param result defines the Color4 object where to store data
     */
    static LerpToRef(left, right, amount, result) {
        result.r = left.r + (right.r - left.r) * amount;
        result.g = left.g + (right.g - left.g) * amount;
        result.b = left.b + (right.b - left.b) * amount;
        result.a = left.a + (right.a - left.a) * amount;
    }
    /**
     * Creates a new Color4 from a Color3 and an alpha value
     * @param color3 defines the source Color3 to read from
     * @param alpha defines the alpha component (1.0 by default)
     * @returns a new Color4 object
     */
    static FromColor3(color3, alpha = 1.0) {
        return new Color4(color3.r, color3.g, color3.b, alpha);
    }
    /**
     * Creates a new Color4 from the starting index element of the given array
     * @param array defines the source array to read from
     * @param offset defines the offset in the source array
     * @returns a new Color4 object
     */
    static FromArray(array, offset = 0) {
        return new Color4(array[offset], array[offset + 1], array[offset + 2], array[offset + 3]);
    }
    /**
     * Creates a new Color4 from the starting index element of the given array
     * @param array defines the source array to read from
     * @param offset defines the offset in the source array
     * @param result defines the target Color4 object
     */
    static FromArrayToRef(array, offset = 0, result) {
        result.r = array[offset];
        result.g = array[offset + 1];
        result.b = array[offset + 2];
        result.a = array[offset + 3];
    }
    /**
     * Creates a new Color3 from integer values (< 256)
     * @param r defines the red component to read from (value between 0 and 255)
     * @param g defines the green component to read from (value between 0 and 255)
     * @param b defines the blue component to read from (value between 0 and 255)
     * @param a defines the alpha component to read from (value between 0 and 255)
     * @returns a new Color3 object
     */
    static FromInts(r, g, b, a) {
        return new Color4(r / 255.0, g / 255.0, b / 255.0, a / 255.0);
    }
    /**
     * Check the content of a given array and convert it to an array containing RGBA data
     * If the original array was already containing count * 4 values then it is returned directly
     * @param colors defines the array to check
     * @param count defines the number of RGBA data to expect
     * @returns an array containing count * 4 values (RGBA)
     */
    static CheckColors4(colors, count) {
        // Check if color3 was used
        if (colors.length === count * 3) {
            var colors4 = [];
            for (var index = 0; index < colors.length; index += 3) {
                var newIndex = (index / 3) * 4;
                colors4[newIndex] = colors[index];
                colors4[newIndex + 1] = colors[index + 1];
                colors4[newIndex + 2] = colors[index + 2];
                colors4[newIndex + 3] = 1.0;
            }
            return colors4;
        }
        return colors;
    }
}
/**
 * @hidden
 */
class TmpColors {
}
TmpColors.Color3 = _misc_arrayTools__WEBPACK_IMPORTED_MODULE_2__["ArrayTools"].BuildArray(3, Color3.Black);
TmpColors.Color4 = _misc_arrayTools__WEBPACK_IMPORTED_MODULE_2__["ArrayTools"].BuildArray(3, () => new Color4(0, 0, 0, 0));
_misc_typeStore__WEBPACK_IMPORTED_MODULE_3__["_TypeStore"].RegisteredTypes["BABYLON.Color3"] = Color3;
_misc_typeStore__WEBPACK_IMPORTED_MODULE_3__["_TypeStore"].RegisteredTypes["BABYLON.Color4"] = Color4;


/***/ }),

/***/ "./src/maths/math.constants.ts":
/*!*************************************!*\
  !*** ./src/maths/math.constants.ts ***!
  \*************************************/
/*! exports provided: ToGammaSpace, ToLinearSpace, DEG2RAD, RAD2DEG, Epsilon */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToGammaSpace", function() { return ToGammaSpace; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToLinearSpace", function() { return ToLinearSpace; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEG2RAD", function() { return DEG2RAD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RAD2DEG", function() { return RAD2DEG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Epsilon", function() { return Epsilon; });
/**
 * Constant used to convert a value to gamma space
 * @ignorenaming
 */
const ToGammaSpace = 1 / 2.2;
/**
 * Constant used to convert a value to linear space
 * @ignorenaming
 */
const ToLinearSpace = 2.2;
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;
/**
 * Constant used to define the minimal number value in Babylon.js
 * @ignorenaming
 */
let Epsilon = 0.001;



/***/ }),

/***/ "./src/maths/math.euler.ts":
/*!*********************************!*\
  !*** ./src/maths/math.euler.ts ***!
  \*********************************/
/*! exports provided: Euler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Euler", function() { return Euler; });
/* harmony import */ var _math_quat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.quat */ "./src/maths/math.quat.ts");
/* harmony import */ var _math_vec3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./math.vec3 */ "./src/maths/math.vec3.ts");
/* harmony import */ var _math_mat4__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./math.mat4 */ "./src/maths/math.mat4.ts");
/* harmony import */ var _math_tool__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./math.tool */ "./src/maths/math.tool.ts");




const _matrix = /*@__PURE__*/ new _math_mat4__WEBPACK_IMPORTED_MODULE_2__["Mat4"]();
const _quaternion = /*@__PURE__*/ new _math_quat__WEBPACK_IMPORTED_MODULE_0__["Quat"]();
class Euler {
    constructor(x = 0, y = 0, z = 0, order = Euler.DefaultOrder) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._order = order;
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
        this._onChangeCallback();
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
        this._onChangeCallback();
    }
    get z() {
        return this._z;
    }
    set z(value) {
        this._z = value;
        this._onChangeCallback();
    }
    get order() {
        return this._order;
    }
    set order(value) {
        this._order = value;
        this._onChangeCallback();
    }
    set(x, y, z, order = this._order) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._order = order;
        this._onChangeCallback();
        return this;
    }
    clone() {
        return new Euler(this._x, this._y, this._z, this._order);
    }
    copy(euler) {
        this._x = euler._x;
        this._y = euler._y;
        this._z = euler._z;
        this._order = euler._order;
        this._onChangeCallback();
        return this;
    }
    setFromRotationMatrix(m, order = this._order, update = true) {
        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
        const te = m.data;
        const m11 = te[0], m12 = te[4], m13 = te[8];
        const m21 = te[1], m22 = te[5], m23 = te[9];
        const m31 = te[2], m32 = te[6], m33 = te[10];
        switch (order) {
            case 'XYZ':
                this._y = Math.asin(_math_tool__WEBPACK_IMPORTED_MODULE_3__["MathTool"].clamp(m13, -1, 1));
                if (Math.abs(m13) < 0.9999999) {
                    this._x = Math.atan2(-m23, m33);
                    this._z = Math.atan2(-m12, m11);
                }
                else {
                    this._x = Math.atan2(m32, m22);
                    this._z = 0;
                }
                break;
            case 'YXZ':
                this._x = Math.asin(-_math_tool__WEBPACK_IMPORTED_MODULE_3__["MathTool"].clamp(m23, -1, 1));
                if (Math.abs(m23) < 0.9999999) {
                    this._y = Math.atan2(m13, m33);
                    this._z = Math.atan2(m21, m22);
                }
                else {
                    this._y = Math.atan2(-m31, m11);
                    this._z = 0;
                }
                break;
            case 'ZXY':
                this._x = Math.asin(_math_tool__WEBPACK_IMPORTED_MODULE_3__["MathTool"].clamp(m32, -1, 1));
                if (Math.abs(m32) < 0.9999999) {
                    this._y = Math.atan2(-m31, m33);
                    this._z = Math.atan2(-m12, m22);
                }
                else {
                    this._y = 0;
                    this._z = Math.atan2(m21, m11);
                }
                break;
            case 'ZYX':
                this._y = Math.asin(-_math_tool__WEBPACK_IMPORTED_MODULE_3__["MathTool"].clamp(m31, -1, 1));
                if (Math.abs(m31) < 0.9999999) {
                    this._x = Math.atan2(m32, m33);
                    this._z = Math.atan2(m21, m11);
                }
                else {
                    this._x = 0;
                    this._z = Math.atan2(-m12, m22);
                }
                break;
            case 'YZX':
                this._z = Math.asin(_math_tool__WEBPACK_IMPORTED_MODULE_3__["MathTool"].clamp(m21, -1, 1));
                if (Math.abs(m21) < 0.9999999) {
                    this._x = Math.atan2(-m23, m22);
                    this._y = Math.atan2(-m31, m11);
                }
                else {
                    this._x = 0;
                    this._y = Math.atan2(m13, m33);
                }
                break;
            case 'XZY':
                this._z = Math.asin(-_math_tool__WEBPACK_IMPORTED_MODULE_3__["MathTool"].clamp(m12, -1, 1));
                if (Math.abs(m12) < 0.9999999) {
                    this._x = Math.atan2(m32, m22);
                    this._y = Math.atan2(m13, m11);
                }
                else {
                    this._x = Math.atan2(-m23, m33);
                    this._y = 0;
                }
                break;
            default:
                console.warn('THREE.Euler: .setFromRotationMatrix() encountered an unknown order: ' + order);
        }
        this._order = order;
        if (update === true)
            this._onChangeCallback();
        return this;
    }
    setFromQuaternion(q, order, update) {
        _matrix.makeRotationFromQuaternion(q);
        return this.setFromRotationMatrix(_matrix, order, update);
    }
    setFromVector3(v, order = this._order) {
        return this.set(v.x, v.y, v.z, order);
    }
    reorder(newOrder) {
        // WARNING: this discards revolution information -bhouston
        _quaternion.setFromEuler(this);
        return this.setFromQuaternion(_quaternion, newOrder);
    }
    equals(euler) {
        return (euler._x === this._x) && (euler._y === this._y) && (euler._z === this._z) && (euler._order === this._order);
    }
    fromArray(array) {
        this._x = array[0];
        this._y = array[1];
        this._z = array[2];
        if (array[3] !== undefined)
            this._order = array[3];
        this._onChangeCallback();
        return this;
    }
    toArray(array, offset = 0) {
        array[offset] = this._x;
        array[offset + 1] = this._y;
        array[offset + 2] = this._z;
        array[offset + 3] = this._order;
        return array;
    }
    toVector3(optionalResult) {
        if (optionalResult) {
            return optionalResult.set(this._x, this._y, this._z);
        }
        else {
            return new _math_vec3__WEBPACK_IMPORTED_MODULE_1__["Vec3"](this._x, this._y, this._z);
        }
    }
    _onChange(callback) {
        this._onChangeCallback = callback;
        return this;
    }
    _onChangeCallback() { }
}
Euler.prototype.isEuler = true;
Euler.DefaultOrder = 'XYZ';
Euler.RotationOrders = ['XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX'];



/***/ }),

/***/ "./src/maths/math.mat3.ts":
/*!********************************!*\
  !*** ./src/maths/math.mat3.ts ***!
  \********************************/
/*! exports provided: Mat3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Mat3", function() { return Mat3; });
/* harmony import */ var _math_vec3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.vec3 */ "./src/maths/math.vec3.ts");

/**
 * A 3x3 matrix.
 */
class Mat3 {
    /**
     * Create a new Mat3 instance. It is initialized to the identity matrix.
     */
    constructor() {
        // Create an identity matrix. Note that a new Float32Array has all elements set
        // to zero by default, so we only need to set the relevant elements to one.
        const data = new Float32Array(9);
        data[0] = data[4] = data[8] = 1;
        /**
         * Matrix elements in the form of a flat array.
         *
         * @type {Float32Array}
         */
        this.data = data;
    }
    invert() {
        const te = this.data, n11 = te[0], n21 = te[1], n31 = te[2], n12 = te[3], n22 = te[4], n32 = te[5], n13 = te[6], n23 = te[7], n33 = te[8], t11 = n33 * n22 - n32 * n23, t12 = n32 * n13 - n33 * n12, t13 = n23 * n12 - n22 * n13, det = n11 * t11 + n21 * t12 + n31 * t13;
        if (det === 0)
            return this.set([0, 0, 0, 0, 0, 0, 0, 0, 0]);
        const detInv = 1 / det;
        te[0] = t11 * detInv;
        te[1] = (n31 * n23 - n33 * n21) * detInv;
        te[2] = (n32 * n21 - n31 * n22) * detInv;
        te[3] = t12 * detInv;
        te[4] = (n33 * n11 - n31 * n13) * detInv;
        te[5] = (n31 * n12 - n32 * n11) * detInv;
        te[6] = t13 * detInv;
        te[7] = (n21 * n13 - n23 * n11) * detInv;
        te[8] = (n22 * n11 - n21 * n12) * detInv;
        return this;
    }
    setFromMatrix4(m) {
        const me = m.data;
        this.set([me[0], me[4], me[8], me[1], me[5], me[9], me[2], me[6], me[10]]);
        return this;
    }
    /**
     * Creates a duplicate of the specified matrix.
     *
     * @returns {Mat3} A duplicate matrix.
     * @example
     * var src = new pc.Mat3().translate(10, 20, 30);
     * var dst = src.clone();
     * console.log("The two matrices are " + (src.equals(dst) ? "equal" : "different"));
     */
    clone() {
        return new Mat3().copy(this);
    }
    /**
     * Copies the contents of a source 3x3 matrix to a destination 3x3 matrix.
     *
     * @param {Mat3} rhs - A 3x3 matrix to be copied.
     * @returns {Mat3} Self for chaining.
     * @example
     * var src = new pc.Mat3().translate(10, 20, 30);
     * var dst = new pc.Mat3();
     * dst.copy(src);
     * console.log("The two matrices are " + (src.equals(dst) ? "equal" : "different"));
     */
    copy(rhs) {
        const src = rhs.data;
        const dst = this.data;
        dst[0] = src[0];
        dst[1] = src[1];
        dst[2] = src[2];
        dst[3] = src[3];
        dst[4] = src[4];
        dst[5] = src[5];
        dst[6] = src[6];
        dst[7] = src[7];
        dst[8] = src[8];
        return this;
    }
    /**
     * Copies the contents of a source array[9] to a destination 3x3 matrix.
     *
     * @param {number[]} src - An array[9] to be copied.
     * @returns {Mat3} Self for chaining.
     * @example
     * var dst = new pc.Mat3();
     * dst.set([0, 1, 2, 3, 4, 5, 6, 7, 8]);
     */
    set(src) {
        const dst = this.data;
        dst[0] = src[0];
        dst[1] = src[1];
        dst[2] = src[2];
        dst[3] = src[3];
        dst[4] = src[4];
        dst[5] = src[5];
        dst[6] = src[6];
        dst[7] = src[7];
        dst[8] = src[8];
        return this;
    }
    /**
     * Reports whether two matrices are equal.
     *
     * @param {Mat3} rhs - The other matrix.
     * @returns {boolean} True if the matrices are equal and false otherwise.
     * @example
     * var a = new pc.Mat3().translate(10, 20, 30);
     * var b = new pc.Mat3();
     * console.log("The two matrices are " + (a.equals(b) ? "equal" : "different"));
     */
    equals(rhs) {
        const l = this.data;
        const r = rhs.data;
        return l[0] === r[0] && l[1] === r[1] && l[2] === r[2] && l[3] === r[3] && l[4] === r[4] && l[5] === r[5] && l[6] === r[6] && l[7] === r[7] && l[8] === r[8];
    }
    /**
     * Reports whether the specified matrix is the identity matrix.
     *
     * @returns {boolean} True if the matrix is identity and false otherwise.
     * @example
     * var m = new pc.Mat3();
     * console.log("The matrix is " + (m.isIdentity() ? "identity" : "not identity"));
     */
    isIdentity() {
        const m = this.data;
        return m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 0 && m[4] === 1 && m[5] === 0 && m[6] === 0 && m[7] === 0 && m[8] === 1;
    }
    /**
     * Sets the matrix to the identity matrix.
     *
     * @returns {Mat3} Self for chaining.
     * @example
     * m.setIdentity();
     * console.log("The matrix is " + (m.isIdentity() ? "identity" : "not identity"));
     */
    setIdentity() {
        const m = this.data;
        m[0] = 1;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 1;
        m[5] = 0;
        m[6] = 0;
        m[7] = 0;
        m[8] = 1;
        return this;
    }
    /**
     * Converts the matrix to string form.
     *
     * @returns {string} The matrix in string form.
     * @example
     * var m = new pc.Mat3();
     * // Outputs [1, 0, 0, 0, 1, 0, 0, 0, 1]
     * console.log(m.toString());
     */
    toString() {
        let t = "[";
        for (let i = 0; i < 9; i++) {
            t += this.data[i];
            t += i !== 8 ? ", " : "";
        }
        t += "]";
        return t;
    }
    /**
     * Generates the transpose of the specified 3x3 matrix.
     *
     * @returns {Mat3} Self for chaining.
     * @example
     * var m = new pc.Mat3();
     *
     * // Transpose in place
     * m.transpose();
     */
    transpose() {
        const m = this.data;
        let tmp;
        tmp = m[1];
        m[1] = m[3];
        m[3] = tmp;
        tmp = m[2];
        m[2] = m[6];
        m[6] = tmp;
        tmp = m[5];
        m[5] = m[7];
        m[7] = tmp;
        return this;
    }
    /**
     * Converts the specified 4x4 matrix to a Mat3.
     *
     * @param {Mat4} m - The 4x4 matrix to convert.
     * @returns {Mat3} Self for chaining.
     */
    setFromMat4(m) {
        const src = m.data;
        const dst = this.data;
        dst[0] = src[0];
        dst[1] = src[1];
        dst[2] = src[2];
        dst[3] = src[4];
        dst[4] = src[5];
        dst[5] = src[6];
        dst[6] = src[8];
        dst[7] = src[9];
        dst[8] = src[10];
        return this;
    }
    /**
     * Transforms a 3-dimensional vector by a 3x3 matrix.
     *
     * @param {Vec3} vec - The 3-dimensional vector to be transformed.
     * @param {Vec3} [res] - An optional 3-dimensional vector to receive the result of the
     * transformation.
     * @returns {Vec3} The input vector v transformed by the current instance.
     */
    transformVector(vec, res = new _math_vec3__WEBPACK_IMPORTED_MODULE_0__["Vec3"]()) {
        const m = this.data;
        const x = vec.x;
        const y = vec.y;
        const z = vec.z;
        res.x = x * m[0] + y * m[3] + z * m[6];
        res.y = x * m[1] + y * m[4] + z * m[7];
        res.z = x * m[2] + y * m[5] + z * m[8];
        return res;
    }
    getNormalMatrix(matrix4) {
        return this.setFromMatrix4(matrix4).invert().transpose();
    }
}
/**
 * A constant matrix set to the identity.
 *
 * @type {Mat3}
 * @readonly
 */
Mat3.IDENTITY = Object.freeze(new Mat3());
/**
 * A constant matrix with all elements set to 0.
 *
 * @type {Mat3}
 * @readonly
 */
Mat3.ZERO = Object.freeze(new Mat3().set([0, 0, 0, 0, 0, 0, 0, 0, 0]));



/***/ }),

/***/ "./src/maths/math.mat4.ts":
/*!********************************!*\
  !*** ./src/maths/math.mat4.ts ***!
  \********************************/
/*! exports provided: Mat4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Mat4", function() { return Mat4; });
/* harmony import */ var _math_tool__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.tool */ "./src/maths/math.tool.ts");
/* harmony import */ var _math_vec2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./math.vec2 */ "./src/maths/math.vec2.ts");
/* harmony import */ var _math_vec3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./math.vec3 */ "./src/maths/math.vec3.ts");
/* harmony import */ var _math_vec4__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./math.vec4 */ "./src/maths/math.vec4.ts");
/** @typedef {import('./quat.js').Quat} Quat */




const _halfSize = new _math_vec2__WEBPACK_IMPORTED_MODULE_1__["Vec2"]();
const x = new _math_vec3__WEBPACK_IMPORTED_MODULE_2__["Vec3"]();
const y = new _math_vec3__WEBPACK_IMPORTED_MODULE_2__["Vec3"]();
const z = new _math_vec3__WEBPACK_IMPORTED_MODULE_2__["Vec3"]();
const scale = new _math_vec3__WEBPACK_IMPORTED_MODULE_2__["Vec3"]();
const _v1 = /*@__PURE__*/ new _math_vec3__WEBPACK_IMPORTED_MODULE_2__["Vec3"]();
/**
 * A 4x4 matrix.
 */
class Mat4 {
    /**
     * Create a new Mat4 instance. It is initialized to the identity matrix.
     */
    constructor() {
        // Create an identity matrix. Note that a new Float32Array has all elements set
        // to zero by default, so we only need to set the relevant elements to one.
        const data = new Float32Array(16);
        data[0] = data[5] = data[10] = data[15] = 1;
        /**
         * Matrix elements in the form of a flat array.
         *
         * @type {Float32Array}
         */
        this.data = data;
    }
    // 左手坐标系
    makePerspectiveLH(left, right, top, bottom, near, far) {
        if (far === undefined) {
            console.warn("THREE.Matrix4: .makePerspective() has been redefined and has a new signature. Please check the docs.");
        }
        const te = this.data;
        const x = (2 * near) / (right - left);
        const y = (2 * near) / (top - bottom);
        const a = (right + left) / (right - left);
        const b = (top + bottom) / (top - bottom);
        const c = (far + near) / (far - near);
        const d = (-2 * far * near) / (far - near);
        te[0] = x;
        te[4] = 0;
        te[8] = a;
        te[12] = 0;
        te[1] = 0;
        te[5] = y;
        te[9] = b;
        te[13] = 0;
        te[2] = 0;
        te[6] = 0;
        te[10] = c;
        te[14] = d;
        te[3] = 0;
        te[7] = 0;
        te[11] = 1;
        te[15] = 0;
        return this;
    }
    // 右手坐标系
    makePerspectiveRH(left, right, top, bottom, near, far) {
        if (far === undefined) {
            console.warn("THREE.Matrix4: .makePerspective() has been redefined and has a new signature. Please check the docs.");
        }
        var te = this.data;
        const x = (2 * near) / (right - left);
        const y = (2 * near) / (top - bottom);
        const a = (right + left) / (right - left);
        const b = (top + bottom) / (top - bottom);
        const c = -(far + near) / (far - near);
        const d = (-2 * far * near) / (far - near);
        te[0] = x;
        te[4] = 0;
        te[8] = a;
        te[12] = 0;
        te[1] = 0;
        te[5] = y;
        te[9] = b;
        te[13] = 0;
        te[2] = 0;
        te[6] = 0;
        te[10] = c;
        te[14] = d;
        te[3] = 0;
        te[7] = 0;
        te[11] = -1;
        te[15] = 0;
        return this;
    }
    makeRotationFromQuaternion(q) {
        return this.compose(_zero, q, _one);
    }
    // Static function which evaluates perspective projection matrix half size at the near plane
    static _getPerspectiveHalfSize(halfSize, fov, aspect, znear, fovIsHorizontal) {
        if (fovIsHorizontal) {
            halfSize.x = znear * Math.tan((fov * Math.PI) / 360);
            halfSize.y = halfSize.x / aspect;
        }
        else {
            halfSize.y = znear * Math.tan((fov * Math.PI) / 360);
            halfSize.x = halfSize.y * aspect;
        }
    }
    /**
     * Adds the specified 4x4 matrices together and stores the result in the current instance.
     *
     * @param {Mat4} lhs - The 4x4 matrix used as the first operand of the addition.
     * @param {Mat4} rhs - The 4x4 matrix used as the second operand of the addition.
     * @returns {Mat4} Self for chaining.
     * @example
     * var m = new pc.Mat4();
     *
     * m.add2(pc.Mat4.IDENTITY, pc.Mat4.ONE);
     *
     * console.log("The result of the addition is: " + m.toString());
     */
    add2(lhs, rhs) {
        const a = lhs.data, b = rhs.data, r = this.data;
        r[0] = a[0] + b[0];
        r[1] = a[1] + b[1];
        r[2] = a[2] + b[2];
        r[3] = a[3] + b[3];
        r[4] = a[4] + b[4];
        r[5] = a[5] + b[5];
        r[6] = a[6] + b[6];
        r[7] = a[7] + b[7];
        r[8] = a[8] + b[8];
        r[9] = a[9] + b[9];
        r[10] = a[10] + b[10];
        r[11] = a[11] + b[11];
        r[12] = a[12] + b[12];
        r[13] = a[13] + b[13];
        r[14] = a[14] + b[14];
        r[15] = a[15] + b[15];
        return this;
    }
    /**
     * Adds the specified 4x4 matrix to the current instance.
     *
     * @param {Mat4} rhs - The 4x4 matrix used as the second operand of the addition.
     * @returns {Mat4} Self for chaining.
     * @example
     * var m = new pc.Mat4();
     *
     * m.add(pc.Mat4.ONE);
     *
     * console.log("The result of the addition is: " + m.toString());
     */
    add(rhs) {
        return this.add2(this, rhs);
    }
    /**
     * Creates a duplicate of the specified matrix.
     *
     * @returns {Mat4} A duplicate matrix.
     * @example
     * var src = new pc.Mat4().setFromEulerAngles(10, 20, 30);
     * var dst = src.clone();
     * console.log("The two matrices are " + (src.equals(dst) ? "equal" : "different"));
     */
    clone() {
        return new Mat4().copy(this);
    }
    /**
     * Copies the contents of a source 4x4 matrix to a destination 4x4 matrix.
     *
     * @param {Mat4} rhs - A 4x4 matrix to be copied.
     * @returns {Mat4} Self for chaining.
     * @example
     * var src = new pc.Mat4().setFromEulerAngles(10, 20, 30);
     * var dst = new pc.Mat4();
     * dst.copy(src);
     * console.log("The two matrices are " + (src.equals(dst) ? "equal" : "different"));
     */
    copy(rhs) {
        const src = rhs.data, dst = this.data;
        dst[0] = src[0];
        dst[1] = src[1];
        dst[2] = src[2];
        dst[3] = src[3];
        dst[4] = src[4];
        dst[5] = src[5];
        dst[6] = src[6];
        dst[7] = src[7];
        dst[8] = src[8];
        dst[9] = src[9];
        dst[10] = src[10];
        dst[11] = src[11];
        dst[12] = src[12];
        dst[13] = src[13];
        dst[14] = src[14];
        dst[15] = src[15];
        return this;
    }
    /**
     * Reports whether two matrices are equal.
     *
     * @param {Mat4} rhs - The other matrix.
     * @returns {boolean} True if the matrices are equal and false otherwise.
     * @example
     * var a = new pc.Mat4().setFromEulerAngles(10, 20, 30);
     * var b = new pc.Mat4();
     * console.log("The two matrices are " + (a.equals(b) ? "equal" : "different"));
     */
    equals(rhs) {
        const l = this.data, r = rhs.data;
        return (l[0] === r[0] &&
            l[1] === r[1] &&
            l[2] === r[2] &&
            l[3] === r[3] &&
            l[4] === r[4] &&
            l[5] === r[5] &&
            l[6] === r[6] &&
            l[7] === r[7] &&
            l[8] === r[8] &&
            l[9] === r[9] &&
            l[10] === r[10] &&
            l[11] === r[11] &&
            l[12] === r[12] &&
            l[13] === r[13] &&
            l[14] === r[14] &&
            l[15] === r[15]);
    }
    /**
     * Reports whether the specified matrix is the identity matrix.
     *
     * @returns {boolean} True if the matrix is identity and false otherwise.
     * @example
     * var m = new pc.Mat4();
     * console.log("The matrix is " + (m.isIdentity() ? "identity" : "not identity"));
     */
    isIdentity() {
        const m = this.data;
        return (m[0] === 1 &&
            m[1] === 0 &&
            m[2] === 0 &&
            m[3] === 0 &&
            m[4] === 0 &&
            m[5] === 1 &&
            m[6] === 0 &&
            m[7] === 0 &&
            m[8] === 0 &&
            m[9] === 0 &&
            m[10] === 1 &&
            m[11] === 0 &&
            m[12] === 0 &&
            m[13] === 0 &&
            m[14] === 0 &&
            m[15] === 1);
    }
    /**
     * Multiplies the specified 4x4 matrices together and stores the result in the current
     * instance.
     *
     * @param {Mat4} lhs - The 4x4 matrix used as the first multiplicand of the operation.
     * @param {Mat4} rhs - The 4x4 matrix used as the second multiplicand of the operation.
     * @returns {Mat4} Self for chaining.
     * @example
     * var a = new pc.Mat4().setFromEulerAngles(10, 20, 30);
     * var b = new pc.Mat4().setFromAxisAngle(pc.Vec3.UP, 180);
     * var r = new pc.Mat4();
     *
     * // r = a * b
     * r.mul2(a, b);
     *
     * console.log("The result of the multiplication is: " + r.toString());
     */
    mul2(lhs, rhs) {
        const a = lhs.data;
        const b = rhs.data;
        const r = this.data;
        const a00 = a[0];
        const a01 = a[1];
        const a02 = a[2];
        const a03 = a[3];
        const a10 = a[4];
        const a11 = a[5];
        const a12 = a[6];
        const a13 = a[7];
        const a20 = a[8];
        const a21 = a[9];
        const a22 = a[10];
        const a23 = a[11];
        const a30 = a[12];
        const a31 = a[13];
        const a32 = a[14];
        const a33 = a[15];
        let b0, b1, b2, b3;
        b0 = b[0];
        b1 = b[1];
        b2 = b[2];
        b3 = b[3];
        r[0] = a00 * b0 + a10 * b1 + a20 * b2 + a30 * b3;
        r[1] = a01 * b0 + a11 * b1 + a21 * b2 + a31 * b3;
        r[2] = a02 * b0 + a12 * b1 + a22 * b2 + a32 * b3;
        r[3] = a03 * b0 + a13 * b1 + a23 * b2 + a33 * b3;
        b0 = b[4];
        b1 = b[5];
        b2 = b[6];
        b3 = b[7];
        r[4] = a00 * b0 + a10 * b1 + a20 * b2 + a30 * b3;
        r[5] = a01 * b0 + a11 * b1 + a21 * b2 + a31 * b3;
        r[6] = a02 * b0 + a12 * b1 + a22 * b2 + a32 * b3;
        r[7] = a03 * b0 + a13 * b1 + a23 * b2 + a33 * b3;
        b0 = b[8];
        b1 = b[9];
        b2 = b[10];
        b3 = b[11];
        r[8] = a00 * b0 + a10 * b1 + a20 * b2 + a30 * b3;
        r[9] = a01 * b0 + a11 * b1 + a21 * b2 + a31 * b3;
        r[10] = a02 * b0 + a12 * b1 + a22 * b2 + a32 * b3;
        r[11] = a03 * b0 + a13 * b1 + a23 * b2 + a33 * b3;
        b0 = b[12];
        b1 = b[13];
        b2 = b[14];
        b3 = b[15];
        r[12] = a00 * b0 + a10 * b1 + a20 * b2 + a30 * b3;
        r[13] = a01 * b0 + a11 * b1 + a21 * b2 + a31 * b3;
        r[14] = a02 * b0 + a12 * b1 + a22 * b2 + a32 * b3;
        r[15] = a03 * b0 + a13 * b1 + a23 * b2 + a33 * b3;
        return this;
    }
    /**
     * Multiplies the specified 4x4 matrices together and stores the result in the current
     * instance. This function assumes the matrices are affine transformation matrices, where the
     * upper left 3x3 elements are a rotation matrix, and the bottom left 3 elements are
     * translation. The rightmost column is assumed to be [0, 0, 0, 1]. The parameters are not
     * verified to be in the expected format. This function is faster than general
     * {@link Mat4#mul2}.
     *
     * @param {Mat4} lhs - The affine transformation 4x4 matrix used as the first multiplicand of
     * the operation.
     * @param {Mat4} rhs - The affine transformation 4x4 matrix used as the second multiplicand of
     * the operation.
     * @returns {Mat4} Self for chaining.
     */
    mulAffine2(lhs, rhs) {
        const a = lhs.data;
        const b = rhs.data;
        const r = this.data;
        const a00 = a[0];
        const a01 = a[1];
        const a02 = a[2];
        const a10 = a[4];
        const a11 = a[5];
        const a12 = a[6];
        const a20 = a[8];
        const a21 = a[9];
        const a22 = a[10];
        const a30 = a[12];
        const a31 = a[13];
        const a32 = a[14];
        let b0, b1, b2;
        b0 = b[0];
        b1 = b[1];
        b2 = b[2];
        r[0] = a00 * b0 + a10 * b1 + a20 * b2;
        r[1] = a01 * b0 + a11 * b1 + a21 * b2;
        r[2] = a02 * b0 + a12 * b1 + a22 * b2;
        r[3] = 0;
        b0 = b[4];
        b1 = b[5];
        b2 = b[6];
        r[4] = a00 * b0 + a10 * b1 + a20 * b2;
        r[5] = a01 * b0 + a11 * b1 + a21 * b2;
        r[6] = a02 * b0 + a12 * b1 + a22 * b2;
        r[7] = 0;
        b0 = b[8];
        b1 = b[9];
        b2 = b[10];
        r[8] = a00 * b0 + a10 * b1 + a20 * b2;
        r[9] = a01 * b0 + a11 * b1 + a21 * b2;
        r[10] = a02 * b0 + a12 * b1 + a22 * b2;
        r[11] = 0;
        b0 = b[12];
        b1 = b[13];
        b2 = b[14];
        r[12] = a00 * b0 + a10 * b1 + a20 * b2 + a30;
        r[13] = a01 * b0 + a11 * b1 + a21 * b2 + a31;
        r[14] = a02 * b0 + a12 * b1 + a22 * b2 + a32;
        r[15] = 1;
        return this;
    }
    /**
     * Multiplies the current instance by the specified 4x4 matrix.
     *
     * @param {Mat4} rhs - The 4x4 matrix used as the second multiplicand of the operation.
     * @returns {Mat4} Self for chaining.
     * @example
     * var a = new pc.Mat4().setFromEulerAngles(10, 20, 30);
     * var b = new pc.Mat4().setFromAxisAngle(pc.Vec3.UP, 180);
     *
     * // a = a * b
     * a.mul(b);
     *
     * console.log("The result of the multiplication is: " + a.toString());
     */
    mul(rhs) {
        return this.mul2(this, rhs);
    }
    /**
     * Transforms a 3-dimensional point by a 4x4 matrix.
     *
     * @param {Vec3} vec - The 3-dimensional point to be transformed.
     * @param {Vec3} [res] - An optional 3-dimensional point to receive the result of the
     * transformation.
     * @returns {Vec3} The input point v transformed by the current instance.
     * @example
     * // Create a 3-dimensional point
     * var v = new pc.Vec3(1, 2, 3);
     *
     * // Create a 4x4 rotation matrix
     * var m = new pc.Mat4().setFromEulerAngles(10, 20, 30);
     *
     * var tv = m.transformPoint(v);
     */
    transformPoint(vec, res = new _math_vec3__WEBPACK_IMPORTED_MODULE_2__["Vec3"]()) {
        const m = this.data;
        const x = vec.x;
        const y = vec.y;
        const z = vec.z;
        res.x = x * m[0] + y * m[4] + z * m[8] + m[12];
        res.y = x * m[1] + y * m[5] + z * m[9] + m[13];
        res.z = x * m[2] + y * m[6] + z * m[10] + m[14];
        return res;
    }
    /**
     * Transforms a 3-dimensional vector by a 4x4 matrix.
     *
     * @param {Vec3} vec - The 3-dimensional vector to be transformed.
     * @param {Vec3} [res] - An optional 3-dimensional vector to receive the result of the
     * transformation.
     * @returns {Vec3} The input vector v transformed by the current instance.
     * @example
     * // Create a 3-dimensional vector
     * var v = new pc.Vec3(1, 2, 3);
     *
     * // Create a 4x4 rotation matrix
     * var m = new pc.Mat4().setFromEulerAngles(10, 20, 30);
     *
     * var tv = m.transformVector(v);
     */
    transformVector(vec, res = new _math_vec3__WEBPACK_IMPORTED_MODULE_2__["Vec3"]()) {
        const m = this.data;
        const x = vec.x;
        const y = vec.y;
        const z = vec.z;
        res.x = x * m[0] + y * m[4] + z * m[8];
        res.y = x * m[1] + y * m[5] + z * m[9];
        res.z = x * m[2] + y * m[6] + z * m[10];
        return res;
    }
    /**
     * Transforms a 4-dimensional vector by a 4x4 matrix.
     *
     * @param {Vec4} vec - The 4-dimensional vector to be transformed.
     * @param {Vec4} [res] - An optional 4-dimensional vector to receive the result of the
     * transformation.
     * @returns {Vec4} The input vector v transformed by the current instance.
     * @example
     * // Create an input 4-dimensional vector
     * var v = new pc.Vec4(1, 2, 3, 4);
     *
     * // Create an output 4-dimensional vector
     * var result = new pc.Vec4();
     *
     * // Create a 4x4 rotation matrix
     * var m = new pc.Mat4().setFromEulerAngles(10, 20, 30);
     *
     * m.transformVec4(v, result);
     */
    transformVec4(vec, res = new _math_vec4__WEBPACK_IMPORTED_MODULE_3__["Vec4"]()) {
        const m = this.data;
        const x = vec.x;
        const y = vec.y;
        const z = vec.z;
        const w = vec.w;
        res.x = x * m[0] + y * m[4] + z * m[8] + w * m[12];
        res.y = x * m[1] + y * m[5] + z * m[9] + w * m[13];
        res.z = x * m[2] + y * m[6] + z * m[10] + w * m[14];
        res.w = x * m[3] + y * m[7] + z * m[11] + w * m[15];
        return res;
    }
    /**
     * Sets the specified matrix to a viewing matrix derived from an eye point, a target point and
     * an up vector. The matrix maps the target point to the negative z-axis and the eye point to
     * the origin, so that when you use a typical projection matrix, the center of the scene maps
     * to the center of the viewport. Similarly, the direction described by the up vector projected
     * onto the viewing plane is mapped to the positive y-axis so that it points upward in the
     * viewport. The up vector must not be parallel to the line of sight from the eye to the
     * reference point.
     *
     * @param {Vec3} position - 3-d vector holding view position.
     * @param {Vec3} target - 3-d vector holding reference point.
     * @param {Vec3} up - 3-d vector holding the up direction.
     * @returns {Mat4} Self for chaining.
     * @example
     * var position = new pc.Vec3(10, 10, 10);
     * var target = new pc.Vec3(0, 0, 0);
     * var up = new pc.Vec3(0, 1, 0);
     * var m = new pc.Mat4().setLookAt(position, target, up);
     */
    setLookAt(position, target, up) {
        z.sub2(position, target).normalize();
        y.copy(up).normalize();
        x.cross(y, z).normalize();
        y.cross(z, x);
        const r = this.data;
        r[0] = x.x;
        r[1] = x.y;
        r[2] = x.z;
        r[3] = 0;
        r[4] = y.x;
        r[5] = y.y;
        r[6] = y.z;
        r[7] = 0;
        r[8] = z.x;
        r[9] = z.y;
        r[10] = z.z;
        r[11] = 0;
        r[12] = position.x;
        r[13] = position.y;
        r[14] = position.z;
        r[15] = 1;
        return this;
    }
    /**
     * Sets the specified matrix to a perspective projection matrix. The function's parameters
     * define the shape of a frustum.
     *
     * @param {number} left - The x-coordinate for the left edge of the camera's projection plane
     * in eye space.
     * @param {number} right - The x-coordinate for the right edge of the camera's projection plane
     * in eye space.
     * @param {number} bottom - The y-coordinate for the bottom edge of the camera's projection
     * plane in eye space.
     * @param {number} top - The y-coordinate for the top edge of the camera's projection plane in
     * eye space.
     * @param {number} znear - The near clip plane in eye coordinates.
     * @param {number} zfar - The far clip plane in eye coordinates.
     * @returns {Mat4} Self for chaining.
     * @example
     * // Create a 4x4 perspective projection matrix
     * var f = pc.Mat4().setFrustum(-2, 2, -1, 1, 1, 1000);
     * @ignore
     */
    setFrustum(left, right, bottom, top, znear, zfar) {
        const temp1 = 2 * znear;
        const temp2 = right - left;
        const temp3 = top - bottom;
        const temp4 = zfar - znear;
        const r = this.data;
        r[0] = temp1 / temp2;
        r[1] = 0;
        r[2] = 0;
        r[3] = 0;
        r[4] = 0;
        r[5] = temp1 / temp3;
        r[6] = 0;
        r[7] = 0;
        r[8] = (right + left) / temp2;
        r[9] = (top + bottom) / temp3;
        r[10] = (-zfar - znear) / temp4;
        r[11] = -1;
        r[12] = 0;
        r[13] = 0;
        r[14] = (-temp1 * zfar) / temp4;
        r[15] = 0;
        return this;
    }
    /**
     * Sets the specified matrix to a perspective projection matrix. The function's parameters
     * define the shape of a frustum.
     *
     * @param {number} fov - The frustum's field of view in degrees. The fovIsHorizontal parameter
     * controls whether this is a vertical or horizontal field of view. By default, it's a vertical
     * field of view.
     * @param {number} aspect - The aspect ratio of the frustum's projection plane
     * (width / height).
     * @param {number} znear - The near clip plane in eye coordinates.
     * @param {number} zfar - The far clip plane in eye coordinates.
     * @param {boolean} [fovIsHorizontal=false] - Set to true to treat the fov as horizontal
     * (x-axis) and false for vertical (y-axis). Defaults to false.
     * @returns {Mat4} Self for chaining.
     * @example
     * // Create a 4x4 perspective projection matrix
     * var persp = pc.Mat4().setPerspective(45, 16 / 9, 1, 1000);
     */
    setPerspective(fov, aspect, znear, zfar, fovIsHorizontal) {
        Mat4._getPerspectiveHalfSize(_halfSize, fov, aspect, znear, fovIsHorizontal);
        return this.setFrustum(-_halfSize.x, _halfSize.x, -_halfSize.y, _halfSize.y, znear, zfar);
    }
    /**
     * Sets the specified matrix to an orthographic projection matrix. The function's parameters
     * define the shape of a cuboid-shaped frustum.
     *
     * @param {number} left - The x-coordinate for the left edge of the camera's projection plane
     * in eye space.
     * @param {number} right - The x-coordinate for the right edge of the camera's projection plane
     * in eye space.
     * @param {number} bottom - The y-coordinate for the bottom edge of the camera's projection
     * plane in eye space.
     * @param {number} top - The y-coordinate for the top edge of the camera's projection plane in
     * eye space.
     * @param {number} near - The near clip plane in eye coordinates.
     * @param {number} far - The far clip plane in eye coordinates.
     * @returns {Mat4} Self for chaining.
     * @example
     * // Create a 4x4 orthographic projection matrix
     * var ortho = pc.Mat4().ortho(-2, 2, -2, 2, 1, 1000);
     */
    setOrtho(left, right, bottom, top, near, far) {
        const r = this.data;
        r[0] = 2 / (right - left);
        r[1] = 0;
        r[2] = 0;
        r[3] = 0;
        r[4] = 0;
        r[5] = 2 / (top - bottom);
        r[6] = 0;
        r[7] = 0;
        r[8] = 0;
        r[9] = 0;
        r[10] = -2 / (far - near);
        r[11] = 0;
        r[12] = -(right + left) / (right - left);
        r[13] = -(top + bottom) / (top - bottom);
        r[14] = -(far + near) / (far - near);
        r[15] = 1;
        return this;
    }
    /**
     * Sets the specified matrix to a rotation matrix equivalent to a rotation around an axis. The
     * axis must be normalized (unit length) and the angle must be specified in degrees.
     *
     * @param {Vec3} axis - The normalized axis vector around which to rotate.
     * @param {number} angle - The angle of rotation in degrees.
     * @returns {Mat4} Self for chaining.
     * @example
     * // Create a 4x4 rotation matrix
     * var rm = new pc.Mat4().setFromAxisAngle(pc.Vec3.UP, 90);
     */
    setFromAxisAngle(axis, angle) {
        angle *= _math_tool__WEBPACK_IMPORTED_MODULE_0__["MathTool"].DEG_TO_RAD;
        const x = axis.x;
        const y = axis.y;
        const z = axis.z;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const t = 1 - c;
        const tx = t * x;
        const ty = t * y;
        const m = this.data;
        m[0] = tx * x + c;
        m[1] = tx * y + s * z;
        m[2] = tx * z - s * y;
        m[3] = 0;
        m[4] = tx * y - s * z;
        m[5] = ty * y + c;
        m[6] = ty * z + s * x;
        m[7] = 0;
        m[8] = tx * z + s * y;
        m[9] = ty * z - x * s;
        m[10] = t * z * z + c;
        m[11] = 0;
        m[12] = 0;
        m[13] = 0;
        m[14] = 0;
        m[15] = 1;
        return this;
    }
    /**
     * Sets the specified matrix to a translation matrix.
     *
     * @param {number} x - The x-component of the translation.
     * @param {number} y - The y-component of the translation.
     * @param {number} z - The z-component of the translation.
     * @returns {Mat4} Self for chaining.
     * @example
     * // Create a 4x4 translation matrix
     * var tm = new pc.Mat4().setTranslate(10, 10, 10);
     * @ignore
     */
    setTranslate(x, y, z) {
        const m = this.data;
        m[0] = 1;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 0;
        m[5] = 1;
        m[6] = 0;
        m[7] = 0;
        m[8] = 0;
        m[9] = 0;
        m[10] = 1;
        m[11] = 0;
        m[12] = x;
        m[13] = y;
        m[14] = z;
        m[15] = 1;
        return this;
    }
    /**
     * Sets the specified matrix to a scale matrix.
     *
     * @param {number} x - The x-component of the scale.
     * @param {number} y - The y-component of the scale.
     * @param {number} z - The z-component of the scale.
     * @returns {Mat4} Self for chaining.
     * @example
     * // Create a 4x4 scale matrix
     * var sm = new pc.Mat4().setScale(10, 10, 10);
     * @ignore
     */
    setScale(x, y, z) {
        const m = this.data;
        m[0] = x;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 0;
        m[5] = y;
        m[6] = 0;
        m[7] = 0;
        m[8] = 0;
        m[9] = 0;
        m[10] = z;
        m[11] = 0;
        m[12] = 0;
        m[13] = 0;
        m[14] = 0;
        m[15] = 1;
        return this;
    }
    /**
     * Sets the specified matrix to a matrix transforming a normalized view volume (in range of
     * -1 .. 1) to their position inside a viewport (in range of 0 .. 1). This encapsulates a
     * scaling to the size of the viewport and a translation to the position of the viewport.
     *
     * @param {number} x - The x-component of the position of the viewport (in 0..1 range).
     * @param {number} y - The y-component of the position of the viewport (in 0..1 range).
     * @param {number} width - The width of the viewport (in 0..1 range).
     * @param {number} height - The height of the viewport (in 0..1 range).
     * @returns {Mat4} Self for chaining.
     * @example
     * // Create a 4x4 viewport matrix which scales normalized view volume to full texture viewport
     * var vm = new pc.Mat4().setViewport(0, 0, 1, 1);
     * @ignore
     */
    setViewport(x, y, width, height) {
        const m = this.data;
        m[0] = width * 0.5;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 0;
        m[5] = height * 0.5;
        m[6] = 0;
        m[7] = 0;
        m[8] = 0;
        m[9] = 0;
        m[10] = 0.5;
        m[11] = 0;
        m[12] = x + width * 0.5;
        m[13] = y + height * 0.5;
        m[14] = 0.5;
        m[15] = 1;
        return this;
    }
    /**
     * Sets the specified matrix to its inverse.
     *
     * @returns {Mat4} Self for chaining.
     * @example
     * // Create a 4x4 rotation matrix of 180 degrees around the y-axis
     * var rot = new pc.Mat4().setFromAxisAngle(pc.Vec3.UP, 180);
     *
     * // Invert in place
     * rot.invert();
     */
    invert() {
        const m = this.data;
        const a00 = m[0];
        const a01 = m[1];
        const a02 = m[2];
        const a03 = m[3];
        const a10 = m[4];
        const a11 = m[5];
        const a12 = m[6];
        const a13 = m[7];
        const a20 = m[8];
        const a21 = m[9];
        const a22 = m[10];
        const a23 = m[11];
        const a30 = m[12];
        const a31 = m[13];
        const a32 = m[14];
        const a33 = m[15];
        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;
        const det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (det === 0) {
            this.setIdentity();
        }
        else {
            const invDet = 1 / det;
            m[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
            m[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
            m[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
            m[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
            m[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
            m[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
            m[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
            m[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
            m[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
            m[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
            m[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
            m[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
            m[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
            m[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
            m[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
            m[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;
        }
        return this;
    }
    /**
     * Sets matrix data from an array.
     *
     * @param {number[]} src - Source array. Must have 16 values.
     * @returns {Mat4} Self for chaining.
     */
    set(src) {
        const dst = this.data;
        dst[0] = src[0];
        dst[1] = src[1];
        dst[2] = src[2];
        dst[3] = src[3];
        dst[4] = src[4];
        dst[5] = src[5];
        dst[6] = src[6];
        dst[7] = src[7];
        dst[8] = src[8];
        dst[9] = src[9];
        dst[10] = src[10];
        dst[11] = src[11];
        dst[12] = src[12];
        dst[13] = src[13];
        dst[14] = src[14];
        dst[15] = src[15];
        return this;
    }
    /**
     * Sets the specified matrix to the identity matrix.
     *
     * @returns {Mat4} Self for chaining.
     * @example
     * m.setIdentity();
     * console.log("The matrix is " + (m.isIdentity() ? "identity" : "not identity"));
     */
    setIdentity() {
        const m = this.data;
        m[0] = 1;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 0;
        m[5] = 1;
        m[6] = 0;
        m[7] = 0;
        m[8] = 0;
        m[9] = 0;
        m[10] = 1;
        m[11] = 0;
        m[12] = 0;
        m[13] = 0;
        m[14] = 0;
        m[15] = 1;
        return this;
    }
    /**
     * Sets the specified matrix to the concatenation of a translation, a quaternion rotation and a
     * scale.
     *
     * @param {Vec3} t - A 3-d vector translation.
     * @param {Quat} r - A quaternion rotation.
     * @param {Vec3} s - A 3-d vector scale.
     * @returns {Mat4} Self for chaining.
     * @example
     * var t = new pc.Vec3(10, 20, 30);
     * var r = new pc.Quat();
     * var s = new pc.Vec3(2, 2, 2);
     *
     * var m = new pc.Mat4();
     * m.setTRS(t, r, s);
     */
    setTRS(t, r, s) {
        const qx = r.x;
        const qy = r.y;
        const qz = r.z;
        const qw = r.w;
        const sx = s.x;
        const sy = s.y;
        const sz = s.z;
        const x2 = qx + qx;
        const y2 = qy + qy;
        const z2 = qz + qz;
        const xx = qx * x2;
        const xy = qx * y2;
        const xz = qx * z2;
        const yy = qy * y2;
        const yz = qy * z2;
        const zz = qz * z2;
        const wx = qw * x2;
        const wy = qw * y2;
        const wz = qw * z2;
        const m = this.data;
        m[0] = (1 - (yy + zz)) * sx;
        m[1] = (xy + wz) * sx;
        m[2] = (xz - wy) * sx;
        m[3] = 0;
        m[4] = (xy - wz) * sy;
        m[5] = (1 - (xx + zz)) * sy;
        m[6] = (yz + wx) * sy;
        m[7] = 0;
        m[8] = (xz + wy) * sz;
        m[9] = (yz - wx) * sz;
        m[10] = (1 - (xx + yy)) * sz;
        m[11] = 0;
        m[12] = t.x;
        m[13] = t.y;
        m[14] = t.z;
        m[15] = 1;
        return this;
    }
    /**
     * Sets the specified matrix to its transpose.
     *
     * @returns {Mat4} Self for chaining.
     * @example
     * var m = new pc.Mat4();
     *
     * // Transpose in place
     * m.transpose();
     */
    transpose() {
        let tmp;
        const m = this.data;
        tmp = m[1];
        m[1] = m[4];
        m[4] = tmp;
        tmp = m[2];
        m[2] = m[8];
        m[8] = tmp;
        tmp = m[3];
        m[3] = m[12];
        m[12] = tmp;
        tmp = m[6];
        m[6] = m[9];
        m[9] = tmp;
        tmp = m[7];
        m[7] = m[13];
        m[13] = tmp;
        tmp = m[11];
        m[11] = m[14];
        m[14] = tmp;
        return this;
    }
    invertTo3x3(res) {
        const m = this.data;
        const r = res.data;
        const m0 = m[0];
        const m1 = m[1];
        const m2 = m[2];
        const m4 = m[4];
        const m5 = m[5];
        const m6 = m[6];
        const m8 = m[8];
        const m9 = m[9];
        const m10 = m[10];
        const a11 = m10 * m5 - m6 * m9;
        const a21 = -m10 * m1 + m2 * m9;
        const a31 = m6 * m1 - m2 * m5;
        const a12 = -m10 * m4 + m6 * m8;
        const a22 = m10 * m0 - m2 * m8;
        const a32 = -m6 * m0 + m2 * m4;
        const a13 = m9 * m4 - m5 * m8;
        const a23 = -m9 * m0 + m1 * m8;
        const a33 = m5 * m0 - m1 * m4;
        const det = m0 * a11 + m1 * a12 + m2 * a13;
        if (det === 0) {
            // no inverse
            return this;
        }
        const idet = 1 / det;
        r[0] = idet * a11;
        r[1] = idet * a21;
        r[2] = idet * a31;
        r[3] = idet * a12;
        r[4] = idet * a22;
        r[5] = idet * a32;
        r[6] = idet * a13;
        r[7] = idet * a23;
        r[8] = idet * a33;
        return this;
    }
    /**
     * Extracts the translational component from the specified 4x4 matrix.
     *
     * @param {Vec3} [t] - The vector to receive the translation of the matrix.
     * @returns {Vec3} The translation of the specified 4x4 matrix.
     * @example
     * // Create a 4x4 matrix
     * var m = new pc.Mat4();
     *
     * // Query the z-axis component
     * var t = new pc.Vec3();
     * m.getTranslation(t);
     */
    getTranslation(t = new _math_vec3__WEBPACK_IMPORTED_MODULE_2__["Vec3"]()) {
        return t.set(this.data[12], this.data[13], this.data[14]);
    }
    /**
     * Extracts the x-axis from the specified 4x4 matrix.
     *
     * @param {Vec3} [x] - The vector to receive the x axis of the matrix.
     * @returns {Vec3} The x-axis of the specified 4x4 matrix.
     * @example
     * // Create a 4x4 matrix
     * var m = new pc.Mat4();
     *
     * // Query the z-axis component
     * var x = new pc.Vec3();
     * m.getX(x);
     */
    getX(x = new _math_vec3__WEBPACK_IMPORTED_MODULE_2__["Vec3"]()) {
        return x.set(this.data[0], this.data[1], this.data[2]);
    }
    /**
     * Extracts the y-axis from the specified 4x4 matrix.
     *
     * @param {Vec3} [y] - The vector to receive the y axis of the matrix.
     * @returns {Vec3} The y-axis of the specified 4x4 matrix.
     * @example
     * // Create a 4x4 matrix
     * var m = new pc.Mat4();
     *
     * // Query the z-axis component
     * var y = new pc.Vec3();
     * m.getY(y);
     */
    getY(y = new _math_vec3__WEBPACK_IMPORTED_MODULE_2__["Vec3"]()) {
        return y.set(this.data[4], this.data[5], this.data[6]);
    }
    /**
     * Extracts the z-axis from the specified 4x4 matrix.
     *
     * @param {Vec3} [z] - The vector to receive the z axis of the matrix.
     * @returns {Vec3} The z-axis of the specified 4x4 matrix.
     * @example
     * // Create a 4x4 matrix
     * var m = new pc.Mat4();
     *
     * // Query the z-axis component
     * var z = new pc.Vec3();
     * m.getZ(z);
     */
    getZ(z = new _math_vec3__WEBPACK_IMPORTED_MODULE_2__["Vec3"]()) {
        return z.set(this.data[8], this.data[9], this.data[10]);
    }
    /**
     * Extracts the scale component from the specified 4x4 matrix.
     *
     * @param {Vec3} [scale] - Vector to receive the scale.
     * @returns {Vec3} The scale in X, Y and Z of the specified 4x4 matrix.
     * @example
     * // Query the scale component
     * var scale = m.getScale();
     */
    getScale(scale = new _math_vec3__WEBPACK_IMPORTED_MODULE_2__["Vec3"]()) {
        this.getX(x);
        this.getY(y);
        this.getZ(z);
        scale.set(x.length(), y.length(), z.length());
        return scale;
    }
    /**
     * Sets the specified matrix to a rotation matrix defined by Euler angles. The Euler angles are
     * specified in XYZ order and in degrees.
     *
     * @param {number} ex - Angle to rotate around X axis in degrees.
     * @param {number} ey - Angle to rotate around Y axis in degrees.
     * @param {number} ez - Angle to rotate around Z axis in degrees.
     * @returns {Mat4} Self for chaining.
     * @example
     * var m = new pc.Mat4();
     * m.setFromEulerAngles(45, 90, 180);
     */
    setFromEulerAngles(ex, ey, ez) {
        // http://en.wikipedia.org/wiki/Rotation_matrix#Conversion_from_and_to_axis-angle
        // The 3D space is right-handed, so the rotation around each axis will be counterclockwise
        // for an observer placed so that the axis goes in his or her direction (Right-hand rule).
        ex *= _math_tool__WEBPACK_IMPORTED_MODULE_0__["MathTool"].DEG_TO_RAD;
        ey *= _math_tool__WEBPACK_IMPORTED_MODULE_0__["MathTool"].DEG_TO_RAD;
        ez *= _math_tool__WEBPACK_IMPORTED_MODULE_0__["MathTool"].DEG_TO_RAD;
        // Solution taken from http://en.wikipedia.org/wiki/Euler_angles#Matrix_orientation
        const s1 = Math.sin(-ex);
        const c1 = Math.cos(-ex);
        const s2 = Math.sin(-ey);
        const c2 = Math.cos(-ey);
        const s3 = Math.sin(-ez);
        const c3 = Math.cos(-ez);
        const m = this.data;
        // Set rotation elements
        m[0] = c2 * c3;
        m[1] = -c2 * s3;
        m[2] = s2;
        m[3] = 0;
        m[4] = c1 * s3 + c3 * s1 * s2;
        m[5] = c1 * c3 - s1 * s2 * s3;
        m[6] = -c2 * s1;
        m[7] = 0;
        m[8] = s1 * s3 - c1 * c3 * s2;
        m[9] = c3 * s1 + c1 * s2 * s3;
        m[10] = c1 * c2;
        m[11] = 0;
        m[12] = 0;
        m[13] = 0;
        m[14] = 0;
        m[15] = 1;
        return this;
    }
    /**
     * Extracts the Euler angles equivalent to the rotational portion of the specified matrix. The
     * returned Euler angles are in XYZ order an in degrees.
     *
     * @param {Vec3} [eulers] - A 3-d vector to receive the Euler angles.
     * @returns {Vec3} A 3-d vector containing the Euler angles.
     * @example
     * // Create a 4x4 rotation matrix of 45 degrees around the y-axis
     * var m = new pc.Mat4().setFromAxisAngle(pc.Vec3.UP, 45);
     *
     * var eulers = m.getEulerAngles();
     */
    getEulerAngles(eulers = new _math_vec3__WEBPACK_IMPORTED_MODULE_2__["Vec3"]()) {
        this.getScale(scale);
        const sx = scale.x;
        const sy = scale.y;
        const sz = scale.z;
        if (sx === 0 || sy === 0 || sz === 0)
            return eulers.set(0, 0, 0);
        const m = this.data;
        const y = Math.asin(-m[2] / sx);
        const halfPi = Math.PI * 0.5;
        let x, z;
        if (y < halfPi) {
            if (y > -halfPi) {
                x = Math.atan2(m[6] / sy, m[10] / sz);
                z = Math.atan2(m[1] / sx, m[0] / sx);
            }
            else {
                // Not a unique solution
                z = 0;
                x = -Math.atan2(m[4] / sy, m[5] / sy);
            }
        }
        else {
            // Not a unique solution
            z = 0;
            x = Math.atan2(m[4] / sy, m[5] / sy);
        }
        return eulers.set(x, y, z).mulScalar(_math_tool__WEBPACK_IMPORTED_MODULE_0__["MathTool"].RAD_TO_DEG);
    }
    /**
     * Converts the specified matrix to string form.
     *
     * @returns {string} The matrix in string form.
     * @example
     * var m = new pc.Mat4();
     * // Outputs [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
     * console.log(m.toString());
     */
    toString() {
        let t = "[";
        for (let i = 0; i < 16; i += 1) {
            t += this.data[i];
            t += i !== 15 ? ", " : "";
        }
        t += "]";
        return t;
    }
    determinant() {
        const te = this.data;
        const n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
        const n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
        const n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
        const n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];
        //TODO: make this more efficient
        //( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )
        return (n41 * (+n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) +
            n42 * (+n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) +
            n43 * (+n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) +
            n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31));
    }
    compose(position, quaternion, scale) {
        const te = this.data;
        const x = quaternion.x, y = quaternion.y, z = quaternion.z, w = quaternion.w;
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, xy = x * y2, xz = x * z2;
        const yy = y * y2, yz = y * z2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;
        const sx = scale.x, sy = scale.y, sz = scale.z;
        te[0] = (1 - (yy + zz)) * sx;
        te[1] = (xy + wz) * sx;
        te[2] = (xz - wy) * sx;
        te[3] = 0;
        te[4] = (xy - wz) * sy;
        te[5] = (1 - (xx + zz)) * sy;
        te[6] = (yz + wx) * sy;
        te[7] = 0;
        te[8] = (xz + wy) * sz;
        te[9] = (yz - wx) * sz;
        te[10] = (1 - (xx + yy)) * sz;
        te[11] = 0;
        te[12] = position.x;
        te[13] = position.y;
        te[14] = position.z;
        te[15] = 1;
        return this;
    }
    decompose(position, quaternion, scale) {
        const te = this.data;
        let sx = _v1.set(te[0], te[1], te[2]).length();
        const sy = _v1.set(te[4], te[5], te[6]).length();
        const sz = _v1.set(te[8], te[9], te[10]).length();
        // if determine is negative, we need to invert one scale
        const det = this.determinant();
        if (det < 0)
            sx = -sx;
        position.x = te[12];
        position.y = te[13];
        position.z = te[14];
        // scale the rotation part
        _m1.copy(this);
        const invSX = 1 / sx;
        const invSY = 1 / sy;
        const invSZ = 1 / sz;
        _m1.data[0] *= invSX;
        _m1.data[1] *= invSX;
        _m1.data[2] *= invSX;
        _m1.data[4] *= invSY;
        _m1.data[5] *= invSY;
        _m1.data[6] *= invSY;
        _m1.data[8] *= invSZ;
        _m1.data[9] *= invSZ;
        _m1.data[10] *= invSZ;
        quaternion.setFromMat4(_m1);
        scale.x = sx;
        scale.y = sy;
        scale.z = sz;
        return this;
    }
}
/**
 * A constant matrix set to the identity.
 *
 * @type {Mat4}
 * @readonly
 */
Mat4.IDENTITY = Object.freeze(new Mat4());
/**
 * A constant matrix with all elements set to 0.
 *
 * @type {Mat4}
 * @readonly
 */
Mat4.ZERO = Object.freeze(new Mat4().set([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
const _m1 = /*@__PURE__*/ new Mat4();
const _zero = /*@__PURE__*/ new _math_vec3__WEBPACK_IMPORTED_MODULE_2__["Vec3"](0, 0, 0);
const _one = /*@__PURE__*/ new _math_vec3__WEBPACK_IMPORTED_MODULE_2__["Vec3"](1, 1, 1);



/***/ }),

/***/ "./src/maths/math.quat.ts":
/*!********************************!*\
  !*** ./src/maths/math.quat.ts ***!
  \********************************/
/*! exports provided: Quat */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Quat", function() { return Quat; });
/* harmony import */ var _math_tool__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.tool */ "./src/maths/math.tool.ts");
/* harmony import */ var _math_vec3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./math.vec3 */ "./src/maths/math.vec3.ts");
/** @typedef {import('./mat4.js').Mat4} Mat4 */


/**
 * A quaternion.
 */
class Quat {
    /**
     * Create a new Quat instance.
     *
     * @param {number} [x] - The quaternion's x component. Defaults to 0. If x is an array
     * of length 4, the array will be used to populate all components.
     * @param {number} [y] - The quaternion's y component. Defaults to 0.
     * @param {number} [z] - The quaternion's z component. Defaults to 0.
     * @param {number} [w] - The quaternion's w component. Defaults to 1.
     */
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    /**
     * Returns an identical copy of the specified quaternion.
     *
     * @returns {Quat} A quaternion containing the result of the cloning.
     * @example
     * var q = new pc.Quat(-0.11, -0.15, -0.46, 0.87);
     * var qclone = q.clone();
     *
     * console.log("The result of the cloning is: " + q.toString());
     */
    clone() {
        return new Quat(this.x, this.y, this.z, this.w);
    }
    conjugate() {
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    }
    /**
     * Copies the contents of a source quaternion to a destination quaternion.
     *
     * @param {Quat} rhs - The quaternion to be copied.
     * @returns {Quat} Self for chaining.
     * @example
     * var src = new pc.Quat();
     * var dst = new pc.Quat();
     * dst.copy(src, src);
     * console.log("The two quaternions are " + (src.equals(dst) ? "equal" : "different"));
     */
    copy(rhs) {
        this.x = rhs.x;
        this.y = rhs.y;
        this.z = rhs.z;
        this.w = rhs.w;
        return this;
    }
    /**
     * Reports whether two quaternions are equal.
     *
     * @param {Quat} rhs - The quaternion to be compared against.
     * @returns {boolean} True if the quaternions are equal and false otherwise.
     * @example
     * var a = new pc.Quat();
     * var b = new pc.Quat();
     * console.log("The two quaternions are " + (a.equals(b) ? "equal" : "different"));
     */
    equals(rhs) {
        return this.x === rhs.x && this.y === rhs.y && this.z === rhs.z && this.w === rhs.w;
    }
    /**
     * Gets the rotation axis and angle for a given quaternion. If a quaternion is created with
     * `setFromAxisAngle`, this method will return the same values as provided in the original
     * parameter list OR functionally equivalent values.
     *
     * @param {Vec3} axis - The 3-dimensional vector to receive the axis of rotation.
     * @returns {number} Angle, in degrees, of the rotation.
     * @example
     * var q = new pc.Quat();
     * q.setFromAxisAngle(new pc.Vec3(0, 1, 0), 90);
     * var v = new pc.Vec3();
     * var angle = q.getAxisAngle(v);
     * // Outputs 90
     * console.log(angle);
     * // Outputs [0, 1, 0]
     * console.log(v.toString());
     */
    getAxisAngle(axis) {
        let rad = Math.acos(this.w) * 2;
        const s = Math.sin(rad / 2);
        if (s !== 0) {
            axis.x = this.x / s;
            axis.y = this.y / s;
            axis.z = this.z / s;
            if (axis.x < 0 || axis.y < 0 || axis.z < 0) {
                // Flip the sign
                axis.x *= -1;
                axis.y *= -1;
                axis.z *= -1;
                rad *= -1;
            }
        }
        else {
            // If s is zero, return any axis (no rotation - axis does not matter)
            axis.x = 1;
            axis.y = 0;
            axis.z = 0;
        }
        return rad * _math_tool__WEBPACK_IMPORTED_MODULE_0__["MathTool"].RAD_TO_DEG;
    }
    /**
     * Converts the supplied quaternion to Euler angles.
     *
     * @param {Vec3} [eulers] - The 3-dimensional vector to receive the Euler angles.
     * @returns {Vec3} The 3-dimensional vector holding the Euler angles that
     * correspond to the supplied quaternion.
     */
    getEulerAngles(eulers = new _math_vec3__WEBPACK_IMPORTED_MODULE_1__["Vec3"]()) {
        let x, y, z;
        const qx = this.x;
        const qy = this.y;
        const qz = this.z;
        const qw = this.w;
        const a2 = 2 * (qw * qy - qx * qz);
        if (a2 <= -0.99999) {
            x = 2 * Math.atan2(qx, qw);
            y = -Math.PI / 2;
            z = 0;
        }
        else if (a2 >= 0.99999) {
            x = 2 * Math.atan2(qx, qw);
            y = Math.PI / 2;
            z = 0;
        }
        else {
            x = Math.atan2(2 * (qw * qx + qy * qz), 1 - 2 * (qx * qx + qy * qy));
            y = Math.asin(a2);
            z = Math.atan2(2 * (qw * qz + qx * qy), 1 - 2 * (qy * qy + qz * qz));
        }
        return eulers.set(x, y, z).mulScalar(_math_tool__WEBPACK_IMPORTED_MODULE_0__["MathTool"].RAD_TO_DEG);
    }
    /**
     * Generates the inverse of the specified quaternion.
     *
     * @returns {Quat} Self for chaining.
     * @example
     * // Create a quaternion rotated 180 degrees around the y-axis
     * var rot = new pc.Quat().setFromEulerAngles(0, 180, 0);
     *
     * // Invert in place
     * rot.invert();
     */
    invert() {
        return this.conjugate().normalize();
    }
    /**
     * Returns the magnitude of the specified quaternion.
     *
     * @returns {number} The magnitude of the specified quaternion.
     * @example
     * var q = new pc.Quat(0, 0, 0, 5);
     * var len = q.length();
     * // Outputs 5
     * console.log("The length of the quaternion is: " + len);
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    /**
     * Returns the magnitude squared of the specified quaternion.
     *
     * @returns {number} The magnitude of the specified quaternion.
     * @example
     * var q = new pc.Quat(3, 4, 0);
     * var lenSq = q.lengthSq();
     * // Outputs 25
     * console.log("The length squared of the quaternion is: " + lenSq);
     */
    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    /**
     * Returns the result of multiplying the specified quaternions together.
     *
     * @param {Quat} rhs - The quaternion used as the second multiplicand of the operation.
     * @returns {Quat} Self for chaining.
     * @example
     * var a = new pc.Quat().setFromEulerAngles(0, 30, 0);
     * var b = new pc.Quat().setFromEulerAngles(0, 60, 0);
     *
     * // a becomes a 90 degree rotation around the Y axis
     * // In other words, a = a * b
     * a.mul(b);
     *
     * console.log("The result of the multiplication is: " + a.toString());
     */
    mul(rhs) {
        const q1x = this.x;
        const q1y = this.y;
        const q1z = this.z;
        const q1w = this.w;
        const q2x = rhs.x;
        const q2y = rhs.y;
        const q2z = rhs.z;
        const q2w = rhs.w;
        this.x = q1w * q2x + q1x * q2w + q1y * q2z - q1z * q2y;
        this.y = q1w * q2y + q1y * q2w + q1z * q2x - q1x * q2z;
        this.z = q1w * q2z + q1z * q2w + q1x * q2y - q1y * q2x;
        this.w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
        return this;
    }
    /**
     * Returns the result of multiplying the specified quaternions together.
     *
     * @param {Quat} lhs - The quaternion used as the first multiplicand of the operation.
     * @param {Quat} rhs - The quaternion used as the second multiplicand of the operation.
     * @returns {Quat} Self for chaining.
     * @example
     * var a = new pc.Quat().setFromEulerAngles(0, 30, 0);
     * var b = new pc.Quat().setFromEulerAngles(0, 60, 0);
     * var r = new pc.Quat();
     *
     * // r is set to a 90 degree rotation around the Y axis
     * // In other words, r = a * b
     * r.mul2(a, b);
     *
     * console.log("The result of the multiplication is: " + r.toString());
     */
    mul2(lhs, rhs) {
        const q1x = lhs.x;
        const q1y = lhs.y;
        const q1z = lhs.z;
        const q1w = lhs.w;
        const q2x = rhs.x;
        const q2y = rhs.y;
        const q2z = rhs.z;
        const q2w = rhs.w;
        this.x = q1w * q2x + q1x * q2w + q1y * q2z - q1z * q2y;
        this.y = q1w * q2y + q1y * q2w + q1z * q2x - q1x * q2z;
        this.z = q1w * q2z + q1z * q2w + q1x * q2y - q1y * q2x;
        this.w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
        return this;
    }
    /**
     * Returns the specified quaternion converted in place to a unit quaternion.
     *
     * @returns {Quat} The result of the normalization.
     * @example
     * var v = new pc.Quat(0, 0, 0, 5);
     *
     * v.normalize();
     *
     * // Outputs 0, 0, 0, 1
     * console.log("The result of the vector normalization is: " + v.toString());
     */
    normalize() {
        let len = this.length();
        if (len === 0) {
            this.x = this.y = this.z = 0;
            this.w = 1;
        }
        else {
            len = 1 / len;
            this.x *= len;
            this.y *= len;
            this.z *= len;
            this.w *= len;
        }
        return this;
    }
    /**
     * Sets the specified quaternion to the supplied numerical values.
     *
     * @param {number} x - The x component of the quaternion.
     * @param {number} y - The y component of the quaternion.
     * @param {number} z - The z component of the quaternion.
     * @param {number} w - The w component of the quaternion.
     * @returns {Quat} Self for chaining.
     * @example
     * var q = new pc.Quat();
     * q.set(1, 0, 0, 0);
     *
     * // Outputs 1, 0, 0, 0
     * console.log("The result of the vector set is: " + q.toString());
     */
    set(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    }
    /**
     * Sets a quaternion from an angular rotation around an axis.
     *
     * @param {Vec3} axis - World space axis around which to rotate.
     * @param {number} angle - Angle to rotate around the given axis in degrees.
     * @returns {Quat} Self for chaining.
     * @example
     * var q = new pc.Quat();
     * q.setFromAxisAngle(pc.Vec3.UP, 90);
     */
    setFromAxisAngle(axis, angle) {
        angle *= 0.5 * _math_tool__WEBPACK_IMPORTED_MODULE_0__["MathTool"].DEG_TO_RAD;
        const sa = Math.sin(angle);
        const ca = Math.cos(angle);
        this.x = sa * axis.x;
        this.y = sa * axis.y;
        this.z = sa * axis.z;
        this.w = ca;
        return this;
    }
    /**
     * Sets a quaternion from Euler angles specified in XYZ order.
     *
     * @param {number} ex - Angle to rotate around X axis in degrees.
     * @param {number} ey - Angle to rotate around Y axis in degrees.
     * @param {number} ez - Angle to rotate around Z axis in degrees.
     * @returns {Quat} Self for chaining.
     * @example
     * var q = new pc.Quat();
     * q.setFromEulerAngles(45, 90, 180);
     */
    setFromEulerAngles(ex, ey, ez) {
        const halfToRad = 0.5 * _math_tool__WEBPACK_IMPORTED_MODULE_0__["MathTool"].DEG_TO_RAD;
        ex *= halfToRad;
        ey *= halfToRad;
        ez *= halfToRad;
        const sx = Math.sin(ex);
        const cx = Math.cos(ex);
        const sy = Math.sin(ey);
        const cy = Math.cos(ey);
        const sz = Math.sin(ez);
        const cz = Math.cos(ez);
        this.x = sx * cy * cz - cx * sy * sz;
        this.y = cx * sy * cz + sx * cy * sz;
        this.z = cx * cy * sz - sx * sy * cz;
        this.w = cx * cy * cz + sx * sy * sz;
        return this;
    }
    setFromEuler(euler) {
        return this.setFromEulerAngles(euler.x, euler.y, euler.z);
    }
    /**
     * Converts the specified 4x4 matrix to a quaternion. Note that since a quaternion is purely a
     * representation for orientation, only the translational part of the matrix is lost.
     *
     * @param {Mat4} m - The 4x4 matrix to convert.
     * @returns {Quat} Self for chaining.
     * @example
     * // Create a 4x4 rotation matrix of 180 degrees around the y-axis
     * var rot = new pc.Mat4().setFromAxisAngle(pc.Vec3.UP, 180);
     *
     * // Convert to a quaternion
     * var q = new pc.Quat().setFromMat4(rot);
     */
    setFromMat4(m) {
        let m00, m01, m02, m10, m11, m12, m20, m21, m22, s, rs, lx, ly, lz;
        var mData = m.data;
        // Cache matrix values for super-speed
        m00 = mData[0];
        m01 = mData[1];
        m02 = mData[2];
        m10 = mData[4];
        m11 = mData[5];
        m12 = mData[6];
        m20 = mData[8];
        m21 = mData[9];
        m22 = mData[10];
        // Remove the scale from the matrix
        lx = m00 * m00 + m01 * m01 + m02 * m02;
        if (lx === 0)
            return this;
        lx = 1 / Math.sqrt(lx);
        ly = m10 * m10 + m11 * m11 + m12 * m12;
        if (ly === 0)
            return this;
        ly = 1 / Math.sqrt(ly);
        lz = m20 * m20 + m21 * m21 + m22 * m22;
        if (lz === 0)
            return this;
        lz = 1 / Math.sqrt(lz);
        m00 *= lx;
        m01 *= lx;
        m02 *= lx;
        m10 *= ly;
        m11 *= ly;
        m12 *= ly;
        m20 *= lz;
        m21 *= lz;
        m22 *= lz;
        // http://www.cs.ucr.edu/~vbz/resources/quatut.pdf
        const tr = m00 + m11 + m22;
        if (tr >= 0) {
            s = Math.sqrt(tr + 1);
            this.w = s * 0.5;
            s = 0.5 / s;
            this.x = (m12 - m21) * s;
            this.y = (m20 - m02) * s;
            this.z = (m01 - m10) * s;
        }
        else {
            if (m00 > m11) {
                if (m00 > m22) {
                    // XDiagDomMatrix
                    rs = m00 - (m11 + m22) + 1;
                    rs = Math.sqrt(rs);
                    this.x = rs * 0.5;
                    rs = 0.5 / rs;
                    this.w = (m12 - m21) * rs;
                    this.y = (m01 + m10) * rs;
                    this.z = (m02 + m20) * rs;
                }
                else {
                    // ZDiagDomMatrix
                    rs = m22 - (m00 + m11) + 1;
                    rs = Math.sqrt(rs);
                    this.z = rs * 0.5;
                    rs = 0.5 / rs;
                    this.w = (m01 - m10) * rs;
                    this.x = (m20 + m02) * rs;
                    this.y = (m21 + m12) * rs;
                }
            }
            else if (m11 > m22) {
                // YDiagDomMatrix
                rs = m11 - (m22 + m00) + 1;
                rs = Math.sqrt(rs);
                this.y = rs * 0.5;
                rs = 0.5 / rs;
                this.w = (m20 - m02) * rs;
                this.z = (m12 + m21) * rs;
                this.x = (m10 + m01) * rs;
            }
            else {
                // ZDiagDomMatrix
                rs = m22 - (m00 + m11) + 1;
                rs = Math.sqrt(rs);
                this.z = rs * 0.5;
                rs = 0.5 / rs;
                this.w = (m01 - m10) * rs;
                this.x = (m20 + m02) * rs;
                this.y = (m21 + m12) * rs;
            }
        }
        return this;
    }
    /**
     * Performs a spherical interpolation between two quaternions. The result of the interpolation
     * is written to the quaternion calling the function.
     *
     * @param {Quat} lhs - The quaternion to interpolate from.
     * @param {Quat} rhs - The quaternion to interpolate to.
     * @param {number} alpha - The value controlling the interpolation in relation to the two input
     * quaternions. The value is in the range 0 to 1, 0 generating q1, 1 generating q2 and anything
     * in between generating a spherical interpolation between the two.
     * @returns {Quat} Self for chaining.
     * @example
     * var q1 = new pc.Quat(-0.11, -0.15, -0.46, 0.87);
     * var q2 = new pc.Quat(-0.21, -0.21, -0.67, 0.68);
     *
     * var result;
     * result = new pc.Quat().slerp(q1, q2, 0);   // Return q1
     * result = new pc.Quat().slerp(q1, q2, 0.5); // Return the midpoint interpolant
     * result = new pc.Quat().slerp(q1, q2, 1);   // Return q2
     */
    slerp(lhs, rhs, alpha) {
        // Algorithm sourced from:
        // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
        const lx = lhs.x;
        const ly = lhs.y;
        const lz = lhs.z;
        const lw = lhs.w;
        let rx = rhs.x;
        let ry = rhs.y;
        let rz = rhs.z;
        let rw = rhs.w;
        // Calculate angle between them.
        let cosHalfTheta = lw * rw + lx * rx + ly * ry + lz * rz;
        if (cosHalfTheta < 0) {
            rw = -rw;
            rx = -rx;
            ry = -ry;
            rz = -rz;
            cosHalfTheta = -cosHalfTheta;
        }
        // If lhs == rhs or lhs == -rhs then theta == 0 and we can return lhs
        if (Math.abs(cosHalfTheta) >= 1) {
            this.w = lw;
            this.x = lx;
            this.y = ly;
            this.z = lz;
            return this;
        }
        // Calculate temporary values.
        const halfTheta = Math.acos(cosHalfTheta);
        const sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);
        // If theta = 180 degrees then result is not fully defined
        // we could rotate around any axis normal to qa or qb
        if (Math.abs(sinHalfTheta) < 0.001) {
            this.w = lw * 0.5 + rw * 0.5;
            this.x = lx * 0.5 + rx * 0.5;
            this.y = ly * 0.5 + ry * 0.5;
            this.z = lz * 0.5 + rz * 0.5;
            return this;
        }
        const ratioA = Math.sin((1 - alpha) * halfTheta) / sinHalfTheta;
        const ratioB = Math.sin(alpha * halfTheta) / sinHalfTheta;
        // Calculate Quaternion.
        this.w = lw * ratioA + rw * ratioB;
        this.x = lx * ratioA + rx * ratioB;
        this.y = ly * ratioA + ry * ratioB;
        this.z = lz * ratioA + rz * ratioB;
        return this;
    }
    /**
     * Transforms a 3-dimensional vector by the specified quaternion.
     *
     * @param {Vec3} vec - The 3-dimensional vector to be transformed.
     * @param {Vec3} [res] - An optional 3-dimensional vector to receive the result of the transformation.
     * @returns {Vec3} The input vector v transformed by the current instance.
     * @example
     * // Create a 3-dimensional vector
     * var v = new pc.Vec3(1, 2, 3);
     *
     * // Create a 4x4 rotation matrix
     * var q = new pc.Quat().setFromEulerAngles(10, 20, 30);
     *
     * var tv = q.transformVector(v);
     */
    transformVector(vec, res = new _math_vec3__WEBPACK_IMPORTED_MODULE_1__["Vec3"]()) {
        const x = vec.x, y = vec.y, z = vec.z;
        const qx = this.x, qy = this.y, qz = this.z, qw = this.w;
        // calculate quat * vec
        const ix = qw * x + qy * z - qz * y;
        const iy = qw * y + qz * x - qx * z;
        const iz = qw * z + qx * y - qy * x;
        const iw = -qx * x - qy * y - qz * z;
        // calculate result * inverse quat
        res.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        res.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        res.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        return res;
    }
    /**
     * Converts the quaternion to string form.
     *
     * @returns {string} The quaternion in string form.
     * @example
     * var v = new pc.Quat(0, 0, 0, 1);
     * // Outputs [0, 0, 0, 1]
     * console.log(v.toString());
     */
    toString() {
        return `[${this.x}, ${this.y}, ${this.z}, ${this.w}]`;
    }
}
/**
 * A constant quaternion set to [0, 0, 0, 1] (the identity).
 *
 * @type {Quat}
 * @readonly
 */
Quat.IDENTITY = Object.freeze(new Quat(0, 0, 0, 1));
/**
 * A constant quaternion set to [0, 0, 0, 0].
 *
 * @type {Quat}
 * @readonly
 */
Quat.ZERO = Object.freeze(new Quat(0, 0, 0, 0));



/***/ }),

/***/ "./src/maths/math.scalar.ts":
/*!**********************************!*\
  !*** ./src/maths/math.scalar.ts ***!
  \**********************************/
/*! exports provided: Scalar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Scalar", function() { return Scalar; });
/**
 * Scalar computation library
 */
class Scalar {
    /**
     * Boolean : true if the absolute difference between a and b is lower than epsilon (default = 1.401298E-45)
     * @param a number
     * @param b number
     * @param epsilon (default = 1.401298E-45)
     * @returns true if the absolute difference between a and b is lower than epsilon (default = 1.401298E-45)
     */
    static WithinEpsilon(a, b, epsilon = 1.401298E-45) {
        return Math.abs(a - b) <= epsilon;
    }
    /**
     * Returns a string : the upper case translation of the number i to hexadecimal.
     * @param i number
     * @returns the upper case translation of the number i to hexadecimal.
     */
    static ToHex(i) {
        var str = i.toString(16);
        if (i <= 15) {
            return ("0" + str).toUpperCase();
        }
        return str.toUpperCase();
    }
    /**
     * Returns -1 if value is negative and +1 is value is positive.
     * @param value the value
     * @returns the value itself if it's equal to zero.
     */
    static Sign(value) {
        value = +value; // convert to a number
        if (value === 0 || isNaN(value)) {
            return value;
        }
        return value > 0 ? 1 : -1;
    }
    /**
     * Returns the value itself if it's between min and max.
     * Returns min if the value is lower than min.
     * Returns max if the value is greater than max.
     * @param value the value to clmap
     * @param min the min value to clamp to (default: 0)
     * @param max the max value to clamp to (default: 1)
     * @returns the clamped value
     */
    static Clamp(value, min = 0, max = 1) {
        return Math.min(max, Math.max(min, value));
    }
    /**
     * the log2 of value.
     * @param value the value to compute log2 of
     * @returns the log2 of value.
     */
    static Log2(value) {
        return Math.log(value) * Math.LOG2E;
    }
    /**
     * the floor part of a log2 value.
     * @param value the value to compute log2 of
     * @returns the log2 of value.
     */
    static ILog2(value) {
        if (Math.log2) {
            return Math.floor(Math.log2(value));
        }
        if (value < 0) {
            return NaN;
        }
        else if (value === 0) {
            return -Infinity;
        }
        let n = 0;
        if (value < 1) {
            while (value < 1) {
                n++;
                value = value * 2;
            }
            n = -n;
        }
        else if (value > 1) {
            while (value > 1) {
                n++;
                value = Math.floor(value / 2);
            }
        }
        return n;
    }
    /**
    * Loops the value, so that it is never larger than length and never smaller than 0.
    *
    * This is similar to the modulo operator but it works with floating point numbers.
    * For example, using 3.0 for t and 2.5 for length, the result would be 0.5.
    * With t = 5 and length = 2.5, the result would be 0.0.
    * Note, however, that the behaviour is not defined for negative numbers as it is for the modulo operator
    * @param value the value
    * @param length the length
    * @returns the looped value
    */
    static Repeat(value, length) {
        return value - Math.floor(value / length) * length;
    }
    /**
     * Normalize the value between 0.0 and 1.0 using min and max values
     * @param value value to normalize
     * @param min max to normalize between
     * @param max min to normalize between
     * @returns the normalized value
     */
    static Normalize(value, min, max) {
        return (value - min) / (max - min);
    }
    /**
    * Denormalize the value from 0.0 and 1.0 using min and max values
    * @param normalized value to denormalize
    * @param min max to denormalize between
    * @param max min to denormalize between
    * @returns the denormalized value
    */
    static Denormalize(normalized, min, max) {
        return (normalized * (max - min) + min);
    }
    /**
    * Calculates the shortest difference between two given angles given in degrees.
    * @param current current angle in degrees
    * @param target target angle in degrees
    * @returns the delta
    */
    static DeltaAngle(current, target) {
        var num = Scalar.Repeat(target - current, 360.0);
        if (num > 180.0) {
            num -= 360.0;
        }
        return num;
    }
    /**
    * PingPongs the value t, so that it is never larger than length and never smaller than 0.
    * @param tx value
    * @param length length
    * @returns The returned value will move back and forth between 0 and length
    */
    static PingPong(tx, length) {
        var t = Scalar.Repeat(tx, length * 2.0);
        return length - Math.abs(t - length);
    }
    /**
    * Interpolates between min and max with smoothing at the limits.
    *
    * This function interpolates between min and max in a similar way to Lerp. However, the interpolation will gradually speed up
    * from the start and slow down toward the end. This is useful for creating natural-looking animation, fading and other transitions.
    * @param from from
    * @param to to
    * @param tx value
    * @returns the smooth stepped value
    */
    static SmoothStep(from, to, tx) {
        var t = Scalar.Clamp(tx);
        t = -2.0 * t * t * t + 3.0 * t * t;
        return to * t + from * (1.0 - t);
    }
    /**
    * Moves a value current towards target.
    *
    * This is essentially the same as Mathf.Lerp but instead the function will ensure that the speed never exceeds maxDelta.
    * Negative values of maxDelta pushes the value away from target.
    * @param current current value
    * @param target target value
    * @param maxDelta max distance to move
    * @returns resulting value
    */
    static MoveTowards(current, target, maxDelta) {
        var result = 0;
        if (Math.abs(target - current) <= maxDelta) {
            result = target;
        }
        else {
            result = current + Scalar.Sign(target - current) * maxDelta;
        }
        return result;
    }
    /**
    * Same as MoveTowards but makes sure the values interpolate correctly when they wrap around 360 degrees.
    *
    * Variables current and target are assumed to be in degrees. For optimization reasons, negative values of maxDelta
    *  are not supported and may cause oscillation. To push current away from a target angle, add 180 to that angle instead.
    * @param current current value
    * @param target target value
    * @param maxDelta max distance to move
    * @returns resulting angle
    */
    static MoveTowardsAngle(current, target, maxDelta) {
        var num = Scalar.DeltaAngle(current, target);
        var result = 0;
        if (-maxDelta < num && num < maxDelta) {
            result = target;
        }
        else {
            target = current + num;
            result = Scalar.MoveTowards(current, target, maxDelta);
        }
        return result;
    }
    /**
     * Creates a new scalar with values linearly interpolated of "amount" between the start scalar and the end scalar.
     * @param start start value
     * @param end target value
     * @param amount amount to lerp between
     * @returns the lerped value
     */
    static Lerp(start, end, amount) {
        return start + ((end - start) * amount);
    }
    /**
    * Same as Lerp but makes sure the values interpolate correctly when they wrap around 360 degrees.
    * The parameter t is clamped to the range [0, 1]. Variables a and b are assumed to be in degrees.
    * @param start start value
    * @param end target value
    * @param amount amount to lerp between
    * @returns the lerped value
    */
    static LerpAngle(start, end, amount) {
        var num = Scalar.Repeat(end - start, 360.0);
        if (num > 180.0) {
            num -= 360.0;
        }
        return start + num * Scalar.Clamp(amount);
    }
    /**
    * Calculates the linear parameter t that produces the interpolant value within the range [a, b].
    * @param a start value
    * @param b target value
    * @param value value between a and b
    * @returns the inverseLerp value
    */
    static InverseLerp(a, b, value) {
        var result = 0;
        if (a != b) {
            result = Scalar.Clamp((value - a) / (b - a));
        }
        else {
            result = 0.0;
        }
        return result;
    }
    /**
     * Returns a new scalar located for "amount" (float) on the Hermite spline defined by the scalars "value1", "value3", "tangent1", "tangent2".
     * @see http://mathworld.wolfram.com/HermitePolynomial.html
     * @param value1 defines the first control point
     * @param tangent1 defines the first tangent
     * @param value2 defines the second control point
     * @param tangent2 defines the second tangent
     * @param amount defines the amount on the interpolation spline (between 0 and 1)
     * @returns hermite result
     */
    static Hermite(value1, tangent1, value2, tangent2, amount) {
        var squared = amount * amount;
        var cubed = amount * squared;
        var part1 = ((2.0 * cubed) - (3.0 * squared)) + 1.0;
        var part2 = (-2.0 * cubed) + (3.0 * squared);
        var part3 = (cubed - (2.0 * squared)) + amount;
        var part4 = cubed - squared;
        return (((value1 * part1) + (value2 * part2)) + (tangent1 * part3)) + (tangent2 * part4);
    }
    /**
     * Returns a new scalar which is the 1st derivative of the Hermite spline defined by the scalars "value1", "value2", "tangent1", "tangent2".
     * @param value1 defines the first control point
     * @param tangent1 defines the first tangent
     * @param value2 defines the second control point
     * @param tangent2 defines the second tangent
     * @param time define where the derivative must be done
     * @returns 1st derivative
     */
    static Hermite1stDerivative(value1, tangent1, value2, tangent2, time) {
        const t2 = time * time;
        return ((t2 - time) * 6 * value1 +
            (3 * t2 - 4 * time + 1) * tangent1 +
            (-t2 + time) * 6 * value2 +
            (3 * t2 - 2 * time) * tangent2);
    }
    /**
    * Returns a random float number between and min and max values
    * @param min min value of random
    * @param max max value of random
    * @returns random value
    */
    static RandomRange(min, max) {
        if (min === max) {
            return min;
        }
        return ((Math.random() * (max - min)) + min);
    }
    /**
    * This function returns percentage of a number in a given range.
    *
    * RangeToPercent(40,20,60) will return 0.5 (50%)
    * RangeToPercent(34,0,100) will return 0.34 (34%)
    * @param number to convert to percentage
    * @param min min range
    * @param max max range
    * @returns the percentage
    */
    static RangeToPercent(number, min, max) {
        return ((number - min) / (max - min));
    }
    /**
    * This function returns number that corresponds to the percentage in a given range.
    *
    * PercentToRange(0.34,0,100) will return 34.
    * @param percent to convert to number
    * @param min min range
    * @param max max range
    * @returns the number
    */
    static PercentToRange(percent, min, max) {
        return ((max - min) * percent + min);
    }
    /**
     * Returns the angle converted to equivalent value between -Math.PI and Math.PI radians.
     * @param angle The angle to normalize in radian.
     * @return The converted angle.
     */
    static NormalizeRadians(angle) {
        // More precise but slower version kept for reference.
        // angle = angle % Tools.TwoPi;
        // angle = (angle + Tools.TwoPi) % Tools.TwoPi;
        //if (angle > Math.PI) {
        //	angle -= Tools.TwoPi;
        //}
        angle -= (Scalar.TwoPi * Math.floor((angle + Math.PI) / Scalar.TwoPi));
        return angle;
    }
    /**
     * Returns the highest common factor of two integers.
     * @param a first parameter
     * @param b second parameter
     * @return HCF of a and b
     */
    static HCF(a, b) {
        const r = a % b;
        if (r === 0) {
            return b;
        }
        return Scalar.HCF(b, r);
    }
}
/**
 * Two pi constants convenient for computation.
 */
Scalar.TwoPi = Math.PI * 2;


/***/ }),

/***/ "./src/maths/math.tool.ts":
/*!********************************!*\
  !*** ./src/maths/math.tool.ts ***!
  \********************************/
/*! exports provided: MathTool */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MathTool", function() { return MathTool; });
/* harmony import */ var _math_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.constants */ "./src/maths/math.constants.ts");

/**
 * @name math
 * @namespace
 * @description Math API.
 */
class MathTool {
    static degToRad(degrees) {
        return degrees * _math_constants__WEBPACK_IMPORTED_MODULE_0__["DEG2RAD"];
    }
    static radToDeg(radians) {
        return radians * _math_constants__WEBPACK_IMPORTED_MODULE_0__["RAD2DEG"];
    }
    /**
     * @function
     * @name math.clamp
     * @description Clamp a number between min and max inclusive.
     * @param {number} value - Number to clamp.
     * @param {number} min - Min value.
     * @param {number} max - Max value.
     * @returns {number} The clamped value.
     */
    static clamp(value, min, max) {
        if (value >= max)
            return max;
        if (value <= min)
            return min;
        return value;
    }
    /**
     * @function
     * @name math.intToBytes24
     * @description Convert an 24 bit integer into an array of 3 bytes.
     * @param {number} i - Number holding an integer value.
     * @returns {number[]} An array of 3 bytes.
     * @example
     * // Set bytes to [0x11, 0x22, 0x33]
     * var bytes = pc.math.intToBytes24(0x112233);
     */
    static intToBytes24(i) {
        var r, g, b;
        r = (i >> 16) & 0xff;
        g = (i >> 8) & 0xff;
        b = i & 0xff;
        return [r, g, b];
    }
    /**
     * @function
     * @name math.intToBytes32
     * @description Convert an 32 bit integer into an array of 4 bytes.
     * @returns {number[]} An array of 4 bytes.
     * @param {number} i - Number holding an integer value.
     * @example
     * // Set bytes to [0x11, 0x22, 0x33, 0x44]
     * var bytes = pc.math.intToBytes32(0x11223344);
     */
    static intToBytes32(i) {
        var r, g, b, a;
        r = (i >> 24) & 0xff;
        g = (i >> 16) & 0xff;
        b = (i >> 8) & 0xff;
        a = i & 0xff;
        return [r, g, b, a];
    }
    /**
     * @function
     * @name math.bytesToInt24
     * @description Convert 3 8 bit Numbers into a single unsigned 24 bit Number.
     * @example
     * // Set result1 to 0x112233 from an array of 3 values
     * var result1 = pc.math.bytesToInt24([0x11, 0x22, 0x33]);
     *
     * // Set result2 to 0x112233 from 3 discrete values
     * var result2 = pc.math.bytesToInt24(0x11, 0x22, 0x33);
     * @param {number} r - A single byte (0-255).
     * @param {number} g - A single byte (0-255).
     * @param {number} b - A single byte (0-255).
     * @returns {number} A single unsigned 24 bit Number.
     */
    static bytesToInt24(bytes) {
        const b = bytes[2];
        const g = bytes[1];
        const r = bytes[0];
        return (r << 16) | (g << 8) | b;
    }
    /**
     * @function
     * @name math.bytesToInt32
     * @description Convert 4 1-byte Numbers into a single unsigned 32bit Number.
     * @returns {number} A single unsigned 32bit Number.
     * @example
     * // Set result1 to 0x11223344 from an array of 4 values
     * var result1 = pc.math.bytesToInt32([0x11, 0x22, 0x33, 0x44]);
     *
     * // Set result2 to 0x11223344 from 4 discrete values
     * var result2 = pc.math.bytesToInt32(0x11, 0x22, 0x33, 0x44);
     * @param {number} r - A single byte (0-255).
     * @param {number} g - A single byte (0-255).
     * @param {number} b - A single byte (0-255).
     * @param {number} a - A single byte (0-255).
     */
    static bytesToInt32(bytes) {
        const a = bytes[3];
        const b = bytes[2];
        const g = bytes[1];
        const r = bytes[0];
        // Why ((r << 24)>>>32)?
        // << operator uses signed 32 bit numbers, so 128<<24 is negative.
        // >>> used unsigned so >>>32 converts back to an unsigned.
        // See http://stackoverflow.com/questions/1908492/unsigned-integer-in-javascript
        return ((r << 24) | (g << 16) | (b << 8) | a) >>> 32;
    }
    /**
     * @function
     * @name math.lerp
     * @returns {number} The linear interpolation of two numbers.
     * @description Calculates the linear interpolation of two numbers.
     * @param {number} a - Number to linearly interpolate from.
     * @param {number} b - Number to linearly interpolate to.
     * @param {number} alpha - The value controlling the result of interpolation. When alpha is 0,
     * a is returned. When alpha is 1, b is returned. Between 0 and 1, a linear interpolation between
     * a and b is returned. alpha is clamped between 0 and 1.
     */
    static lerp(a, b, alpha) {
        return a + (b - a) * MathTool.clamp(alpha, 0, 1);
    }
    /**
     * @function
     * @name math.lerpAngle
     * @description Calculates the linear interpolation of two angles ensuring that interpolation
     * is correctly performed across the 360 to 0 degree boundary. Angles are supplied in degrees.
     * @returns {number} The linear interpolation of two angles.
     * @param {number} a - Angle (in degrees) to linearly interpolate from.
     * @param {number} b - Angle (in degrees) to linearly interpolate to.
     * @param {number} alpha - The value controlling the result of interpolation. When alpha is 0,
     * a is returned. When alpha is 1, b is returned. Between 0 and 1, a linear interpolation between
     * a and b is returned. alpha is clamped between 0 and 1.
     */
    static lerpAngle(a, b, alpha) {
        if (b - a > 180) {
            b -= 360;
        }
        if (b - a < -180) {
            b += 360;
        }
        return MathTool.lerp(a, b, MathTool.clamp(alpha, 0, 1));
    }
    /**
     * @function
     * @name math.powerOfTwo
     * @description Returns true if argument is a power-of-two and false otherwise.
     * @param {number} x - Number to check for power-of-two property.
     * @returns {boolean} True if power-of-two and false otherwise.
     */
    static powerOfTwo(x) {
        return x !== 0 && !(x & (x - 1));
    }
    /**
     * @function
     * @name math.nextPowerOfTwo
     * @description Returns the next power of 2 for the specified value.
     * @param {number} val - The value for which to calculate the next power of 2.
     * @returns {number} The next power of 2.
     */
    static nextPowerOfTwo(val) {
        val--;
        val |= val >> 1;
        val |= val >> 2;
        val |= val >> 4;
        val |= val >> 8;
        val |= val >> 16;
        val++;
        return val;
    }
    /**
     * @function
     * @name math.random
     * @description Return a pseudo-random number between min and max.
     * The number generated is in the range [min, max), that is inclusive of the minimum but exclusive of the maximum.
     * @param {number} min - Lower bound for range.
     * @param {number} max - Upper bound for range.
     * @returns {number} Pseudo-random number between the supplied range.
     */
    static random(min, max) {
        var diff = max - min;
        return Math.random() * diff + min;
    }
    /**
     * @function
     * @name math.smoothstep
     * @description The function interpolates smoothly between two input values based on
     * a third one that should be between the first two. The returned value is clamped
     * between 0 and 1.
     * <br/>The slope (i.e. derivative) of the smoothstep function starts at 0 and ends at 0.
     * This makes it easy to create a sequence of transitions using smoothstep to interpolate
     * each segment rather than using a more sophisticated or expensive interpolation technique.
     * <br/>See http://en.wikipedia.org/wiki/Smoothstep for more details.
     * @param {number} min - The lower bound of the interpolation range.
     * @param {number} max - The upper bound of the interpolation range.
     * @param {number} x - The value to interpolate.
     * @returns {number} The smoothly interpolated value clamped between zero and one.
     */
    static smoothstep(min, max, x) {
        if (x <= min)
            return 0;
        if (x >= max)
            return 1;
        x = (x - min) / (max - min);
        return x * x * (3 - 2 * x);
    }
    /**
     * @function
     * @name math.smootherstep
     * @description An improved version of the {@link math.smoothstep} function which has zero
     * 1st and 2nd order derivatives at t=0 and t=1.
     * <br/>See http://en.wikipedia.org/wiki/Smoothstep for more details.
     * @param {number} min - The lower bound of the interpolation range.
     * @param {number} max - The upper bound of the interpolation range.
     * @param {number} x - The value to interpolate.
     * @returns {number} The smoothly interpolated value clamped between zero and one.
     */
    static smootherstep(min, max, x) {
        if (x <= min)
            return 0;
        if (x >= max)
            return 1;
        x = (x - min) / (max - min);
        return x * x * x * (x * (x * 6 - 15) + 10);
    }
    /**
     * @function
     * @name math.roundUp
     * @description Rounds a number up to nearest multiple.
     * @param {number} numToRound - The number to round up.
     * @param {number} multiple - The multiple to round up to.
     * @returns {number} A number rounded up to nearest multiple.
     */
    static roundUp(numToRound, multiple) {
        if (multiple === 0)
            return numToRound;
        return Math.ceil(numToRound / multiple) * multiple;
    }
    /**
     * @function
     * @name math.float2Half
     * @description Converts float number to half float representation.
     * @param {number} val - The float number.
     * @returns {number} A 16 bit number representing half float representation as used by GPU.
     */
    static float2Half(val) {
        // based on based on https://esdiscuss.org/topic/float16array
        var floatView = new Float32Array(1);
        var int32View = new Int32Array(floatView.buffer);
        // This method is faster than the OpenEXR implementation (very often
        // used, eg. in Ogre), with the additional benefit of rounding, inspired
        // by James Tursa?s half-precision code.
        floatView[0] = val;
        var x = int32View[0];
        var bits = (x >> 16) & 0x8000; // Get the sign
        var m = (x >> 12) & 0x07ff; // Keep one extra bit for rounding
        var e = (x >> 23) & 0xff; // Using int is faster here
        // If zero, or denormal, or exponent underflows too much for a denormal half, return signed zero.
        if (e < 103) {
            return bits;
        }
        // If NaN, return NaN. If Inf or exponent overflow, return Inf.
        if (e > 142) {
            bits |= 0x7c00;
            // If exponent was 0xff and one mantissa bit was set, it means NaN,
            // not Inf, so make sure we set one mantissa bit too.
            bits |= (e == 255 ? 0 : 1) && x & 0x007fffff;
            return bits;
        }
        // If exponent underflows but not too much, return a denormal
        if (e < 113) {
            m |= 0x0800;
            // Extra rounding may overflow and set mantissa to 0 and exponent to 1, which is OK.
            bits |= (m >> (114 - e)) + ((m >> (113 - e)) & 1);
            return bits;
        }
        bits |= ((e - 112) << 10) | (m >> 1);
        // Extra rounding. An overflow will set mantissa to 0 and increment the exponent, which is OK.
        bits += m & 1;
        return bits;
    }
    /**
     * @function
     * @private
     * @name math.between
     * @description Checks whether a given number resides between two other given numbers.
     * @returns {boolean} true if between or false otherwise.
     * @param {number} num - The number to check the position of.
     * @param {number} a - The first upper or lower threshold to check between.
     * @param {number} b - The second upper or lower threshold to check between.
     * @param {boolean} inclusive - If true, a num param which is equal to a or b will return true.
     */
    static between(num, a, b, inclusive) {
        var min = Math.min(a, b), max = Math.max(a, b);
        return inclusive ? num >= min && num <= max : num > min && num < max;
    }
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
    static generateUUID() {
        const d0 = (Math.random() * 0xffffffff) | 0;
        const d1 = (Math.random() * 0xffffffff) | 0;
        const d2 = (Math.random() * 0xffffffff) | 0;
        const d3 = (Math.random() * 0xffffffff) | 0;
        const _lut = [];
        const uuid = _lut[d0 & 0xff] +
            _lut[(d0 >> 8) & 0xff] +
            _lut[(d0 >> 16) & 0xff] +
            _lut[(d0 >> 24) & 0xff] +
            "-" +
            _lut[d1 & 0xff] +
            _lut[(d1 >> 8) & 0xff] +
            "-" +
            _lut[((d1 >> 16) & 0x0f) | 0x40] +
            _lut[(d1 >> 24) & 0xff] +
            "-" +
            _lut[(d2 & 0x3f) | 0x80] +
            _lut[(d2 >> 8) & 0xff] +
            "-" +
            _lut[(d2 >> 16) & 0xff] +
            _lut[(d2 >> 24) & 0xff] +
            _lut[d3 & 0xff] +
            _lut[(d3 >> 8) & 0xff] +
            _lut[(d3 >> 16) & 0xff] +
            _lut[(d3 >> 24) & 0xff];
        // .toUpperCase() here flattens concatenated strings to save heap memory space.
        return uuid.toUpperCase();
    }
    static zTween(_val, _target, _ratio) {
        return Math.abs(_target - _val) < 0.00001 ? _target : _val + (_target - _val) * Math.min(_ratio, 1);
    }
}
/**
 * @constant
 * @type {number}
 * @name math.DEG_TO_RAD
 * @description Conversion factor between degrees and radians.
 * @example
 * // Convert 180 degrees to pi radians
 * var rad = 180 * pc.math.DEG_TO_RAD;
 */
MathTool.DEG_TO_RAD = Math.PI / 180;
/**
 * @constant
 * @type {number}
 * @name math.RAD_TO_DEG
 * @description Conversion factor between degrees and radians.
 * @example
 * // Convert pi radians to 180 degrees
 * var deg = Math.PI * pc.math.RAD_TO_DEG;
 */
MathTool.RAD_TO_DEG = 180 / Math.PI;


/***/ }),

/***/ "./src/maths/math.vec2.ts":
/*!********************************!*\
  !*** ./src/maths/math.vec2.ts ***!
  \********************************/
/*! exports provided: Vec2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Vec2", function() { return Vec2; });
/**
 * A 2-dimensional vector.
 */
class Vec2 {
    /**
     * Create a new Vec2 instance.
     *
     * @param {number|number[]} [x] - The x value. Defaults to 0. If x is an array of length 2, the
     * array will be used to populate all components.
     * @param {number} [y] - The y value. Defaults to 0.
     * @example
     * var v = new pc.Vec2(1, 2);
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    /**
     * Adds a 2-dimensional vector to another in place.
     *
     * @param {Vec2} rhs - The vector to add to the specified vector.
     * @returns {Vec2} Self for chaining.
     * @example
     * var a = new pc.Vec2(10, 10);
     * var b = new pc.Vec2(20, 20);
     *
     * a.add(b);
     *
     * // Outputs [30, 30]
     * console.log("The result of the addition is: " + a.toString());
     */
    add(rhs) {
        this.x += rhs.x;
        this.y += rhs.y;
        return this;
    }
    /**
     * Adds two 2-dimensional vectors together and returns the result.
     *
     * @param {Vec2} lhs - The first vector operand for the addition.
     * @param {Vec2} rhs - The second vector operand for the addition.
     * @returns {Vec2} Self for chaining.
     * @example
     * var a = new pc.Vec2(10, 10);
     * var b = new pc.Vec2(20, 20);
     * var r = new pc.Vec2();
     *
     * r.add2(a, b);
     * // Outputs [30, 30]
     *
     * console.log("The result of the addition is: " + r.toString());
     */
    add2(lhs, rhs) {
        this.x = lhs.x + rhs.x;
        this.y = lhs.y + rhs.y;
        return this;
    }
    /**
     * Adds a number to each element of a vector.
     *
     * @param {number} scalar - The number to add.
     * @returns {Vec2} Self for chaining.
     * @example
     * var vec = new pc.Vec2(3, 4);
     *
     * vec.addScalar(2);
     *
     * // Outputs [5, 6]
     * console.log("The result of the addition is: " + vec.toString());
     */
    addScalar(scalar) {
        this.x += scalar;
        this.y += scalar;
        return this;
    }
    /**
     * Returns an identical copy of the specified 2-dimensional vector.
     *
     * @returns {Vec2} A 2-dimensional vector containing the result of the cloning.
     * @example
     * var v = new pc.Vec2(10, 20);
     * var vclone = v.clone();
     * console.log("The result of the cloning is: " + vclone.toString());
     */
    clone() {
        return new Vec2(this.x, this.y);
    }
    /**
     * Copies the contents of a source 2-dimensional vector to a destination 2-dimensional vector.
     *
     * @param {Vec2} rhs - A vector to copy to the specified vector.
     * @returns {Vec2} Self for chaining.
     * @example
     * var src = new pc.Vec2(10, 20);
     * var dst = new pc.Vec2();
     *
     * dst.copy(src);
     *
     * console.log("The two vectors are " + (dst.equals(src) ? "equal" : "different"));
     */
    copy(rhs) {
        this.x = rhs.x;
        this.y = rhs.y;
        return this;
    }
    /**
     * Returns the result of a cross product operation performed on the two specified 2-dimensional
     * vectors.
     *
     * @param {Vec2} rhs - The second 2-dimensional vector operand of the cross product.
     * @returns {number} The cross product of the two vectors.
     * @example
     * var right = new pc.Vec2(1, 0);
     * var up = new pc.Vec2(0, 1);
     * var crossProduct = right.cross(up);
     *
     * // Prints 1
     * console.log("The result of the cross product is: " + crossProduct);
     */
    cross(rhs) {
        return this.x * rhs.y - this.y * rhs.x;
    }
    /**
     * Returns the distance between the two specified 2-dimensional vectors.
     *
     * @param {Vec2} rhs - The second 2-dimensional vector to test.
     * @returns {number} The distance between the two vectors.
     * @example
     * var v1 = new pc.Vec2(5, 10);
     * var v2 = new pc.Vec2(10, 20);
     * var d = v1.distance(v2);
     * console.log("The distance between v1 and v2 is: " + d);
     */
    distance(rhs) {
        const x = this.x - rhs.x;
        const y = this.y - rhs.y;
        return Math.sqrt(x * x + y * y);
    }
    /**
     * Divides a 2-dimensional vector by another in place.
     *
     * @param {Vec2} rhs - The vector to divide the specified vector by.
     * @returns {Vec2} Self for chaining.
     * @example
     * var a = new pc.Vec2(4, 9);
     * var b = new pc.Vec2(2, 3);
     *
     * a.div(b);
     *
     * // Outputs [2, 3]
     * console.log("The result of the division is: " + a.toString());
     */
    div(rhs) {
        this.x /= rhs.x;
        this.y /= rhs.y;
        return this;
    }
    /**
     * Divides one 2-dimensional vector by another and writes the result to the specified vector.
     *
     * @param {Vec2} lhs - The dividend vector (the vector being divided).
     * @param {Vec2} rhs - The divisor vector (the vector dividing the dividend).
     * @returns {Vec2} Self for chaining.
     * @example
     * var a = new pc.Vec2(4, 9);
     * var b = new pc.Vec2(2, 3);
     * var r = new pc.Vec2();
     *
     * r.div2(a, b);
     * // Outputs [2, 3]
     *
     * console.log("The result of the division is: " + r.toString());
     */
    div2(lhs, rhs) {
        this.x = lhs.x / rhs.x;
        this.y = lhs.y / rhs.y;
        return this;
    }
    /**
     * Divides each element of a vector by a number.
     *
     * @param {number} scalar - The number to divide by.
     * @returns {Vec2} Self for chaining.
     * @example
     * var vec = new pc.Vec2(3, 6);
     *
     * vec.divScalar(3);
     *
     * // Outputs [1, 2]
     * console.log("The result of the division is: " + vec.toString());
     */
    divScalar(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }
    /**
     * Returns the result of a dot product operation performed on the two specified 2-dimensional
     * vectors.
     *
     * @param {Vec2} rhs - The second 2-dimensional vector operand of the dot product.
     * @returns {number} The result of the dot product operation.
     * @example
     * var v1 = new pc.Vec2(5, 10);
     * var v2 = new pc.Vec2(10, 20);
     * var v1dotv2 = v1.dot(v2);
     * console.log("The result of the dot product is: " + v1dotv2);
     */
    dot(rhs) {
        return this.x * rhs.x + this.y * rhs.y;
    }
    /**
     * Reports whether two vectors are equal.
     *
     * @param {Vec2} rhs - The vector to compare to the specified vector.
     * @returns {boolean} True if the vectors are equal and false otherwise.
     * @example
     * var a = new pc.Vec2(1, 2);
     * var b = new pc.Vec2(4, 5);
     * console.log("The two vectors are " + (a.equals(b) ? "equal" : "different"));
     */
    equals(rhs) {
        return this.x === rhs.x && this.y === rhs.y;
    }
    /**
     * Returns the magnitude of the specified 2-dimensional vector.
     *
     * @returns {number} The magnitude of the specified 2-dimensional vector.
     * @example
     * var vec = new pc.Vec2(3, 4);
     * var len = vec.length();
     * // Outputs 5
     * console.log("The length of the vector is: " + len);
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /**
     * Returns the magnitude squared of the specified 2-dimensional vector.
     *
     * @returns {number} The magnitude of the specified 2-dimensional vector.
     * @example
     * var vec = new pc.Vec2(3, 4);
     * var len = vec.lengthSq();
     * // Outputs 25
     * console.log("The length squared of the vector is: " + len);
     */
    lengthSq() {
        return this.x * this.x + this.y * this.y;
    }
    /**
     * Returns the result of a linear interpolation between two specified 2-dimensional vectors.
     *
     * @param {Vec2} lhs - The 2-dimensional to interpolate from.
     * @param {Vec2} rhs - The 2-dimensional to interpolate to.
     * @param {number} alpha - The value controlling the point of interpolation. Between 0 and 1,
     * the linear interpolant will occur on a straight line between lhs and rhs. Outside of this
     * range, the linear interpolant will occur on a ray extrapolated from this line.
     * @returns {Vec2} Self for chaining.
     * @example
     * var a = new pc.Vec2(0, 0);
     * var b = new pc.Vec2(10, 10);
     * var r = new pc.Vec2();
     *
     * r.lerp(a, b, 0);   // r is equal to a
     * r.lerp(a, b, 0.5); // r is 5, 5
     * r.lerp(a, b, 1);   // r is equal to b
     */
    lerp(lhs, rhs, alpha) {
        this.x = lhs.x + alpha * (rhs.x - lhs.x);
        this.y = lhs.y + alpha * (rhs.y - lhs.y);
        return this;
    }
    /**
     * Multiplies a 2-dimensional vector to another in place.
     *
     * @param {Vec2} rhs - The 2-dimensional vector used as the second multiplicand of the operation.
     * @returns {Vec2} Self for chaining.
     * @example
     * var a = new pc.Vec2(2, 3);
     * var b = new pc.Vec2(4, 5);
     *
     * a.mul(b);
     *
     * // Outputs 8, 15
     * console.log("The result of the multiplication is: " + a.toString());
     */
    mul(rhs) {
        this.x *= rhs.x;
        this.y *= rhs.y;
        return this;
    }
    /**
     * Returns the result of multiplying the specified 2-dimensional vectors together.
     *
     * @param {Vec2} lhs - The 2-dimensional vector used as the first multiplicand of the operation.
     * @param {Vec2} rhs - The 2-dimensional vector used as the second multiplicand of the operation.
     * @returns {Vec2} Self for chaining.
     * @example
     * var a = new pc.Vec2(2, 3);
     * var b = new pc.Vec2(4, 5);
     * var r = new pc.Vec2();
     *
     * r.mul2(a, b);
     *
     * // Outputs 8, 15
     * console.log("The result of the multiplication is: " + r.toString());
     */
    mul2(lhs, rhs) {
        this.x = lhs.x * rhs.x;
        this.y = lhs.y * rhs.y;
        return this;
    }
    /**
     * Multiplies each element of a vector by a number.
     *
     * @param {number} scalar - The number to multiply by.
     * @returns {Vec2} Self for chaining.
     * @example
     * var vec = new pc.Vec2(3, 6);
     *
     * vec.mulScalar(3);
     *
     * // Outputs [9, 18]
     * console.log("The result of the multiplication is: " + vec.toString());
     */
    mulScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    /**
     * Returns this 2-dimensional vector converted to a unit vector in place. If the vector has a
     * length of zero, the vector's elements will be set to zero.
     *
     * @returns {Vec2} Self for chaining.
     * @example
     * var v = new pc.Vec2(25, 0);
     *
     * v.normalize();
     *
     * // Outputs 1, 0
     * console.log("The result of the vector normalization is: " + v.toString());
     */
    normalize() {
        const lengthSq = this.x * this.x + this.y * this.y;
        if (lengthSq > 0) {
            const invLength = 1 / Math.sqrt(lengthSq);
            this.x *= invLength;
            this.y *= invLength;
        }
        return this;
    }
    /**
     * Each element is set to the largest integer less than or equal to its value.
     *
     * @returns {Vec2} Self for chaining.
     */
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }
    /**
     * Each element is rounded up to the next largest integer.
     *
     * @returns {Vec2} Self for chaining.
     */
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }
    /**
     * Each element is rounded up or down to the nearest integer.
     *
     * @returns {Vec2} Self for chaining.
     */
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }
    /**
     * Each element is assigned a value from rhs parameter if it is smaller.
     *
     * @param {Vec2} rhs - The 2-dimensional vector used as the source of elements to compare to.
     * @returns {Vec2} Self for chaining.
     */
    min(rhs) {
        if (rhs.x < this.x)
            this.x = rhs.x;
        if (rhs.y < this.y)
            this.y = rhs.y;
        return this;
    }
    /**
     * Each element is assigned a value from rhs parameter if it is larger.
     *
     * @param {Vec2} rhs - The 2-dimensional vector used as the source of elements to compare to.
     * @returns {Vec2} Self for chaining.
     */
    max(rhs) {
        if (rhs.x > this.x)
            this.x = rhs.x;
        if (rhs.y > this.y)
            this.y = rhs.y;
        return this;
    }
    /**
     * Sets the specified 2-dimensional vector to the supplied numerical values.
     *
     * @param {number} x - The value to set on the first component of the vector.
     * @param {number} y - The value to set on the second component of the vector.
     * @returns {Vec2} Self for chaining.
     * @example
     * var v = new pc.Vec2();
     * v.set(5, 10);
     *
     * // Outputs 5, 10
     * console.log("The result of the vector set is: " + v.toString());
     */
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    /**
     * Subtracts a 2-dimensional vector from another in place.
     *
     * @param {Vec2} rhs - The vector to add to the specified vector.
     * @returns {Vec2} Self for chaining.
     * @example
     * var a = new pc.Vec2(10, 10);
     * var b = new pc.Vec2(20, 20);
     *
     * a.sub(b);
     *
     * // Outputs [-10, -10]
     * console.log("The result of the subtraction is: " + a.toString());
     */
    sub(rhs) {
        this.x -= rhs.x;
        this.y -= rhs.y;
        return this;
    }
    /**
     * Subtracts two 2-dimensional vectors from one another and returns the result.
     *
     * @param {Vec2} lhs - The first vector operand for the addition.
     * @param {Vec2} rhs - The second vector operand for the addition.
     * @returns {Vec2} Self for chaining.
     * @example
     * var a = new pc.Vec2(10, 10);
     * var b = new pc.Vec2(20, 20);
     * var r = new pc.Vec2();
     *
     * r.sub2(a, b);
     *
     * // Outputs [-10, -10]
     * console.log("The result of the subtraction is: " + r.toString());
     */
    sub2(lhs, rhs) {
        this.x = lhs.x - rhs.x;
        this.y = lhs.y - rhs.y;
        return this;
    }
    /**
     * Subtracts a number from each element of a vector.
     *
     * @param {number} scalar - The number to subtract.
     * @returns {Vec2} Self for chaining.
     * @example
     * var vec = new pc.Vec2(3, 4);
     *
     * vec.subScalar(2);
     *
     * // Outputs [1, 2]
     * console.log("The result of the subtraction is: " + vec.toString());
     */
    subScalar(scalar) {
        this.x -= scalar;
        this.y -= scalar;
        return this;
    }
    /**
     * Converts the vector to string form.
     *
     * @returns {string} The vector in string form.
     * @example
     * var v = new pc.Vec2(20, 10);
     * // Outputs [20, 10]
     * console.log(v.toString());
     */
    toString() {
        return `[${this.x}, ${this.y}]`;
    }
    /**
     * Calculates the angle between two Vec2's in radians.
     *
     * @param {Vec2} lhs - The first vector operand for the calculation.
     * @param {Vec2} rhs - The second vector operand for the calculation.
     * @returns {number} The calculated angle in radians.
     * @ignore
     */
    static angleRad(lhs, rhs) {
        return Math.atan2(lhs.x * rhs.y - lhs.y * rhs.x, lhs.x * rhs.x + lhs.y * rhs.y);
    }
}
/**
 * A constant vector set to [0, 0].
 *
 * @type {Vec2}
 * @readonly
 */
Vec2.ZERO = Object.freeze(new Vec2(0, 0));
/**
 * A constant vector set to [1, 1].
 *
 * @type {Vec2}
 * @readonly
 */
Vec2.ONE = Object.freeze(new Vec2(1, 1));
/**
 * A constant vector set to [0, 1].
 *
 * @type {Vec2}
 * @readonly
 */
Vec2.UP = Object.freeze(new Vec2(0, 1));
/**
 * A constant vector set to [0, -1].
 *
 * @type {Vec2}
 * @readonly
 */
Vec2.DOWN = Object.freeze(new Vec2(0, -1));
/**
 * A constant vector set to [1, 0].
 *
 * @type {Vec2}
 * @readonly
 */
Vec2.RIGHT = Object.freeze(new Vec2(1, 0));
/**
 * A constant vector set to [-1, 0].
 *
 * @type {Vec2}
 * @readonly
 */
Vec2.LEFT = Object.freeze(new Vec2(-1, 0));


/***/ }),

/***/ "./src/maths/math.vec3.ts":
/*!********************************!*\
  !*** ./src/maths/math.vec3.ts ***!
  \********************************/
/*! exports provided: Vec3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Vec3", function() { return Vec3; });
/**
 * 3-dimensional vector.
 */
class Vec3 {
    /**
     * Creates a new Vec3 object.
     *
     * @param {number} [x] - The x value. Defaults to 0. If x is an array of length 3, the
     * array will be used to populate all components.
     * @param {number} [y] - The y value. Defaults to 0.
     * @param {number} [z] - The z value. Defaults to 0.
     * @example
     * var v = new pc.Vec3(1, 2, 3);
     */
    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
    applyQuaternion(quaternion) {
        throw new Error("Method not implemented.");
    }
    multiplyScalar(distance) {
        throw new Error("Method not implemented.");
    }
    setFromMatrixPosition(m) {
        const e = m.data;
        this.x = e[12];
        this.y = e[13];
        this.z = e[14];
        return this;
    }
    /**
     * Adds a 3-dimensional vector to another in place.
     *
     * @param {Vec3} rhs - The vector to add to the specified vector.
     * @returns {Vec3} Self for chaining.
     * @example
     * var a = new pc.Vec3(10, 10, 10);
     * var b = new pc.Vec3(20, 20, 20);
     *
     * a.add(b);
     *
     * // Outputs [30, 30, 30]
     * console.log("The result of the addition is: " + a.toString());
     */
    add(rhs) {
        this.x += rhs.x;
        this.y += rhs.y;
        this.z += rhs.z;
        return this;
    }
    /**
     * Adds two 3-dimensional vectors together and returns the result.
     *
     * @param {Vec3} lhs - The first vector operand for the addition.
     * @param {Vec3} rhs - The second vector operand for the addition.
     * @returns {Vec3} Self for chaining.
     * @example
     * var a = new pc.Vec3(10, 10, 10);
     * var b = new pc.Vec3(20, 20, 20);
     * var r = new pc.Vec3();
     *
     * r.add2(a, b);
     * // Outputs [30, 30, 30]
     *
     * console.log("The result of the addition is: " + r.toString());
     */
    add2(lhs, rhs) {
        this.x = lhs.x + rhs.x;
        this.y = lhs.y + rhs.y;
        this.z = lhs.z + rhs.z;
        return this;
    }
    /**
     * Adds a number to each element of a vector.
     *
     * @param {number} scalar - The number to add.
     * @returns {Vec3} Self for chaining.
     * @example
     * var vec = new pc.Vec3(3, 4, 5);
     *
     * vec.addScalar(2);
     *
     * // Outputs [5, 6, 7]
     * console.log("The result of the addition is: " + vec.toString());
     */
    addScalar(scalar) {
        this.x += scalar;
        this.y += scalar;
        this.z += scalar;
        return this;
    }
    /**
     * Returns an identical copy of the specified 3-dimensional vector.
     *
     * @returns {Vec3} A 3-dimensional vector containing the result of the cloning.
     * @example
     * var v = new pc.Vec3(10, 20, 30);
     * var vclone = v.clone();
     * console.log("The result of the cloning is: " + vclone.toString());
     */
    clone() {
        return new Vec3(this.x, this.y, this.z);
    }
    /**
     * Copies the contents of a source 3-dimensional vector to a destination 3-dimensional vector.
     *
     * @param {Vec3} rhs - A vector to copy to the specified vector.
     * @returns {Vec3} Self for chaining.
     * @example
     * var src = new pc.Vec3(10, 20, 30);
     * var dst = new pc.Vec3();
     *
     * dst.copy(src);
     *
     * console.log("The two vectors are " + (dst.equals(src) ? "equal" : "different"));
     */
    copy(rhs) {
        this.x = rhs.x;
        this.y = rhs.y;
        this.z = rhs.z;
        return this;
    }
    /**
     * Returns the result of a cross product operation performed on the two specified 3-dimensional
     * vectors.
     *
     * @param {Vec3} lhs - The first 3-dimensional vector operand of the cross product.
     * @param {Vec3} rhs - The second 3-dimensional vector operand of the cross product.
     * @returns {Vec3} Self for chaining.
     * @example
     * var back = new pc.Vec3().cross(pc.Vec3.RIGHT, pc.Vec3.UP);
     *
     * // Prints the Z axis (i.e. [0, 0, 1])
     * console.log("The result of the cross product is: " + back.toString());
     */
    cross(lhs, rhs) {
        // Create temporary variables in case lhs or rhs are 'this'
        const lx = lhs.x;
        const ly = lhs.y;
        const lz = lhs.z;
        const rx = rhs.x;
        const ry = rhs.y;
        const rz = rhs.z;
        this.x = ly * rz - ry * lz;
        this.y = lz * rx - rz * lx;
        this.z = lx * ry - rx * ly;
        return this;
    }
    /**
     * Returns the distance between the two specified 3-dimensional vectors.
     *
     * @param {Vec3} rhs - The second 3-dimensional vector to test.
     * @returns {number} The distance between the two vectors.
     * @example
     * var v1 = new pc.Vec3(5, 10, 20);
     * var v2 = new pc.Vec3(10, 20, 40);
     * var d = v1.distance(v2);
     * console.log("The distance between v1 and v2 is: " + d);
     */
    distance(rhs) {
        const x = this.x - rhs.x;
        const y = this.y - rhs.y;
        const z = this.z - rhs.z;
        return Math.sqrt(x * x + y * y + z * z);
    }
    /**
     * Divides a 3-dimensional vector by another in place.
     *
     * @param {Vec3} rhs - The vector to divide the specified vector by.
     * @returns {Vec3} Self for chaining.
     * @example
     * var a = new pc.Vec3(4, 9, 16);
     * var b = new pc.Vec3(2, 3, 4);
     *
     * a.div(b);
     *
     * // Outputs [2, 3, 4]
     * console.log("The result of the division is: " + a.toString());
     */
    div(rhs) {
        this.x /= rhs.x;
        this.y /= rhs.y;
        this.z /= rhs.z;
        return this;
    }
    /**
     * Divides one 3-dimensional vector by another and writes the result to the specified vector.
     *
     * @param {Vec3} lhs - The dividend vector (the vector being divided).
     * @param {Vec3} rhs - The divisor vector (the vector dividing the dividend).
     * @returns {Vec3} Self for chaining.
     * @example
     * var a = new pc.Vec3(4, 9, 16);
     * var b = new pc.Vec3(2, 3, 4);
     * var r = new pc.Vec3();
     *
     * r.div2(a, b);
     * // Outputs [2, 3, 4]
     *
     * console.log("The result of the division is: " + r.toString());
     */
    div2(lhs, rhs) {
        this.x = lhs.x / rhs.x;
        this.y = lhs.y / rhs.y;
        this.z = lhs.z / rhs.z;
        return this;
    }
    /**
     * Divides each element of a vector by a number.
     *
     * @param {number} scalar - The number to divide by.
     * @returns {Vec3} Self for chaining.
     * @example
     * var vec = new pc.Vec3(3, 6, 9);
     *
     * vec.divScalar(3);
     *
     * // Outputs [1, 2, 3]
     * console.log("The result of the division is: " + vec.toString());
     */
    divScalar(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
        return this;
    }
    /**
     * Returns the result of a dot product operation performed on the two specified 3-dimensional
     * vectors.
     *
     * @param {Vec3} rhs - The second 3-dimensional vector operand of the dot product.
     * @returns {number} The result of the dot product operation.
     * @example
     * var v1 = new pc.Vec3(5, 10, 20);
     * var v2 = new pc.Vec3(10, 20, 40);
     * var v1dotv2 = v1.dot(v2);
     * console.log("The result of the dot product is: " + v1dotv2);
     */
    dot(rhs) {
        return this.x * rhs.x + this.y * rhs.y + this.z * rhs.z;
    }
    /**
     * Reports whether two vectors are equal.
     *
     * @param {Vec3} rhs - The vector to compare to the specified vector.
     * @returns {boolean} True if the vectors are equal and false otherwise.
     * @example
     * var a = new pc.Vec3(1, 2, 3);
     * var b = new pc.Vec3(4, 5, 6);
     * console.log("The two vectors are " + (a.equals(b) ? "equal" : "different"));
     */
    equals(rhs) {
        return this.x === rhs.x && this.y === rhs.y && this.z === rhs.z;
    }
    /**
     * Returns the magnitude of the specified 3-dimensional vector.
     *
     * @returns {number} The magnitude of the specified 3-dimensional vector.
     * @example
     * var vec = new pc.Vec3(3, 4, 0);
     * var len = vec.length();
     * // Outputs 5
     * console.log("The length of the vector is: " + len);
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    /**
     * Returns the magnitude squared of the specified 3-dimensional vector.
     *
     * @returns {number} The magnitude of the specified 3-dimensional vector.
     * @example
     * var vec = new pc.Vec3(3, 4, 0);
     * var len = vec.lengthSq();
     * // Outputs 25
     * console.log("The length squared of the vector is: " + len);
     */
    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    /**
     * Returns the result of a linear interpolation between two specified 3-dimensional vectors.
     *
     * @param {Vec3} lhs - The 3-dimensional to interpolate from.
     * @param {Vec3} rhs - The 3-dimensional to interpolate to.
     * @param {number} alpha - The value controlling the point of interpolation. Between 0 and 1,
     * the linear interpolant will occur on a straight line between lhs and rhs. Outside of this
     * range, the linear interpolant will occur on a ray extrapolated from this line.
     * @returns {Vec3} Self for chaining.
     * @example
     * var a = new pc.Vec3(0, 0, 0);
     * var b = new pc.Vec3(10, 10, 10);
     * var r = new pc.Vec3();
     *
     * r.lerp(a, b, 0);   // r is equal to a
     * r.lerp(a, b, 0.5); // r is 5, 5, 5
     * r.lerp(a, b, 1);   // r is equal to b
     */
    lerp(lhs, rhs, alpha) {
        this.x = lhs.x + alpha * (rhs.x - lhs.x);
        this.y = lhs.y + alpha * (rhs.y - lhs.y);
        this.z = lhs.z + alpha * (rhs.z - lhs.z);
        return this;
    }
    /**
     * Multiplies a 3-dimensional vector to another in place.
     *
     * @param {Vec3} rhs - The 3-dimensional vector used as the second multiplicand of the operation.
     * @returns {Vec3} Self for chaining.
     * @example
     * var a = new pc.Vec3(2, 3, 4);
     * var b = new pc.Vec3(4, 5, 6);
     *
     * a.mul(b);
     *
     * // Outputs 8, 15, 24
     * console.log("The result of the multiplication is: " + a.toString());
     */
    mul(rhs) {
        this.x *= rhs.x;
        this.y *= rhs.y;
        this.z *= rhs.z;
        return this;
    }
    /**
     * Returns the result of multiplying the specified 3-dimensional vectors together.
     *
     * @param {Vec3} lhs - The 3-dimensional vector used as the first multiplicand of the operation.
     * @param {Vec3} rhs - The 3-dimensional vector used as the second multiplicand of the operation.
     * @returns {Vec3} Self for chaining.
     * @example
     * var a = new pc.Vec3(2, 3, 4);
     * var b = new pc.Vec3(4, 5, 6);
     * var r = new pc.Vec3();
     *
     * r.mul2(a, b);
     *
     * // Outputs 8, 15, 24
     * console.log("The result of the multiplication is: " + r.toString());
     */
    mul2(lhs, rhs) {
        this.x = lhs.x * rhs.x;
        this.y = lhs.y * rhs.y;
        this.z = lhs.z * rhs.z;
        return this;
    }
    /**
     * Multiplies each element of a vector by a number.
     *
     * @param {number} scalar - The number to multiply by.
     * @returns {Vec3} Self for chaining.
     * @example
     * var vec = new pc.Vec3(3, 6, 9);
     *
     * vec.mulScalar(3);
     *
     * // Outputs [9, 18, 27]
     * console.log("The result of the multiplication is: " + vec.toString());
     */
    mulScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }
    /**
     * Returns this 3-dimensional vector converted to a unit vector in place. If the vector has a
     * length of zero, the vector's elements will be set to zero.
     *
     * @returns {Vec3} Self for chaining.
     * @example
     * var v = new pc.Vec3(25, 0, 0);
     *
     * v.normalize();
     *
     * // Outputs 1, 0, 0
     * console.log("The result of the vector normalization is: " + v.toString());
     */
    normalize() {
        const lengthSq = this.x * this.x + this.y * this.y + this.z * this.z;
        if (lengthSq > 0) {
            const invLength = 1 / Math.sqrt(lengthSq);
            this.x *= invLength;
            this.y *= invLength;
            this.z *= invLength;
        }
        return this;
    }
    /**
     * Each element is set to the largest integer less than or equal to its value.
     *
     * @returns {Vec3} Self for chaining.
     */
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
    }
    /**
     * Each element is rounded up to the next largest integer.
     *
     * @returns {Vec3} Self for chaining.
     */
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
    }
    /**
     * Each element is rounded up or down to the nearest integer.
     *
     * @returns {Vec3} Self for chaining.
     */
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    }
    /**
     * Each element is assigned a value from rhs parameter if it is smaller.
     *
     * @param {Vec3} rhs - The 3-dimensional vector used as the source of elements to compare to.
     * @returns {Vec3} Self for chaining.
     */
    min(rhs) {
        if (rhs.x < this.x)
            this.x = rhs.x;
        if (rhs.y < this.y)
            this.y = rhs.y;
        if (rhs.z < this.z)
            this.z = rhs.z;
        return this;
    }
    /**
     * Each element is assigned a value from rhs parameter if it is larger.
     *
     * @param {Vec3} rhs - The 3-dimensional vector used as the source of elements to compare to.
     * @returns {Vec3} Self for chaining.
     */
    max(rhs) {
        if (rhs.x > this.x)
            this.x = rhs.x;
        if (rhs.y > this.y)
            this.y = rhs.y;
        if (rhs.z > this.z)
            this.z = rhs.z;
        return this;
    }
    /**
     * Projects this 3-dimensional vector onto the specified vector.
     *
     * @param {Vec3} rhs - The vector onto which the original vector will be projected on.
     * @returns {Vec3} Self for chaining.
     * @example
     * var v = new pc.Vec3(5, 5, 5);
     * var normal = new pc.Vec3(1, 0, 0);
     *
     * v.project(normal);
     *
     * // Outputs 5, 0, 0
     * console.log("The result of the vector projection is: " + v.toString());
     */
    project(rhs) {
        const a_dot_b = this.x * rhs.x + this.y * rhs.y + this.z * rhs.z;
        const b_dot_b = rhs.x * rhs.x + rhs.y * rhs.y + rhs.z * rhs.z;
        const s = a_dot_b / b_dot_b;
        this.x = rhs.x * s;
        this.y = rhs.y * s;
        this.z = rhs.z * s;
        return this;
    }
    /**
     * Sets the specified 3-dimensional vector to the supplied numerical values.
     *
     * @param {number} x - The value to set on the first component of the vector.
     * @param {number} y - The value to set on the second component of the vector.
     * @param {number} z - The value to set on the third component of the vector.
     * @returns {Vec3} Self for chaining.
     * @example
     * var v = new pc.Vec3();
     * v.set(5, 10, 20);
     *
     * // Outputs 5, 10, 20
     * console.log("The result of the vector set is: " + v.toString());
     */
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    /**
     * Subtracts a 3-dimensional vector from another in place.
     *
     * @param {Vec3} rhs - The vector to add to the specified vector.
     * @returns {Vec3} Self for chaining.
     * @example
     * var a = new pc.Vec3(10, 10, 10);
     * var b = new pc.Vec3(20, 20, 20);
     *
     * a.sub(b);
     *
     * // Outputs [-10, -10, -10]
     * console.log("The result of the subtraction is: " + a.toString());
     */
    sub(rhs) {
        this.x -= rhs.x;
        this.y -= rhs.y;
        this.z -= rhs.z;
        return this;
    }
    /**
     * Subtracts two 3-dimensional vectors from one another and returns the result.
     *
     * @param {Vec3} lhs - The first vector operand for the addition.
     * @param {Vec3} rhs - The second vector operand for the addition.
     * @returns {Vec3} Self for chaining.
     * @example
     * var a = new pc.Vec3(10, 10, 10);
     * var b = new pc.Vec3(20, 20, 20);
     * var r = new pc.Vec3();
     *
     * r.sub2(a, b);
     *
     * // Outputs [-10, -10, -10]
     * console.log("The result of the subtraction is: " + r.toString());
     */
    sub2(lhs, rhs) {
        this.x = lhs.x - rhs.x;
        this.y = lhs.y - rhs.y;
        this.z = lhs.z - rhs.z;
        return this;
    }
    /**
     * Subtracts a number from each element of a vector.
     *
     * @param {number} scalar - The number to subtract.
     * @returns {Vec3} Self for chaining.
     * @example
     * var vec = new pc.Vec3(3, 4, 5);
     *
     * vec.subScalar(2);
     *
     * // Outputs [1, 2, 3]
     * console.log("The result of the subtraction is: " + vec.toString());
     */
    subScalar(scalar) {
        this.x -= scalar;
        this.y -= scalar;
        this.z -= scalar;
        return this;
    }
    /**
     * Converts the vector to string form.
     *
     * @returns {string} The vector in string form.
     * @example
     * var v = new pc.Vec3(20, 10, 5);
     * // Outputs [20, 10, 5]
     * console.log(v.toString());
     */
    toString() {
        return `[${this.x}, ${this.y}, ${this.z}]`;
    }
}
/**
 * A constant vector set to [0, 0, 0].
 *
 * @type {Vec3}
 * @readonly
 */
Vec3.ZERO = Object.freeze(new Vec3(0, 0, 0));
/**
 * A constant vector set to [1, 1, 1].
 *
 * @type {Vec3}
 * @readonly
 */
Vec3.ONE = Object.freeze(new Vec3(1, 1, 1));
/**
 * A constant vector set to [0, 1, 0].
 *
 * @type {Vec3}
 * @readonly
 */
Vec3.UP = Object.freeze(new Vec3(0, 1, 0));
/**
 * A constant vector set to [0, -1, 0].
 *
 * @type {Vec3}
 * @readonly
 */
Vec3.DOWN = Object.freeze(new Vec3(0, -1, 0));
/**
 * A constant vector set to [1, 0, 0].
 *
 * @type {Vec3}
 * @readonly
 */
Vec3.RIGHT = Object.freeze(new Vec3(1, 0, 0));
/**
 * A constant vector set to [-1, 0, 0].
 *
 * @type {Vec3}
 * @readonly
 */
Vec3.LEFT = Object.freeze(new Vec3(-1, 0, 0));
/**
 * A constant vector set to [0, 0, -1].
 *
 * @type {Vec3}
 * @readonly
 */
Vec3.FORWARD = Object.freeze(new Vec3(0, 0, -1));
/**
 * A constant vector set to [0, 0, 1].
 *
 * @type {Vec3}
 * @readonly
 */
Vec3.BACK = Object.freeze(new Vec3(0, 0, 1));



/***/ }),

/***/ "./src/maths/math.vec4.ts":
/*!********************************!*\
  !*** ./src/maths/math.vec4.ts ***!
  \********************************/
/*! exports provided: Vec4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Vec4", function() { return Vec4; });
/**
 * A 4-dimensional vector.
 */
class Vec4 {
    /**
     * Creates a new Vec4 object.
     *
     * @param {number|number[]} [x] - The x value. Defaults to 0. If x is an array of length 4, the
     * array will be used to populate all components.
     * @param {number} [y] - The y value. Defaults to 0.
     * @param {number} [z] - The z value. Defaults to 0.
     * @param {number} [w] - The w value. Defaults to 0.
     * @example
     * var v = new pc.Vec4(1, 2, 3, 4);
     */
    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    /**
     * Adds a 4-dimensional vector to another in place.
     *
     * @param {Vec4} rhs - The vector to add to the specified vector.
     * @returns {Vec4} Self for chaining.
     * @example
     * var a = new pc.Vec4(10, 10, 10, 10);
     * var b = new pc.Vec4(20, 20, 20, 20);
     *
     * a.add(b);
     *
     * // Outputs [30, 30, 30]
     * console.log("The result of the addition is: " + a.toString());
     */
    add(rhs) {
        this.x += rhs.x;
        this.y += rhs.y;
        this.z += rhs.z;
        this.w += rhs.w;
        return this;
    }
    /**
     * Adds two 4-dimensional vectors together and returns the result.
     *
     * @param {Vec4} lhs - The first vector operand for the addition.
     * @param {Vec4} rhs - The second vector operand for the addition.
     * @returns {Vec4} Self for chaining.
     * @example
     * var a = new pc.Vec4(10, 10, 10, 10);
     * var b = new pc.Vec4(20, 20, 20, 20);
     * var r = new pc.Vec4();
     *
     * r.add2(a, b);
     * // Outputs [30, 30, 30]
     *
     * console.log("The result of the addition is: " + r.toString());
     */
    add2(lhs, rhs) {
        this.x = lhs.x + rhs.x;
        this.y = lhs.y + rhs.y;
        this.z = lhs.z + rhs.z;
        this.w = lhs.w + rhs.w;
        return this;
    }
    /**
     * Adds a number to each element of a vector.
     *
     * @param {number} scalar - The number to add.
     * @returns {Vec4} Self for chaining.
     * @example
     * var vec = new pc.Vec4(3, 4, 5, 6);
     *
     * vec.addScalar(2);
     *
     * // Outputs [5, 6, 7, 8]
     * console.log("The result of the addition is: " + vec.toString());
     */
    addScalar(scalar) {
        this.x += scalar;
        this.y += scalar;
        this.z += scalar;
        this.w += scalar;
        return this;
    }
    /**
     * Returns an identical copy of the specified 4-dimensional vector.
     *
     * @returns {Vec4} A 4-dimensional vector containing the result of the cloning.
     * @example
     * var v = new pc.Vec4(10, 20, 30, 40);
     * var vclone = v.clone();
     * console.log("The result of the cloning is: " + vclone.toString());
     */
    clone() {
        return new Vec4(this.x, this.y, this.z, this.w);
    }
    /**
     * Copies the contents of a source 4-dimensional vector to a destination 4-dimensional vector.
     *
     * @param {Vec4} rhs - A vector to copy to the specified vector.
     * @returns {Vec4} Self for chaining.
     * @example
     * var src = new pc.Vec4(10, 20, 30, 40);
     * var dst = new pc.Vec4();
     *
     * dst.copy(src);
     *
     * console.log("The two vectors are " + (dst.equals(src) ? "equal" : "different"));
     */
    copy(rhs) {
        this.x = rhs.x;
        this.y = rhs.y;
        this.z = rhs.z;
        this.w = rhs.w;
        return this;
    }
    /**
     * Divides a 4-dimensional vector by another in place.
     *
     * @param {Vec4} rhs - The vector to divide the specified vector by.
     * @returns {Vec4} Self for chaining.
     * @example
     * var a = new pc.Vec4(4, 9, 16, 25);
     * var b = new pc.Vec4(2, 3, 4, 5);
     *
     * a.div(b);
     *
     * // Outputs [2, 3, 4, 5]
     * console.log("The result of the division is: " + a.toString());
     */
    div(rhs) {
        this.x /= rhs.x;
        this.y /= rhs.y;
        this.z /= rhs.z;
        this.w /= rhs.w;
        return this;
    }
    /**
     * Divides one 4-dimensional vector by another and writes the result to the specified vector.
     *
     * @param {Vec4} lhs - The dividend vector (the vector being divided).
     * @param {Vec4} rhs - The divisor vector (the vector dividing the dividend).
     * @returns {Vec4} Self for chaining.
     * @example
     * var a = new pc.Vec4(4, 9, 16, 25);
     * var b = new pc.Vec4(2, 3, 4, 5);
     * var r = new pc.Vec4();
     *
     * r.div2(a, b);
     * // Outputs [2, 3, 4, 5]
     *
     * console.log("The result of the division is: " + r.toString());
     */
    div2(lhs, rhs) {
        this.x = lhs.x / rhs.x;
        this.y = lhs.y / rhs.y;
        this.z = lhs.z / rhs.z;
        this.w = lhs.w / rhs.w;
        return this;
    }
    /**
     * Divides each element of a vector by a number.
     *
     * @param {number} scalar - The number to divide by.
     * @returns {Vec4} Self for chaining.
     * @example
     * var vec = new pc.Vec4(3, 6, 9, 12);
     *
     * vec.divScalar(3);
     *
     * // Outputs [1, 2, 3, 4]
     * console.log("The result of the division is: " + vec.toString());
     */
    divScalar(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
        this.w /= scalar;
        return this;
    }
    /**
     * Returns the result of a dot product operation performed on the two specified 4-dimensional
     * vectors.
     *
     * @param {Vec4} rhs - The second 4-dimensional vector operand of the dot product.
     * @returns {number} The result of the dot product operation.
     * @example
     * var v1 = new pc.Vec4(5, 10, 20, 40);
     * var v2 = new pc.Vec4(10, 20, 40, 80);
     * var v1dotv2 = v1.dot(v2);
     * console.log("The result of the dot product is: " + v1dotv2);
     */
    dot(rhs) {
        return this.x * rhs.x + this.y * rhs.y + this.z * rhs.z + this.w * rhs.w;
    }
    /**
     * Reports whether two vectors are equal.
     *
     * @param {Vec4} rhs - The vector to compare to the specified vector.
     * @returns {boolean} True if the vectors are equal and false otherwise.
     * @example
     * var a = new pc.Vec4(1, 2, 3, 4);
     * var b = new pc.Vec4(5, 6, 7, 8);
     * console.log("The two vectors are " + (a.equals(b) ? "equal" : "different"));
     */
    equals(rhs) {
        return this.x === rhs.x && this.y === rhs.y && this.z === rhs.z && this.w === rhs.w;
    }
    /**
     * Returns the magnitude of the specified 4-dimensional vector.
     *
     * @returns {number} The magnitude of the specified 4-dimensional vector.
     * @example
     * var vec = new pc.Vec4(3, 4, 0, 0);
     * var len = vec.length();
     * // Outputs 5
     * console.log("The length of the vector is: " + len);
     */
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    /**
     * Returns the magnitude squared of the specified 4-dimensional vector.
     *
     * @returns {number} The magnitude of the specified 4-dimensional vector.
     * @example
     * var vec = new pc.Vec4(3, 4, 0);
     * var len = vec.lengthSq();
     * // Outputs 25
     * console.log("The length squared of the vector is: " + len);
     */
    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    /**
     * Returns the result of a linear interpolation between two specified 4-dimensional vectors.
     *
     * @param {Vec4} lhs - The 4-dimensional to interpolate from.
     * @param {Vec4} rhs - The 4-dimensional to interpolate to.
     * @param {number} alpha - The value controlling the point of interpolation. Between 0 and 1,
     * the linear interpolant will occur on a straight line between lhs and rhs. Outside of this
     * range, the linear interpolant will occur on a ray extrapolated from this line.
     * @returns {Vec4} Self for chaining.
     * @example
     * var a = new pc.Vec4(0, 0, 0, 0);
     * var b = new pc.Vec4(10, 10, 10, 10);
     * var r = new pc.Vec4();
     *
     * r.lerp(a, b, 0);   // r is equal to a
     * r.lerp(a, b, 0.5); // r is 5, 5, 5, 5
     * r.lerp(a, b, 1);   // r is equal to b
     */
    lerp(lhs, rhs, alpha) {
        this.x = lhs.x + alpha * (rhs.x - lhs.x);
        this.y = lhs.y + alpha * (rhs.y - lhs.y);
        this.z = lhs.z + alpha * (rhs.z - lhs.z);
        this.w = lhs.w + alpha * (rhs.w - lhs.w);
        return this;
    }
    /**
     * Multiplies a 4-dimensional vector to another in place.
     *
     * @param {Vec4} rhs - The 4-dimensional vector used as the second multiplicand of the operation.
     * @returns {Vec4} Self for chaining.
     * @example
     * var a = new pc.Vec4(2, 3, 4, 5);
     * var b = new pc.Vec4(4, 5, 6, 7);
     *
     * a.mul(b);
     *
     * // Outputs 8, 15, 24, 35
     * console.log("The result of the multiplication is: " + a.toString());
     */
    mul(rhs) {
        this.x *= rhs.x;
        this.y *= rhs.y;
        this.z *= rhs.z;
        this.w *= rhs.w;
        return this;
    }
    /**
     * Returns the result of multiplying the specified 4-dimensional vectors together.
     *
     * @param {Vec4} lhs - The 4-dimensional vector used as the first multiplicand of the operation.
     * @param {Vec4} rhs - The 4-dimensional vector used as the second multiplicand of the operation.
     * @returns {Vec4} Self for chaining.
     * @example
     * var a = new pc.Vec4(2, 3, 4, 5);
     * var b = new pc.Vec4(4, 5, 6, 7);
     * var r = new pc.Vec4();
     *
     * r.mul2(a, b);
     *
     * // Outputs 8, 15, 24, 35
     * console.log("The result of the multiplication is: " + r.toString());
     */
    mul2(lhs, rhs) {
        this.x = lhs.x * rhs.x;
        this.y = lhs.y * rhs.y;
        this.z = lhs.z * rhs.z;
        this.w = lhs.w * rhs.w;
        return this;
    }
    /**
     * Multiplies each element of a vector by a number.
     *
     * @param {number} scalar - The number to multiply by.
     * @returns {Vec4} Self for chaining.
     * @example
     * var vec = new pc.Vec4(3, 6, 9, 12);
     *
     * vec.mulScalar(3);
     *
     * // Outputs [9, 18, 27, 36]
     * console.log("The result of the multiplication is: " + vec.toString());
     */
    mulScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        this.w *= scalar;
        return this;
    }
    /**
     * Returns this 4-dimensional vector converted to a unit vector in place. If the vector has a
     * length of zero, the vector's elements will be set to zero.
     *
     * @returns {Vec4} Self for chaining.
     * @example
     * var v = new pc.Vec4(25, 0, 0, 0);
     *
     * v.normalize();
     *
     * // Outputs 1, 0, 0, 0
     * console.log("The result of the vector normalization is: " + v.toString());
     */
    normalize() {
        const lengthSq = this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
        if (lengthSq > 0) {
            const invLength = 1 / Math.sqrt(lengthSq);
            this.x *= invLength;
            this.y *= invLength;
            this.z *= invLength;
            this.w *= invLength;
        }
        return this;
    }
    /**
     * Each element is set to the largest integer less than or equal to its value.
     *
     * @returns {Vec4} Self for chaining.
     */
    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        this.w = Math.floor(this.w);
        return this;
    }
    /**
     * Each element is rounded up to the next largest integer.
     *
     * @returns {Vec4} Self for chaining.
     */
    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        this.w = Math.ceil(this.w);
        return this;
    }
    /**
     * Each element is rounded up or down to the nearest integer.
     *
     * @returns {Vec4} Self for chaining.
     */
    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        this.w = Math.round(this.w);
        return this;
    }
    /**
     * Each element is assigned a value from rhs parameter if it is smaller.
     *
     * @param {Vec4} rhs - The 4-dimensional vector used as the source of elements to compare to.
     * @returns {Vec4} Self for chaining.
     */
    min(rhs) {
        if (rhs.x < this.x)
            this.x = rhs.x;
        if (rhs.y < this.y)
            this.y = rhs.y;
        if (rhs.z < this.z)
            this.z = rhs.z;
        if (rhs.w < this.w)
            this.w = rhs.w;
        return this;
    }
    /**
     * Each element is assigned a value from rhs parameter if it is larger.
     *
     * @param {Vec4} rhs - The 4-dimensional vector used as the source of elements to compare to.
     * @returns {Vec4} Self for chaining.
     */
    max(rhs) {
        if (rhs.x > this.x)
            this.x = rhs.x;
        if (rhs.y > this.y)
            this.y = rhs.y;
        if (rhs.z > this.z)
            this.z = rhs.z;
        if (rhs.w > this.w)
            this.w = rhs.w;
        return this;
    }
    /**
     * Sets the specified 4-dimensional vector to the supplied numerical values.
     *
     * @param {number} x - The value to set on the first component of the vector.
     * @param {number} y - The value to set on the second component of the vector.
     * @param {number} z - The value to set on the third component of the vector.
     * @param {number} w - The value to set on the fourth component of the vector.
     * @returns {Vec4} Self for chaining.
     * @example
     * var v = new pc.Vec4();
     * v.set(5, 10, 20, 40);
     *
     * // Outputs 5, 10, 20, 40
     * console.log("The result of the vector set is: " + v.toString());
     */
    set(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    }
    /**
     * Subtracts a 4-dimensional vector from another in place.
     *
     * @param {Vec4} rhs - The vector to add to the specified vector.
     * @returns {Vec4} Self for chaining.
     * @example
     * var a = new pc.Vec4(10, 10, 10, 10);
     * var b = new pc.Vec4(20, 20, 20, 20);
     *
     * a.sub(b);
     *
     * // Outputs [-10, -10, -10, -10]
     * console.log("The result of the subtraction is: " + a.toString());
     */
    sub(rhs) {
        this.x -= rhs.x;
        this.y -= rhs.y;
        this.z -= rhs.z;
        this.w -= rhs.w;
        return this;
    }
    /**
     * Subtracts two 4-dimensional vectors from one another and returns the result.
     *
     * @param {Vec4} lhs - The first vector operand for the subtraction.
     * @param {Vec4} rhs - The second vector operand for the subtraction.
     * @returns {Vec4} Self for chaining.
     * @example
     * var a = new pc.Vec4(10, 10, 10, 10);
     * var b = new pc.Vec4(20, 20, 20, 20);
     * var r = new pc.Vec4();
     *
     * r.sub2(a, b);
     *
     * // Outputs [-10, -10, -10, -10]
     * console.log("The result of the subtraction is: " + r.toString());
     */
    sub2(lhs, rhs) {
        this.x = lhs.x - rhs.x;
        this.y = lhs.y - rhs.y;
        this.z = lhs.z - rhs.z;
        this.w = lhs.w - rhs.w;
        return this;
    }
    /**
     * Subtracts a number from each element of a vector.
     *
     * @param {number} scalar - The number to subtract.
     * @returns {Vec4} Self for chaining.
     * @example
     * var vec = new pc.Vec4(3, 4, 5, 6);
     *
     * vec.subScalar(2);
     *
     * // Outputs [1, 2, 3, 4]
     * console.log("The result of the subtraction is: " + vec.toString());
     */
    subScalar(scalar) {
        this.x -= scalar;
        this.y -= scalar;
        this.z -= scalar;
        this.w -= scalar;
        return this;
    }
    /**
     * Converts the vector to string form.
     *
     * @returns {string} The vector in string form.
     * @example
     * var v = new pc.Vec4(20, 10, 5, 0);
     * // Outputs [20, 10, 5, 0]
     * console.log(v.toString());
     */
    toString() {
        return `[${this.x}, ${this.y}, ${this.z}, ${this.w}]`;
    }
}
/**
 * A constant vector set to [0, 0, 0, 0].
 *
 * @type {Vec4}
 * @readonly
 */
Vec4.ZERO = Object.freeze(new Vec4(0, 0, 0, 0));
/**
 * A constant vector set to [1, 1, 1, 1].
 *
 * @type {Vec4}
 * @readonly
 */
Vec4.ONE = Object.freeze(new Vec4(1, 1, 1, 1));



/***/ }),

/***/ "./src/mesh/index.ts":
/*!***************************!*\
  !*** ./src/mesh/index.ts ***!
  \***************************/
/*! exports provided: Mesh */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mesh__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mesh */ "./src/mesh/mesh.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Mesh", function() { return _mesh__WEBPACK_IMPORTED_MODULE_0__["Mesh"]; });




/***/ }),

/***/ "./src/mesh/mesh.ts":
/*!**************************!*\
  !*** ./src/mesh/mesh.ts ***!
  \**************************/
/*! exports provided: Mesh */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Mesh", function() { return Mesh; });
/* harmony import */ var _maths_math_euler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../maths/math.euler */ "./src/maths/math.euler.ts");
/* harmony import */ var _maths_math_mat3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../maths/math.mat3 */ "./src/maths/math.mat3.ts");
/* harmony import */ var _maths_math_mat4__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../maths/math.mat4 */ "./src/maths/math.mat4.ts");
/* harmony import */ var _maths_math_quat__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../maths/math.quat */ "./src/maths/math.quat.ts");
/* harmony import */ var _maths_math_tool__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../maths/math.tool */ "./src/maths/math.tool.ts");
/* harmony import */ var _maths_math_vec3__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../maths/math.vec3 */ "./src/maths/math.vec3.ts");
/* harmony import */ var _misc_tool__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../misc/tool */ "./src/misc/tool.ts");







class Mesh {
    constructor(engine, geometry, material) {
        this.geometry = geometry;
        this._engine = engine;
        this.uuid = _maths_math_tool__WEBPACK_IMPORTED_MODULE_4__["MathTool"].generateUUID();
        this.material = material;
        this.visible = true;
        this.matrix = new _maths_math_mat4__WEBPACK_IMPORTED_MODULE_2__["Mat4"]();
        this.normalMatrix = new _maths_math_mat3__WEBPACK_IMPORTED_MODULE_1__["Mat3"]();
        this.position = new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_5__["Vec3"]();
        this.scale = new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_5__["Vec3"](1, 1, 1);
        this.rotation = new _maths_math_euler__WEBPACK_IMPORTED_MODULE_0__["Euler"]();
        this.quaternion = new _maths_math_quat__WEBPACK_IMPORTED_MODULE_3__["Quat"]();
        this.updateMatrix = this.updateMatrix.bind(this);
        this._onRotationChange = this._onRotationChange.bind(this);
        this.position = Object(_misc_tool__WEBPACK_IMPORTED_MODULE_6__["addProxy"])(this.position, this.updateMatrix);
        this.scale = Object(_misc_tool__WEBPACK_IMPORTED_MODULE_6__["addProxy"])(this.scale, this.updateMatrix);
        this.rotation = Object(_misc_tool__WEBPACK_IMPORTED_MODULE_6__["addProxy"])(this.rotation, this._onRotationChange);
    }
    _onRotationChange() {
        this.quaternion.setFromEuler(this.rotation, false);
        this.updateMatrix();
    }
    active() {
        this.geometry.setBuffers(this.material.program);
        this.material.setUniform();
    }
    updateMatrix() {
        this.matrix.compose(this.position, this.quaternion, this.scale);
    }
}


/***/ }),

/***/ "./src/misc/arrayTools.ts":
/*!********************************!*\
  !*** ./src/misc/arrayTools.ts ***!
  \********************************/
/*! exports provided: ArrayTools */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ArrayTools", function() { return ArrayTools; });
/**
 * Class containing a set of static utilities functions for arrays.
 */
class ArrayTools {
    /**
     * Returns an array of the given size filled with element built from the given constructor and the paramters
     * @param size the number of element to construct and put in the array
     * @param itemBuilder a callback responsible for creating new instance of item. Called once per array entry.
     * @returns a new array filled with new objects
     */
    static BuildArray(size, itemBuilder) {
        const a = [];
        for (let i = 0; i < size; ++i) {
            a.push(itemBuilder());
        }
        return a;
    }
}


/***/ }),

/***/ "./src/misc/fileTools.ts":
/*!*******************************!*\
  !*** ./src/misc/fileTools.ts ***!
  \*******************************/
/*! exports provided: FileTools */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FileTools", function() { return FileTools; });
/**
 * @hidden
 */
class FileTools {
    static LoadImage(src) {
        return new Promise(function (resolve, reject) {
            let img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = function () {
                resolve(img);
            };
            img.onerror = function () {
                reject("ERROR WHILE TRYING TO LOAD SKYBOX TEXTURE");
            };
            img.src = src;
        });
    }
    static LoadCubeImages(urls) {
        return new Promise(function (resolve, reject) {
            let ct = 0;
            let img = new Array(6);
            for (let i = 0; i < 6; i++) {
                img[i] = new Image();
                img[i].onload = function () {
                    ct++;
                    if (ct == 6) {
                        resolve(img);
                    }
                };
                img[i].onerror = function () {
                    reject("ERROR WHILE TRYING TO LOAD SKYBOX TEXTURE");
                };
                img[i].src = urls[i];
            }
        });
    }
}


/***/ }),

/***/ "./src/misc/logger.ts":
/*!****************************!*\
  !*** ./src/misc/logger.ts ***!
  \****************************/
/*! exports provided: Logger */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Logger", function() { return Logger; });
/**
 * Logger used througouht the application to allow configuration of
 * the log level required for the messages.
 */
class Logger {
    static _AddLogEntry(entry) {
        Logger._LogCache = entry + Logger._LogCache;
        if (Logger.OnNewCacheEntry) {
            Logger.OnNewCacheEntry(entry);
        }
    }
    static _FormatMessage(message) {
        var padStr = (i) => (i < 10 ? "0" + i : "" + i);
        var date = new Date();
        return "[" + padStr(date.getHours()) + ":" + padStr(date.getMinutes()) + ":" + padStr(date.getSeconds()) + "]: " + message;
    }
    static _LogDisabled(message) {
        // nothing to do
    }
    static _LogEnabled(message) {
        var formattedMessage = Logger._FormatMessage(message);
        console.log("EasyCG - " + formattedMessage);
        // var entry = "<div style='color:white'>" + formattedMessage + "</div><br>";
        // Logger._AddLogEntry(entry);
    }
    static _WarnDisabled(message) {
        // nothing to do
    }
    static _WarnEnabled(message) {
        var formattedMessage = Logger._FormatMessage(message);
        console.warn("EasyCG - " + formattedMessage);
        // var entry = "<div style='color:orange'>" + formattedMessage + "</div><br>";
        // Logger._AddLogEntry(entry);
    }
    static _ErrorDisabled(message) {
        // nothing to do
    }
    static _ErrorEnabled(message) {
        Logger.errorsCount++;
        var formattedMessage = Logger._FormatMessage(message);
        console.error("EasyCG - " + formattedMessage);
        // var entry = "<div style='color:red'>" + formattedMessage + "</div><br>";
        // Logger._AddLogEntry(entry);
    }
    /**
     * Gets current log cache (list of logs)
     */
    static get LogCache() {
        return Logger._LogCache;
    }
    /**
     * Clears the log cache
     */
    static ClearLogCache() {
        Logger._LogCache = "";
        Logger.errorsCount = 0;
    }
    /**
     * Sets the current log level (MessageLogLevel / WarningLogLevel / ErrorLogLevel)
     */
    static set LogLevels(level) {
        if ((level & Logger.MessageLogLevel) === Logger.MessageLogLevel) {
            Logger.Log = Logger._LogEnabled;
        }
        else {
            Logger.Log = Logger._LogDisabled;
        }
        if ((level & Logger.WarningLogLevel) === Logger.WarningLogLevel) {
            Logger.Warn = Logger._WarnEnabled;
        }
        else {
            Logger.Warn = Logger._WarnDisabled;
        }
        if ((level & Logger.ErrorLogLevel) === Logger.ErrorLogLevel) {
            Logger.Error = Logger._ErrorEnabled;
        }
        else {
            Logger.Error = Logger._ErrorDisabled;
        }
    }
    /**
     * Assertion error message. If the assertion is false, the error message is written to the log.
     *
     * @param {boolean} assertion - The assertion to check.
     * @param {...*} args - The values to be written to the log.
     */
    static Assert(assertion, ...args) {
        if (!assertion) {
            console.error("ASSERT FAILED: ", ...args);
        }
    }
}
/**
 * No log
 */
Logger.NoneLogLevel = 0;
/**
 * Only message logs
 */
Logger.MessageLogLevel = 1;
/**
 * Only warning logs
 */
Logger.WarningLogLevel = 2;
/**
 * Only error logs
 */
Logger.ErrorLogLevel = 4;
/**
 * All logs
 */
Logger.AllLogLevel = 7;
Logger._LogCache = "";
/**
 * Gets a value indicating the number of loading errors
 * @ignorenaming
 */
Logger.errorsCount = 0;
/**
 * Log a message to the console
 */
Logger.Log = Logger._LogEnabled;
/**
 * Write a warning message to the console
 */
Logger.Warn = Logger._WarnEnabled;
/**
 * Write an error message to the console
 */
Logger.Error = Logger._ErrorEnabled;


/***/ }),

/***/ "./src/misc/tool.ts":
/*!**************************!*\
  !*** ./src/misc/tool.ts ***!
  \**************************/
/*! exports provided: addProxy, cloneUniforms */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addProxy", function() { return addProxy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cloneUniforms", function() { return cloneUniforms; });
function addProxy(proxyObj, setCb, getCb) {
    const handler = {
        get(target, key) {
            let result = target[key];
            getCb && getCb(result);
            return result;
        },
        set(target, key, value) {
            target[key] = value;
            setCb && setCb(this);
            return this;
        },
    };
    return new Proxy(proxyObj, handler);
}
function cloneUniforms(src) {
    const dst = {};
    for (const u in src) {
        dst[u] = {};
        for (const p in src[u]) {
            const property = src[u][p];
            if (property &&
                (property.isColor || property.isMatrix3 || property.isMatrix4 || property.isVector2 || property.isVector3 || property.isVector4 || property.isTexture || property.isQuaternion)) {
                dst[u][p] = property.clone();
            }
            else if (Array.isArray(property)) {
                dst[u][p] = property.slice();
            }
            else {
                dst[u][p] = property;
            }
        }
    }
    return dst;
}


/***/ }),

/***/ "./src/misc/typeStore.ts":
/*!*******************************!*\
  !*** ./src/misc/typeStore.ts ***!
  \*******************************/
/*! exports provided: _TypeStore */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_TypeStore", function() { return _TypeStore; });
/** @hidden */
class _TypeStore {
    /** @hidden */
    static GetClass(fqdn) {
        if (this.RegisteredTypes && this.RegisteredTypes[fqdn]) {
            return this.RegisteredTypes[fqdn];
        }
        return null;
    }
}
/** @hidden */
_TypeStore.RegisteredTypes = {};


/***/ }),

/***/ "./src/object3D.ts":
/*!*************************!*\
  !*** ./src/object3D.ts ***!
  \*************************/
/*! exports provided: Object3D */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Object3D", function() { return Object3D; });
/* harmony import */ var _maths_math_mat4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./maths/math.mat4 */ "./src/maths/math.mat4.ts");
/* harmony import */ var _maths_math_mat3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./maths/math.mat3 */ "./src/maths/math.mat3.ts");
/* harmony import */ var _maths_math_tool__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./maths/math.tool */ "./src/maths/math.tool.ts");
/* harmony import */ var _maths_math_vec3__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./maths/math.vec3 */ "./src/maths/math.vec3.ts");
/* harmony import */ var _maths_math_quat__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./maths/math.quat */ "./src/maths/math.quat.ts");
/* harmony import */ var _maths_math_euler__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./maths/math.euler */ "./src/maths/math.euler.ts");





// import { EventDispatcher } from "./EventDispatcher.js";

// import { Layers } from './Layers.js';
// import { Matrix3 } from "../math/Matrix3.js";
// import * as MathUtils from "../math/MathUtils.js";
let _object3DId = 0;
const _v1 = /*@__PURE__*/ new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_3__["Vec3"]();
const _q1 = /*@__PURE__*/ new _maths_math_quat__WEBPACK_IMPORTED_MODULE_4__["Quat"]();
const _m1 = /*@__PURE__*/ new _maths_math_mat4__WEBPACK_IMPORTED_MODULE_0__["Mat4"]();
const _target = /*@__PURE__*/ new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_3__["Vec3"]();
const _position = /*@__PURE__*/ new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_3__["Vec3"]();
const _scale = /*@__PURE__*/ new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_3__["Vec3"]();
const _quaternion = /*@__PURE__*/ new _maths_math_quat__WEBPACK_IMPORTED_MODULE_4__["Quat"]();
const _xAxis = /*@__PURE__*/ new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_3__["Vec3"](1, 0, 0);
const _yAxis = /*@__PURE__*/ new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_3__["Vec3"](0, 1, 0);
const _zAxis = /*@__PURE__*/ new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_3__["Vec3"](0, 0, 1);
const _addedEvent = { type: "added" };
const _removedEvent = { type: "removed" };
class Object3D {
    constructor() {
        // Object.defineProperty(this, "id", { value: _object3DId++ });
        this.uuid = _maths_math_tool__WEBPACK_IMPORTED_MODULE_2__["MathTool"].generateUUID();
        this.name = "";
        this.type = "Object3D";
        this.parent = null;
        this.children = [];
        this.up = Object3D.DefaultUp.clone();
        const position = new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_3__["Vec3"]();
        const rotation = new _maths_math_euler__WEBPACK_IMPORTED_MODULE_5__["Euler"]();
        const quaternion = new _maths_math_quat__WEBPACK_IMPORTED_MODULE_4__["Quat"]();
        const scale = new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_3__["Vec3"](1, 1, 1);
        function onRotationChange() {
            quaternion.setFromEuler(rotation);
        }
        Object.defineProperties(this, {
            position: {
                configurable: true,
                enumerable: true,
                value: position,
            },
            rotation: {
                configurable: true,
                enumerable: true,
                value: rotation,
            },
            quaternion: {
                configurable: true,
                enumerable: true,
                value: quaternion,
            },
            scale: {
                configurable: true,
                enumerable: true,
                value: scale,
            },
            modelViewMatrix: {
                value: new _maths_math_mat4__WEBPACK_IMPORTED_MODULE_0__["Mat4"](),
            },
            normalMatrix: {
                value: new _maths_math_mat3__WEBPACK_IMPORTED_MODULE_1__["Mat3"](),
            },
        });
        this.matrix = new _maths_math_mat4__WEBPACK_IMPORTED_MODULE_0__["Mat4"]();
        this.matrixWorld = new _maths_math_mat4__WEBPACK_IMPORTED_MODULE_0__["Mat4"]();
        this.matrixAutoUpdate = Object3D.DefaultMatrixAutoUpdate;
        this.matrixWorldNeedsUpdate = false;
        // this.layers = new Layers();
        this.visible = true;
        this.castShadow = false;
        this.receiveShadow = false;
        this.frustumCulled = true;
        this.renderOrder = 0;
        this.animations = [];
        this.userData = {};
    }
    copy(source, recursive) {
        throw new Error("Method not implemented.");
    }
    onBeforeRender() { }
    onAfterRender() { }
    applyMatrix4(matrix) {
        if (this.matrixAutoUpdate)
            this.updateMatrix();
        this.matrix.mul(matrix);
        this.matrix.decompose(this.position, this.quaternion, this.scale);
    }
    applyQuaternion(q) {
        this.quaternion.mul(q);
        return this;
    }
    setRotationFromAxisAngle(axis, angle) {
        // assumes axis is normalized
        this.quaternion.setFromAxisAngle(axis, angle);
    }
    setRotationFromEuler(euler) {
        this.quaternion.setFromEuler(euler);
    }
    setRotationFromMatrix(m) {
        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
        this.quaternion.setFromMat4(m);
    }
    setRotationFromQuaternion(q) {
        // assumes q is normalized
        this.quaternion.copy(q);
    }
    rotateOnAxis(axis, angle) {
        // rotate object on axis in object space
        // axis is assumed to be normalized
        _q1.setFromAxisAngle(axis, angle);
        this.quaternion.mul(_q1);
        return this;
    }
    rotateOnWorldAxis(axis, angle) {
        // rotate object on axis in world space
        // axis is assumed to be normalized
        // method assumes no rotated parent
        _q1.setFromAxisAngle(axis, angle);
        this.quaternion.mul(_q1);
        return this;
    }
    rotateX(angle) {
        return this.rotateOnAxis(_xAxis, angle);
    }
    rotateY(angle) {
        return this.rotateOnAxis(_yAxis, angle);
    }
    rotateZ(angle) {
        return this.rotateOnAxis(_zAxis, angle);
    }
    translateOnAxis(axis, distance) {
        // translate object by distance along axis in object space
        // axis is assumed to be normalized
        _v1.copy(axis).applyQuaternion(this.quaternion);
        this.position.add(_v1.multiplyScalar(distance));
        return this;
    }
    translateX(distance) {
        return this.translateOnAxis(_xAxis, distance);
    }
    translateY(distance) {
        return this.translateOnAxis(_yAxis, distance);
    }
    translateZ(distance) {
        return this.translateOnAxis(_zAxis, distance);
    }
    localToWorld(vector) {
        return vector.applyMatrix4(this.matrixWorld);
    }
    worldToLocal(vector) {
        return vector.applyMatrix4(_m1.copy(this.matrixWorld).invert());
    }
    lookAt(x) {
        // This method does not support objects having non-uniformly-scaled parent(s)
        _target.copy(x);
        const parent = this.parent;
        this.updateWorldMatrix(true, false);
        _position.setFromMatrixPosition(this.matrixWorld);
        if (this.isCamera || this.isLight) {
            _m1.setLookAt(_position, _target, this.up);
        }
        else {
            _m1.setLookAt(_target, _position, this.up);
        }
        this.quaternion.setFromMat4(_m1);
        // if (parent) {
        //     _m1.extractRotation(parent.matrixWorld);
        //     _q1.setFromMat4(_m1);
        //     this.quaternion.mul(_q1.invert());
        // }
    }
    getWorldPosition(target) {
        this.updateWorldMatrix(true, false);
        return target.setFromMatrixPosition(this.matrixWorld);
    }
    getWorldQuaternion(target) {
        this.updateWorldMatrix(true, false);
        this.matrixWorld.decompose(_position, target, _scale);
        return target;
    }
    getWorldScale(target) {
        this.updateWorldMatrix(true, false);
        this.matrixWorld.decompose(_position, _quaternion, target);
        return target;
    }
    getWorldDirection(target) {
        this.updateWorldMatrix(true, false);
        const e = this.matrixWorld.data;
        return target.set(e[8], e[9], e[10]).normalize();
    }
    updateMatrix() {
        this.matrix.compose(this.position, this.quaternion, this.scale);
        this.matrixWorldNeedsUpdate = true;
    }
    updateMatrixWorld(force) {
        if (this.matrixAutoUpdate)
            this.updateMatrix();
        if (this.matrixWorldNeedsUpdate || force) {
            if (this.parent === null) {
                this.matrixWorld.copy(this.matrix);
            }
            else {
                this.matrixWorld.mul2(this.parent.matrixWorld, this.matrix);
            }
            this.matrixWorldNeedsUpdate = false;
            force = true;
        }
        // update children
        // const children = this.children;
        // for (let i = 0, l = children.length; i < l; i++) {
        //     children[i].updateMatrixWorld(force);
        // }
    }
    updateWorldMatrix(updateParents, updateChildren) {
        const parent = this.parent;
        if (updateParents === true && parent !== null) {
            parent.updateWorldMatrix(true, false);
        }
        if (this.matrixAutoUpdate)
            this.updateMatrix();
        if (this.parent === null) {
            this.matrixWorld.copy(this.matrix);
        }
        else {
            this.matrixWorld.mul2(this.parent.matrixWorld, this.matrix);
        }
        // update children
        if (updateChildren === true) {
            const children = this.children;
            for (let i = 0, l = children.length; i < l; i++) {
                children[i].updateWorldMatrix(false, true);
            }
        }
    }
}
Object3D.DefaultUp = new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_3__["Vec3"](0, 1, 0);
Object3D.DefaultMatrixAutoUpdate = true;
Object3D.prototype.isObject3D = true;



/***/ }),

/***/ "./src/renderer/index.ts":
/*!*******************************!*\
  !*** ./src/renderer/index.ts ***!
  \*******************************/
/*! exports provided: RenderTarget */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _render_target__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./render.target */ "./src/renderer/render.target.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RenderTarget", function() { return _render_target__WEBPACK_IMPORTED_MODULE_0__["RenderTarget"]; });

/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderer */ "./src/renderer/renderer.ts");
/* empty/unused harmony star reexport */



/***/ }),

/***/ "./src/renderer/render.target.ts":
/*!***************************************!*\
  !*** ./src/renderer/render.target.ts ***!
  \***************************************/
/*! exports provided: RenderTarget */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderTarget", function() { return RenderTarget; });
/* harmony import */ var _engines__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../engines */ "./src/engines/index.ts");
/* harmony import */ var _misc_logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../misc/logger */ "./src/misc/logger.ts");
/* harmony import */ var _texture__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../texture */ "./src/texture/index.ts");



class RenderTarget {
    constructor(engine, options) {
        this._engine = engine;
        this.glFrameBuffer = null;
        this.glDepthBuffer = null;
        this.colorBuffer = new _texture__WEBPACK_IMPORTED_MODULE_2__["Texture"](engine, {
            width: options.width,
            height: options.height,
            format: _engines__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_R8_G8_B8_A8,
            addressU: _engines__WEBPACK_IMPORTED_MODULE_0__["TextureAddress"].ADDRESS_CLAMP_TO_EDGE,
            addressV: _engines__WEBPACK_IMPORTED_MODULE_0__["TextureAddress"].ADDRESS_CLAMP_TO_EDGE,
            minFilter: _engines__WEBPACK_IMPORTED_MODULE_0__["TextureFilter"].FILTER_LINEAR,
            magFilter: _engines__WEBPACK_IMPORTED_MODULE_0__["TextureFilter"].FILTER_LINEAR,
        });
        this.colorBuffer.needsUpload = true;
        this.stencil = false;
        if (this.depthBuffer) {
            const format = this.depthBuffer.format;
            if (format === _engines__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_DEPTH) {
                this.depth = true;
                this.stencil = false;
            }
            else if (format === _engines__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_DEPTHSTENCIL) {
                this.depth = true;
                this.stencil = true;
            }
            else {
                _misc_logger__WEBPACK_IMPORTED_MODULE_1__["Logger"].Warn("Incorrect depthBuffer format. Must be pc.PIXELFORMAT_DEPTH or pc.PIXELFORMAT_DEPTHSTENCIL");
                this.depth = false;
                this.stencil = false;
            }
        }
        else {
            this.depth = options.depth !== undefined ? options.depth : false;
            this.stencil = options.stencil !== undefined ? options.stencil : false;
        }
        this.samples = options.samples !== undefined ? Math.min(options.samples, this._engine.capabilities.maxSamples) : 1;
        this._engine.engineRenderTarget.initRenderTarget(this);
    }
    /**
     * Width of the render target in pixels.
     *
     * @type {number}
     */
    get width() {
        return this.colorBuffer ? this.colorBuffer.width : this.depthBuffer.width;
    }
    /**
     * Height of the render target in pixels.
     *
     * @type {number}
     */
    get height() {
        return this.colorBuffer ? this.colorBuffer.height : this.depthBuffer.height;
    }
}


/***/ }),

/***/ "./src/renderer/renderer.ts":
/*!**********************************!*\
  !*** ./src/renderer/renderer.ts ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Renderer; });
/* harmony import */ var _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../engines/engine.enum */ "./src/engines/engine.enum.ts");
/* harmony import */ var _maths_math_color__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../maths/math.color */ "./src/maths/math.color.ts");
/* harmony import */ var _maths_math_mat3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../maths/math.mat3 */ "./src/maths/math.mat3.ts");
/* harmony import */ var _maths_math_mat4__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../maths/math.mat4 */ "./src/maths/math.mat4.ts");
/* harmony import */ var _maths_math_vec3__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../maths/math.vec3 */ "./src/maths/math.vec3.ts");
// WebGLIndexedBufferRenderer.js





class Renderer {
    constructor(engine) {
        this._engine = engine;
        this.currentPrograme = null;
        this.currentRenderTarget = null;
        this.clearColor = new _maths_math_color__WEBPACK_IMPORTED_MODULE_1__["Color4"](0.2, 0.19, 0.3, 1.0);
    }
    /**
     * 更新内置的uniform
     * @param program
     * @param mesh
     * @param camera
     */
    _updateSystemUniform(program, mesh, camera) {
        camera.updateMatrix();
        camera.updateMatrixWorld();
        camera.updateProjectionMatrix();
        mesh.updateMatrix();
        this._engine.engineUniform.setUniform(program, "projectionMatrix", camera.projectionMatrix.data, _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Matrix4);
        const modelViewMatrix = new _maths_math_mat4__WEBPACK_IMPORTED_MODULE_3__["Mat4"]();
        modelViewMatrix.mul2(camera.matrixWorldInverse, mesh.matrix);
        this._engine.engineUniform.setUniform(program, "modelViewMatrix", modelViewMatrix.data, _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Matrix4);
        this._engine.engineUniform.setUniform(program, "world", mesh.matrix.data, _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Matrix4);
        // 法线: world -> eye
        mesh.normalMatrix.getNormalMatrix(modelViewMatrix);
        this._engine.engineUniform.setUniform(program, "normalMatrix", mesh.normalMatrix.data, _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Matrix4);
        let _vector3 = new _maths_math_vec3__WEBPACK_IMPORTED_MODULE_4__["Vec3"]();
        _vector3 = _vector3.setFromMatrixPosition(camera.matrixWorld);
        // vEyePosition/cameraPosition
        this._engine.engineUniform.setUniform(program, "vEyePosition", _vector3, _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Vector3);
        this._engine.engineUniform.setUniform(program, "viewMatrix", camera.matrixWorldInverse.data, _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Matrix4);
        let _tempMat3 = new _maths_math_mat3__WEBPACK_IMPORTED_MODULE_2__["Mat3"]();
        _tempMat3.setFromMatrix4(camera.matrixWorldInverse).invert();
        this._engine.engineUniform.setUniform(program, "inverseViewTransform", _tempMat3.data, _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Matrix3);
        this._engine.engineUniform.setUniform(program, "modelMatrix", mesh.matrix.data, _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__["UniformsType"].Matrix4);
    }
    // 根据材质设置webgl状态
    // _readMaterial(material) {
    //     const gl = dao.getData("gl");
    //     const { blending, depthTest, side } = material;
    //     const { blendingType, blendRGBASrc, blendRGBADst, blendRGB_ASrc, blendRGB_ADst } = material;
    //     WebGLInterface.setDepthTest(gl, depthTest);
    //     WebGLInterface.setBlend(gl, blending, blendingType, blendRGBASrc, blendRGBADst, blendRGB_ASrc, blendRGB_ADst);
    //     WebGLInterface.setSide(gl, side);
    //     WebGLInterface.cullFace(gl, false);
    // }
    renderMesh(mesh, camera) {
        if (mesh.visible == false)
            return;
        const { geometry, material } = mesh;
        const { geometryInfo } = geometry;
        const program = material.program;
        mesh.active();
        this._updateSystemUniform(program, mesh, camera);
        this._engine.engineDraw.draw({
            type: geometryInfo.type,
            indexed: geometryInfo.indices.length > 0,
            count: geometryInfo.count,
        });
        // 多采样帧缓冲区
        // if (this.currentRenderTarget && this.currentRenderTarget.isMultisample) {
        //     const { width, height } = this.currentRenderTarget;
        //     gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.currentRenderTarget.multiSampleFrameBuffer);
        //     gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.currentRenderTarget.normalFrameBuffer);
        //     gl.blitFramebuffer(0, 0, width, height, 0, 0, width, height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
        // }
    }
    setRenderTarget(target) {
        this._target = target;
        this._engine.engineRenderTarget.setRenderTarget(target);
    }
    clear() {
        this._engine.engineDraw.clear(this.clearColor);
    }
    setViewPort() {
        let width = this._engine.renderingCanvas.clientWidth;
        let height = this._engine.renderingCanvas.clientHeight;
        if (this._target) {
            width = this._target.width;
            height = this._target.height;
        }
        this._engine.engineViewPort.setViewport({
            x: 0,
            y: 0,
            width,
            height: height,
        });
    }
    renderScene(scene, camera) {
        this.clear();
        this.setViewPort();
        for (let i = 0; i < scene.children.length; i++) {
            const mesh = scene.children[i];
            this.renderMesh(mesh, camera);
        }
    }
}


/***/ }),

/***/ "./src/scene/index.ts":
/*!****************************!*\
  !*** ./src/scene/index.ts ***!
  \****************************/
/*! exports provided: Scene */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scene__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scene */ "./src/scene/scene.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Scene", function() { return _scene__WEBPACK_IMPORTED_MODULE_0__["Scene"]; });




/***/ }),

/***/ "./src/scene/scene.ts":
/*!****************************!*\
  !*** ./src/scene/scene.ts ***!
  \****************************/
/*! exports provided: Scene */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Scene", function() { return Scene; });
class Scene {
    constructor(engine) {
        this._engine = engine;
        this.children = [];
    }
    add(object) {
        this.children.push(object);
    }
    remove(object) {
        const index = this.children.indexOf(object);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }
}


/***/ }),

/***/ "./src/texture/index.ts":
/*!******************************!*\
  !*** ./src/texture/index.ts ***!
  \******************************/
/*! exports provided: Texture */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _texture__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./texture */ "./src/texture/texture.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Texture", function() { return _texture__WEBPACK_IMPORTED_MODULE_0__["Texture"]; });




/***/ }),

/***/ "./src/texture/texture.ts":
/*!********************************!*\
  !*** ./src/texture/texture.ts ***!
  \********************************/
/*! exports provided: Texture */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Texture", function() { return Texture; });
/* harmony import */ var _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../engines/engine.enum */ "./src/engines/engine.enum.ts");
/* harmony import */ var _maths_math_tool__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../maths/math.tool */ "./src/maths/math.tool.ts");


let id = 0;
class Texture {
    constructor(engine, options) {
        this.uuid = id++;
        this._compareOnRead = false;
        this._cubemap = false;
        this._volume = false;
        this._engine = engine;
        this.needsUpload = false;
        if (!options) {
            options = {};
        }
        this._source = null;
        this._minFilter = options.minFilter !== undefined ? options.minFilter : _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureFilter"].FILTER_LINEAR_MIPMAP_LINEAR;
        this._magFilter = options.magFilter !== undefined ? options.magFilter : _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureFilter"].FILTER_LINEAR;
        this._addressU = options.addressU !== undefined ? options.addressU : _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureAddress"].ADDRESS_REPEAT;
        this._addressV = options.addressV !== undefined ? options.addressV : _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureAddress"].ADDRESS_REPEAT;
        this._flipY = options.flipY !== undefined ? options.flipY : true;
        this._format = options.format !== undefined ? options.format : _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__["TextureFormat"].PIXELFORMAT_R8_G8_B8_A8;
        this._compareOnRead = options.compareOnRead !== undefined ? options.compareOnRead : false;
        this._compareFunc = options.compareFunc !== undefined ? options.compareFunc : _engines_engine_enum__WEBPACK_IMPORTED_MODULE_0__["CompareFunc"].FUNC_LESS;
        this._premultiplyAlpha = options.premultiplyAlpha !== undefined ? options.premultiplyAlpha : false;
        this._parameterFlags = 255; // 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128
        this._width = options.width !== undefined ? options.width : 0;
        this._height = options.height !== undefined ? options.height : 0;
    }
    get parameterFlags() {
        return this._parameterFlags;
    }
    set parameterFlags(v) {
        this._parameterFlags = v;
    }
    get cubemap() {
        return this._cubemap;
    }
    get volume() {
        return this._volume;
    }
    get flipY() {
        return this._flipY;
    }
    set flipY(v) {
        this._flipY = v;
    }
    set premultiplyAlpha(premultiplyAlpha) {
        if (this._premultiplyAlpha !== premultiplyAlpha) {
            this._premultiplyAlpha = premultiplyAlpha;
            this.needsUpload = true;
        }
    }
    get premultiplyAlpha() {
        return this._premultiplyAlpha;
    }
    get minFilter() {
        return this._minFilter;
    }
    set minFilter(v) {
        this._minFilter = v;
        this._parameterFlags |= 1;
    }
    get magFilter() {
        return this._magFilter;
    }
    set magFilter(v) {
        this._magFilter = v;
        this._parameterFlags |= 2;
    }
    get addressU() {
        return this._addressU;
    }
    set addressU(v) {
        this._addressU = v;
        this._parameterFlags |= 4;
    }
    get addressV() {
        return this._addressV;
    }
    set addressV(v) {
        this._addressV = v;
        this._parameterFlags |= 8;
    }
    get format() {
        return this._format;
    }
    set format(v) {
        this._format = v;
    }
    /**
     * Returns true if all dimensions of the texture are power of two, and false otherwise.
     *
     * @type {boolean}
     */
    get pot() {
        return _maths_math_tool__WEBPACK_IMPORTED_MODULE_1__["MathTool"].powerOfTwo(this._width) && _maths_math_tool__WEBPACK_IMPORTED_MODULE_1__["MathTool"].powerOfTwo(this._height);
    }
    /**
     * When enabled, and if texture format is {@link PIXELFORMAT_DEPTH} or
     * {@link PIXELFORMAT_DEPTHSTENCIL}, hardware PCF is enabled for this texture, and you can get
     * filtered results of comparison using texture() in your shader (WebGL2 only).
     *
     * @type {boolean}
     */
    set compareOnRead(v) {
        if (this._compareOnRead !== v) {
            this._compareOnRead = v;
            this._parameterFlags |= 32;
        }
    }
    get compareOnRead() {
        return this._compareOnRead;
    }
    set compareFunc(v) {
        if (this._compareFunc !== v) {
            this._compareFunc = v;
            this._parameterFlags |= 64;
        }
    }
    get compareFunc() {
        return this._compareFunc;
    }
    get source() {
        return this._source;
    }
    get width() {
        return this._width;
    }
    set width(v) {
        this._width = v;
    }
    get height() {
        return this._height;
    }
    set height(v) {
        this._height = v;
    }
    set source(v) {
        this._source = v;
        this._width = v.width;
        this._height = v.height;
        this.needsUpload = true;
    }
}
function generateUUID() {
    throw new Error("Function not implemented.");
}


/***/ })

/******/ });
//# sourceMappingURL=lmgl.max.js.map