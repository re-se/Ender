import React from 'react';

export type Props = {
  classList: string[],
  path: string,
  loadCallback: ()->void
};

class MessageBox extends React.Component
{
  const STRONG_RUBY_STRING = "﹅";

  render() {
    if(this.props.message) {
      return (
          <div className="ender-messageBox ${this.props.styles}">
            <div className="ender-messageBox-inner">
              {this._generateMessageDoms(message)}
            </div>
        </div>
      );
    } else {
      return <div/>;
    }

  }

  /**
   * メッセージのDOMをメッセージ種別に応じて生成して配列にする
   * @param  {MessageInst[]} message メッセージ情報
   * @return {[type]}
   */
  _generateMessageDoms(message) {
    let messageDoms = [];
    let style = {};
    let keyNum = -1;
    for(let word of message) {
      let key = "message-${keyNum}";
      switch(word.type) {
        // 標準メッセージ
        case "text":
          messageDoms.push(
            <span key={key} style={style}>{word.body}</span>
          );
          break;
        // 強調点付きメッセージ
        case "strong":
          messageDoms.push(
            <ruby key={key} style={style}>
              <rb>{word.body}</rb>
              <rt>{this._generateStrongRuby(word.body.length)}</rt>
            </ruby>
          );
          break;
        // 改行
        case "br":
          messageDoms.push(
            <br key={key} style={style}/>
          );
          break;
        // マーカー付きメッセージ
        case "marker":
          messageDoms.push(
            <span key={key} className="marker">{word.body}</span>
          );
          break;
        // ルビ
        case "ruby":
          messageDoms.push(
            <ruby key={key} style={style}>
              <rb>{word.kanji}</rb>
              <rt>{word.kana}</rt>
            </ruby>
          );
          break;
        // 書式、スタイル指定
        case "style":
          style = word.value;
          break;
        // 未定義の種別ならエラー
        default:
          console.error(word);
      }
    }
    return messageDoms;
  }

  /**
   * 強調ルビの文字列生成
   * @param  {int} wordCount 強調する文字数
   * @return {string}
   */
  _generateStrongRuby(wordCount: int) {
    let ruby = "";
    for(let i = 0; i < wordCount; i++) {
      ruby += this.STRONG_RUBY_STRING;
    }
    return ruby;
  }
}

export default MessageBox;
