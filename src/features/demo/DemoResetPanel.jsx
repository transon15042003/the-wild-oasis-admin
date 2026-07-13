import styled from "styled-components";
import Heading from "../../ui/Heading";
import Button from "../../ui/Button";
import SpinnerMini from "../../ui/SpinnerMini";
import { useDemoMeta } from "./useDemoMeta";
import { useDemoReset } from "./useDemoReset";

const Box = styled.div`
    padding: 2.4rem;
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);
    display: flex;
    flex-direction: column;
    gap: 1.2rem;

    & p {
        color: var(--color-grey-500);
        font-size: 1.4rem;
    }
`;

function DemoResetPanel() {
    const { isMaintenance } = useDemoMeta();
    const { resetDemo, isPending } = useDemoReset();

    function handleReset() {
        const confirmed = window.confirm(
            "Reset demo data for EVERYONE? This restores shared cabins, guests, bookings, and settings. Auth accounts are kept. A short Maintenance Window will start."
        );
        if (!confirmed) return;
        resetDemo();
    }

    return (
        <Box>
            <Heading as="h2">Demo Reset</Heading>
            <p>
                Restore the shared Demo Sandbox to seed data. This affects all
                Demo Operators. You can do this once per 24 hours.
            </p>
            <div>
                <Button
                    variation="danger"
                    onClick={handleReset}
                    disabled={isPending || isMaintenance}
                >
                    {isPending ? <SpinnerMini /> : "Reset demo data"}
                </Button>
            </div>
        </Box>
    );
}

export default DemoResetPanel;
