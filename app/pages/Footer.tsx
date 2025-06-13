import React from 'react'
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
const Footer = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full h-16 bg-gray-900 text-white mt-4 border-t-2 ring-white rounded-xl p-2'>
      <p className='mt-10'>&copy; 2025 SuperBot. All rights reserved.</p>
      <div>
        <h1 className='text-center'>Links to reach us:</h1>
        <ul>
          <li>
            <a href="mailto:lokesh2.dev@gmail.com" className='flex items-center gap-2'><FaEnvelope /> <u>lokesh2.dev@gmail.com</u></a>
          </li>
          <div className='flex items-center justify-center space-x-4 mt-2'>
            <li>
              <a href="https://linkedin.com/in/lokeshumredkar02" target="_blank" rel="noopener noreferrer" className='text-blue-400'><FaLinkedin /></a>
            </li>
            <li>
              <a href="https://github.com/Lokesh9307" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            </li>
          </div>
        </ul>
      </div>
    </div>
  )
}

export default Footer