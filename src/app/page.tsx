"use client";
// import React, { useState } from 'react';
import Image from 'next/image';
// import car from './assets/car.jpg';
import flood from './assets/flood.jpg';
import strom from './assets/strom.jpg';
import bg from './assets/back1anime.jpeg';
import accident from './assets/accident.jpg';
import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar';
import { useState } from 'react';
import Login from './components/login';
import { signIn, useSession } from "next-auth/react"

const AnimatedReportButton = () => {
  const router = useRouter(); // Use the hook inside the component


  return (
    <button
      onClick={() => router.push("/report")}
      className=" font-display relative group bg-red-700 text-card px-6 py-2 rounded-full hover:bg-red-900 transition"
    >
      <span className="relative z-10">Report disaster</span>
      <span className="absolute inset-0 rounded-full animate-ping bg-green-600 opacity-75"></span>
      {/* <span className="absolute inset-0 rounded-full animate-pulse-slow bg-green-300 opacity-0 group-hover:opacity-75"></span>
      <span className="absolute -inset-3 rounded-full animate-ping-slow bg-red-200 opacity-0 group-hover:opacity-50"></span> */}
    </button>
  );
};

const DisasterManagementLanding = () => {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session } = useSession()
  const router = useRouter();
  const [isVisible, setIsVisible] = useState("none");

  const handleGetStarted = () => {

      // Scroll to top of page to show the "Join us" button
      window.scrollTo({ top: 0, behavior: 'smooth' });
    
  };

  const handleLogin = async () => {
        const result = await signIn("google", { redirect: false, callbackUrl: "/profile" });
        if (result?.url) {
          router.push(result.url);
        }
    };
    
  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <Navbar />
      <Login isVisible={isVisible} setIsVisible={setIsVisible} />
      {/* Heroes Section */}
      <section className="mt-0 relative">
        <div className="relative">
          <div className="w-full h-[750px] relative">
            <Image
              src={bg}
              alt="Disaster scene"
              fill
              className="object-cover brightness-75"
            />
          </div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-card p-8 shadow-lg hover:shadow-xl backdrop-blur-sm bg-black/30">
            <h2 className="font-heading text-4xl md:text-8xl font-extrabold mb-4 tracking-tight">
              Disaster Heroes
            </h2>
            <p className="font-sans max-w-2xl mb-8 t md:text- text-gray-300">
              When disaster strikes, every second counts. At Disaster Heroes, we empower individuals, communities, and organizations with the knowledge, tools, and support needed to respond effectively to emergencies.
            </p>
            <div className="flex space-x-10">
              <AnimatedReportButton />
              {session && (
                <button
                  className="font-display bg-blue-800 text-card px-6 py-2 rounded-full hover:bg-blue-900 transition"
                  onClick={() => router.push('/member')}
                >
                  Active reports
                </button>
              )}
              {!session && (
                <button 
                  className="font-display bg-footer text-card px-6 py-2 rounded-full hover:bg-gray-600 transition"
                  onClick={handleLogin}
                >
                  Join us
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          <div className="bg-gray-800 text-card p-8">
            <h3 className="font-display text-2xl font-bold">3567K+</h3>
            <p className="font-sans text-gray-300">Demand of manpower is important in disaster situation</p>
          </div>

          <div className="bg-gray-700 text-card p-8">
            <h3 className="text-2xl font-bold">3,125</h3>
            <p className="text-gray-300">Accident happens daily across the world</p>
          </div>

          <div className="bg-gray-600 text-card p-8">
            <h3 className="text-2xl font-bold">$0.34</h3>
            <p className="text-gray-300">Economical and Medical help is a need in emergency</p>
          </div>
        </div>
      </section>
      {/* Mission Section */}
      <section className="max-w-6xl mx-auto p-8 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div >
            <h1 className="font-heading text-6xl font-extrabold text-800 mb-4 text-cardtext">Our Mission</h1>
            <p className="font-sans text-600 mb-6 text-gray-400">
              We are dedicated to minimizing disaster impact through preparedness, response, and
              recovery strategies. By providing real-time alerts, expert guidance, and emergency
              resources, we help safeguard lives and communities.
            </p>
            <button onClick={handleGetStarted} className="font-display bg-footer text-card px-6 py-2 rounded-full hover:bg-gray-700 transition">
              Get started
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Stat Cards with transparency and blur */}
            <div className="bg-card backdrop-blur-md p-4 rounded-lg shadow-lg flex items-start ">
              <div className="bg-blue-500/80 p-3 rounded-md mr-3 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
              </div>
              <div>
          <h3 className="font-bold text-gray-800">2,000+</h3>
          <p className="text-sm text-gray-700">Annually, typhoons, strikes cause substantially affecting rural areas.</p>
              </div>
            </div>

            <div className="bg-card backdrop-blur-md p-4 rounded-lg shadow-lg flex items-start ">
              <div className="bg-red-300/80 p-3 rounded-md mr-3 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
              </div>
              <div>
          <h3 className="font-bold text-gray-800">Real-Time Alerts</h3>
          <p className="text-sm text-gray-700">Get live updates on natural disasters, weather emergencies, and crisis situations near you.</p>
              </div>
            </div>

            <div className="bg-card backdrop-blur-md p-4 rounded-lg shadow-lg flex items-start ">
              <div className="bg-yellow-400/80 p-3 rounded-md mr-3 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
              </div>
              <div>
          <h3 className="font-bold text-gray-800">387+</h3>
          <p className="text-sm text-gray-700">Natural disasters globally, causing 1% GDP decline and affecting millions of people.</p>
              </div>
            </div>

            <div className="bg-card backdrop-blur-md p-4 rounded-lg shadow-lg flex items-start ">
              <div className="bg-green-500/80 p-3 rounded-md mr-3 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
              </div>
              <div>
          <h3 className="font-bold text-gray-800">Training</h3>
          <p className="text-sm text-gray-700">Learn life-saving skills through workshops, modules, and specialized training sessions.</p>
              </div>
            </div>

            <div className="bg-card backdrop-blur-md p-4 rounded-lg shadow-lg flex items-start ">
              <div className="bg-purple-500/80 p-3 rounded-md mr-3 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
              </div>
              <div>
          <h3 className="font-bold text-gray-800">10,749</h3>
          <p className="text-sm text-gray-700">People have survived island-lives in Haiti, with Tamil Nadu being the hardest hit zone.</p>
              </div>
            </div>

            <div className="bg-card backdrop-blur-md p-4 rounded-lg shadow-lg flex items-start ">
              <div className="bg-teal-400/80 p-3 rounded-md mr-3 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
          </svg>
              </div>
              <div>
          <h3 className="font-bold text-gray-800">Community Support</h3>
          <p className="text-sm text-gray-700">Connect with trained professionals and volunteers to rebuild and recover together.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prevention Tips Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 ">
          <div className="relative overflow-hidden rounded-lg h-48">
            <div className="h-full w-full relative blur-sm">
              <Image
                src={flood.src}
                alt="Rising water"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-50 p-4 flex flex-col justify-end">
              <h3 className="text-card text-lg font-semibold">Rising water levels can cause unavoidable damage before you&apos;re even aware of it.</h3>
              <p className="text-card text-sm">Learn how to protect your property.</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg h-48">
            <div className="h-full w-full relative blur-sm">
              <Image
                src={accident}
                alt="Weather warnings"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-50 p-4 flex flex-col justify-end">
              <h3 className="text-card text-lg font-semibold">We monitor over 200+ locations each day to advance you of impending crises.</h3>
              <p className="text-card text-sm">Subscribe to our emergency alerts.</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg h-48">
            <div className="h-full w-full relative blur-sm">
              <Image
                src={strom}
                alt="Emergency response"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-50 p-4 flex flex-col justify-end">
              <h3 className="text-card text-lg font-semibold">Disaster and our team of experts will instantly notify your emergency contacts.</h3>
              <p className="text-card text-sm">Add your priority contacts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-footer text-card mt-12">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Emergency Contacts</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>Emergency Hotline: 911</span>
                </li>

                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  <span>Missing Persons: 2214-5053</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Customer Support</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>disasterheroes911@gmail.com</span>
                </li>
                <li>
                  <span> ☎️   <a href="https://en.wikipedia.org/wiki/List_of_emergency_telephone_numbers">Link to International helplines</a> </span>
                </li>
              </ul>
            </div>

            {/* <div>
              <h3 className="text-xl font-bold mb-4">Company Info</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                  <span>123 Disaster Ave, Crisis City</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>info@disasterheroes.com</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>Mon-Fri: 8am-6pm EST</span>
                </li>
              </ul>
            </div> */}

            <div>
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-card hover:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="text-card hover:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-card hover:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-card hover:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
       
            </div>
            <div>
                <h4 className="text-lg font-semibold mb-2">Subscribe to Updates</h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="p-2 text-gray-800 rounded-l-md focus:outline-none w-full"
                  />
                  <button className="bg-blue-500 hover:bg-blue-600 p-2 rounded-r-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
          </div>

          
        </div>
      </footer>
    </div>
  );
};

export default DisasterManagementLanding;