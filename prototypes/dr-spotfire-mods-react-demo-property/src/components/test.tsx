import React from 'react'

class Test extends React.Component <any, any> {
  render () {
    const t = this.props.properties[15].value();
    console.log(JSON.parse(t).request)
    return (
      <h1>IM A TEST COMPONENT</h1>
    )
  }
}

export { Test }
