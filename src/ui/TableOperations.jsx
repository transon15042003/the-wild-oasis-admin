import styled from "styled-components";
import { media } from "../styles/breakpoints";

const TableOperations = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;

  ${media.max("tablet")} {
    flex-direction: column;
    align-items: stretch;
    flex-wrap: wrap;
  }
`;

export default TableOperations;
