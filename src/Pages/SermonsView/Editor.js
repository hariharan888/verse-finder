import React, { useCallback, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import _ from "lodash";
import {
  FaBold,
  FaItalic,
  // FaListOl,
  // FaListUl,
  // FaQuoteRight,
  FaRegQuestionCircle,
  FaQuestion,
  FaStream
} from "react-icons/fa";
import {
  MdFormatUnderlined,
  MdFormatListNumbered,
  MdPrint
} from "react-icons/md";
import {
  FiAlignLeft,
  FiAlignCenter,
  FiAlignJustify,
  FiAlignRight
} from "react-icons/fi";
import { createEditor, Transforms } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import styled from "styled-components";
import VerseInput from "Containers/Common/VerseInput";
import {
  Toolbar,
  insertVerse,
  Leaf,
  Element,
  toggleMark,
  MarkButton,
  BlockButton,
  CustomButton,
  ActionButton,
  H1,
  H2,
  H3
} from "./SlateComponents";
import Persistor from "Helpers/Persistor";

// Bug Workaround: Editor selection set to null on blur
Transforms.deselect = _.noop;

const Wrapper = styled.div`
  flex: 1 1 auto;
  overflow: auto;

  .sermon-page {
    margin: 16px auto;
    width: 21cm;
    min-height: 29.7cm;
    padding: 10mm;
  }
  .instruction {
    white-space: pre-wrap;
    margin: 0 -20px 10px;
    padding: 10px 20px;
    font-size: 14px;
    background: #f8f8e8;
  }

  .format-block {
    display: flex;
    flex-direction: row;
    margin: 0px 4px;
    height: 24px;
    align-items: center;
  }

  .editor-menu {
    width: 21cm;
    padding: 12px;
    margin: auto;
  }

  .editor-toolbar {
    position: sticky;
    top: 0;
    padding: 12px;
    border-bottom: 1px solid #e0e0e0;
    background-color: white;
    user-select: none;
  }

  .verse-search {
    margin: 0px 6px;
    margin-top: 0.4rem;
    font-size: 0.9rem;
  }

  .toolbar-row {
    height: 30px;
  }

  .vertical-divider {
    height: 90%;
    border-right: 1px solid #e0e0e0;
    margin: 0px 6px;
  }

  .underline-tb-button {
    margin-top: 2px;
  }

  .slate-editable {
    height: 100%;
    div {
      text-align: left;
    }
    p {
      text-align: left;
      font-size: 1.4rem;
      line-height: 1.8rem;
    }
    h1 {
      text-align: left;
      font-size: 2rem;
      line-height: 3rem;
    }
    h2 {
      text-align: left;
      font-size: 1.5rem;
      line-height: 2.5rem;
    }
    h3 {
      text-align: left;
      font-size: 1.4rem;
      line-height: 1.8rem;
    }

    .verse {
      margin-bottom: 8px;
      p {
        margin-block-start: 4px;
        margin-block-end: 4px;
      }
    }
  }
`;

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code"
};

const HOCs = [withReact, withHistory];

const EditorWithToolbar = () => {
  const [value, setValue] = useState(
    JSON.parse(Persistor.get("slate")) || INITIAL_VALUE
  );
  const [customFormats, setCustomFormats] = useState({
    "interleave-verses": true
  }); // formats not handled by slate
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => _.flowRight(HOCs)(createEditor()), []);
  const handleHotKey = event => {
    const hotKey = _.findKey(HOTKEYS, (format, key) => isHotkey(key, event));
    if (!_.isNil(hotKey)) {
      event.preventDefault();
      const mark = HOTKEYS[hotKey];
      toggleMark(editor, mark);
    }
  };

  return (
    <Wrapper className="editor-wrapper">
      <Slate
        editor={editor}
        value={value}
        onChange={val => {
          Persistor.save("slate", JSON.stringify(val));
          setValue(val);
        }}
      >
        <CustomToolbar
          onVerseSubmit={data =>
            insertVerse(editor, data, { ...customFormats })
          }
          customFormats={customFormats}
          setCustomFormats={setCustomFormats}
        />
        <div id="sermon-page" className="sermon-page card-1">
          <Editable
            className="slate-editable"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Type and format your sermon..."
            spellCheck
            autoFocus
            onKeyDown={handleHotKey}
          />
        </div>
      </Slate>
    </Wrapper>
  );
};

const printDocument = () => window.print();

const CustomToolbar = ({ onVerseSubmit, customFormats, setCustomFormats }) => (
  <Toolbar>
    <div className="toolbar-row row">
      <div className="format-block">
        <MarkButton format="bold" ButtonIcon={FaBold} />
        <MarkButton format="italic" ButtonIcon={FaItalic} />
        <MarkButton
          format="underline"
          ButtonIcon={MdFormatUnderlined}
          iconSize={18}
        />
      </div>
      <div className="vertical-divider" />
      <div className="format-block">
        <BlockButton
          format="align-left"
          iconSize={18}
          ButtonIcon={FiAlignLeft}
        />
        <BlockButton
          format="align-center"
          iconSize={18}
          ButtonIcon={FiAlignCenter}
        />
        <BlockButton
          format="align-right"
          iconSize={18}
          ButtonIcon={FiAlignRight}
        />
        <BlockButton
          format="align-justify"
          iconSize={18}
          ButtonIcon={FiAlignJustify}
        />
      </div>
      <div className="vertical-divider" />
      <div className="format-block">
        <BlockButton format="heading-one" ButtonIcon={H1} />
        <BlockButton format="heading-two" ButtonIcon={H2} />
        <BlockButton format="heading-three" ButtonIcon={H3} />
      </div>
      <div className="vertical-divider" />
      <div className="format-block">
        <VerseInput
          className="input verse-search"
          onSubmit={onVerseSubmit}
          defaultPrevented
        />
        <CustomButton
          format="prefix-verse-numbers"
          customFormats={customFormats}
          setCustomFormats={setCustomFormats}
          ButtonIcon={MdFormatListNumbered}
          title="Prefix Verse Numbers"
          iconSize={18}
        />
        <CustomButton
          format="interleave-verses"
          customFormats={customFormats}
          setCustomFormats={setCustomFormats}
          ButtonIcon={FaStream}
          title="Interleave translations"
          iconSize={14}
        />
      </div>
      <div className="vertical-divider" />
      <div className="format-block">
        <ActionButton
          iconSize={18}
          onClick={printDocument}
          title="Print this document"
          ButtonIcon={MdPrint}
        />
        <MarkButton format="my-custom-mark-action" ButtonIcon={FaQuestion} />
        <BlockButton
          format="my-custom-block-action"
          ButtonIcon={FaRegQuestionCircle}
        />
      </div>
    </div>
  </Toolbar>
);
// <BlockButton format="block-quote" ButtonIcon={FaQuoteRight} />
// <BlockButton format="numbered-list" ButtonIcon={FaListOl} />
// <BlockButton format="bulleted-list" ButtonIcon={FaListUl} />

const INITIAL_VALUE = [
  {
    type: "paragraph",
    children: [
      { text: "Type and ", bold: false },
      { text: "format ", bold: true },
      { text: "your " },
      { text: "sermon!", italic: true }
    ]
  }
];
// const INITIAL_VALUE = [
//   {
//     type: 'paragraph',
//     children: [
//       { text: 'This is editable ', bold: false },
//       { text: 'rich', bold: true },
//       { text: ' text, ' },
//       { text: 'much', italic: true },
//       { text: ' better than a ' },
//       { text: '<textarea>', code: true },
//       { text: '!' }
//     ]
//   },
//   {
//     type: 'paragraph',
//     children: [
//       {
//         text:
//           "Since it's rich text, you can do things like turn a selection of text "
//       },
//       { text: 'bold', bold: true },
//       {
//         text:
//           ', or add a semantically rendered block quote in the middle of the page, like this:'
//       }
//     ]
//   },
//   {
//     type: 'block-quote',
//     children: [{ text: 'A wise quote.' }]
//   },
//   {
//     type: 'paragraph',
//     children: [{ text: 'Try it out for yourself!' }]
//   },
//   {
//     type: 'div',
//     customAttributes: { className: 'verse' },
//     children: [
//       {
//         type: 'h3',
//         customAttributes: {
//           className: 'verse-header'
//         },
//         children: [
//           {
//             text: `ஆதியாகமம் / Genesis 2:3`,
//             bold: true
//           }
//         ]
//       },
//       {
//         type: 'paragraph',
//         customAttributes: {
//           className: 'verse-tamil'
//         },
//         children: [
//           {
//             text:
//               'தேவன் தாம் சிருஷ்டித்து உண்டுபண்ணின தம்முடைய கிரியைகளையெல்லாம் முடித்தபின்பு அதிலே ஓய்ந்திருந்தபடியால், தேவன் ஏழாம் நாளை ஆசீர்வதித்து, அதைப் பரிசுத்தமாக்கினார்.'
//           }
//         ]
//       },
//       {
//         type: 'paragraph',
//         customAttributes: {
//           className: 'verse-nkjv'
//         },
//         children: [
//           {
//             text:
//               'Then God blessed the seventh day and sanctified it, because in it He rested from all His work which God had created and made.'
//           }
//         ]
//       }
//     ]
//   }
// ];

export default EditorWithToolbar;
