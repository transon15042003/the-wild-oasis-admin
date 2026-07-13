import { useQuery } from "@tanstack/react-query";
import { getDemoMeta } from "../../services/apiDemo";

export function useDemoMeta() {
    const { data, isPending, error, isError } = useQuery({
        queryKey: ["demo-meta"],
        queryFn: getDemoMeta,
        refetchInterval: 30_000,
        retry: 1,
    });

    const maintenanceUntil = data?.maintenance_until
        ? new Date(data.maintenance_until)
        : null;
    const isMaintenance =
        maintenanceUntil instanceof Date &&
        !Number.isNaN(maintenanceUntil.valueOf()) &&
        maintenanceUntil.getTime() > Date.now();

    return {
        demoMeta: data,
        isPending,
        error,
        isError,
        isMaintenance,
        maintenanceUntil,
        lastResetAt: data?.last_reset_at
            ? new Date(data.last_reset_at)
            : null,
        nextScheduledResetAt: data?.next_scheduled_reset_at
            ? new Date(data.next_scheduled_reset_at)
            : null,
    };
}
