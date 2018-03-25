import React from 'react'
import './Topbar.css'

const Topbar = ({ onPrevious, onNext, title, isAr }) => (
  <nav className="Topbar">
    <div className="Topbar_previous" onClick={onPrevious}>
      {' '}
      {'<'}{' '}
    </div>
    <div className="Topbar_title">
      {title}{' '}
      {isAr && (
        <a target="_blank" href={`${process.env.PUBLIC_URL}/images/HIRO.jpg`}>
          (Télécharger code Hiro)
        </a>
      )}
    </div>
    <div className="Topbar_next" onClick={onNext}>
      {' '}
      {'>'}{' '}
    </div>
  </nav>
)

export default Topbar
