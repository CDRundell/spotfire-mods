import React from 'react'

class Header extends React.Component<any> {

  render() {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }} >
        <img src="../images/SignalsNotebook_sq_lg_(1).png" style={{width: "60px", height: "60px"}}></img>
        <h2 style={{fontFamily:"Roboto", paddingRight:"8px"}}>Signals Notebook Mod</h2>
      </div>
    )
  }
}

export { Header};
