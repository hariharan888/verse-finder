import styled from 'styled-components';

const GlobalStyles = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  font-size: 1.2rem !important;
  .page {
    display: flex;
    width: 100%;
    flex: 1;
  }
  .column {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .row {
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }

  .center {
    align-items: center;
    justify-content: center;
    display: flex;
  }

  .align-center {
    display: flex;
    align-items: center;
  }

  .justify-center {
    display: flex;
    justify-content: center;
  }

  .card {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    background: white;
    border-radius: 2px;
  }

  .card-1 {
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .card-hover {
    &:hover {
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
        0 10px 10px rgba(0, 0, 0, 0.22);
    }
  }

  .card-2 {
    background-color: white;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }

  .card-3 {
    background-color: white;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  }

  .card-4 {
    background-color: white;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }

  .card-5 {
    background-color: white;
    box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  }
`;

export default GlobalStyles;
