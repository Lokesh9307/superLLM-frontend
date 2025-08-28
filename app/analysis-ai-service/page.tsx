import React from 'react'

const AanalysisAI = () => {
    return (
        <>
            <iframe
                src={process.env.NEXT_PUBLIC_ANALYSIS_AI_URL}
                style={{
                    width: "100%",
                    height: "100vh",
                    border: "none",
                    overflow: "hidden",
                }}
                allowFullScreen
                loading="lazy"
            />
        </>
    )
}

export default AanalysisAI