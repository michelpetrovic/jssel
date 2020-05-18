const jsSel = (() => {

  function hasNodeCount(string) {
    return string[1] === '[' && (string[3] === ']' || string[4] === ']');
  }

  function getNodeCount(string) {
    const endIndex = string[3] === ']' ? 3 : 4;
    return parseInt(string.substring(2, endIndex));
  }

  function getNode(startElmt, selector) {
    let targetNode;
    const isMultiple = selector[0] === '[';

    if (isMultiple) {
      selector = selector.substring(1, selector.length - 1);
    }

    const firstChar = selector[0];

    if (firstChar === '^') {//search a parent node
      if (hasNodeCount(selector)) {
        const level = getNodeCount(selector);
        let i = 0;
        targetNode = startElmt;
        while (i++ < level) {
          targetNode = targetNode.parentElement;
        }
      }
      else {
        const query = selector.substring(1);
        targetNode = startElmt.parentElement;
        while (!targetNode.matches(query)) {
          targetNode = targetNode.parentElement;
        }
      }
    }
    else if (firstChar === '#' || firstChar === '@') {//search in whole document
      selector = firstChar === '#' ? selector : selector.substring(1);
      targetNode = (!isMultiple) ? document.querySelector(selector) : document.querySelectorAll(selector);
    }
    else if (selector === 'this') {
      targetNode = startElmt;
    }
    else if (firstChar === '<') {//search prior siblings
      if (hasNodeCount(selector)) {
        const count = getNodeCount(selector);
        let i = 0;
        targetNode = startElmt.previousElementSibling;
        while (++i < count) {
          targetNode = targetNode.previousSibling;
        }
      }
      else {
        const query = selector.substring(1);
        targetNode = startElmt.previousElementSibling;
        while (!targetNode.matches(query)) {
          targetNode = targetNode.previousElementSibling;
        }
      }
    }
    else if (firstChar === '>') {//search next siblings
      if (hasNodeCount(selector)) {
        const count = getNodeCount(selector);
        let i = 0;
        targetNode = startElmt.nextElementSibling;
        while (++i < count) {
          targetNode = targetNode.nextElementSibling;
        }
      }
      else {
        const query = selector.substring(1);
        targetNode = startElmt.nextElementSibling;
        while (!targetNode.matches(query)) {
          targetNode = targetNode.nextElementSibling;
        }
      }
    }
    else if (selector === 'val') {
      const elmtType = startElmt.type;
      if (!elmtType) {//assume it's a markup elmt
        targetNode = startElmt.innerText || startElmt.textContent;
      }
      else {
        if (elmtType === 'text' || elmtType === 'textarea' || elmtType === 'button') {
          targetNode = startElmt.value;
        }
        else if (elmtType === 'submit') {
          targetNode = startElmt.innerText;
        }
        else if (elmtType === 'select-one') {
          targetNode = startElmt.options[startElmt.selectedIndex].value;
        }
        else if (elmtType === 'select-multiple') {
          targetNode = [];
          for (let i = 0,n = startElmt.options.length; i < n; i++) {
            const opt = sel.options[i];
            if (opt.selected) {
              targetNode.push(opt);
            }
          }
        }
      }
    }
    else if (selector.indexOf('data:') === 0) {
      return startElmt.dataset[selector.substring(selector.indexOf(':') + 1)];
    }
    else if (selector.indexOf('attr:') === 0) {
      return startElmt.getAttribute(selector.substring(selector.indexOf(':') + 1));
    }
    else { //search inside startElmt
      targetNode = (!isMultiple) ? startElmt.querySelector(selector) : startElmt.querySelectorAll(selector);
    }

    return targetNode;
  }

  function querySelector(startElmt, selectors, els) {
    let selectedEl = startElmt,
      selector = selectors.split(';');

    for (let i = 0, n = selector.length; i < n; i++) {
      const num = parseInt(selector[i][0]);
      let query, elmt;

      if (isNaN(num)) {
        elmt = selectedEl;
        query = selector[i];
      }
      else {
        elmt = els[num - 1];
        query = selector[++i];
      }
      selectedEl = getNode(elmt, query);
    }
    return selectedEl;
  }

  function queryElements(startElmt, selectors) {
    const sels = selectors.split(' '),
      len = sels.length;

    if (len === 1) {
      return querySelector(startElmt, sels[0], undefined);
    }

    const elmts = [],
      resultObj = selectors.indexOf('=') > 0 ? {} : undefined;

    if (!resultObj) {
      for (let i = 0; i < len; i++) {
        elmts.push(querySelector(startElmt, sels[i], elmts));
      }
      return elmts;
    }


    for (let i = 0; i < len; i++) {
      const delim = sels[i].lastIndexOf('='),
        key = sels[i].substring(delim + 1),
        elmt = querySelector(startElmt, sels[i].substring(0, delim), elmts);
      resultObj[key] = elmt;
      elmts.push(elmt);
    }

    return resultObj;
  }

  return {
    select: queryElements
  };
})();
