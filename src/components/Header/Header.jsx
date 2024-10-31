import React from "react";
import Link from "next/link";

function Header() {
    return (
        <header className="fixed flex items-end justify-between top-0 w-full bg-gray-800 text-white p-4 z-10">
            <h1 className="text-lg font-bold ml-3 lg:ml-[70px]">
                <Link href="/users">
                    Fastyr Frontend
                </Link>
            </h1>
            <nav className="mt-2 space-x-4 block lg:hidden mr-4">
                <Link href="/users" className="hover:text-gray-400">Users</Link>
                <Link href="/albums" className="hover:text-gray-400">Albums</Link>
                <Link href="/audio" className="hover:text-gray-400">Audio</Link>
            </nav>
        </header>
    );
}

export default Header;
