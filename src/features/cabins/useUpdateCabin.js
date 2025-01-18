import toast from "react-hot-toast";
import { insertUpdateCabin } from "../../services/apiCabins";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useUpdateCabin() {
    const queryClient = useQueryClient();

    const { mutate: updateCabin, isPending: isUpdating } = useMutation({
        mutationFn: ({ newCabinData, id }) =>
            insertUpdateCabin(newCabinData, id),
        onSuccess: () => {
            queryClient.refetchQueries("cabins");
            // queryClient.invalidateQueries({
            //   queryKey: ["cabins"],
            // });
            toast.success("Cabin is updated");
        },
        onError: () => {
            toast.error("Cabin could not be updated");
        },
    });

    return { isUpdating, updateCabin };
}

export default useUpdateCabin;
