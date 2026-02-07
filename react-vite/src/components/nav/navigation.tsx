"use client";
import { Key, Barcode, NotebookPen, LogOut, User } from "lucide-react";

import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/context/AppContextProvider";

export default function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const navigationMenuItems = [
        ...(isAuthenticated ? [
            { title: "Products", href: "/products", icon: Barcode },
            { title: "Profile", href: "/me", icon: User },
        ] : [
            { title: "Login", href: "/login", icon: Key },
            { title: "Register", href: "/register", icon: NotebookPen },
        ]),
    ];

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (<div className="flex w-full flex-col items-center p-4 bg-gray-800 sm:items-start">
        <NavigationMenu>
            <NavigationMenuList>
                {navigationMenuItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <NavigationMenuItem key={item.title}>
                            <NavigationMenuLink
                                active={isActive}
                                asChild
                                className={navigationMenuTriggerStyle()}
                            >
                                <Link
                                    className={`flex-row items-center gap-2.5 ${isActive && "bg-[#ccb965]! text-black!" }`}
                                    to={item.href}
                                >
                                    <item.icon
                                        className={`h-5 w-5 shrink-0 ${isActive && "text-black!" }`}
                                    />
                                    {item.title}
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    )
                })}
                {isAuthenticated && (
                    <>
                    <NavigationMenuItem>
                        <button
                            onClick={handleLogout}
                            className={`${navigationMenuTriggerStyle()} cursor-pointer`}
                        >
                            <LogOut className="h-5 w-5 shrink-0" />
                            Logout
                        </button>
                    </NavigationMenuItem>
                    </>
                )}
            </NavigationMenuList>
        </NavigationMenu>
    </div>)
};
