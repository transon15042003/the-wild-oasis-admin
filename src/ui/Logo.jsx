import styled from "styled-components";
import { useDarkMode } from "../context/DarkModeContext";

const StyledLogo = styled.div`
  text-align: center;
  cursor: ${(props) => (props.$clickable ? "pointer" : "default")};
`;

const Img = styled.img`
  height: 9.6rem;
  width: auto;
`;

function Logo({ onClick }) { // eslint-disable-line react/prop-types
  const { isDarkMode } = useDarkMode();
  const src = isDarkMode ? "/img/logo-dark.png" : "/img/logo-light.png";
  return (
    <StyledLogo onClick={onClick} $clickable={Boolean(onClick)}>
      <Img src={src} alt="The Wild Oasis" />
    </StyledLogo>
  );
}

export default Logo;
