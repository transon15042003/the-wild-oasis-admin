import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Spinner from "./Spinner";
import DemoStatusBanner from "../features/demo/DemoStatusBanner";
import { SidebarProvider } from "../context/SidebarContext";
import { media } from "../styles/breakpoints";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;

  ${media.max("tablet")} {
    grid-template-columns: 1fr;
  }
`;

const Main = styled.main`
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
  overflow: auto;

  ${media.max("desktop")} {
    padding: 3.2rem 2.4rem 4.8rem;
  }

  ${media.max("tablet")} {
    padding: 2.4rem 1.6rem 3.2rem;
  }
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const ContentFallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 40rem;
`;

function AppLayout() {
  return (
    <SidebarProvider>
      <StyledAppLayout>
        <Header />
        <Sidebar />
        <Main>
          <Container>
            <DemoStatusBanner />
            <Suspense
              fallback={
                <ContentFallback>
                  <Spinner />
                </ContentFallback>
              }
            >
              <Outlet />
            </Suspense>
          </Container>
        </Main>
      </StyledAppLayout>
    </SidebarProvider>
  );
}

export default AppLayout;
