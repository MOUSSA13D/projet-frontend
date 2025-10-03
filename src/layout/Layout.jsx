"use client"
import Aside from "../components/Aside"
import Nav from "../components/Nav"
import { useState } from "react"
import { FaBarsStaggered } from "react-icons/fa6"
import { Outlet } from "react-router-dom"

export default function Layout() {
  const [isOpen, setIsOpen] = useState(true)

  const openToggle = () => {
    setIsOpen(true)
  }

  const closeToggle = () => {
    setIsOpen(false)
  }

  return (
    <div className="flex w-full min-h-screen">
      {!isOpen && (
        <button
          onClick={openToggle}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
        >
          <FaBarsStaggered className="text-xl text-gray-800" />
        </button>
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Aside open={isOpen} clique={closeToggle} />
      </aside>

      {/* Main content wrapper */}
      <div className={`flex flex-col w-full transition-all duration-500 ease-in-out ${isOpen ? "ml-56" : "ml-0"}`}>
        {/* Top navigation bar */}
        <header className="w-full">
          <Nav />
        </header>

        <main className="flex-grow ">
          <div className=" bg-gray-100 min-h-[calc(100vh-4rem)] rounded-lg  shadow-md">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
