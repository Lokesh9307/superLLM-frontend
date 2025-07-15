import React from 'react'
import UploadForm from '../components/UploadForm'

const page = () => {
  return (
    <div>
        <h1 className='text-center text-3xl font-bold py-2'>Chat with Your PDF</h1>
        <UploadForm />
    </div>
  )
}

export default page