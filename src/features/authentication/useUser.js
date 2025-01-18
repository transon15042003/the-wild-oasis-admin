import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

function useUser() {
    const {
        data: user,
        error,
        isPending,
    } = useQuery({
        queryKey: ["user"],
        queryFn: getCurrentUser,
    });

    return {
        user,
        isPending,
        isAuthenticated: user?.role === "authenticated",
        error,
    };
}

export default useUser;
