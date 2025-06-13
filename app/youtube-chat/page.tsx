import React from 'react'
import YoutubeForm from '../components/YoutubeForm'

export default function Page() {
  return (
    <div className='w-full p-2'>
      <h1 className="text-4xl font-bold mb-6 text-center">Chat with YouTube Video</h1>
      <p className='text-red-600 text-center'>Note: Please ensure that the video has a transcript available.</p>
      <YoutubeForm />
    </div>
  )
}