import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertUpdateCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

function useInsertCabin() {
  const queryClient = useQueryClient();

  const { mutate: insertCabin, isPending: isInserting } = useMutation({
    mutationFn: insertUpdateCabin,
    onSuccess: () => {
      queryClient.refetchQueries("cabins");
      // queryClient.invalidateQueries({
      //   queryKey: ["cabins"],
      // });
      toast.success("Cabin is added");
    },
    onError: () => {
      toast.error("Cabin could not be added");
    },
  });

  return { isInserting, insertCabin };
}

export default useInsertCabin;
