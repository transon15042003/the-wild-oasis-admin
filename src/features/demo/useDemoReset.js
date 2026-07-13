import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { requestDemoReset } from "../../services/apiDemo";

export function useDemoReset() {
    const queryClient = useQueryClient();

    const { mutate: resetDemo, isPending } = useMutation({
        mutationFn: requestDemoReset,
        onSuccess: () => {
            toast.success(
                "Demo reset started. The sandbox is in maintenance for a few minutes."
            );
            queryClient.invalidateQueries({ queryKey: ["demo-meta"] });
            queryClient.invalidateQueries();
        },
        onError: (err) => {
            toast.error(err.message || "Could not reset demo data");
        },
    });

    return { resetDemo, isPending };
}
