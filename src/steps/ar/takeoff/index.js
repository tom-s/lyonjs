import React, { Component } from 'react'
import { Entity } from 'aframe-react'
import './style.css'

const LOCATIONS = [
  {
    id: 'observatory',
    title: 'Observatoire de Greenwich, Londres, Grande-Bretagne',
    scale: '0.1 0.1 0.1',
    rocket: {
      position: '-1.1 -0.1 0',
      toPosition: '-1.1 5 0',
      scale: '0.07 0.07 0.07'
    }
  },
  {
    id: 'pattaya',
    title: 'Pattaya, Chonburi, Thailande',
    scale: '0.3 0.3 0.3',
    rocket: {
      position: '-1.1 0 0',
      toPosition: '-1.1 5 0',
      scale: '0.2 0.2 0.2'
    }
  },
  {
    id: 'weidelsburg',
    title: 'Château de Weidelsburg, Büren, Allemagne',
    scale: '0.3 0.3 0.3',
    rocket: {
      position: '0 0 0.1',
      toPosition: '-1.1 5 1',
      scale: '0.07 0.07 0.07'
    }
  }
]

const COUNTDOWN_DURATION = 36

class Countdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      remainingSeconds: COUNTDOWN_DURATION
    }
    this.interval = null
  }

  componentDidMount = () => {
    const { onOver } = this.props
    this.interval = window.setInterval(() => {
      const { remainingSeconds } = this.state
      if (remainingSeconds === 0) {
        window.clearInterval(this.interval)
        this.interval = null
        onOver && onOver()
      }
      const newVal = remainingSeconds - 1
      this.setState({
        remainingSeconds: newVal < 0 ? COUNTDOWN_DURATION : newVal
      })
    }, 1000)
  }

  componentWillUnmount = () => {
    window.clearInterval(this.interval)
  }

  render = () => {
    const { remainingSeconds } = this.state
    return <div className="Takeoff_countdown">{remainingSeconds}</div>
  }
}

class Takeoff extends Component {
  constructor(props) {
    super(props)
    this.state = {
      locationIndex: 0,
      countdown: false,
      showLocation: false
    }
    this.timeout = null
  }

  componentDidMount = () => {
    this.showLocation()
  }

  componentWillUnmount = () => {
    this.timeout && window.clearTimeout(this.timeout)
    this.timeout = null
  }

  showLocation = () => {
    this.setState({
      showLocation: true
    })
    this.timeout && window.clearTimeout(this.timeout)
    this.timeout = window.setTimeout(() => {
      this.setState({
        showLocation: false
      })
    }, 3000)
  }

  toggleLocation = () => {
    this.showLocation()
    this.setState(prevState => ({
      locationIndex:
        prevState.locationIndex < LOCATIONS.length - 1
          ? prevState.locationIndex + 1
          : 0
    }))
  }

  toggleCountdown = () => {
    this.setState(
      {
        countdown: true
      },
      () => {
        window.document.querySelector('#countdown').play()
      }
    )
  }

  sendRocket = () => {
    this.setState({
      countdown: false
    })
    window.document.querySelector('#rocket').emit('start')
  }

  render = () => {
    const { countdown, showLocation, locationIndex } = this.state
    const location = LOCATIONS[locationIndex]
    return (
      <Entity>
        <Entity gltf-model={`#${location.id}`} scale={location.scale} />
        <Entity
          id="rocket"
          gltf-model="#rocket5"
          position={location.rocket.position}
          scale={location.rocket.scale}
        >
          <a-animation
            attribute="position"
            fill="backwards"
            ease="ease-in"
            begin="start"
            dur="20000"
            to={location.rocket.toPosition}
          />
        </Entity>
        <Entity
          id="countdown"
          primitive="a-sound"
          src="#countdown"
          on="start"
        />
        <button className="Takeoff_button" onClick={this.toggleLocation}>
          Changer lieu
        </button>
        <button
          className="Takeoff_button Takeoff_button_start"
          onClick={this.toggleCountdown}
        >
          Décollage
        </button>
        {countdown && <Countdown onOver={this.sendRocket} />}
        {showLocation && (
          <div className="Takeoff_location">
            {location.title}, le {new Date().toLocaleDateString()}
          </div>
        )}
      </Entity>
    )
  }
}

export default Takeoff
