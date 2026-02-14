"use client";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, CircleUser, } from "lucide-react";
import { useEffect, useState } from "react";
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

export default function Register() {

    const navigate = useNavigate();
    const { register } = useAuth();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match");
            }
            await register(name, email, password, confirmPassword);
            // Redirect to /me after successful registration
            navigate("/me");
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-3xl flex-col items-center gap-3 py-32 px-16 bg-white dark:bg-black sm:items-start">
                <Card className="w-full">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Create your account</CardTitle>
                        <CardDescription>
                            Enter your email below to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                            <FieldGroup>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <CircleUser className="text-muted-foreground" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        className="border-0 shadow-none focus-visible:ring-0"
                                        placeholder="John Doe"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </InputGroup>
                                <InputGroup>
                                    <InputGroupAddon>
                                        <MailIcon className="text-muted-foreground" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        className="border-0 shadow-none focus-visible:ring-0"
                                        placeholder="Email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </InputGroup>
                                <Field>
                                    <Field className="grid grid-cols-2 gap-4">
                                        <InputGroup>
                                            <InputGroupAddon>
                                                <LockIcon className="text-muted-foreground" />
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                className="border-0 shadow-none focus-visible:ring-0"
                                                placeholder="Password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />

                                            <InputGroupAddon align="inline-end">
                                                <InputGroupButton onClick={togglePasswordVisibility} className={cn("!bg-transparent !border-none shadow-none focus-visible:ring-0", showPassword && "text-primary")}>
                                                    {showPassword ? (
                                                        <EyeOffIcon className="size-4 text-muted-foreground" />
                                                    ) : (
                                                        <EyeIcon className="size-4 text-muted-foreground" />
                                                    )}
                                                </InputGroupButton>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        {/* CPW */}
                                        <InputGroup>
                                            <InputGroupAddon>
                                                <LockIcon className="text-muted-foreground" />
                                            </InputGroupAddon>
                                            <InputGroupInput
                                                className="border-0 shadow-none focus-visible:ring-0"
                                                placeholder="Confirm Password"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />

                                            <InputGroupAddon align="inline-end">
                                                <InputGroupButton onClick={toggleConfirmPasswordVisibility} className={cn("!bg-transparent !border-none shadow-none focus-visible:ring-0", showConfirmPassword && "text-primary")}>
                                                    {showConfirmPassword ? (
                                                        <EyeOffIcon className="size-4 text-muted-foreground" />
                                                    ) : (
                                                        <EyeIcon className="size-4 text-muted-foreground" />
                                                    )}
                                                </InputGroupButton>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Field>
                                    <FieldDescription className="text-start">
                                        Must be at least 8 characters long.
                                    </FieldDescription>
                                </Field>
                                <Field>
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                    <Button disabled={isLoading} className="w-full bg-[#1e2939]! text-white hover:bg-[#1e2939]/90!" type="submit">
                                        {isLoading ? "Creating account..." : "Create account"}
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
