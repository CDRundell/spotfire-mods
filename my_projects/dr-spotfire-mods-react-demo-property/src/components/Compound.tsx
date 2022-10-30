import React from 'react'

class Compound extends React.Component<any, any, any> {
  render () {
    const { X, Y, Z, hexCode } = this.props
    return (
      <div style={{backgroundColor: hexCode, padding: "8px", margin: "16px", color: "peachpuff", borderRadius: "8px" }}>
        <p>{ X }</p>
        <p>{ Y }</p>
        <p>{ Z }</p>
      </div>
    )
  }
}

export default Compound
