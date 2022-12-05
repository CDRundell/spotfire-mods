import React from "react";
import { AnalysisProperty } from "spotfire-api";
import { CompoundList } from './components/CompoundList'
// import { SearchBar } from './components/SearchBar'
import { Header } from './components/Header'

export interface AppProps {
    currentProperty: string;
    properties: AnalysisProperty[];
    // showProperties: (x: number, y: number) => void;
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
    console.log(this.props.properties)
    // testing setting mod property via 'payload'
    // let payload = this.props.properties.filter(item => {
    //   return item.name === 'payload'
    // }).pop()

    // payload?.set(JSON.stringify({name: "LogP", value: 6.80}))

    return (
      <div style={{ textAlign: "center" }}>
        <Header />
        {/* <SearchBar searchFunction={this.search} /> */}
        <CompoundList {...this.props} {...this.state} />
      </div>

    )
  }
}

export {App};
