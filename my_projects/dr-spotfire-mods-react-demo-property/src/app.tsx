import React from "react";
import { AnalysisProperty } from "spotfire-api";
import { CompoundList } from './components/CompoundList'
// import { SearchBar } from './components/SearchBar'

export interface AppProps {
    currentProperty: string;
    properties: AnalysisProperty[];
    showProperties: (x: number, y: number) => void;
}

class App extends React.Component <AppProps> {

  constructor (props:any) {
    super(props)

    this.state = {
      searchQuery: "",
    }
  }

  search = (query:string) => {
    this.setState({
      searchQuery: query
    })
  }

  render () {
    return (
      <div style={{ textAlign: "center" }}>
        {/* <SearchBar searchFunction={this.search} /> */}
        <CompoundList {...this.props} {...this.state} />
      </div>

    )
  }
}

export {App};
