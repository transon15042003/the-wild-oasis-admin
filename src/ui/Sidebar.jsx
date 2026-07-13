import styled from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav";
import { useSidebar } from "../context/SidebarContext";
import useOutsideClick from "../hooks/useOutsideClick";
import { media } from "../styles/breakpoints";
// import Uploader from "../data/Uploader";

const Overlay = styled.div`
  display: none;

  ${media.max("tablet")} {
    display: ${(props) => (props.$isOpen ? "block" : "none")};
    position: fixed;
    inset: 0;
    background-color: var(--backdrop-color);
    backdrop-filter: blur(4px);
    z-index: 999;
  }
`;

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);

  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;

  ${media.max("tablet")} {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 26rem;
    z-index: 1000;
    grid-row: auto;
    transform: translateX(${(props) => (props.$isOpen ? "0" : "-100%")});
    transition: transform 0.3s ease;
    box-shadow: ${(props) =>
      props.$isOpen ? "var(--shadow-lg)" : "none"};
  }
`;

function Sidebar() {
  const { isOpen, close } = useSidebar();
  const ref = useOutsideClick(close, false);

  return (
    <>
      <Overlay $isOpen={isOpen} />
      <StyledSidebar ref={ref} $isOpen={isOpen}>
        <Logo />
        <MainNav />
        {/* <Uploader /> */}
      </StyledSidebar>
    </>
  );
}

export default Sidebar;
