/**
 * 错误统计
 */
class ErrorCount {
   constructor() {
     this.errMap = new Map();
   }

   catchError(obj) {
     const { moduleName, subName, info } = obj;
     const fullName = this._getFullName(moduleName, subName);
    this._checkExit(fullName);

     if (this.errMap.get(fullName).errorFlag == false) {
       console.warn(moduleName, subName, info);
       this.errMap.get(fullName).errorFlag = true;
     }
   }

  clear(moduleName, subName) {
    // if ("normalMatrix" == subName) {
    //   debugger
    // }
    const fullName = this._getFullName(moduleName, subName);
    this._checkExit(fullName);
    this.errMap.get(fullName).errorFlag = false;
  }

  _getFullName(moduleName, subName) {
    return `${moduleName}_${subName}`;
  }

  _checkExit(fullName) {
    if (!this.errMap.has(fullName)) {
      this.errMap.set(fullName, {
        errorFlag: false
      })
    }
  }
}

const error = new ErrorCount();
export default error;
