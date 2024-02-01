
import styled from 'styled-components';

export const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;

export const StyledGreetingDiv = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: 135px 2.7fr 1fr;
  grid-gap: 10px;
  place-self: center;
  align-items: center;
`;

export const StyledActionButton = styled.button`
  width: 180px;
  height: auto;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
  padding: 0.5rem 1rem; /* Adjust the values as needed */
`;

export const StyledItemList = styled.div`
    margin-top: 20px;
`;

export const StyledItemCard = styled.div`
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
`;

export const StyledLabel = styled.label`
  font-weight: bold;
`;
