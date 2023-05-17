// import { TransitionProps, TransitionChain } from '@interfaces/transitions'
import { Transitions } from '@enums/transitions.ts'

import FadeIn from '@transitions/FadeIn.ts'
import FadeOut from '@transitions/FadeOut.ts'
import Create from '@transitions/Create.ts'
import { v4 as uuid } from 'uuid'
import AnimObject2D from './AnimObject2D.ts'

export const Transition = (type: Transitions) => {
  switch (type) {
    case Transitions.FadeIn:
      return (obj: AnimObject2D, config: any) => FadeIn(obj, config)
    case Transitions.FadeOut:
      return (obj: AnimObject2D, config: any) => FadeOut(obj, config)
    case Transitions.Create:
      return (obj: AnimObject2D, config: any) => Create(obj, config)
    default:
      return <AnimObject>(object: AnimObject, config: any): AnimObject => object
  }
}

export const createTransition = (config: any, object: any) => {
  let started = false
  let transitionQueueItem = {
    id: uuid(),
  }

  if (isTransition(config)) {
    let { onStart, onEnd, onProgress, endCondition } = config
    const end = () => {
      object.transition = null
      onEnd && onEnd({})
      object.scene.dequeueTransition(transitionQueueItem)
      return
    }
    const start = () => {
      onStart && onStart({})
      started = true
    }
    const tx = () => {
      if (!started) {
        !started && start()
        object.scene.enqueueTransition(transitionQueueItem)
      }
      if (endCondition ? endCondition() : false) {
        end()
      } else {
        onProgress({ start, end })
      }
    }
    return tx
  } else if (isTransitionChain(config)) {
    let ended = false
    let index = 0
    let getIndex = () => index

    let end = () => {
      if (getIndex() < config.length) {
        let item = config[getIndex()]
        if (item.endCondition && item.endCondition()) {
          item.onEnd && item.onEnd()
          index++
          started = false
          ended = true
        }
      } else {
        object.transition = null

        object.scene.dequeueTransition(transitionQueueItem)
      }
    }

    let start = () => {
      let item = config[getIndex()]
      item.onStart && item.onStart()
      started = true
      ended = false
    }

    let progress = () => {
      let item = config[getIndex()]
      item.onProgress({ start, end })
    }

    let tx = () => {
      if (getIndex() < config.length) {
        if (!started) start()
        progress()
        if (!ended) end()
      } else {
        if (object) {
          object.transition = null
          object.scene.dequeueTransition(transitionQueueItem)
        }
      }
    }
    return tx
  }
  return () => {}
}

const isTransition = (config: any) => {
  if (!isNaN(config.length)) {
    return false
  }
  let keys = Object.keys(config)
  return keys.includes('onProgress')
}

const isTransitionChain = (config: any) => {
  if (isNaN(config.length)) {
    return false
  }
  // @ts-ignore
  config.forEach((item: any) => {
    if (!isTransition(item)) return false
  })
  return true
}

export const createTransition3D = (config: any, object: any) => {
  let started = false
  let transitionQueueItem = {
    id: uuid(),
  }

  if (isTransition(config)) {
    let { onStart, onEnd, onProgress, endCondition } = config
    const end = () => {
      object.transition = null
      onEnd && onEnd()
      object.scene.dequeueTransition(transitionQueueItem)
      return
    }
    const start = () => {
      onStart && onStart({ end })
      started = true
    }
    const tx = () => {
      if (!started) {
        !started && start()
        object.scene.enqueueTransition(transitionQueueItem)
      }
      if (endCondition ? endCondition() : false) {
        end()
      } else {
        onProgress({ start, end })
      }
    }
    return tx
  } else if (isTransitionChain(config)) {
    let ended = false
    let index = 0
    let getIndex = () => index

    let end = () => {
      if (getIndex() < config.length) {
        let item = config[getIndex()]
        if (item.endCondition && item.endCondition()) {
          item.onEnd && item.onEnd()
          index++
          started = false
          ended = true
        }
      } else {
        object.transition = null

        object.scene.dequeueTransition(transitionQueueItem)
      }
    }

    let start = () => {
      let item = config[getIndex()]
      item.onStart && item.onStart({ end })
      started = true
      ended = false
    }

    let progress = () => {
      let item = config[getIndex()]
      item.onProgress({ start, end })
    }

    let tx = () => {
      if (getIndex() < config.length) {
        if (!started) start()
        progress()
        if (!ended) end()
      } else {
        object.transition = null
        object.scene.dequeueTransition(transitionQueueItem)
      }
    }
    return tx
  }
  return () => {}
}
