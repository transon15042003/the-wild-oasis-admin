import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useCheckout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { mutate: checkout, isPending: isCheckingOut } = useMutation({
        // mutationFun function only accepts 1 argument, so we need to pass an object
        mutationFn: ({ bookingId, options = {} }) =>
            updateBooking(bookingId, {
                status: "checked-out",
                ...options,
            }),
        onSuccess: (data) => {
            toast.success(`Booking ${data.id} successfully checked out`);
            queryClient.invalidateQueries({ active: true });
            navigate(`/bookings/${data.id}`, { replace: true });
        },
        onError: (err) => {
            toast.error(`${err.message}`);
        },
    });

    return { checkout, isCheckingOut };
}
