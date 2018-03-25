import React from 'react'
import { Entity } from 'aframe-react'

const Space = () => (
  <Entity>
    <Entity
      geometry="primitive: plane"
      position="0 0 0"
      rotation="-90 0 0"
      material="src: #video-landing"
    />
    <Entity
      geometry="primitive: plane"
      position="0 0.5 -1"
      rotation="-45 0 0"
      material="src: #video-interstellar"
    />
    <Entity
      geometry="primitive: plane"
      position="-1 0 -1"
      rotation="-45 45 0"
      material="src: #video-spaceodyssey"
    />
    <Entity
      geometry="primitive: plane"
      position="1 0 -1"
      rotation="0 -45 0"
      material="src: #video-et"
    />
  </Entity>
)

export default Space
