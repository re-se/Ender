//@flow
import React from 'react'
import { get } from 'lodash'
import { connect } from 'react-redux'
import engine from '../main/engine'
import SaveData from '../components/SaveData'

export type Props = {
  classNames: string[],
  limit: number,
  offset: number,
  saves: Object,
  onClick: any,
}

type State = {
  select: string,
}

class SaveList extends React.Component<Props, State> {
  render() {
    const saves = this.props.saves

    const saveDataList = []
    for (let key in saves) {
      const saveData = saves[key]
      saveDataList[key] = (
        <SaveData
          saveData={saveData}
          key={`saveData-${key}`}
          onClickLambda={this.props.onClick}
        />
      )
    }

    if (this.props.limit > 0) {
      for (
        let key = this.props.offset;
        saveDataList.length < this.props.limit;
        key++
      ) {
        if (saveDataList[key] !== undefined) {
          continue
        }
        saveDataList[key] = (
          <SaveData
            saveData={{ name: key }}
            key={`saveData-${key}`}
            onClickLambda={this.props.onClick}
          />
        )
      }
    }

    return (
      <div className={`ender-saveList ${this.props.classNames.join(' ')}`}>
        {saveDataList}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    saves: state.save,
  }
}

export default connect(mapStateToProps)(SaveList)
