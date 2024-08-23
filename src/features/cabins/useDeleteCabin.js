import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCabin as deleteCabinApi } from "../../services/apiCabins";
import toast from "react-hot-toast";

export default function useDeleteCabin() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteCabin } = useMutation({
    mutationFn: deleteCabinApi,
    onSuccess: () => {
      queryClient.refetchQueries("cabins");
      // queryClient.invalidateQueries({
      //   queryKey: ["cabins"],
      // });
      toast.success("Cabin deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  return { isDeleting, deleteCabin };
}
