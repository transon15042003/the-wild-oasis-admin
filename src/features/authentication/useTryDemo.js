import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { tryDemo as tryDemoApi } from "../../services/apiAuth";

function useTryDemo() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { mutate: tryDemo, isPending } = useMutation({
        mutationFn: tryDemoApi,
        onSuccess: (data) => {
            queryClient.setQueryData(["user"], data.user);
            navigate("/dashboard", { replace: true });
        },
        onError: (error) => {
            console.error(error.message);
            toast.error("Unable to start the demo. Please try again.");
        },
    });

    return { tryDemo, isPending };
}

export default useTryDemo;
