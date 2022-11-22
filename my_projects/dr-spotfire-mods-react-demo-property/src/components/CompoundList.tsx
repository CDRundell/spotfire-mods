import React from 'react'
// import Compound from './Compound'

class CompoundList extends React.Component<any, any> {

  handleContinousAxis = (axisName:any, row:any) => {
    const contVal = Object.values(row.continuous(axisName))
    return contVal[0]
  }

  handleCategoricalAxis = (axisName:any, row:any) => {
    return row.categorical(axisName).value()[0].key
  }


  render() {
    // const { rows, axes, searchQuery} = this.props
    const { signalsPropertiesVal, signalsImageVal } = this.props
    console.log(JSON.parse(signalsPropertiesVal))
    console.log(signalsImageVal.toString().replace(/\\n/g, ' '))
    // console.log(JSON.parse(signalsPropertiesVal))
    // console.log(JSON.parse(signalsPropertiesVal).data[0].attributes.products)

    return (
      // <img src={`data:image/svg;,${signalsImageVal}`}></img>
      <div
        dangerouslySetInnerHTML={{ __html: signalsImageVal.toString().replace(/\\n/g, ' ').replace(/b'/g, ' ').replace(/width="\d+px"/g, " ").replace(/height="\d+px"/g, " ") }}
      >
      </div>
    //   rows.map((row: any, index:number) => {
    //     const rowObject: any = {}
    //     rowObject["hexCode"] = row.color().hexCode
    //     axes.forEach((axis: any) => {
    //       rowObject[axis.name] = axis.isCategorical ? this.handleCategoricalAxis(axis.name, row) : this.handleContinousAxis(axis.name, row)
    //     })

    //     const rowVals:string[] = Object.values(rowObject)
    //     if (rowVals.find(rowVal => rowVal === searchQuery)) {
    //       return (
    //         <Compound {...rowObject} key={index} image={signalsImageVal} />
    //       )
    //     }
    //   })
    )
  }
}

export { CompoundList }
