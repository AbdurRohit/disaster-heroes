"use client";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <div>
            <nav className="backdrop-blur-md shadow-lg bg-navbg fixed w-full z-10 transition-colors duration-200">
                <div className="max-w-1xl mx-auto px-1">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <span 
                                    onClick={() => window.location.href = '/'}
                                    className="text-2xl font-bold text-gray-800 cursor-pointer
                                               px-2 py-2 
                                               
                                                
                                               text-footer
                                               transition-all duration-300 ease-in-out
                                               "
                                >
                                    Disaster Heroes
                                </span>
                            </div>
                            <div className="hidden md:ml-8 md:flex md:space-x-8">

                                <Link href="/about" className="inline-flex items-center px-3 py-6 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-blue-500 transition duration-200">About</Link>
                                <Link href="/resources" className="inline-flex items-center px-3 py-6 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-blue-500 transition duration-200">Resources</Link>
                                <Link href="/editorials" className="inline-flex items-center px-3 py-6 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-blue-500 transition duration-200">Editorials</Link>

                                <Link href="/member" className="inline-flex items-center px-3 py-6 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-blue-500 transition duration-200">Member area</Link>
                            </div>

                             {/* Theme Toggle Button */}
                             <button
                                onClick={toggleTheme}
                                className="p-2 pl-7 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
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
                           

                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center px-4 py-2 rounded-lg bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none transition duration-200"
                                >
                                    <span>Guest</span>
                                    <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white/90 backdrop-blur-sm ring-1 ring-black ring-opacity-5">
                                        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Profile</Link>
                                        <Link href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">Logout</Link>
                            
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none transition duration-200"
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
                            <Link href="/resources" className="block pl-4 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-500 hover:text-gray-800 transition duration-150">Resources</Link>
                            <Link href="/editorials" className="block pl-4 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-500 hover:text-gray-800 transition duration-150">Editorials</Link>

                            <Link href="/member" className="block pl-4 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-500 hover:text-gray-800 transition duration-150">Members</Link>
                        </div>
                        <div className="pt-4 pb-3 border-t border-gray-200">
                            <div className="space-y-1">
                                <Link href="/login" className="block pl-4 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-500 hover:text-gray-800 transition duration-150">Login</Link>
                                <Link href="/register" className="block pl-4 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-500 hover:text-gray-800 transition duration-150">Register</Link>
                                <Link href="/member" className="block pl-4 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-500 hover:text-gray-800 transition duration-150">Member Area</Link>
                                
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    )
}

export default Navbar;