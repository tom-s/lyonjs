import React, { Component } from 'react'
import { Entity } from 'aframe-react'

const VIDEOS = [
  {
    id: 'landing',
    position: '-1 0 0',
    rotation: '-90 0 0',
  },
  {
    id: 'interstellar',
    position: '0 0 0',
    rotation: '-90 0 0',
  },
  {
    id: 'et',
    position: '1 0 0',
    rotation: '-90 0 0',
  },
  {
    id: 'spaceodyssey',
    position: '2 0 0',
    rotation: '-90 0 0',
  }
]

const getAnimatedPosition =  position => {
  const [x, y, z] = position.split(' ')
  return `${x} 1 ${z}`
}

const animationDuration  = 3000

class Space extends Component {
  constructor(props) {
    super(props)
    this.animated = []
  }

  componentDidMount = () => {
    window.setInterval(() => {
      const animating = Math.floor(Math.random() * Math.floor(3))
      const goBack =  this.animated.includes(animating)
      const action = goBack
        ? 'back'
        : 'start'
      window.document.querySelector(`#video-${animating}`).emit(action)
      if(goBack) {
        this.animated = this.animated.filter(val => val !== animating)
      } else {
        this.animated = [...this.animated, animating]
      }
    }, animationDuration)
  }

  render = () => {
    return (
      <Entity>
        {VIDEOS.map((video, i) => {
          return <Entity
            id={`video-${i}`}
            key={i}
            geometry="primitive: plane"
            position={video.position}
            rotation={video.rotation}
            material={`src: #video-${video.id}`}
            scale="0.7 0.7 0.7"
          > 
            <a-animation
              begin="start"
              attribute="position"
              dur={animationDuration}
              to={getAnimatedPosition(video.position)}
            />
            <a-animation
              begin="back"
              attribute="position"
              dur={animationDuration}
              to={video.position}
            />
          </Entity>
        })}
      </Entity>
    )
  }
}


export default Space
