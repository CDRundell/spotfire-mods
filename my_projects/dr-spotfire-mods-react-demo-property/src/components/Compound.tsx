import React from 'react'

interface Compound {
  xVals?: any,
  yVals?: any,
  zVals?: any
}

class Compound extends React.Component<any, any, any> {
  render () {
    const { xVals, yVals, zVals } = this.props
    // console.log(zVals[0][0].value())
    return (
      <div style={{backgroundColor: "red", padding: "8px", margin: "16px", color: "peachpuff", borderRadius: "8px" }}>
        <p>{ xVals }</p>
        <p>{ yVals[0] }</p>
        <p>{ zVals[0][0].value() }</p>
      </div>
    )
  }
}

export default Compound
