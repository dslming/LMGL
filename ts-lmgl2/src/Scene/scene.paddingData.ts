export class ScenePaddingData {
  public _pendingData = new Array();

  public _addPendingData(data: any): void {
    this._pendingData.push(data);
  }

  /** @hidden */
  public _removePendingData(data: any): void {
    var wasLoading = this.isLoading;
    var index = this._pendingData.indexOf(data);

    if (index !== -1) {
      this._pendingData.splice(index, 1);
    }

    if (wasLoading && !this.isLoading) {
      // this.sceneEventTrigger.onDataLoadedObservable.notifyObservers(this);
    }
  }

  /**
 * Returns a boolean indicating if the scene is still loading data
 */
  public get isLoading(): boolean {
    return this._pendingData.length > 0;
  }
}
