/* Shortcuts file to increase development speed */
const _ = args => alert(args);
const $ = cssSelector => document.querySelector(cssSelector);
const $$ = cssSelector => document.querySelectorAll(cssSelector);

const make = elemName => document.createElement(elemName);

const ael = (elem, evnt, callback) => {
  elem.addEventListener(evnt, () => {
    callback(); 
  });
  return elem;
};

