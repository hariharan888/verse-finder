import React from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import styled from "styled-components";
import _ from "lodash";
import { Editor, Transforms } from "slate";
import { useSlate } from "slate-react";

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const getVerseNode = (verse, translation, opts) => ({
  type: "paragraph",
  customAttributes: {
    className: "verse-tamil"
  },
  children: [
    ...(opts["prefix-verse-numbers"] === true
      ? [{ text: `${verse.verse} ` }]
      : []),
    { text: verse.text[translation] }
  ]
});

const getVerseNodes = (verses, opts = {}) => {
  return _.chain(verses)
    .map(verse => [
      getVerseNode(verse, "tamil", opts),
      getVerseNode(verse, "nkjv", opts)
    ])
    .thru(nodeMaps =>
      opts["interleave-verses"] ? _.zip(...nodeMaps) : nodeMaps
    )
    .flatten()
    .value();
};

const getRefNode = (verse, searchTerm) => ({
  type: "paragraph",
  customAttributes: {
    className: "verse-header"
  },
  children: [
    {
      text: `${verse.book.tamil} / ${verse.book.nkjv} ${verse.chapter}:${searchTerm.verse}`,
      bold: true
    }
  ]
});

export const insertVerse = (editor, verseData, opts = {}) => {
  const { verses, searchTerm } = verseData;
  const verseNodes = [
    {
      type: "div",
      customAttributes: { className: "verse" },
      children: _.flatten([
        getRefNode(_.head(verses), searchTerm, opts),
        getVerseNodes(verses, opts)
      ])
    }
  ];
  Transforms.insertNodes(editor, verseNodes);
};

const ButtonWrapper = styled.div`
  cursor: pointer;
  color: #ccc;
  margin: 0px 4px;
  &.active {
    color: black;
  }

  &.reversed {
    color: #aaa;
    &.active {
      color: white;
    }
  }
`;

export const Button = React.forwardRef(
  ({ className, active, reversed, ...props }, ref) => (
    <ButtonWrapper
      {...props}
      ref={ref}
      className={classNames(className, "editor-btn", { reversed, active })}
    />
  )
);

const EditorValueWrapper = styled.div`
  margin: 30px -20px 0;
  .text {
    font-size: 14px;
    padding: 5px 20px;
    color: #404040;
    border-top: 2px solid #eeeeee;
    background: #f8f8f8;
  }
  .lines {
    color: #404040;
    font: 12px monospace;
    white-space: pre-wrap;
    padding: 10px 20px;
    div {
      margin: 0 0 0.5em;
    }
  }
`;
export const EditorValue = React.forwardRef(
  ({ className, value, ...props }, ref) => {
    const textLines = value.document.nodes
      .map(node => node.text)
      .toArray()
      .join("\n");
    return (
      <EditorValueWrapper ref={ref} {...props} className={className}>
        <div className="text">Value as text</div>
        <div className="lines">{textLines}</div>
      </EditorValueWrapper>
    );
  }
);

export const Instruction = React.forwardRef(({ className, ...props }, ref) => (
  <div {...props} ref={ref} className={classNames(className, "instruction")} />
));

export const Menu = React.forwardRef(({ className, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={classNames(className, "editor-menu", "card-1")}
  />
));

export const Portal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

export const Toolbar = React.forwardRef(({ className, ...props }, ref) => (
  <div className="editor-toolbar">
    <Menu {...props} ref={ref} className={classNames(className)} />
  </div>
));

const ALIGNMENT_TYPES = {
  "align-center": "center",
  "align-right": "right",
  "align-justify": "justify",
  "align-left": "left"
};

export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(n.type),
    split: true
  });

  if (ALIGNMENT_TYPES[format]) {
    Transforms.setNodes(editor, {
      textAlignment: format
    });
  } else {
    Transforms.setNodes(editor, {
      type: isActive ? "paragraph" : isList ? "list-item" : format
    });
  }

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }

  if (format === "my-custom-block-action") {
    //
  }
};

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (format === "my-custom-mark-action") {
    // window.print();
  }

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format
  });

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const ELEMENT_MAP = {
  "block-quote": "blockquote",
  "bulleted-list": "ul",
  "heading-one": "h1",
  "heading-two": "h2",
  "heading-three": "h3",
  "list-item": "li",
  "numbered-list": "ol",
  div: "div"
};

export const Element = props => {
  const { attributes, children, element } = props;
  const { customAttributes = {}, type, textAlignment = "align-left" } = element;
  const allAttributes = {
    ...attributes,
    ...customAttributes
  };
  const HtmlElement = ELEMENT_MAP[type] || "p";
  return (
    <HtmlElement
      {...allAttributes}
      style={{ textAlign: ALIGNMENT_TYPES[textAlignment] }}
    >
      {children}
    </HtmlElement>
  );
};

export const Leaf = ({ attributes, children, leaf }) => {
  let modifiedChildren = children;

  if (leaf.bold) {
    modifiedChildren = <strong>{modifiedChildren}</strong>;
  }

  if (leaf.code) {
    modifiedChildren = <code>{modifiedChildren}</code>;
  }

  if (leaf.italic) {
    modifiedChildren = <em>{modifiedChildren}</em>;
  }

  if (leaf.underline) {
    modifiedChildren = <u>{modifiedChildren}</u>;
  }

  return <span {...attributes}>{modifiedChildren}</span>;
};

export const BlockButton = ({
  format,
  ButtonIcon,
  iconSize = 14,
  title = null
}) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      title={title}
    >
      <ButtonIcon className="format-icon block-button" size={iconSize} />
    </Button>
  );
};

// for formats that are not handled by slate-js
export const CustomButton = ({
  className = "",
  format,
  ButtonIcon,
  iconSize = 14,
  customFormats,
  setCustomFormats,
  title = null
}) => {
  const active = customFormats[format] === true;
  return (
    <Button
      className={classNames(`${format}-tb-button`, className)}
      active={active}
      onMouseDown={event => {
        event.preventDefault();
        setCustomFormats(prev => ({ ...prev, [format]: !active }));
      }}
      title={title}
    >
      <ButtonIcon className="format-icon mark-button" size={iconSize} />
    </Button>
  );
};

export const ActionButton = ({
  className = "",
  ButtonIcon,
  iconSize = 14,
  title = null,
  onClick
}) => {
  return (
    <Button
      className={classNames(`action-tb-button`, className)}
      active={false}
      onMouseDown={event => {
        event.preventDefault();
        onClick();
      }}
      title={title}
    >
      <ButtonIcon className="format-icon mark-button" size={iconSize} />
    </Button>
  );
};

export const MarkButton = ({
  className = "",
  format,
  ButtonIcon,
  iconSize = 14,
  title = null
}) => {
  const editor = useSlate();
  return (
    <Button
      className={classNames(`${format}-tb-button`, className)}
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      title={title}
    >
      <ButtonIcon className="format-icon mark-button" size={iconSize} />
    </Button>
  );
};

export const H1 = ({ size: fontSize }) => (
  <span style={{ fontSize, fontWeight: 600 }}>H1</span>
);
export const H2 = ({ size: fontSize }) => (
  <span style={{ fontSize, fontWeight: 600 }}>H2</span>
);
export const H3 = ({ size: fontSize }) => (
  <span style={{ fontSize, fontWeight: 600 }}>H3</span>
);
