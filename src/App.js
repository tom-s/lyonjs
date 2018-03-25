import React, { Component } from 'react'
import './App.css'
import loadJS from 'load-js'
import Loader from './loader'
import ArScene from './steps/ar'
import Topbar from './Topbar'

// Steps
import SpaceVideos from './steps/ar/space'
import TakeOff from './steps/ar/takeoff'
import Astronaut from './steps/faceTracking/helmet'
import Stars from './steps/stars'

const loadEssentialScripts = async () => {
  const scripts = []
  if (!window.AFRAME)
    scripts.push(`${process.env.PUBLIC_URL}/scripts/aframe.js`)
  if (!window.tracking) {
    scripts.push(`${process.env.PUBLIC_URL}/scripts/tracking/tracking-min.js`)
    scripts.push(`${process.env.PUBLIC_URL}/scripts/tracking/data/face-min.js`)
  }
  if (!window.oflow) {
    scripts.push(`${process.env.PUBLIC_URL}/scripts/oflow/polyfill.js`)
    scripts.push(`${process.env.PUBLIC_URL}/scripts/oflow/flowZone.js`)
  }
  if(scripts.length) {
    await loadJS(`${process.env.PUBLIC_URL}/scripts/getusermedia-polyfill.js`) // load polyfill first
    await loadJS(scripts)
  }
  // aframe-ar requires to be loaded afterwards
  if (!window.AR) {
    await loadJS([`${process.env.PUBLIC_URL}/scripts/aframe-ar.js`])
    await loadJS([`${process.env.PUBLIC_URL}/scripts/aframe-ar-lookat.js`])
  }
}

const getPreviousStep = step => {
  const currentStepIndex = STEPS.findIndex(({ id }) => id === step)
  const nextStepIndex =
    currentStepIndex === 0 ? STEPS.length - 1 : currentStepIndex - 1
  return STEPS[nextStepIndex].id
}

const getNextStep = step => {
  const currentStepIndex = STEPS.findIndex(({ id }) => id === step)
  const nextStepIndex =
    currentStepIndex < STEPS.length - 1 ? currentStepIndex + 1 : 0
  return STEPS[nextStepIndex].id
}

const STEPS = [
  {
    id: 'inTheStars',
    title: `La tête dans les étoiles`,
    component: Stars
  },
  {
    id: 'spaceVideos',
    title: `Des rêves d'espace`,
    component: SpaceVideos,
    isAr: true
  },
  {
    id: 'astronaut',
    title: 'Prêt pour le départ',
    component: Astronaut
  },
  {
    id: 'takeOff',
    title: 'Décollage imminent',
    component: TakeOff,
    isAr: true
  }
]

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      step: 'spaceVideos',
      scriptsReady: false
    }
  }
  componentDidMount = async () => {
    await loadEssentialScripts()
    this.setState({
      scriptsReady: true
    })
  }

  render = () => {
    const { scriptsReady, step } = this.state
    const currentStep = STEPS.find(({ id }) => id === step)
    const isAr = currentStep.isAr
    const Step = isAr ? ArScene : currentStep.component
    return scriptsReady ? (
      [
        <Topbar
          key="topbar"
          onNext={this.onNext}
          onPrevious={this.onPrevious}
          title={currentStep.title}
          isAr={isAr}
        />,
        <Step key="step" Step={currentStep.component} />
      ]
    ) : (
      <Loader />
    )
  }
  onPrevious = () => {
    this.setState(prevState => ({
      step: getPreviousStep(prevState.step)
    }))
  }
  onNext = () => {
    this.setState(prevState => ({
      step: getNextStep(prevState.step)
    }))
  }
}

export default App
