import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getBookings } from "../../services/apiBookings";
import { PAGE_SIZE } from "../../utils/constants";

function useBookings() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // Filter
  const filterValue = searchParams.get("status") || "all";
  const filter =
    filterValue === "all" ? null : { field: "status", value: filterValue }; // { field: "total_price", value: 5000, method: "gte" };

  // Sort by
  const sortByRaw = searchParams.get("sortBy") || "start_date-desc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };

  // Pagination
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  // Query
  const {
    data: { data: bookings, count } = {},
    error,
    isPending,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page],
    queryFn: () => getBookings(filter, sortBy, page),
  });

  // Prefetching
  const totalPages = Math.ceil(count / PAGE_SIZE);

  if (Number(page) < totalPages) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page + 1],
      queryFn: () => getBookings(filter, sortBy, page + 1),
    });
  }

  if (Number(page) > 1) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page - 1],
      queryFn: () => getBookings(filter, sortBy, page - 1),
    });
  }

  return { bookings, count, error, isPending };
}

export default useBookings;
