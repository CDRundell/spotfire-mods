import React from "react";
import { AnalysisProperty } from "spotfire-api";
import { CompoundList } from './components/CompoundList'
import { Header } from './components/Header'
import { Postbox } from './components/Postbox'

export interface AppProps {
    currentProperty: string;
    properties: AnalysisProperty[];
    axes: any,
    rows: any,
    dataView: any,
    displayName: string
}

class App extends React.Component <AppProps> {

  updateDocumentProperties = () => {

      const val = this.props.rows?.filter((item:any) => {
        return item.isMarked()
      })

    const payloadObject = {
      name: this.props.displayName,
      value: parseInt(val.pop().leafNode("Z")?.value())
    }

    if (typeof payloadObject.value === "number") {
    let payload = this.props.properties.filter(item => {
      return item.name === 'payload'
    }).pop()
    payload?.set(JSON.stringify(payloadObject))
    }
  }


  render () {
    return (
      <div style={{ textAlign: "center" }}>
        <Header />
        <CompoundList {...this.props} {...this.state} />
        <Postbox {...this.props} propertiesFunction={this.updateDocumentProperties}  />
      </div>

    )
  }
}

export {App};
