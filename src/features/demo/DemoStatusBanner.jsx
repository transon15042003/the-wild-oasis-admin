import styled from "styled-components";
import { formatDistanceToNow } from "date-fns";
import { useDemoMeta } from "./useDemoMeta";

const Banner = styled.div`
    padding: 1.2rem 1.6rem;
    border-radius: var(--border-radius-md);
    font-size: 1.4rem;
    line-height: 1.5;
    background-color: ${(props) =>
        props.$maintenance
            ? "var(--color-red-100)"
            : "var(--color-blue-100, var(--color-brand-100))"};
    color: ${(props) =>
        props.$maintenance
            ? "var(--color-red-700)"
            : "var(--color-blue-700, var(--color-brand-700))"};
    border: 1px solid
        ${(props) =>
            props.$maintenance
                ? "var(--color-red-700)"
                : "var(--color-brand-200)"};
`;

function DemoStatusBanner() {
    const {
        isPending,
        isError,
        isMaintenance,
        maintenanceUntil,
        nextScheduledResetAt,
    } = useDemoMeta();

    if (isPending || isError) return null;

    if (isMaintenance) {
        return (
            <Banner $maintenance>
                Maintenance Window: writes are blocked until{" "}
                {maintenanceUntil.toLocaleString()} (
                {formatDistanceToNow(maintenanceUntil, { addSuffix: true })}).
            </Banner>
        );
    }

    if (!nextScheduledResetAt) return null;

    return (
        <Banner>
            Demo Sandbox: shared hotel data resets daily. Next Demo Reset{" "}
            {formatDistanceToNow(nextScheduledResetAt, { addSuffix: true })} (
            {nextScheduledResetAt.toUTCString()}).
        </Banner>
    );
}

export default DemoStatusBanner;
