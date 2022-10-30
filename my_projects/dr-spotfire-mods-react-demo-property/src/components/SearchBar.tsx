import React from 'react'

// interface handleKeyDown extends EventTarget {
//   query: string | number;
// }

class SearchBar extends React.Component<any> {

  // handleUpdate = (event:any) => {
  //   console.log(event.target.value)
  // }

  onEnter = (event:any) => {
    if (event.key === 'Enter') {
      const { searchFunction } = this.props
      searchFunction(event.target.value);
    }
  }


  render () {
    return (
      <div style={{display: "flex", justifyContent: "center"}} >
        <p> Please Input compound #:</p>
        <input
          // onChange={this.handleUpdate}
          placeholder="Search here"
          onKeyDown={this.onEnter}
         />
      </div>
    )
  }
}

export { SearchBar };
