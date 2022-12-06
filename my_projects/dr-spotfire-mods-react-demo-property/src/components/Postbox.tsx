import React from 'react'

class Postbox extends React.Component <any> {

  clickHandler = () => {
    this.props.propertiesFunction()
  }

  render () {
    return (
      <button onClick={this.clickHandler}>Push Value (from Z axis) to Notebook</button>
    )
  }
}

export { Postbox };
