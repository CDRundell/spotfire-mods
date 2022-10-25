import React from "react";
import { AnalysisProperty } from "spotfire-api";
import { SingleCompound } from './components/SingleCompound'

export interface AppProps {
    currentProperty: string;
    properties: AnalysisProperty[];
    showProperties: (x: number, y: number) => void;
}

export function App(props: AppProps) {
    return (
        <div>
            <SingleCompound {...props} />
        </div>
    );
}
