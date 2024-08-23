import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateSetting as updateSettingApi } from "../../services/apiSettings";

function useUpdateSetting() {
  const queryClient = useQueryClient();

  const { mutate: updateSetting, isPending: isUpdating } = useMutation({
    mutationFn: updateSettingApi,
    onSuccess: () => {
      queryClient.refetchQueries("settings");
      // queryClient.invalidateQueries({
      //   queryKey: ["settings"],
      // });
      toast.success("Setting is updated");
    },
    onError: () => {
      toast.error("Setting could not be updated");
    },
  });

  return { isUpdating, updateSetting };
}

export default useUpdateSetting;
