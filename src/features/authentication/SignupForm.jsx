import { useForm } from "react-hook-form";
import { useState } from "react";
/* eslint-disable react/prop-types */
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import FormRowVertical from "../../ui/FormRowVertical";
import Input from "../../ui/Input";
import useSignup from "./useSignup";
import SpinnerMini from "../../ui/SpinnerMini";
import TurnstileWidget from "../demo/TurnstileWidget";

function SignupForm({ variant = "admin" }) {
    const isPublic = variant === "public";
    const Row = isPublic ? FormRowVertical : FormRow;
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues,
        reset,
    } = useForm();
    const { signup, isPending } = useSignup();
    const [turnstileToken, setTurnstileToken] = useState("");

    function onSubmit({ fullName, email, password }) {
        if (isPublic && !turnstileToken) return;

        signup(
            {
                fullName,
                email,
                password,
                turnstileToken: isPublic ? turnstileToken : undefined,
            },
            {
                onSuccess: () => {
                    reset();
                    setTurnstileToken("");
                },
            }
        );
    }

    const disabled = isSubmitting || isPending;

    return (
        <Form onSubmit={handleSubmit(onSubmit)} type={isPublic ? "regular" : undefined}>
            <Row label="Full name" error={errors?.fullName?.message}>
                <Input
                    type="text"
                    id="fullName"
                    disabled={disabled}
                    {...register("fullName", {
                        required: "This field is required",
                    })}
                />
            </Row>

            <Row label="Email address" error={errors?.email?.message}>
                <Input
                    type="email"
                    id="email"
                    autoComplete="username"
                    disabled={disabled}
                    {...register("email", {
                        required: "This field is required",
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Invalid email address",
                        },
                    })}
                />
            </Row>

            <Row
                label="Password (min 8 characters)"
                error={errors?.password?.message}
            >
                <Input
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    disabled={disabled}
                    {...register("password", {
                        required: "This field is required",
                        minLength: {
                            value: 8,
                            message:
                                "Password must be at least 8 characters long",
                        },
                    })}
                />
            </Row>

            <Row
                label="Repeat password"
                error={errors?.passwordConfirm?.message}
            >
                <Input
                    type="password"
                    id="passwordConfirm"
                    autoComplete="new-password"
                    disabled={disabled}
                    {...register("passwordConfirm", {
                        required: "This field is required",
                        validate: (value) =>
                            value === getValues("password") ||
                            "Passwords do not match",
                    })}
                />
            </Row>

            {isPublic && (
                <Row>
                    <TurnstileWidget
                        onSuccess={setTurnstileToken}
                        onExpire={() => setTurnstileToken("")}
                    />
                </Row>
            )}

            <Row>
                {!isPublic && (
                    <Button
                        variation="secondary"
                        type="reset"
                        disabled={disabled}
                        onClick={reset}
                    >
                        Reset
                    </Button>
                )}
                <Button
                    size={isPublic ? "large" : "medium"}
                    disabled={disabled || (isPublic && !turnstileToken)}
                >
                    {disabled ? (
                        <SpinnerMini />
                    ) : isPublic ? (
                        "Create account"
                    ) : (
                        "Create new user"
                    )}
                </Button>
            </Row>
        </Form>
    );
}

export default SignupForm;
