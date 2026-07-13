import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { signup as signupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

function useSignup() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {
        mutate: signup,
        isPending,
        error,
    } = useMutation({
        mutationFn: signupApi,
        onSuccess: (data) => {
            if (data?.user) {
                queryClient.setQueryData(["user"], data.user);
            }
            toast.success("Account created. Welcome to the demo!");
            navigate("/dashboard", { replace: true });
        },
        onError: (err) => {
            toast.error(err.message || "Could not create account");
        },
    });

    return {
        signup,
        isPending,
        error,
    };
}

export default useSignup;
