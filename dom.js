if (!Element.prototype.matches) {
  const proto = Element.prototype;
  proto.matches = proto.matchesSelector ||
    proto.mozMatchesSelector ||
    proto.msMatchesSelector ||
    proto.oMatchesSelector ||
    proto.webkitMatchesSelector;
}


export function delegate(el, event, selector, listener, capture) {
  const handler = function(e) {
    const node = closest(e.target, selector, el);
    if (node) {
      e.delegateTarget = node;
      return listener.call(node, e);
    }
    return null;
  };

  el.addEventListener(event, handler, capture);
  return () => el.removeListener(event, handler, capture);
}


export function closest(target, selector, stop) {
  while (target && target !== stop) {
    if (target.matches && target.matches(selector)) {
      return target;
    }
    target = target.parentNode;
  }
  return null;
}
