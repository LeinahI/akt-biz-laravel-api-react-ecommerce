"use client";
import { Key, Barcode, NotebookPen, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
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
    const { isAuthenticated, logout } = useAuth();
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        try {
            await logout();
        } finally {
            setLoading(false);
        }
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
                                    className={`flex-row items-center gap-2.5 ${isActive && "bg-[#ccb965]! text-black!"}`}
                                    to={item.href}
                                >
                                    <item.icon
                                        className={`h-5 w-5 shrink-0 ${isActive && "text-black!"}`}
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
                            <Button disabled={loading} className={`${navigationMenuTriggerStyle()} cursor-pointer bg-red-600! hover:bg-red-600/80! text-white!`} onClick={handleLogout}>
                                <LogOut className="h-5 w-5 shrink-0" />
                                Logout
                            </Button>
                        </NavigationMenuItem>
                    </>
                )}
            </NavigationMenuList>
        </NavigationMenu>
    </div>)
};
