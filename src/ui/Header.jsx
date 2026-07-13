import styled from "styled-components";
import { HiOutlineBars3 } from "react-icons/hi2";
import HeaderMenu from "./HeaderMenu";
import UserAvatar from "../features/authentication/UserAvatar";
import ButtonIcon from "./ButtonIcon";
import { useSidebar } from "../context/SidebarContext";
import { media } from "../styles/breakpoints";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);

  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2.4rem;

  ${media.max("desktop")} {
    padding: 1.2rem 2.4rem;
  }

  ${media.max("tablet")} {
    justify-content: space-between;
    padding: 1.2rem 1.6rem;
  }
`;

const HeaderEnd = styled.div`
  display: flex;
  align-items: center;
  gap: 2.4rem;
`;

const MenuButton = styled(ButtonIcon)`
  display: none;

  ${media.max("tablet")} {
    display: inline-block;
  }
`;

function Header() {
  const { toggle } = useSidebar();

  return (
    <StyledHeader>
      <MenuButton
        onMouseDown={(e) => e.stopPropagation()}
        onClick={toggle}
        aria-label="Open navigation menu"
      >
        <HiOutlineBars3 />
      </MenuButton>
      <HeaderEnd>
        <UserAvatar />
        <HeaderMenu />
      </HeaderEnd>
    </StyledHeader>
  );
}

export default Header;
