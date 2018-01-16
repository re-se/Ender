export default class Animation {
  isFinished: bool
  constructor(callback: () => void) {
    this.isFinished = false
  }

  start() {

  }

  finish() {
  }

  onExec() {
  }
}

// interface Animation {
//   isFinished: bool,
//   start(): void,
//   finish(): void,
//   onExec(): void,
// }

// export default Animation
