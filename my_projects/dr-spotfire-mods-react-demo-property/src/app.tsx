import React from "react";
import { AnalysisProperty } from "spotfire-api";
import { CompoundList } from './components/CompoundList'
import { SearchBar } from './components/SearchBar'

export interface AppProps {
    currentProperty: string;
    properties: AnalysisProperty[];
    showProperties: (x: number, y: number) => void;
}

class App extends React.Component <AppProps> {

  render () {
    return (
      <div style={{ textAlign: "center" }}>
        <SearchBar />
        <CompoundList {...this.props} />
      </div>

    )
  }
}

export {App} ;
