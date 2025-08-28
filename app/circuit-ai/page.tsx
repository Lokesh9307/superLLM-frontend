import React from 'react'

const page = () => {
  return (
     <>
            <iframe
                src={process.env.NEXT_PUBLIC_CIRCUIT_AI_URL}
                allow="geolocation"
                style={{
                    width: '100%',
                    height: '100vh',
                    border: 'none'
                
                }}
            />
        </>
  )
}

export default page