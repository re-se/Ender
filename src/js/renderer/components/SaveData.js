import React from 'react'
import { execLambda } from '../util/lambda'
import engine from '../main/engine'

const DATE_FORMAT_OPTION = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
}

const SaveData = ({ saveData, classNames = [], onClickLambda = null }) => {
  let inners = [
    <div className="ender-saveData-name" key={`saveData-name-${saveData.name}`}>
      {saveData.name}
    </div>,
    <div className="ender-saveData-date" key={`saveData-date-${saveData.name}`}>
      {saveData.date
        ? saveData.date.toLocaleString(undefined, DATE_FORMAT_OPTION)
        : ''}
    </div>,
    <div className="ender-saveData-text" key={`saveData-text-${saveData.name}`}>
      {saveData.text}
    </div>,
  ]

  if (saveData.thumbnail) {
    let style = {
      backgroundImage: `url(data:image/png;base64.${saveData.thumbnail.toString()}`,
    }
    inners.push(
      <div
        className="ender-saveData-image"
        key={`saveData-image-${saveData.name}`}
        style={style}
      />
    )
  }

  return (
    <div
      className={`ender-saveData ${classNames.join(' ')}`}
      onClick={() => {
        onClick(saveData.name, onClickLambda)
      }}
    >
      {inners}
    </div>
  )
}

function onClick(name, onClick) {
  if (onClick) {
    execLambda(onClick, [name])
  }
  engine.exec()
}

export default SaveData
