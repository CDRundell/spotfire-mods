import React from "react";
import { AnalysisProperty } from "spotfire-api";
import { CompoundList } from './components/CompoundList'
// import { SearchBar } from './components/SearchBar'
import { Header } from './components/Header'
import { Postbox } from './components/Postbox'

export interface AppProps {
    currentProperty: string;
    properties: AnalysisProperty[];
    axes: any,
    rows: any,
    dataView: any,
    displayName: string
    // showProperties: (x: number, y: number) => void;
}

class App extends React.Component <AppProps> {

  constructor (props:any) {
    super(props)
    this.state = {
      searchQuery: "",
      categorical: false
    }
  }

  search = (query:string) => {
    this.setState({
      searchQuery: query
    })
  }

  updateDocumentProperties = () => {
    const payloadObject = {
      name: this.props.displayName,
      value: parseInt(this.props.rows.pop().categorical("Z").value()[0].key)
    }

    if (typeof payloadObject.value === "number") {
    let payload = this.props.properties.filter(item => {
      return item.name === 'payload'
    }).pop()
    payload?.set(JSON.stringify(payloadObject))
    }
    // let payload = this.props.properties.filter(item => {
    //   return item.name === 'payload'
    // }).pop()
    // payload?.set(JSON.stringify({name: "LogP", value: 10.80}))
  }


  render () {
    return (
      <div style={{ textAlign: "center" }}>
        <Header />
        {/* <SearchBar searchFunction={this.search} /> */}
        <CompoundList {...this.props} {...this.state} />
        <Postbox {...this.props} propertiesFunction={this.updateDocumentProperties}  />
      </div>

    )
  }
}

export {App};
