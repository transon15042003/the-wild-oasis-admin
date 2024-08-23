import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { logout as logoutApi } from "../../services/apiAuth";

function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // Redirect to login page
      //   queryClient.setQueriesData("user", null);
      queryClient.removeQueries("user");
      navigate("/login", { replace: true });
    },
  });

  return { logout, isPending };
}

export default useLogout;
