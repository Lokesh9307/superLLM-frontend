import React from 'react'
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full bg-black text-white py-4 px-2 border-t border-gray-700">
      <div className="flex flex-col items-center justify-center space-y-2">
        <p className="text-sm text-gray-400">&copy; 2025 SuperLLM. All rights reserved.</p>
        <div className="flex items-center space-x-4">
          <a href="mailto:lokesh2.dev@gmail.com" className="flex items-center text-gray-300 hover:text-white transition">
            <FaEnvelope className="mr-1" />
            <span className="underline">lokesh2.dev@gmail.com</span>
          </a>
          <a href="https://linkedin.com/in/lokeshumredkar02" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition">
            <FaLinkedin size={20} />
          </a>
          <a href="https://github.com/Lokesh9307" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition">
            <FaGithub size={20} />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Footer
