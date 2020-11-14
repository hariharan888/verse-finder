import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

const BoxInputWrapper = styled.div`
  border: 1px solid lightgray;
  border-radius: 0.3rem;
  padding: 0.8rem 1rem;
  display: inline-flex;
  &:active,
  &:focus-within {
    border: 1px solid #2185d0;
  }
  .ui-input {
    outline: none;
    border: none;
    flex: 1 0 auto;
    font-size: 1em;
    &.icon-right {
      margin-right: 4px;
    }
    &.icon-left {
      margin-left: 4px;
    }
  }
`;

const BoxInput = props => {
  const {
    placeholder,
    value,
    className,
    icon = null,
    onChange,
    onBlur,
    onKeyDown,
    iconPosition = 'right',
    customRef
  } = props;
  return (
    <BoxInputWrapper className={classNames('ui-container', className)}>
      {iconPosition === 'left' && icon}
      <input
        className={classNames('ui-input', icon && `icon-${iconPosition}`)}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        ref={customRef}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
      {iconPosition === 'right' && icon}
    </BoxInputWrapper>
  );
};

export default BoxInput;
