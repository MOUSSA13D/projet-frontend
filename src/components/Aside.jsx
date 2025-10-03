"use client"

import React from "react"
import { SlArrowDown } from "react-icons/sl"
import { Link } from "react-router-dom"
import { AiOutlineArrowLeft } from "react-icons/ai"
import { FaBarsStaggered } from "react-icons/fa6"


class Aside extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isMobileMenuOpen: false,
    }
  }

  toggleMobileMenu = () => {
    this.setState((prevState) => ({
      isMobileMenuOpen: !prevState.isMobileMenuOpen,
    }))
  }

  render() {
    const { isMobileMenuOpen } = this.state
    const { open } = this.props

    return (
      <section className="w-56 bg-[#093545] h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-[#0a4a5e]">
          <button onClick={this.props.clique} className="p-2 hover:bg-[#0a4a5e] rounded-lg transition-colors">
          <FaBarsStaggered className="text-xl text-white" />
              
          </button>
           <h1 className="text-white text-2xl font-bold">Logo</h1>

        </div>

        <div className="flex-1 overflow-y-auto pt-6 px-3">
         

          <div className="mb-2">
            <Link to="/accuiel">
            <button
              className="flex items-center justify-between w-full py-3 px-4 rounded-lg text-white font-semibold hover:bg-[#0a4a5e] transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={this.toggleMobileMenu}
            >
              <h4 className="text-white text-base font-semibold m-0">Utilisateurs</h4>
              <SlArrowDown
                className={`transition-transform duration-300 ${isMobileMenuOpen ? "rotate-180" : "rotate-0"}`}
              />
            </button>
            </Link>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pl-4 mt-1">
                <Link
                  to="/client"
                  className="flex items-center py-2 px-4 rounded-lg text-white text-sm hover:bg-[#0a4a5e] transition-colors no-underline border-l-2 border-transparent hover:border-white"
                >
                  <h4 className="text-white text-sm font-medium m-0">Client</h4>
                </Link>

                <Link
                  to="/distributeur"
                  className="flex items-center py-2 px-4 rounded-lg text-white text-sm hover:bg-[#0a4a5e] transition-colors no-underline border-l-2 border-transparent hover:border-white"
                >
                  <h4 className="text-white text-sm font-medium m-0">Distributeur</h4>
                </Link>

               
              </div>
            </div>
          </div>

           <div className="mb-2">
            <Link
              to="/depot"
              className="flex items-center gap-3 py-3 px-4 rounded-lg text-white font-semibold hover:bg-[#0a4a5e] transition-colors no-underline"
            >
              <h4 className="text-white text-base font-semibold m-0">Depôt</h4>
            </Link>
          </div>

          <div className="mb-2">
            <Link
              to="/historique"
              className="flex items-center gap-3 py-3 px-4 rounded-lg text-white font-semibold hover:bg-[#0a4a5e] transition-colors no-underline"
            >
              <h4 className="text-white text-base font-semibold m-0">Historique transaction</h4>
            </Link>
          </div>

          <div className="mb-2">
            <Link
              to="/annuler-transaction"
              className="flex items-center gap-3 py-3 px-4 rounded-lg text-white font-semibold hover:bg-[#0a4a5e] transition-colors no-underline"
            >
              <h4 className="text-white text-base font-semibold m-0">Annuler transaction</h4>
            </Link>
          </div>


        </div>
      </section>
    )
  }
}

export default Aside
