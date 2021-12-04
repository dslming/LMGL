class ComponentTemplate extends HTMLElement {
  constructor() {
    super();
    var container = document.createElement('div');
    container.classList.add('content');
    container.innerHTML = `
        <div class="fail">
          <div class="text">
            不支持webgl2, 请使用chrome</div>
          </div>
        <canvas id="c"></canvas>
      `
    this.append(container);
  }
}
window.customElements.define('webgl-component', ComponentTemplate);
