module.exports = class SVGElement {
  /**
   *
   * @param {String} tag
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   */
  constructor(tag, x, y, width, height) {
    this.tag = tag;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.svg = "";
    this.head = {};
    if(this.width) this.addAttr("width", this.width);
    if(this.height) this.addAttr("height", this.height);
    if(this.x) this.addAttr("x", this.x);
    if(this.y) this.addAttr("y", this.y);
  }
  addAttr(attr, value) {
    this.head[attr] = value;
    return this;
  }
  close() {
    this.svg += `</${this.tag}>`;
    return this;
  }
  /**
   *
   * @param {SVGElement} element
   */
  append(element) {
    if (typeof element == "string") {
      this.svg += element;
      return this;
    }
    this.svg += element.build();
    return this;
  }
  /**
   *
   * @returns {String}
   */
  build() {
    let str = `<${this.tag}`;
    Object.keys(this.head).forEach((key) => {
      str += ` ${key}="${this.head[key]}"`;
    });
    str += ">";
    str += this.svg;

    this.svg = str;
    this.close();
    return this.svg;
  }
};
