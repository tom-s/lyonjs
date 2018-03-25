import React, { Component } from 'react'
import { getDirectionalColor } from './colors'
import './style.css'

class OpticalFlow extends Component {
  constructor(props) {
    super(props)
    this.flow = null
    this.canvas = null
    this.video = null
  }
  componentWillUnmount = () => {
    this.flow.stopCapture()
  }
  componentDidMount = () => {
    window.navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then(this.videoReady)
      .catch(this.videoError)
    this.flow = new window.oflow.WebCamFlow()
    this.flow.onCalculated(this.onCapture)
    // Starts capturing the flow from webcamera
    this.flow.startCapture()
  }

  videoReady = stream => {
    this.video.srcObject = stream
  }

  videoError = error => {
    alert('navigator.getUserMedia error: ')
  }

  onCapture = direction => {
    // render zones
    const context = this.canvas.getContext('2d')
    context.clearRect(0, 0, 640, 480)
    context.lineWidth = 15
    direction.zones.forEach(zone => {
      context.strokeStyle = getDirectionalColor(zone.u, zone.v)
      context.beginPath()
      context.moveTo(zone.x, zone.y)
      context.lineTo(zone.x - zone.u, zone.y + zone.v)
      context.stroke()
    })
  }

  render = () => (
    <div className="Oflow">
      <div className="Oflow_wrapper">
        <video
          ref={el => (this.video = el)}
          className="Oflow_video"
          width="640px"
          height="480px"
          autoPlay
          loop
          muted
        />
        <canvas
          ref={el => (this.canvas = el)}
          className="Oflow_canvas"
          width="640px"
          height="480px"
        />
      </div>
    </div>
  )
}

export default OpticalFlow
