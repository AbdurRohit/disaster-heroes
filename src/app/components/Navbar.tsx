"use client";
import Link from "next/link";
import { useState, MouseEvent, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useTheme } from "../context/ThemeContext";
import { signIn, signOut, useSession } from "next-auth/react";
import { Middleware } from "next/dist/lib/load-custom-routes";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const { theme, toggleTheme } = useTheme();
    const { data: session, status } = useSession();
    const router = useRouter();
    const isAuthenticated = status === "authenticated";

    const handleProtectedLink = async (e: MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        if (!isAuthenticated) {
            await signIn("google", { redirect: false });
        } else {
            router.push(path);
        }
    };

    const handleLogin = async () => {
        const result = await signIn("google", { redirect: false, callbackUrl: "/profile" });
        if (result?.url) {
          router.push(result.url);
        }
    };

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push('/');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | any) => {
            if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    // Protected Links component
    const ProtectedLink = ({ href, children, className }: { href: string; children: React.ReactNode; className: string }) => (
        <a href={href} onClick={(e) => handleProtectedLink(e, href)} className={className}>
            {children}
        </a>
    );

    return (
        <div>
            <nav className="backdrop-blur-md shadow-lg bg-navbg fixed w-full z-10 transition-colors duration-200">
                <div className="max-w-1xl mx-auto px-1">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <span 
                                    onClick={() => window.location.href = '/'}
                                    className="text-2xl font-bold cursor-pointer
                                               px-2 py-2 
                                               transition-all duration-300 ease-in-out"
                                >
                                    Disaster Heroes
                                </span>
                            </div>
                            <div className="hidden md:ml-8 md:flex md:space-x-8">
                                <Link href="/about" className="inline-flex items-center px-3 py-6 border-b-2 border-transparent text-sm font-medium  hover:text-gray-700 hover:border-blue-500 transition duration-200">About</Link>
                                <Link href="/report" className="inline-flex items-center px-3 py-6 border-b-2 border-transparent text-sm font-medium  hover:text-gray-700 hover:border-blue-500 transition duration-200">Report</Link>
                                <Link href="/resources" className="inline-flex items-center px-3 py-6 border-b-2 border-transparent text-sm font-medium  hover:text-gray-700 hover:border-blue-500 transition duration-200">Resources</Link>
                                <Link href="/editorials" className="inline-flex items-center px-3 py-6 border-b-2 border-transparent text-sm font-medium  hover:text-gray-700 hover:border-blue-500 transition duration-200">Editorials</Link>
                                
                                {/* Only show Member area if logged in */}
                                {isAuthenticated && (
                                    <ProtectedLink href="/member" className="inline-flex items-center px-3 py-6 border-b-2 border-transparent text-sm font-medium  hover:text-gray-700 hover:border-blue-500 transition duration-200">Member area</ProtectedLink>
                                )}
                            </div>

                            {/* Theme Toggle Button */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 pl-7 rounded-lg  hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                                aria-label="Toggle theme"
                            >
                                {theme === 'light' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            {status === "authenticated" && session ? (
                                <div className="relative dropdown-container">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center space-x-2 focus:outline-none"
                                    >
                                        <span className="">{session.user?.name}</span>
                                        {session.user?.image ? (
                                            <img
                                                src={session.user.image}
                                                alt="Profile"
                                                className="h-8 w-8 rounded-full"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                <span>{session.user?.name?.[0]}</span>
                                            </div>
                                        )}
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                                            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Profile
                                            </Link>
                                            <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Settings
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={handleLogin}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Sign in
                                </button>
                            )}
                        </div>
                        
                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md hover:text-gray-700 hover:bg-gray-100 focus:outline-none transition duration-200"
                                aria-label="Toggle mobile menu"
                            >
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white/95 backdrop-blur-sm">
                        <div className="pt-1 pb-1 space-y-1">
                            <Link href="/about" className="block pl-4 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-500 hover:text-gray-800 transition duration-150">About</Link>
                            <Link href="/report" className="block pl-4 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-500 hover:text-gray-800 transition duration-150">Report</Link>
                            <Link href="/resources" className="block pl-4 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-500 hover:text-gray-800 transition duration-150">Resources</Link>
                            <Link href="/editorials" className="block pl-4 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-500 hover:text-gray-800 transition duration-150">Editorials</Link>
                            
                            {/* Only show Member area if logged in */}
                            {isAuthenticated && (
                                <ProtectedLink href="/member" className="block pl-4 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-500 hover:text-gray-800 transition duration-150">Members</ProtectedLink>
                            )}
                        </div>
                        <div className="pt-4 pb-3 border-t border-gray-200">
                            <div className="space-y-1">
                                {status === "authenticated" && session ? (
                                    <>
                                        <div className="flex items-center px-4">
                                            {session.user?.image ? (
                                                <img
                                                    src={session.user.image}
                                                    alt="Profile"
                                                    className="h-8 w-8 rounded-full"
                                                />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span>{session.user?.name?.[0]}</span>
                                                </div>
                                            )}
                                            <span className="ml-3 text-gray-700">{session.user?.name}</span>
                                        </div>
                                        <div className="mt-3 space-y-1">
                                            <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                Profile
                                            </Link>
                                            <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                Settings
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="px-4">
                                        <button
                                            onClick={handleLogin}
                                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            Sign in
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Navbar;