import React, { Component } from 'react'
import uniq from 'lodash/uniq'
import './style.css'
const IS_MOBILE = "ontouchstart" in window
const HELMET_RATIO = IS_MOBILE ? 0.3 : 0.7
const TOLERANCE = IS_MOBILE ? 50 : 5

class FaceTracking extends Component {
  constructor(props) {
    super(props)
    this.canvas = null
    this.videoEl = null
    this.trackerTask = null
    this.images = []
    this.state = {
      currentImg: 0
    }
    this.missingFaceFrames = 0
    this.previousImageWidth = null
    this.previousPosition = null
  }

  componentWillUnmount = () => {
    this.trackerTask.stop()
    this.videoEl && this.videoEl.pause()
    this.videoEl && this.videoEl.srcObject.getVideoTracks().forEach(track => {
      track.stop()
    })
  }

  componentDidMount = () => {
    const tracker = new window.tracking.ObjectTracker('face')
    tracker.setInitialScale(4)
    tracker.setStepSize(2)
    tracker.setEdgesDensity(0.1)
    this.trackerTask = window.tracking.track('#video', tracker, {
      camera: true
    })
    tracker.on('track', event => {
      if (event.data.length || this.missingFaceFrames > 20) {
        this.missingFaceFrames = 0
        this.canvas
          .getContext('2d')
          .clearRect(0, 0, this.canvas.width, this.canvas.height)
      } else {
        this.missingFaceFrames++
      }
      // Draw first face
      if (event.data[0]) {
        this.drawFace(event.data[0])
      }
      /* if we wanted to draw all faces
      event.data.forEach(rect => {
        this.drawFace(rect)
      })*/
    })
  }

  // smoothen image width
  calculateImageWidth = imgWidth => {
    if (!this.previousImageWidth) return imgWidth
    if (imgWidth - this.previousImageWidth > TOLERANCE)
      return this.previousImageWidth + TOLERANCE
    if (this.previousImageWidth - imgWidth > TOLERANCE)
      return this.previousImageWidth - TOLERANCE
    return imgWidth
  }

  // smoothen position
  calculateCoordinate = (a, tolerance, axis) => {
    if (!this.previousPosition) return a
    if (a - this.previousPosition[axis] > tolerance)
      return this.previousPosition[axis] + tolerance
    if (this.previousPosition[axis] - a > tolerance)
      return this.previousPosition[axis] - tolerance
    return a
  }

  calculatePosition = (x, y) => {
    return {
      x: this.calculateCoordinate(x, TOLERANCE, 'x'),
      y: this.calculateCoordinate(y, TOLERANCE, 'y')
    }
  }

  drawFace = rect => {
    const { currentImg } = this.state
    const img = this.images[currentImg]
    
    const imgWidth = this.calculateImageWidth(
      Math.max(rect.width, rect.height) * (1 + HELMET_RATIO)
    )
    this.previousImageWidth = imgWidth
    const position = this.calculatePosition(
      rect.x - (imgWidth - Math.max(rect.width, rect.height)) / 2,
      rect.y - (imgWidth - Math.max(rect.width, rect.height)) / 2
    )
    this.previousPosition = position
    this.canvas
      .getContext('2d')
      .drawImage(img, position.x, position.y, imgWidth, imgWidth)
  }

  toggle = () => {
    const { currentImg } = this.state
    this.setState({
      currentImg: currentImg === this.images.length - 1 ? 0 : currentImg + 1
    })
  }

  addToImages = el => {
    this.images = uniq([...this.images, el])
  }

  render = () => (
    <div className="FaceTracking">
      <div className="FaceTracking_wrapper">
        <video
          ref={el => this.videoEl = el}
          width="320px"
          height="240px"
          className="FaceTracking_video"
          id="video"
          autoPlay
          loop
          muted
        />
        <canvas
          width="320px"
          height="240px"
          className="FaceTracking_canvas"
          ref={el => (this.canvas = el)}
        />
        <button className="Helmet_button" onClick={this.toggle}>
          Changer de style !
        </button>
        <div style={{ display: 'none' }}>
          <img
            alt="helmet 1"
            ref={this.addToImages}
            src={`${process.env.PUBLIC_URL}/images/helmets/1.png`}
          />
        </div>
        <div style={{ display: 'none' }}>
          <img
            alt="helmet 2"
            ref={this.addToImages}
            src={`${process.env.PUBLIC_URL}/images/helmets/2.png`}
          />
        </div>
        <div style={{ display: 'none' }}>
          <img
            alt="helmet 3"
            ref={this.addToImages}
            src={`${process.env.PUBLIC_URL}/images/helmets/3.png`}
          />
        </div>
        <div style={{ display: 'none' }}>
          <img
            alt="helmet 4"
            ref={this.addToImages}
            src={`${process.env.PUBLIC_URL}/images/helmets/4.png`}
          />
        </div>
      </div>
    </div>
  )
}

export default FaceTracking
