import VerseInput from "Containers/Common/VerseInput";
import db from "Helpers/db";
import _ from "lodash";
import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styled from "styled-components";

const Wrapper = styled.div`
  .verse-search {
    margin: 2rem 0rem;
    .app-mobile & {
      width: 90%;
      position: fixed;
      bottom: 0;
      margin: 1rem 0rem;
    }
  }
  .verse-view {
    width: 500px;
    height: 500px;
    font-weight: 600;
    border-radius: 0.8rem;
    margin: 2rem 0rem;
    overflow-y: auto;
    .header {
      height: 3em;
      .header-label {
        text-align: center;
      }
      .nav-icon {
        margin: 0rem 1rem;
        cursor: pointer;
      }
    }
    .verse {
      padding: 1rem;
      font-size: 1.5em;
      line-height: 1.4em;
      font-weight: 600;
      text-align: justify;
    }
    .app-mobile & {
      width: 90%;
    }
  }
`;

const QuickSearch = () => {
  const [verse, setVerse] = useState(null);
  const onSubmit = data => setVerse(_.get(data, ["verses", 0], null));
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  function handleTouchStart(e) {
    setTouchStart(e.targetTouches[0].clientX);
  }

  function handleTouchMove(e) {
    setTouchEnd(e.targetTouches[0].clientX);
  }

  function handleTouchEnd() {
    if (touchStart - touchEnd > 150) {
      // do your stuff here for left swipe
      showNext();
    }

    if (touchStart - touchEnd < -150) {
      // do your stuff here for right swipe
      showPrevious();
    }
  }
  const showNext = () => {
    if (verse.next) {
      const [book, chapter, verseNum] = verse.next;
      const data = db.getVersesByRefs(book, chapter, [verseNum]);
      const nextVerse = _.head(data);
      setVerse(nextVerse);
    }
  };
  const showPrevious = () => {
    if (verse.previous) {
      const [book, chapter, verseNum] = verse.previous;
      const data = db.getVersesByRefs(book, chapter, [verseNum]);
      const previousVerse = _.head(data);
      setVerse(previousVerse);
    }
  };

  return (
    <Wrapper className="w-100 flex-column align-center">
      <VerseInput className="input verse-search" onSubmit={onSubmit} />
      <div
        className="verse-view flex-column box-shadow hide-scrollbar"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {!_.isEmpty(verse) && (
          <>
            <div className="header flex-row align-center space-between">
              <FiChevronLeft
                className="nav-icon"
                size={24}
                onClick={showPrevious}
              />
              <div className="header-label flex-1 text-ellipsis">
                {verse.book.nkjv} {verse.chapter}: {verse.verse}
              </div>
              <FiChevronRight
                className="nav-icon"
                size={24}
                onClick={showNext}
              />
            </div>
            <div className="verse flex-1">{verse.text.tamil}</div>
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default QuickSearch;
