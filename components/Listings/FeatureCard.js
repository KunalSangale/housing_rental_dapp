import React from 'react'

const FeatureCard = (props) => {
  return (
    <div className={`feature-card2-feature-card ${props.rootClassName} `}>
      <div className="feature-card2-container">
        <h2 className="feature-card2-text">{props.title}</h2>
        <span className="feature-card2-text1">{props.description}</span>
      </div>
    </div>
  )
}
export default FeatureCard
