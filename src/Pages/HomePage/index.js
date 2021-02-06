// @flow
import React from "react";
import { AiOutlineFileSearch } from "react-icons/ai";
import { FaRegClipboard } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  .nav-item {
    border: 1px solid black;
    padding: 8px;
    height: 150px;
    width: 140px;
    border-radius: 6px;
    margin-right: 16px;
    cursor: pointer;

    .nav-icon {
      font-size: 40px;
    }
    .nav-label {
      text-align: center;
      margin-top: 16px;
    }
  }
`;

const SermonEditor = () => {
  const history = useHistory();
  return (
    <Wrapper className="flex-row w-100 flex-wrap flex-center">
      <div
        className="nav-item box-shadow flex-column flex-center"
        onClick={() => history.push("/verse-finder/sermon-editor")}
      >
        <FaRegClipboard className="nav-icon"></FaRegClipboard>
        <div className="nav-label">Sermon Editor</div>
      </div>
      <div
        className="nav-item box-shadow flex-column flex-center"
        onClick={() => history.push("/verse-finder/quick-search")}
      >
        <AiOutlineFileSearch className="nav-icon" />
        <div className="nav-label">Quick Search</div>
      </div>

    </Wrapper>
  );
};

export default SermonEditor;
