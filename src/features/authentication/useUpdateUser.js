import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateCurrentUser } from "../../services/apiAuth";

function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: ({ fullName, avatar, password }) =>
      UpdateCurrentUser({ fullName, avatar, password }),
    onSuccess: (data) => {
      //   console.log(data);
      //   queryClient.refetchQueries(["user"]);
      queryClient.setQueryData(["user"], data.user);
      // queryClient.invalidateQueries({
      //   queryKey: ["cabins"],
      // });
      toast.success("User account is updated");
    },
    onError: (error) => toast.error(error.message),
  });

  return { isUpdating, updateUser };
}

export default useUpdateUser;
