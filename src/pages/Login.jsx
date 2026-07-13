import styled from "styled-components";
import { useState } from "react";
import LoginForm from "../features/authentication/LoginForm";
import SignupForm from "../features/authentication/SignupForm";
import Logo from "../ui/Logo";
import Heading from "../ui/Heading";
import Button from "../ui/Button";
import DemoStatusBanner from "../features/demo/DemoStatusBanner";

const LoginLayout = styled.main`
    min-height: 100vh;
    display: grid;
    grid-template-columns: 48rem;
    align-content: center;
    justify-content: center;
    gap: 3.2rem;
    background-color: var(--color-grey-50);
    padding: 2.4rem;
`;

const SwitchRow = styled.div`
    display: flex;
    justify-content: center;
    gap: 0.8rem;
    align-items: center;
    font-size: 1.4rem;
    color: var(--color-grey-600);
`;

function Login() {
    const [mode, setMode] = useState("login");
    const isLogin = mode === "login";

    return (
        <LoginLayout>
            <Logo />
            <DemoStatusBanner />
            <Heading as="h4">
                {isLogin ? "Log in to your account" : "Create a demo account"}
            </Heading>
            {isLogin ? <LoginForm /> : <SignupForm variant="public" />}
            <SwitchRow>
                <span>
                    {isLogin
                        ? "New here?"
                        : "Already have an account?"}
                </span>
                <Button
                    variation="secondary"
                    size="small"
                    type="button"
                    onClick={() => setMode(isLogin ? "signup" : "login")}
                >
                    {isLogin ? "Sign up" : "Log in"}
                </Button>
            </SwitchRow>
        </LoginLayout>
    );
}

export default Login;
