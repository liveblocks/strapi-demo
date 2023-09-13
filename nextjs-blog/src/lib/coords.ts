// TODO

// === GET SELECTORS FOR CURRENT ELEMENT =======================================
const pathArray = e.path || e.composedPath();
let reachedBody = false;

const id = pathArray[pathArray.length - 1].id;
let accuratePathSelectors = [];
let inaccuratePathSelectors = [];

pathArray.forEach((el) => {
  if (reachedBody) {
    return;
  }
  if (el.nodeName.toLowerCase() === "body") {
    reachedBody = true;
  }

  // Selector from nearest ID
  // TODO

  // Selector with nth child and HTML element types
  // More performant than: [...el.parentNode.children].indexOf(el) + 1
  const nthIndex = Array.prototype.indexOf.call(el.parentNode.children, el) + 1;
  accuratePathSelectors.push(`${el.nodeName}:nth-child(${nthIndex})`);

  // Selector with just class names
  // More performant than: [...el.classList].map(CSS.escape).join('.')
  const classes = Array.prototype.map.call(el.classList, CSS.escape).join(".");
  inaccuratePathSelectors.push(el.nodeName + (classes ? "." + classes : ""));
});

const accuratePath = accuratePathSelectors.reverse().join(">");
const inaccuratePath = inaccuratePathSelectors.reverse().join(">");
const selectors = [accuratePath, inaccuratePath];

if (id) {
  selectors.unshift(id);
}

// === GET PERCENTAGE ACROSS CURRENT ELEMENT =======================================
const { width, height } = e.target.getBoundingClientRect();
const xPercent = e.offsetX / width;
const yPercent = e.offsetY / height;
