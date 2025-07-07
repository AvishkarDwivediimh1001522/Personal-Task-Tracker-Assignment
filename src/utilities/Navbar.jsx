"use client";
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from 'react-router-dom';

//import { usePathname } from "next/navigation";
//import Image from "next/image";



const DropdownComponent = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        //Listen for mouse clicks
        document.addEventListener('mousedown', handleClickOutside);
        // Listen for touch events
        document.addEventListener('touchstart', handleClickOutside);

        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);
}

const Navbar = () => {
    const location = useLocation();
    const pathname = location.pathname;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showDropdowm, setShowDropdowm] = useState(false)
    // const user = useUser();//
    // console.log(user.user?.id)

    return (

        <nav className="navbar bg-black text-white p-3 flex items-center justify-between px-6 lg:px-8 font-serif gap-0">
            {/* Logo Section */}
            <div className="flex items-center justify-between w-full xl:w-auto">
                <div className="flex gap-2 ">
                    {/* <Image
                        src="/BIT logo as bg black.jpg"
                        alt="BIT logo"
                       // layout="fill"
                       // objectFit="cover"
                        height={10}
                        width={30}
                        className="bg-black "
                    /> */}
                    {/* <div className="logo font-bold text-2xl">Agro Arjuna</div> */}
                    <div className="flex items-center mb-0 md:mb-0">
                        {/* <div className="bg-white p-2 rounded-full mr-3">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    </div> */}
                        <div>
                            <h2 className="text-2xl font-bold">RYGNeco</h2>
                            <p className="text-emerald-200 text-xs">Personalised Task Manager</p>
                        </div>
                    </div>
                </div>
                <button
                    className="text-white text-2xl xl:hidden cursor-pointer"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    ☰
                </button>
            </div>

            {/* Desktop Navigation */}
            <ul className="hidden xl:flex items-center gap-10 font-medium text-lg lg:underline-offset-[6px]">
                <Link to="/dashboard" passHref>
                    <li className={`cursor-pointer ${pathname === "/dashboard" ? "underline" : ""}`}>
                        Home
                    </li>
                </Link>
                <Link to="/TasksPage" passHref>
                    <li className={`cursor-pointer ${pathname === "/TasksPage" ? "underline" : ""}`}>
                        Task
                    </li>
                </Link>
                <Link to="/AboutPage" passHref>
                    <li className={`cursor-pointer ${pathname === "/AboutPage" ? "underline" : ""}`}>
                        About
                    </li>
                </Link>
                {/* <Link to="/stepGuide" passHref>
                    <li className={`cursor-pointer ${pathname === "/stepGuide" ? "underline" : ""}`}>
                        Step Guide
                    </li>
                </Link> */}
                {/* Users Dropdown */}
                {/* <div
                    className="relative cursor-pointer"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                    eventListner={() => onClick()}
                    onMouseOver={() => setIsDropdownOpen(true)}
                >
                    <li className="flex gap- items-center justify-center">
                        <li
                            className={`cursor-pointer ${pathname.startsWith("/users") ? "underline" : ""}`}
                        >
                            Users
                        </li>
                        
                        <span><svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" storkelinecap="round" storkelinejoin="round" storkewidth="2" d="m1 1 4 4 4-4" />
                        </svg></span>
                    </li>
                    {isDropdownOpen && (
                        <ul className="absolute top-full left-0 mt-2 bg-black border border-gray-700 rounded-lg py-2 flex flex-col w-40 z-20">
                            <Link to="/users/signup" passHref>
                                <li className="px-4 py-2 hover:bg-gray-700">Sign Up</li>
                            </Link>
                            <Link to="/users/login" passHref>
                                <li className="px-4 py-2 hover:bg-gray-700">Login</li>
                            </Link>
                        </ul>
                    )}
                </div> */}


                <div className="relative" >
                    <button onClick={() => setShowDropdowm(!showDropdowm)}
                        onBlur={() => {
                            setTimeout(() => {
                                setShowDropdowm(false)
                            }, 400);
                        }}
                        id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="dropdow
          text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-1.5 text-center inline-flex items-center dark:bg-blue-600  dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Users <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" storkelinecap="round" storkelinejoin="round" storkewidth="2" d="m1 1 4 4 4-4" />
                        </svg>
                    </button>

                    {/* <!-- Dropdown menu --> */}
                    <div id="dropdown" className={`${showDropdowm ? "" : "hidden"} z-50 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-32 dark:bg-gray-700 mt-4  cursor-pointer`}>
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 cursor-pointer" aria-labelledby="dropdownDefaultButton">
                            <Link to="/dashboard" passHref>
                                <li className="px-4 py-2 hover:bg-gray-300 cursor-pointer dark:hover:bg-gray-600 dark:text-white">
                                    Open Source</li>
                            </Link>
                            <Link to="/dashboard" passHref>
                                <li className="px-4 py-2 hover:bg-gray-300 cursor-pointer dark:hover:bg-gray-600 dark:text-white">
                                    Logout</li>
                            </Link>
                            {/* <Link to="/signup" passHref>
                                <li className="px-4 py-2 hover:bg-gray-300 cursor-pointer dark:hover:bg-gray-600 dark:text-white">
                                    Sign Up </li>
                            </Link> */}



                        </ul>
                    </div>
                </div>

            </ul>


            {/* Input Field and Button */}
            {/* <div className="hidden xl:flex items-center ">
                <input
                    type="text"
                    className="rounded-lg p-1 px-2 text-black w-[21rem]"
                    placeholder="Enter text"
                />
                <button className="focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-indigo-600 rounded-lg p-1 ml-2 px-3 font-medium hover:bg-indigo-700">
                    Search
                </button>
            </div> */}

            

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <ul className="absolute top-[4.5rem] left-0 w-full bg-black flex flex-col items-center gap-5 py-5 text-lg xl:hidden z-10 underline-offset-[5px] min-h-full   overflow-hidden h-screen">

                    <div className="block xl:hidden h-full w-2px bg-white relative">
                        <div className="absolute top-0 bottom-0 left-0 w-2px bg-white opacity-20" />
                    </div>

                    <Link to="/dashboard" passHref>
                        <li
                            className={`cursor-pointer ${pathname === "/dashboard" ? "underline" : ""}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </li>
                    </Link>
                    <Link to="/TasksPage" passHref>
                        <li
                            className={`cursor-pointer ${pathname === "/TasksPage" ? "underline" : ""}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Task
                        </li>
                    </Link>
                    <Link to="/AboutPage" passHref>
                        <li
                            className={`cursor-pointer ${pathname === "/AboutPage" ? "underline" : ""}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </li>
                    </Link>
                    {/* <Link to="/stepGuide" passHref>
                        <li
                            className={`cursor-pointer ${pathname === "/stepGuide" ? "underline" : ""}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Steps Guide
                        </li>
                    </Link> */}
                    <div className="relative cursor-pointer w-full text-center">
                        <li
                            className="flex items-center justify-center gap-1"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            Users
                            <span className="text-sm">▼</span>
                        </li>
                        {isDropdownOpen && (
                            <ul className="mt-2 bg-black border border-gray-700 rounded-lg py-2 flex flex-col w-full">
                                <Link to="/dashboard" passHref>
                                    <li
                                        className="px-4 py-2 hover:bg-gray-700"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Open Source
                                    </li>
                                </Link>
                                <Link to="/dashboard" passHref>
                                    <li
                                        className="px-4 py-2 hover:bg-gray-700"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Logout
                                    </li>
                                </Link>
                                {/* <Link to="/signup" passHref>
                                    <li
                                        className="px-4 py-2 hover:bg-gray-700"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign Up
                                    </li>
                                </Link> */}
                            </ul>
                        )}
                    </div>
                    {/* <div className="w-full px-6">
                        <input
                            type="text"
                            className="rounded-lg p-2 px-2 text-black w-full"
                            placeholder="Enter text"
                        />
                        <button className="focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-indigo-600 rounded-lg p-2 mt-2 w-full font-medium hover:bg-indigo-700">
                            Search
                        </button>
                    </div> */}
                </ul>
            )}
            
        </nav>
    );
};

export default Navbar;






