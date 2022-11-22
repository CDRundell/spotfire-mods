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
    const propertiesObject = JSON.parse(signalsPropertiesVal)

    return (
      <div style={{
                  display:"flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  border: "1px solid #5FA920",
                  borderRadius: "16px;",
                  padding: "8px 8px"
                  }}>
        <div
          dangerouslySetInnerHTML=
            {{ __html: signalsImageVal.toString().replace(/\\n/g, ' ').replace(/b'/g, ' ').replace(/width="\d+px"/g, " ").replace(/height="\d+px"/g, " ") }}
        >
        </div>
        <div style={{display: "flex", justifyContent: "space-evenly"}}>
          {propertiesObject.data.pop().attributes.products.map((item:any) => {
            const itemKeys = Object.keys(item)
            return itemKeys.map((key:any) => {
              return key === "actualMass" || key === "purity" || key ===  'rxnid'  ? <p style={{fontFamily: "Roboto", fontSize: "14px"}}><strong>{key}</strong>: {item[key]}</p> : null
            })
          })}
        </div>
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