import _ from "lodash";

const classNames = (...args) => {
  return _.chain(args)
    .map(item => {
      return _.isString(item)
        ? item
        : _.isPlainObject(item)
        ? _.map(item, (v, k) => (v ? k : null)) // return keys if value is truthy else return null
        : null;
    })
    .flatten()
    .compact()
    .join(" ")
    .value();
};
export default classNames;
