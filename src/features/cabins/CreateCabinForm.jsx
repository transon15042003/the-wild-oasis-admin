import { useForm } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import useInsertCabin from "./useInsertCabin";
import useUpdateCabin from "./useUpdateCabin";

// eslint-disable-next-line react/prop-types
function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
    const { isInserting, insertCabin } = useInsertCabin();
    const { isUpdating, updateCabin } = useUpdateCabin();
    const isWorking = isUpdating || isInserting;

    const { id: editId, ...editValues } = cabinToEdit;
    const isEditSession = Boolean(editId);

    const { register, handleSubmit, reset, formState, getValues } = useForm({
        defaultValues: isEditSession ? editValues : {},
    });
    const { errors } = formState;

    function onSubmit(data) {
        const image =
            typeof data.image === "string" ? data.image : data.image[0];

        if (isEditSession)
            updateCabin(
                { newCabinData: { ...data, image: image }, id: editId },
                {
                    onSuccess: (data) => {
                        console.log(data);
                        reset();
                        onCloseModal?.();
                    },
                }
            );
        else
            insertCabin(
                { ...data, image: image },
                {
                    onSuccess: (data) => {
                        console.log(data);
                        reset();
                        onCloseModal?.();
                    },
                }
            );
    }

    function onError(errors) {
        console.error(errors);
    }

    return (
        <Form
            onSubmit={handleSubmit(onSubmit, onError)}
            type={onCloseModal ? "modal" : "regular"}
        >
            <FormRow label="Cabin name" error={errors?.name?.message}>
                <Input
                    type="text"
                    id="name"
                    disabled={isWorking}
                    {...register("name", {
                        required: "Cabin name is required",
                        minLength: {
                            value: 3,
                            message: "Cabin name is too short",
                        },
                    })}
                    aria-invalid={errors.name ? "true" : "false"}
                />
            </FormRow>

            <FormRow
                label="Maximum capacity"
                error={errors?.max_capacity?.message}
            >
                <Input
                    type="number"
                    id="maxCapacity"
                    disabled={isWorking}
                    {...register("max_capacity", {
                        required: "Maximum capacity is required",
                        min: { value: 1, message: "Minimum capacity is 1" },
                    })}
                />
            </FormRow>

            <FormRow
                label="Regular price"
                error={errors?.regular_price?.message}
            >
                <Input
                    type="number"
                    id="regularPrice"
                    disabled={isWorking}
                    {...register("regular_price", {
                        required: "Regular price is required",
                        min: { value: 0, message: "Minimum price is 0" },
                    })}
                />
            </FormRow>

            <FormRow label="Discount" error={errors?.discount?.message}>
                <Input
                    type="number"
                    id="discount"
                    defaultValue={0}
                    disabled={isWorking}
                    {...register("discount", {
                        required: "Discount is required",
                        validate: (value) =>
                            +value <= +getValues("regular_price") ||
                            "Discount cannot be higher than regular price",
                    })}
                />
            </FormRow>

            <FormRow
                label="Description for cabin"
                error={errors?.description?.message}
            >
                <Textarea
                    type="number"
                    id="description"
                    defaultValue=""
                    disabled={isWorking}
                    {...register("description", {
                        required: "Description is required",
                    })}
                />
            </FormRow>

            <FormRow label="Cabin photo" error={errors?.image?.message}>
                <FileInput
                    id="image"
                    accept="image/*"
                    disabled={isWorking}
                    {...register("image", {
                        required: isEditSession ? false : "Image is required",
                    })}
                />
            </FormRow>

            <FormRow>
                {/* type is an HTML attribute! */}
                <Button
                    variation="secondary"
                    type="reset"
                    onClick={() => onCloseModal?.()}
                >
                    {onCloseModal ? "Cancel" : "Clear"}
                </Button>
                <Button disabled={isWorking}>
                    {isEditSession ? "Save cabin" : "Add cabin"}
                </Button>
            </FormRow>
        </Form>
    );
}

export default CreateCabinForm;
