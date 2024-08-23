import { subDays } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStaysAfterDate } from "../../services/apiBookings";

function useRecentStays() {
  const [searchParams] = useSearchParams();
  const numDays = searchParams.get("last")
    ? parseInt(searchParams.get("last"))
    : 7;
  const queryDate = subDays(new Date(), numDays).toISOString();

  const {
    isPending,
    data: stays,
    error,
  } = useQuery({
    queryKey: ["stays", `last-${numDays}`],
    queryFn: () => getStaysAfterDate(queryDate),
  });

  const confirmedStays = stays?.filter(
    (stay) => stay.status === "checked-out" || stay.status === "checked-in"
  );

  return { isPending, stays, confirmedStays, error, numDays };
}

export default useRecentStays;
