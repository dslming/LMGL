export class Constants {}

/** Defines that the ressource is not delayed*/
Constants.DELAYLOADSTATE_NONE = 0;
/** Defines that the ressource was successfully delay loaded */
Constants.DELAYLOADSTATE_LOADED = 1;
/** Defines that the ressource is currently delay loading */
Constants.DELAYLOADSTATE_LOADING = 2;
/** Defines that the ressource is delayed and has not started loading */
Constants.DELAYLOADSTATE_NOTLOADED = 4;
