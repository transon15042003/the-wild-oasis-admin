import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteBooking as deleteBookingApi } from "../../services/apiBookings";
// import { useNavigate, useParams } from "react-router-dom";

export default function useDeleteBooking() {
  // const { bookingId } = useParams();
  // const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteBooking } = useMutation({
    mutationFn: (id) => deleteBookingApi(id),
    onSuccess: () => {
      queryClient.refetchQueries("bookings");
      // queryClient.invalidateQueries({
      //   queryKey: ["cabins"],
      // });
      toast.success("Booking deleted successfully");
      // if (bookingId) {
      //   navigate(-1);
      // }
    },
    onError: (error) => toast.error(error.message),
  });

  return { isDeleting, deleteBooking };
}
