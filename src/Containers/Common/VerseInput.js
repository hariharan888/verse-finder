import _ from "lodash";
import React, { useState, useEffect, useRef } from "react";
import BoxInput from "Components/BoxInput";
import { AppConfig } from "Config";
import { FaSearch } from "react-icons/fa";
import ShortcutService from "Services/ShortcutService";
import db from "Helpers/db";

const { bible } = AppConfig;
const { books } = bible;
const { Shortcut } = ShortcutService;

// const tests = [
//   'Mat 2 3',
//   '2 Sam 2:3',
//   '2 Sam 2 3',
//   '2 Sam   2  3',
//   '2 Sam 2 3-5',
//   '2 Sam 2 3,45',
//   '2 Sam 2 3,4,7-10,19'
// ];

const VERSE_REGEX = /^([1-3]{0,3}\s?[A-z]+?)\.?\s+(\d+)[:\s]+([\d-,]+)/gi;

const scan = (str, regex) => {
  if (!regex.global) throw new Error("regex must have 'global' flag set");
  const r = [];
  str.replace(regex, (...args) => {
    r.push(Array.prototype.slice.call(args, 1, -2));
  });
  return r;
};

const parseVerseNumbers = str => {
  const parts = _.split(str, ",");
  const RANGE_REGEX = /(\d+)-(\d+)/gi;
  return _.flatMap(parts, part => {
    if (/-/g.test(part)) {
      const [start, end] = _.head(scan(part, RANGE_REGEX));
      return _.range(start, _.toFinite(end) + 1);
    } else {
      return _.toFinite(part);
    }
  });
};

const parseReferences = str => {
  const matches = _.head(scan(_.trim(str), VERSE_REGEX));
  if (_.isEmpty(matches)) throw new Error("Invalid Search term");
  const [bookMatch, chapterMatch, verseMatch] = matches;
  const bookRegex = new RegExp(bookMatch, "gi");
  const book = _.find(books, bk => bookRegex.test(bk.english));
  const chapterNum = _.toFinite(chapterMatch);
  const verseNums = parseVerseNumbers(verseMatch);
  if (chapterNum === 0 || _.some(verseNums, n => n === 0))
    throw new Error("Invalid Search term");
  return {
    book,
    chapterNum,
    verseNums,
    searchTerm: {
      text: str,
      book: bookMatch,
      chater: chapterMatch,
      verse: verseMatch
    }
  };
};

const VerseInput = props => {
  const [filterText, setFilterText] = useState("");
  const inputRef = useRef(null);

  const handleKeyDown = async e => {
    if (e.keyCode === 13) {
      try {
        const text = _.toString(_.get(e, "target.value"));
        const { book, chapterNum, verseNums, searchTerm } = parseReferences(
          text
        );
        const results = db.getVersesByRefs(book.id, chapterNum, verseNums);
        if (!_.isEmpty(_.compact(results))) {
          props.onSubmit({
            book,
            chapterNum,
            verseNums,
            searchTerm,
            verses: results
          });
        }
      } catch (error) {
        console.log(error);
        // do nothing
      }
      setFilterText("");
    }
  };

  useEffect(() => {
    const sub = Shortcut.subscribe("SEARCH_INPUT_FOCUS", () => {
      if (inputRef.current) inputRef.current.focus();
    });
    return () => sub.unsubscribe();
  }, []);
  return (
    <BoxInput
      className="input verse-search mousetrap"
      icon={<FaSearch size={16} color="lightgray" />}
      placeholder="Search for verses..."
      value={filterText}
      onChange={e => setFilterText(e.target.value)}
      onKeyDown={handleKeyDown}
      customRef={inputRef}
    />
  );
};

export default VerseInput;
