
"use client";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useEffect, useState } from "react";
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

export default function Login() {

    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login(email, password);
            // Redirect to /me after successful login
            navigate("/me");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    /* Redirect to me if authenticated */
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/me");
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <div className="flex min-h-screen w-3xl flex-col items-center gap-3 py-32 px-16 bg-white dark:bg-black sm:items-start">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-xl">Login to your account</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
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
                                    <InputGroupButton onClick={togglePasswordVisibility} className={cn("bg-transparent! border-none! shadow-none focus-visible:ring-0", showPassword && "text-primary")}>
                                        {showPassword ? (
                                            <EyeOffIcon className="size-4 text-muted-foreground" />
                                        ) : (
                                            <EyeIcon className="size-4 text-muted-foreground" />
                                        )}
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <Button disabled={isLoading} className="w-full bg-[#1e2939]! text-white hover:bg-[#1e2939]/90!" type="submit">
                                {isLoading ? "Logging in..." : "Log In"}
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
