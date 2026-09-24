import styled from "styled-components";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import LoginForm from "../features/authentication/LoginForm";
import useTryDemo from "../features/authentication/useTryDemo";
import Logo from "../ui/Logo";
import Heading from "../ui/Heading";
import Button from "../ui/Button";
import SpinnerMini from "../ui/SpinnerMini";
import DemoStatusBanner from "../features/demo/DemoStatusBanner";

const LoginLayout = styled.main`
    min-height: 100vh;
    display: grid;
    grid-template-columns: minmax(0, 48rem);
    width: 100%;
    align-content: center;
    justify-content: center;
    gap: 3.2rem;
    background-color: var(--color-grey-50);
    padding: 2.4rem;
    box-sizing: border-box;
`;

const Intro = styled.div`
    display: grid;
    gap: 1.2rem;
    text-align: center;
`;

const Copy = styled.p`
    font-size: 1.6rem;
    line-height: 1.6;
    color: var(--color-grey-600);
`;

const DemoButton = styled(Button)`
    justify-self: center;
`;

function Login() {
    const [searchParams] = useSearchParams();
    const [logoClicks, setLogoClicks] = useState(0);
    const { tryDemo, isPending } = useTryDemo();
    const showOwner = searchParams.get("owner") === "1" || logoClicks >= 5;

    return (
        <LoginLayout>
            <Logo
                onClick={() =>
                    setLogoClicks((clicks) => Math.min(clicks + 1, 5))
                }
            />
            <DemoStatusBanner />
            <Intro>
                <Heading as="h4">Try the Demo Sandbox</Heading>
                <Copy>
                    Explore shared demo data in a temporary account. The
                    sandbox resets nightly.
                </Copy>
                <DemoButton
                    size="large"
                    type="button"
                    disabled={isPending}
                    onClick={() => tryDemo()}
                >
                    {isPending ? <SpinnerMini /> : "Try Demo"}
                </DemoButton>
            </Intro>
            {showOwner && <LoginForm />}
        </LoginLayout>
    );
}

export default Login;
