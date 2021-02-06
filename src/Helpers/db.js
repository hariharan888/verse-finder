import bible from "Data/bible";
import _ from "lodash";

const getVersesByRefs = (book, chapter, verses) => {
  const chapterData = _.chain(bible)
    .get([book, chapter])
    .keyBy("verse")
    .value();
  const data = _.chain(verses)
    .map(v => _.get(chapterData, v))
    .compact()
    .value();

  return _.some(data, _.isNil) ? [] : data; // empty if any of the reference is invalid
};

export default {
  getVersesByRefs
};
