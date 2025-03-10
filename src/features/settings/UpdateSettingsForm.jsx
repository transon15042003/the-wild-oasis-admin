import { useForm } from "react-hook-form";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import useSettings from "./useSettings";
import Spinner from "../../ui/Spinner";
import useUpdateSetting from "./useUpdateSetting";

function UpdateSettingsForm() {
    const {
        isPending,
        settings: {
            min_booking_length,
            max_booking_length,
            max_guests_per_booking,
            breakfast_price,
        } = {},
    } = useSettings();
    const { isUpdating, updateSetting } = useUpdateSetting();

    const { register } = useForm({
        defaultValues: [
            min_booking_length,
            max_booking_length,
            max_guests_per_booking,
            breakfast_price,
        ],
    });

    function handleUpdate(e, field) {
        const { value } = e.target;

        if (!value) return;

        updateSetting({ [field]: value });
    }

    if (isPending) {
        return <Spinner />;
    }

    return (
        <Form>
            <FormRow label="Minimum nights/booking">
                <Input
                    type="number"
                    id="min_booking_length"
                    defaultValue={min_booking_length}
                    disabled={isUpdating}
                    {...register("min_booking_length")}
                    onBlur={(e) => handleUpdate(e, "min_booking_length")}
                />
            </FormRow>
            <FormRow label="Maximum nights/booking">
                <Input
                    type="number"
                    id="max-nights"
                    defaultValue={max_booking_length}
                    disabled={isUpdating}
                    {...register("max_booking_length")}
                    onBlur={(e) => handleUpdate(e, "max_booking_length")}
                />
            </FormRow>
            <FormRow label="Maximum guests/booking">
                <Input
                    type="number"
                    id="max-guests"
                    defaultValue={max_guests_per_booking}
                    disabled={isUpdating}
                    {...register("max_guests_per_booking")}
                    onBlur={(e) => handleUpdate(e, "max_guests_per_booking")}
                />
            </FormRow>
            <FormRow label="Breakfast price">
                <Input
                    type="number"
                    id="breakfast-price"
                    defaultValue={breakfast_price}
                    disabled={isUpdating}
                    {...register("breakfast_price")}
                    onBlur={(e) => handleUpdate(e, "breakfast_price")}
                />
            </FormRow>
        </Form>
    );
}

export default UpdateSettingsForm;
