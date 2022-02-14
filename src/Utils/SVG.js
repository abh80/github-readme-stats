const SVGElement = require("./SVGElement");
module.exports = class SVG {
  /**
   *
   * @param {Number} width
   * @param {Number} height
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.svg = "";

    this.create();
  }
  /**
   *
   * @param {String} style
   */
  appendStyle(style) {
    this.svg += `<style>`;
    this.svg += style;
    this.svg += `</style>`;
  }
  create() {
    this.svg += `<svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">`;
  }
  close() {
    this.svg += "</svg>";
  }
  /**
   *
   * @param {SVGElement} element
   */
  append(element) {
    this.svg += element.build();
  }
  /**
   * 
   * @param {String} tag 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} width 
   * @param {Number} height 
   * @returns {SVGElement}
   */
  createElement(tag, x, y, width, height) {
    return new SVGElement(tag, x, y, width, height);
  }
  /**
   *
   * @returns {String}
   */
  build() {
    this.close();
    return this.svg;
  }
};
