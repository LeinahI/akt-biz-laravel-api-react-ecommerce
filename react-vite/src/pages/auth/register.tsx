"use client";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon, } from "lucide-react";
import { useState } from "react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AppContextProvider";
import { Link, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
} from "@/components/ui/field"
import { useForm, Controller } from "react-hook-form";

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface BackendErrors {
    [key: string]: string[];
}

export default function Register() {

    const navigate = useNavigate();
    const { register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [backendErrors, setBackendErrors] = useState<BackendErrors>({});

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    /* For storing data */
    const { control, handleSubmit, formState: { isSubmitting }, setError: setFormError } = useForm<RegisterFormData>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        }
    });

    const onSubmit = async (data: RegisterFormData) => {
        setError("");
        setBackendErrors({});

        try {
            await register(data.name, data.email, data.password, data.password_confirmation);
            // Redirect to /me after successful registration
            navigate("/me");
        } catch (err: any) {
            console.log("Err: ", err);

            // Handle backend validation errors
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors as BackendErrors;
                setBackendErrors(errors);

                Object.keys(errors).forEach((field) => {
                    setFormError(field as keyof RegisterFormData, {
                        type: "server",
                        message: errors[field][0] || "Validation error",
                    });
                });
            } else {
                setError(err || "Registration failed. Please try again.");
            }
        }
    };

    return (
        <div className="flex min-h-[92.7vh] items-center justify-center bg-[#1e2939]/90 font-sans">
            <main className="flex w-3xl flex-col items-center gap-3 py-32 px-16 sm:items-start">
                <Card className="w-full">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Create your account</CardTitle>
                        <CardDescription>
                            Enter your email below to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3">
                            <FieldGroup>
                                {/* Name */}
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <InputGroup>
                                                <InputGroupAddon>
                                                    <UserIcon className="text-muted-foreground" />
                                                </InputGroupAddon>
                                                <InputGroupInput
                                                    className={cn("border-0 shadow-none focus-visible:ring-0", error && "border-red-500")}
                                                    placeholder="Name"
                                                    type="text"
                                                    {...field}
                                                    disabled={isSubmitting}
                                                />
                                            </InputGroup>
                                            {error && (
                                                <p className="text-start text-red-500 text-sm">{error.message}</p>
                                            )}
                                        </>
                                    )}
                                />
                                {/* Email */}
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <>
                                            <InputGroup className="p-0">
                                                <InputGroupAddon>
                                                    <MailIcon className="text-muted-foreground" />
                                                </InputGroupAddon>
                                                <InputGroupInput
                                                    className={cn("border-0 shadow-none focus-visible:ring-0", error && "border-red-500")}
                                                    placeholder="Email"
                                                    type="email"
                                                    {...field}
                                                    disabled={isSubmitting}
                                                />
                                            </InputGroup>
                                            {error && (
                                                <p className="text-start text-red-500 text-sm">{error.message}</p>
                                            )}
                                        </>

                                    )}
                                />
                                <Field>
                                    <Field className="grid grid-cols-2 gap-4">
                                        {/* Password */}
                                        <div className="col-span-1">
                                            <Controller
                                            name="password"
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <>
                                                    <InputGroup>
                                                        <InputGroupAddon>
                                                            <LockIcon className="text-muted-foreground" />
                                                        </InputGroupAddon>
                                                        <InputGroupInput
                                                            className={cn("border-0 shadow-none focus-visible:ring-0", error && "border-red-500")}
                                                            placeholder="Password"
                                                            type={showPassword ? "text" : "password"}
                                                            {...field}
                                                            disabled={isSubmitting}
                                                        />
                                                        <InputGroupAddon align="inline-end">
                                                            <InputGroupButton onClick={togglePasswordVisibility} className={cn("bg-transparent! border-none! shadow-none focus-visible:ring-0", showPassword && "text-primary")}>
                                                                {showPassword ? (
                                                                    <EyeOffIcon className="size-4 text-muted-foreground" />
                                                                ) : (
                                                                    <EyeIcon className="size-4 text-muted-foreground" />
                                                                )}
                                                            </InputGroupButton>
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                    {error && (
                                                        <p className="text-red-500 text-sm mt-1 text-start">{error.message}</p>
                                                    )}
                                                </>
                                            )}
                                        />
                                        </div>
                                        {/* CPW */}
                                        <div className="col-span-1">
                                            <Controller
                                            name="password_confirmation"
                                            control={control}
                                            render={({ field, fieldState: { error } }) => (
                                                <>
                                                    <InputGroup>
                                                        <InputGroupAddon>
                                                            <LockIcon className="text-muted-foreground" />
                                                        </InputGroupAddon>
                                                        <InputGroupInput
                                                            className={cn("border-0 shadow-none focus-visible:ring-0", error && "border-red-500")}
                                                            placeholder="Confirm Password"
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            {...field}
                                                            disabled={isSubmitting}
                                                        />

                                                        <InputGroupAddon align="inline-end">
                                                            <InputGroupButton onClick={toggleConfirmPasswordVisibility} className={cn("bg-transparent! border-none! shadow-none focus-visible:ring-0", showConfirmPassword && "text-primary")}>
                                                                {showConfirmPassword ? (
                                                                    <EyeOffIcon className="size-4 text-muted-foreground" />
                                                                ) : (
                                                                    <EyeIcon className="size-4 text-muted-foreground" />
                                                                )}
                                                            </InputGroupButton>
                                                        </InputGroupAddon>

                                                    </InputGroup>
                                                    {error && (
                                                        <p className="text-red-500 text-sm mt-1 text-start">{error.message}</p>
                                                    )}
                                                </>
                                            )}
                                        />
                                        </div>
                                    </Field>
                                    <FieldDescription className="text-start">
                                        Must be at least 8 characters long.
                                    </FieldDescription>
                                    {error && (<p className="text-red-700 text-sm font-medium">{error}</p>)}
                                </Field>
                                <Field>
                                    <Button disabled={isSubmitting} className="w-full bg-[#1e2939]! text-white hover:bg-[#1e2939]/90!" type="submit">
                                        {isSubmitting ? "Creating account..." : "Create account"}
                                    </Button>
                                    <FieldDescription className="text-center">
                                        Already have an account? <Link to="/login" className="underline !font-bold!text-black">Log in</Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div >
    )
};
