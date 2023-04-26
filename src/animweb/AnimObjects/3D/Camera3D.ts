import * as THREE from 'three'
import { v4 as uuid } from 'uuid'
import { rangePerFrame, roundOff } from '../../helpers/miscellaneous'

export enum CameraAxes {
  X = 'X',
  Y = 'Y',
  Z = 'Z',
}

export default class Camera {
  camera: THREE.PerspectiveCamera
  transitions: Array<{ id: string; function: Function }> = []
  origin: { x: number; y: number; z: number }

  constructor(width: number, height: number) {
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    this.camera.position.z = 5
    this.origin = {
      x: 0,
      y: 0,
      z: 0,
    }
    this.lookAtWithoutTransition(this.origin.x, this.origin.y, this.origin.z)
  }

  createTransition() {
    return {
      id: uuid(),
      function: () => {},
    }
  }

  lookAt(x: number, y: number, z: number, duration = 1) {
    let lookAtTransition = this.createTransition()
    let xSpeed = rangePerFrame(x - this.origin.x, duration)
    let ySpeed = rangePerFrame(y - this.origin.y, duration)
    let zSpeed = rangePerFrame(z - this.origin.z, duration)
    lookAtTransition.function = () => {
      if (
        roundOff(this.origin.x, 2) == roundOff(x, 2) &&
        roundOff(this.origin.y, 2) == roundOff(y, 2) &&
        roundOff(this.origin.z, 2) == roundOff(z, 2)
      ) {
        this.transitions = this.transitions.filter(
          (transition) => transition.id != lookAtTransition.id
        )
        this.origin = { x, y, z }
        return
      } else {
        this.origin.x += xSpeed
        this.origin.y += ySpeed
        this.origin.z += zSpeed
        this.camera.lookAt(this.origin.x, this.origin.y, this.origin.z)
      }
    }
    this.transitions.push(lookAtTransition)
  }

  lookAtWithoutTransition(x: number, y: number, z: number) {
    this.origin = { x, y, z }
    this.camera.lookAt(this.origin.x, this.origin.y, this.origin.z)
  }

  startRotation() {}

  stopRotation() {}

  moveTo(x: number, y: number, z: number, duration: number = 1) {
    let moveToTransition = this.createTransition()
    let xSpeed = rangePerFrame(x - this.camera.position.x, duration)
    let ySpeed = rangePerFrame(y - this.camera.position.y, duration)
    let zSpeed = rangePerFrame(z - this.camera.position.z, duration)
    moveToTransition.function = () => {
      if (
        roundOff(x, 2) == roundOff(this.camera.position.x, 2) &&
        roundOff(y, 2) == roundOff(this.camera.position.y, 2) &&
        roundOff(z, 2) == roundOff(this.camera.position.z, 2)
      ) {
        this.transitions = this.transitions.filter(
          (transition) => transition.id != moveToTransition.id
        )
        this.camera.position.x = x
        this.camera.position.y = y
        this.camera.position.z = z
        return
      } else {
        this.camera.position.x += xSpeed
        this.camera.position.y += ySpeed
        this.camera.position.z += zSpeed
        this.lookAtWithoutTransition(
          this.origin.x,
          this.origin.y,
          this.origin.z
        )
      }
    }
    this.transitions.push(moveToTransition)
  }

  rotateAround(axis: CameraAxes) {
    if (axis == CameraAxes.X) {
    }
    if (axis == CameraAxes.X) {
    }
    if (axis == CameraAxes.X) {
    }
  }

  transform() {
    this.transitions.forEach((transition) => transition.function())
  }

  reset() {
    this.camera.position.x = 0
    this.camera.position.y = 0
    this.camera.position.z = 5
    this.lookAtWithoutTransition(0, 0, 0)
  }
}
