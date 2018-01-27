import React from 'react'

const calc_text_width = (txt: string, elem: HTMLElement): number => {
  const element = document.createElement('canvas')
  let context = element.getContext('2d')
  const style = window.getComputedStyle(elem || document.querySelector('html'))
  context.font = style.font
  return context.measureText(txt).width
}

export default class Ruby extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      width: null,
    }
  }

  calcWidth(text, span) {
    const width = calc_text_width(text, span)
    if (this.state.width < width) {
      this.setState({ width: width })
    }
  }

  render() {
    let style = {}
    if (this.state.width) {
      style.width = this.state.width
    }
    let kanji = this.props.kanji
    let kana = this.props.kana
    let position = this.props.position || kanji.length

    return (
      <span className="ender-ruby">
        <span
          className="ender-rt"
          style={style}
          ref={this.calcWidth.bind(this, kana)}
        >
          {this._generateText(kana, kana.length * position / kanji.length)}
        </span>
        <span
          className="ender-rb"
          style={style}
          ref={this.calcWidth.bind(this, kanji)}
        >
          {this._generateText(kanji, position)}
        </span>
      </span>
    )
  }

  _generateText(text, position) {
    return text.split('').map((c, i) => {
      const opacity = i < position ? 1 : 0
      return (
        <span key={i} style={{ opacity }}>
          {c}
        </span>
      )
    })
  }
}

Ruby.defaultProps = {
  kanji: '',
  kana: '',
}
