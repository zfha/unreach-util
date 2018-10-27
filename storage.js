exports.get = function(name) {
  const v = window.localStorage.getItem(name);
  try {
    return v ? JSON.parse(v) : null;
  } catch (e) {
    return null;
  }
};

exports.set = function(name, value) {
  window.localStorage.setItem(name, JSON.stringify(value));
};

exports.remove = function(name) {
  window.localStorage.removeItem(name);
};
