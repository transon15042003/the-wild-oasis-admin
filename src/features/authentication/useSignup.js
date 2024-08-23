import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

function useSignup() {
  const {
    mutate: signup,
    isPending,
    error,
  } = useMutation({
    mutationFn: signupApi,
    onSuccess: (data) => {
      console.log(data);
      toast.success("Account created successfully. Please verify your email.");
    },
  });

  return {
    signup,
    isPending,
    error,
  };
}

export default useSignup;
