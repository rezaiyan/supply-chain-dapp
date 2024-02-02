
import styled from 'styled-components';

export const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;

export const StyledDiv = styled.div`
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
  padding: 0.5rem 1rem;
  margin: 8px;
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
  text-align: left;
`;

// Define a container for your UI elements
export const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two columns */
  grid-gap: 20px; /* Adjust the gap as needed */
  justify-content: center;
  align-items: center;
  text-align: center;
`;

// Define a container for the top section
export const TopSection = styled.div`
  grid-column: span 2;
`;

// Define a container for the bottom section
export const BottomSection = styled.div`
  grid-column: span 2;
`;

// Define a container for the item list
export const ItemListContainer = styled.div`
  grid-column: span 2;
  text-align: left;
`;

// Define a container for each action button
export const ActionButtonContainer = styled.div`
  margin: 10px;
`;
