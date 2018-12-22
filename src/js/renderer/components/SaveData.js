import React from 'react'

const SaveData = ({ saveData, classNames = [] }) => {
  let inners = [
    <div key={`saveData-name-${saveData.name}`}>{saveData.name}</div>,
    <div key={`saveData-date-${saveData.name}`}>
      {saveData.date.toString()}
    </div>,
    <div key={`saveData-text-${saveData.name}`}>{saveData.text}</div>,
  ]

  if (saveData.thumbnail) {
    let style = {
      width: '200px',
      height: '100px',
      backgroundImage: `url(data:image/png;base64.${saveData.thumbnail.toString()}`,
    }
    inners.push(<div key={`saveData-image-${saveData.name}`} style={style} />)
  }

  return (
    <div className={`ender-saveData ${classNames.join(' ')}`}>{inners}</div>
  )
}

export default SaveData
