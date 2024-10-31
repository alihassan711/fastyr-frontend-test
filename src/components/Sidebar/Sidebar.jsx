"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { User, Album, Mic } from "lucide-react";
import { usePathname } from 'next/navigation';

function Sidebar() {
    const pathname = usePathname(); 
    const isActive = (path) => pathname === path;
    const [openSideBar, setOpenSideBar] = useState(false);

    useEffect(() => {
        const sideBarStatus = localStorage.getItem('openSideBar');
        setOpenSideBar(sideBarStatus === 'true');
    }, []);

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-4">
            <nav className="mt-[80px] space-y-2 flex flex-col">
                <Link href="/users">
                    <Button 
                        variant="ghost" 
                        className={`w-full flex items-center space-x-2 py-2 ${isActive('/users') ? 'bg-white bg-opacity-10 border-white' : ''}`}
                    >
                        <User className="h-5 w-5" />
                        <span>Users</span>
                    </Button>
                </Link>
                <Link href="/albums">
                    <Button 
                        variant="ghost" 
                        className={`w-full flex items-center space-x-2 py-2 ${isActive('/albums') ? 'bg-white bg-opacity-10 border-white' : ''}`}
                    >
                        <Album className="h-5 w-5" />
                        <span>Albums</span>
                    </Button>
                </Link>
                <Link href="/audio">
                    <Button 
                        variant="ghost" 
                        className={`w-full flex items-center space-x-2 py-2 ${isActive('/audio') ? 'bg-white bg-opacity-10 border-white' : ''}`}
                    >
                        <Mic className="h-5 w-5" />
                        <span>Audio</span>
                    </Button>
                </Link>
            </nav>
        </aside>
    );
}

export default Sidebar;


