/* eslint-disable react/prop-types */
import styled from "styled-components";
import Heading from "../../ui/Heading";
import { useDemoMeta } from "./useDemoMeta";
import Spinner from "../../ui/Spinner";

const FullPage = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.6rem;
    padding: 2.4rem;
    background-color: var(--color-grey-50);
    text-align: center;

    & p {
        max-width: 48rem;
        width: 100%;
        color: var(--color-grey-600);
        font-size: 1.6rem;
    }
`;

function MaintenanceScreen({ children }) {
    const { isPending, isMaintenance, maintenanceUntil } = useDemoMeta();

    if (isPending) {
        return (
            <FullPage>
                <Spinner />
            </FullPage>
        );
    }

    if (!isMaintenance) return children;

    return (
        <FullPage>
            <Heading as="h1">Under maintenance</Heading>
            <p>
                The Demo Sandbox is in a Maintenance Window
                {maintenanceUntil
                    ? ` until ${maintenanceUntil.toLocaleString()}`
                    : ""}
                . Login and write operations are temporarily blocked while data
                is reset.
            </p>
        </FullPage>
    );
}

export default MaintenanceScreen;
