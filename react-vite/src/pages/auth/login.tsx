
"use client";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Field,
    FieldDescription,
    FieldGroup,
} from "@/components/ui/field"
import { useAuth } from "@/context/AppContextProvider";
import { useForm, Controller } from "react-hook-form";

interface LoginFormData {
    email: string;
    password: string;
}

export default function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    /* For storing data */
    const { control, handleSubmit, formState: { isSubmitting } } = useForm<LoginFormData>({
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (data: LoginFormData) => {
        setError("");
        try {
            await login(data.email, data.password);
            // Redirect to /me after successful login
            navigate("/me");
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="flex min-h-[92.7vh] items-center justify-center bg-[#1e2939]/90 font-sans">
            <div className="flex w-3xl flex-col items-center gap-3 py-32 px-16 sm:items-star">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-xl">Login to your account</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                            <Controller
                                name="email"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <InputGroup>
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
                                )}
                            />
                            <Controller
                                name="password"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
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
                                )}
                            />
                            {error && (<p className="text-red-700 text-sm font-medium">{error}</p>)}
                            <Button disabled={isSubmitting} className="w-full bg-[#1e2939]! text-white hover:bg-[#1e2939]/90!" type="submit">
                                {isSubmitting ? "Logging in..." : "Log In"}
                            </Button>

                            <FieldGroup>
                                <Field>
                                    <FieldDescription className="text-center">
                                        Don&apos;t have an account? <Link to="/register" className="underline !font-bold!text-black">Sign up</Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
};
