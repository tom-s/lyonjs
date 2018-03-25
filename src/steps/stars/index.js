/* Code inspired from https://www.clicktorelease.com/code/optical-flow-webrtc/ */

import React, { Component } from 'react'
import './style.css'

const scale = 2
const fStep = scale

class OpticalFlow extends Component {
  constructor(props) {
    super(props)
    this.frameRequest = null
    this.flow = null
    this.containerEl = null
    this.imgEl = null
    this.canvasEl = null
    this.ocanvasEl = null
    this.tcanvasEl = null
    this.fcanvasEl = null
    this.videoEl = null

    this.startTime = null
    this.balls = []
  }

  componentWillUnmount = () => {
    window.cancelAnimationFrame(this.frameRequest)
  }

  componentDidMount = () => {
    window.navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then(this.videoReady)
      .catch(this.videoError)
  }

  extractDifferences = () => {
    const context = this.canvasEl.getContext('2d')
    const oCtx = this.ocanvasEl.getContext('2d')
    const tCtx = this.tcanvasEl.getContext('2d')

    if (
      this.canvasEl.width !== this.videoEl.videoWidth / scale ||
      this.canvasEl.height !== this.videoEl.videoHeight / scale
    ) {
      this.canvasEl.width = this.ocanvasEl.width = this.tcanvasEl.width =
        this.videoEl.videoWidth / scale
      this.canvasEl.height = this.ocanvasEl.height = this.tcanvasEl.height =
        this.videoEl.videoHeight / scale
      this.fcanvasEl.width = this.videoEl.videoWidth
      this.fcanvasEl.height = this.videoEl.videoHeight
    }

    try {
      context.drawImage(
        this.videoEl,
        0,
        0,
        this.videoEl.videoWidth,
        this.videoEl.videoHeight,
        0,
        0,
        this.canvasEl.width,
        this.canvasEl.height
      )
      if (this.canvasEl.width > 0 && this.canvasEl.height > 0) {
        tCtx.drawImage(this.canvasEl, 0, 0)
      }

      var iData = context.getImageData(
        0,
        0,
        this.canvasEl.width,
        this.canvasEl.height
      )
      var oData = oCtx.getImageData(
        0,
        0,
        this.ocanvasEl.width,
        this.ocanvasEl.height
      )
    } catch (e) {
      this.frameRequest = window.requestAnimationFrame(this.extractDifferences)
      return
    }

    var buf8 = new Uint8ClampedArray(iData.data)
    var oBuf8 = new Uint8ClampedArray(oData.data)

    var d = this.flow.calculate(
      buf8,
      oBuf8,
      this.canvasEl.width,
      this.canvasEl.height
    )

    var currentTime = Date.now()
    var eTime = currentTime - this.startTime
    this.startTime = currentTime
    var f = eTime / 16

    this.updateCanvas(d, f)

    oCtx.drawImage(this.tcanvasEl, 0, 0)

    this.frameRequest = window.requestAnimationFrame(this.extractDifferences)
  }

  videoReady = stream => {
    this.videoEl.srcObject = stream
    this.startTime = Date.now()
    this.canvasEl = document.createElement('canvas')
    this.canvasEl.style.display = 'none'
    this.tcanvasEl = document.createElement('canvas')
    this.ocanvasEl = document.createElement('canvas')
    this.flow = new window.oflow.FlowCalculator(fStep)
    this.extractDifferences()
  }

  videoError = error => {
    alert('navigator.getUserMedia non disponible, désolé !')
  }

  updateCanvas = (d, f) => {
    const gap = 10
    const context = this.fcanvasEl.getContext('2d')
    var min = 2
    var maxLife = 100
    for (let j = 0; j < d.zones.length; j = j + gap) {
      if (Math.abs(d.zones[j].u) > min || Math.abs(d.zones[j].v) > min) {
        this.balls.push({
          x: d.zones[j].x,
          y: d.zones[j].y,
          u: d.zones[j].u,
          v: d.zones[j].v,
          ox: d.zones[j].x,
          oy: d.zones[j].y,
          life: maxLife
        })
      }
    }
    context.drawImage(this.videoEl, 0, 0)
    context.fillStyle = '#FFD285'
    context.strokeStyle = '#FFD285'
    context.save()
    context.globalCompositeOperation = 'lighter'

    for (let j = 0; j < this.balls.length; j++) {
      var b = this.balls[j]
      var ox = b.x
      var oy = b.y
      b.x -= f * 0.5 * b.u
      b.y -= f * 0.5 * b.v
      b.v -= f * 0.098
      b.life -= f
      if (b.life < 0) {
        this.balls.splice(j, 1)
      }
      var a = 0.5 * Math.max(0, b.life / maxLife)

      context.globalAlpha = a
      context.beginPath()
      context.drawImage(this.imgEl, b.x * scale, b.y * scale)
      /*
      context.arc(
        b.x * scale,
        b.y * scale,
        0.05 * (maxLife - b.life),
        0,
        2 * Math.PI
      )*/
      context.fill()

      b.ox = ox
      b.oy = oy
    }
    context.restore()
  }

  render = () => (
    <div className="Oflow">
      <div className="Oflow_wrapper">
        <video
          ref={el => (this.videoEl = el)}
          style={{ display: 'none' }}
          width="640px"
          height="480px"
          autoPlay
          muted
        />
        <canvas ref={el => (this.fcanvasEl = el)} />
        <div ref={el => (this.containerEl = el)} className="Container" />
        <img
          ref={el => (this.imgEl = el)}
          alt="star"
          style={{ display: 'none' }}
          src={`${process.env.PUBLIC_URL}/images/star_10x10.png`}
        />
      </div>
    </div>
  )
}

export default OpticalFlow
