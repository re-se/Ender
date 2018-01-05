import React from 'react'
import { get } from 'lodash'
import { connect } from 'react-redux'

export type Props = {
  classList: string[],
  path: string,
  loadCallback: ()=>void
};

const STRONG_RUBY_STRING = "﹅"

class MessageBox extends React.Component
{
  render() {
    if(this.props.message) {
      return (
        <div className={`ender-messageBox ${this.props.classNames.join(' ')}`}>
          <div className="ender-messageBox-inner">
            {this._generateMessageDoms(this.props.message, this.props.marker)}
          </div>
        </div>
      )
    } else {
      return <div/>
    }

  }

  /**
   * メッセージのDOMをメッセージ種別に応じて生成して配列にする
   * @param  {MessageInst[]} message メッセージ情報
   * @return {[type]}
   */
  _generateMessageDoms(message, marker) {
    let messageDoms = []
    let style = {}
    let index = this.props.index || message.length
    for(let i = 0; i < index; i++) {
      let word = message[i]
      let key = `message-${i}`
      let body = word.body
      let kana = word.kana
      if (this.props.position != null && i === index - 1) {
        body = word.body.slice(0, this.props.position)
        if (word.kana && this.props.position < word.body.length) {
          kana = ''
        }
      }
      switch(word.type) {
        // 標準メッセージ
        case "text":
          messageDoms.push(
            <span key={key} style={style}>{body}</span>
          )
          break
        // メッセージ(強調)
        case "strong":
          messageDoms.push(
            <ruby key={key} style={style}>
              <rb>{body}</rb>
              <rt>{this._generateStrongRuby(body.length)}</rt>
            </ruby>
          )
          break
        // 改行
        case "br":
          messageDoms.push(
            <br key={key} style={style}/>
          )
          break
        // ルビ
        case "ruby":
          messageDoms.push(
            <ruby key={key} style={style}>
              <rb>{body}</rb>
              <rt>{kana}</rt>
            </ruby>
          )
          break
        // 書式、スタイル指定
        case "style":
          style = word.value
          break
        // 未定義の種別ならエラー
        default:
          console.error(word)
      }
    }
    // マーカ
    if (marker && index === message.length) {
      if (message[index - 1].type === 'br') {
        messageDoms.pop()
      }
      messageDoms.push(
        <span key='marker' className="marker">{marker}</span>
      )
    }
    return messageDoms
  }

  /**
   * 強調ルビの文字列生成
   * @param  {int} wordCount 強調する文字数
   * @return {string}
   */
  _generateStrongRuby(wordCount: int) {
    let ruby = ""
    for(let i = 0; i < wordCount; i++) {
      ruby += get(this.props.config, 'text.strong') || STRONG_RUBY_STRING
    }
    return ruby
  }
}


const mapStateToProps = (state) => {
  return {
    config : state.config,
    message: state.MessageBox.message,
    marker: state.MessageBox.marker,
    classNames: state.MessageBox.classNames,
    index: state.MessageBox.index,
    position: state.MessageBox.position
  }
}

export default connect(mapStateToProps)(MessageBox)
