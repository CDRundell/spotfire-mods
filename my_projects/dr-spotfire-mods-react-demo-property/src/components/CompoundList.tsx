import React from 'react'
import Compound from './Compound'

class CompoundList extends React.Component<any, any> {
  render() {
    let { rows, axisList } = this.props
    console.log(axisList)



    return (
      rows.slice(0,3).map((row: any) => {
        const xVals = row.categorical("X").value()[0].key
        const yVals = Object.values(row.continuous("Y"))
        // const stringVal:any = yVals[0]
        const zVals = Object.values(row.categorical("Z"))
        // let zValsTwo: any = zVals[0]

        return (
            // {/* <p>Row # {xVals }</p>
            // <p>{ stringVal }</p>
            // <p>{ zValsTwo[0].value() }</p> */}
            <Compound
              {
                ...{xVals: xVals,
                   yVals: yVals,
                    zVals: zVals}
              }
            />
        )
      })
    )
  }
}

export { CompoundList }
