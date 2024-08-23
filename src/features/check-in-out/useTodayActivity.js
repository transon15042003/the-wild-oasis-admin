import { useQuery } from "@tanstack/react-query";
import { getStaysTodayActivity } from "../../services/apiBookings";

function useTodayActivity() {
  const { isPending, data, error } = useQuery({
    queryKey: ["today-activity"],
    queryFn: getStaysTodayActivity,
  });
  return { isPending, data, error };
}

export default useTodayActivity;
