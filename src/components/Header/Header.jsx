import React from "react";
import Link from "next/link";

function Header() {
    return (
        <header className="fixed top-0 w-full bg-gray-800 text-white p-4 z-10">
            <h1 className="text-lg font-bold ml-[70px]">
                <Link href="/users">
                    Fastyr Frontend
                </Link>
            </h1>
        </header>
    );
}

export default Header;
