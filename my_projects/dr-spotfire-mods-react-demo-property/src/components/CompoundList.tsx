import React from 'react'
import Compound from './Compound'

class CompoundList extends React.Component<any, any> {

  handleContinousAxis = (axisName:any, row:any) => {
    const contVal = Object.values(row.continuous(axisName))
    return contVal[0]
  }

  handleCategoricalAxis = (axisName:any, row:any) => {
    return row.categorical(axisName).value()[0].key
  }

  render() {
    const { rows, axes } = this.props

    return (
      rows.slice(0,2).map((row: any, index:number) => {
        const rowObject: any = {}
        rowObject["hexCode"] = row.color().hexCode
        axes.forEach((axis: any) => {
          rowObject[axis.name] = axis.isCategorical ? this.handleCategoricalAxis(axis.name, row) : this.handleContinousAxis(axis.name, row)
        })

        return (
          <Compound {...rowObject} key={index} />
        )
      })
    )
  }
}

export { CompoundList }
