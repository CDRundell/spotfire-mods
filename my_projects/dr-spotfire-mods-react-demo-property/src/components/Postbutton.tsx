import React from 'react'

class Postbutton extends React.Component <any> {

  clickHandler = () => {
    this.props.propertiesFunction()
  }

  render () {
    return (
      <button onClick={this.clickHandler}>Push Value (from Z axis) to Notebook</button>
    )
  }
}

export { Postbutton };
