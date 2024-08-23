import styled from "styled-components";

const Input = styled.input`
  font-size: 1.6rem;
  padding: 1.2rem 1.6rem;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-grey-200);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  width: 100%;
  margin-bottom: 1.6rem;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
  }
`;

export default Input;
