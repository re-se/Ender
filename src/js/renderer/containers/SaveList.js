//@flow
import React from 'react'
import { get } from 'lodash'
import { connect } from 'react-redux'
import engine from '../main/engine'
import SaveData from '../components/SaveData'

export type Props = {
  classNames: string[],
  saves: Object,
}

type State = {
  select: string,
}

class SaveList extends React.Component<Props, State> {
  render() {
    const saves = this.props.saves

    console.log(saves)
    const saveDataList = []
    for (let key in saves) {
      const saveData = saves[key]
      saveDataList.push(
        <SaveData saveData={saveData} key={`saveData-${key}`} />
      )
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
