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

/*
const getPreviousStep = step => {
  const currentStepIndex = STEPS.findIndex(({ id }) => id === step)
  const nextStepIndex =
    currentStepIndex === 0 ? STEPS.length - 1 : currentStepIndex - 1
  return STEPS[nextStepIndex].id
}*/

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
    id: 'astronaut',
    title: 'Deviens astronaute',
    component: Astronaut
  },
  {
    id: 'spaceVideos',
    title: `L'espace en vidéos`,
    component: SpaceVideos,
    isAr: true
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
      step: 'inTheStars',
      scriptsReady: false
    }
  }
  componentDidMount = async () => {
    await this.loadEssentialScripts()
  }

  componentWillUpdate = (nextProps, nextState) => {
    // Because AR.js doesn't free cameras, we need to reload the whole fucking page
    if(this.state.step !== STEPS[0].id && nextState.step === STEPS[0].id) {
      window.location.reload()
    }
  }

  loadEssentialScripts = async () => {
    const { step } = this.state
    const currentStep = STEPS.find(({ id }) => id === step)
    const isAr = currentStep.isAr

    await loadJS(`${process.env.PUBLIC_URL}/scripts/getusermedia-polyfill.js`) // load polyfill first
    await loadJS(`${process.env.PUBLIC_URL}/scripts/oflow/polyfill.js`)
    
    if (isAr) {
      await loadJS(`${process.env.PUBLIC_URL}/scripts/aframe.js`)
      await loadJS([`${process.env.PUBLIC_URL}/scripts/aframe-ar.js`])
    } else {
      await loadJS(`${process.env.PUBLIC_URL}/scripts/tracking/tracking-min.js`)
      await loadJS(`${process.env.PUBLIC_URL}/scripts/tracking/data/face-min.js`)
      await loadJS(`${process.env.PUBLIC_URL}/scripts/oflow/flowZone.js`)
    }

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
  /*
  onPrevious = () => {
    this.setState(prevState => ({
      scriptsReady: false,
      step: getPreviousStep(prevState.step)
    }), () => {
      this.loadEssentialScripts()
    })
  }*/ 

  onNext = () => {
    this.setState(prevState => ({
      scriptsReady: false,
      step: getNextStep(prevState.step)
    }), () => {
      // We reload the scripts every time, cause some might override others variables
      this.loadEssentialScripts()
    })
  }
}

export default App
