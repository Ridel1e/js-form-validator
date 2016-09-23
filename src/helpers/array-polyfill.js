/**
 * Created by ridel1e on 23/09/16.
 */

Object.assign(Array.prototype, {
  concatAll,
  distinct
});

/**
 * Returns a flatten array
 * @returns {Array}
 */
function concatAll() {
  return Array.prototype.concat.apply([], this);
}

/**
 * Returns array with unique elements
 * @returns {Array}
 */
function distinct() {
  return this.filter((value, index, self) =>
  self.indexOf(value) === index)
}
