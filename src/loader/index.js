import React from 'react'
import './style.css'

const Loader = () => (
  <div className="Loader_wrapper">
    <div className="Loader">
      <svg viewBox="0 0 800 600" width="100%" height="100%">
        <g id="rocket">
          <path d="M445.3,256.3c-47.3-3.5-62.8,27-62.8,27c-18.5,2-24,10-24,10l15.5,12.3c-0.5,15.3,3.5,16.5,3.5,16.5c5.5,7.5,17.8,4.8,17.8,4.8l12.8,17c12-12.5,10.3-25.5,10.3-25.5C450.8,300,445.3,256.3,445.3,256.3zM416.3,297c-6.5,0-11.8-5.3-11.8-11.8c0-6.5,5.3-11.8,11.8-11.8s11.8,5.3,11.8,11.8C428,291.7,422.7,297,416.3,297z" />
        </g>
      </svg>
    </div>
    <div className="Loader_text">Décollage en cours...</div>
  </div>
)

export default Loader
