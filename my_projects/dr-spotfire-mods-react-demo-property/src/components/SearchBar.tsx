import React from 'react'

// interface handleKeyDown extends EventTarget {
//   query: string | number;
// }

class SearchBar extends React.Component<any> {

  handleKeyUp = (event:any) => {
    console.log(event.target.value)
  }



  render () {
    return (
      <div style={{display: "flex", justifyContent: "center"}} >
        <p> Please Input compound #:</p>
        <input onKeyUp={this.handleKeyUp} placeholder="Search here" />
      </div>
    )
  }
}

export { SearchBar };
