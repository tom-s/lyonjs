import React, { Component } from 'react'
import { Entity, Scene } from 'aframe-react'
import Loader from '../../loader'
const IS_MOBILE = "ontouchstart" in window

class ArScene extends Component {
  constructor(props) {
    super(props)
    this.state = {
      assetsLoaded: false
    }
  }
  componentDidMount = () => {
    window.document.querySelector('a-assets').addEventListener('loaded', () => {
      this.setState({
        assetsLoaded: true
      })
    })
  }

  render = () => {
    const { assetsLoaded } = this.state
    const { Step } = this.props
    return (
      <Scene
        embedded
        arjs="trackingMethod: best;debugUIEnabled: false;"
        stats={false}
      >
        {/* Load all assets */}
        {!assetsLoaded && <Loader />}
        <Entity primitive="a-assets">
          {!IS_MOBILE && <a-asset-item
            id="observatory"
            src={`${
              process.env.PUBLIC_URL
            }/models/location/observatory/scene.gltf`}
          />}
          <a-asset-item
            id="pattaya"
            src={`${process.env.PUBLIC_URL}/models/location/pattaya/scene.gltf`}
          />
          {!IS_MOBILE && <a-asset-item
            id="weidelsburg"
            src={`${
              process.env.PUBLIC_URL
            }/models/location/weidelsburg/scene.gltf`}
          />}

          <a-asset-item
            id="rocket5"
            src={`${process.env.PUBLIC_URL}/models/rockets/rocket5/scene.gltf`}
          />
          <audio
            id="countdown"
            src={`${process.env.PUBLIC_URL}/sounds/countdown.mp3`}
          />
          <video
            id="video-et"
            muted={true}
            autoPlay={true}
            loop="true"
            src={`${process.env.PUBLIC_URL}/videos/et.mp4`}
          />
          <video
            id="video-interstellar"
            muted={true}
            autoPlay={true}
            loop="true"
            src={`${process.env.PUBLIC_URL}/videos/interstellar.mp4`}
          />
          <video
            id="video-landing"
            muted={true}
            autoPlay={true}
            loop="true"
            src={`${process.env.PUBLIC_URL}/videos/landing.mp4`}
          />
          <video
            id="video-spaceodyssey"
            muted={true}
            autoPlay={true}
            loop="true"
            src={`${process.env.PUBLIC_URL}/videos/spaceodyssey.mp4`}
          />
        </Entity>

        <Entity primitive="a-marker">
          <Step />
        </Entity>
        <Entity primitive="a-camera-static" />
      </Scene>
    )
  }
}

export default ArScene
