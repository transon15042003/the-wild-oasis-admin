import styled from "styled-components";
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

const Divider = styled.p`
    text-align: center;
    font-size: 1.4rem;
    color: var(--color-grey-500);
`;

function Login() {
    const { tryDemo, isPending } = useTryDemo();

    return (
        <LoginLayout>
            <Logo />
            <DemoStatusBanner />
            <Intro>
                <Heading as="h4">Try the Demo Sandbox</Heading>
                <Copy>
                    Explore shared demo data with one click. The sandbox resets
                    nightly.
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
            <Divider>or log in with your account</Divider>
            <Heading as="h4">Log in to your account</Heading>
            <LoginForm />
        </LoginLayout>
    );
}

export default Login;
