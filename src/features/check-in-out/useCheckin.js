import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useCheckin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { mutate: checkin, isPending: isCheckingIn } = useMutation({
        // mutationFun function only accepts 1 argument, so we need to pass an object
        mutationFn: ({ bookingId, options = {} }) =>
            updateBooking(bookingId, {
                status: "checked-in",
                is_paid: true,
                ...options,
            }),
        onSuccess: (data) => {
            toast.success(`Booking ${data.id} successfully checked in`);
            queryClient.invalidateQueries({ active: true });
            navigate(`/bookings/${data.id}`);
        },
        onError: (err) => {
            toast.error(`Error checking in booking: ${err.message}`);
        },
    });

    return { checkin, isCheckingIn };
}
