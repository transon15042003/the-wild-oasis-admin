import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Login as LoginApi } from "../../services/apiAuth";

function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    mutate: login,
    error,
    isPending: isLoggingIn,
  } = useMutation({
    mutationFn: LoginApi,
    onSuccess: (data) => {
      // console.log(data);
      queryClient.setQueryData(["user"], data.user);
      navigate("/dashboard", { replace: true });
    },
    onError: (error) => {
      console.error(error.message);
      toast.error("Login failed. Please try again.");
    },
  });

  return { login, isLoggingIn, error };
}

export default useLogin;
