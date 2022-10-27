import React from "react";
import { AnalysisProperty } from "spotfire-api";
import { CompoundList } from './components/CompoundList'
import { SearchBar } from './components/SearchBar'

export interface AppProps {
    currentProperty: string;
    properties: AnalysisProperty[];
    showProperties: (x: number, y: number) => void;
}

export function App(props: AppProps) {
    return (
      <div style={{textAlign: "center"}}>
        <SearchBar />
        <CompoundList {...props} />
      </div>
    );
}
