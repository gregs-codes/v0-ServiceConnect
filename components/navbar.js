"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-700">
            WelderFinder
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-700 font-medium">
              Home
            </Link>
            <Link href="/welders" className="text-gray-700 hover:text-blue-700 font-medium">
              Find Welders
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-blue-700 font-medium">
              Services
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-700 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-700 font-medium">
              Contact
            </Link>
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-blue-700 font-medium">
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 pb-6 space-y-4">
            <Link
              href="/"
              className="block text-gray-700 hover:text-blue-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/welders"
              className="block text-gray-700 hover:text-blue-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Welders
            </Link>
            <Link
              href="/services"
              className="block text-gray-700 hover:text-blue-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/about"
              className="block text-gray-700 hover:text-blue-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-gray-700 hover:text-blue-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 border-t border-gray-200 flex flex-col space-y-3">
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-700 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors inline-block w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
