/*
 * Copyright © 2021. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

// Import the Spotfire module

import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";
import { AnalysisProperty, ModProperty, DataView } from "spotfire-api";

const root = document.querySelector("#app");

window.Spotfire.initialize(async (mod) => {
    let context = mod.getRenderContext();
    let reader = mod.createReader(mod.visualization.data(), mod.document.properties(), mod.property("propertyName"));

    reader.subscribe(async function render(dataView: DataView, properties: AnalysisProperty[], currentProperty: ModProperty ) {
      const axes = await dataView.axes()
      let rows = await dataView.allRows()

      let signalsProperties = properties.find(item => item.name === "response")
      let signalsPropertiesVal = signalsProperties?.value()

      let signalsImage = properties.find(item => item.name === "encodedImage")
      let signalsImageVal = signalsImage?.value()
      let table = await mod.visualization.mainTable()
      let cols = await table.columns()
      const zed = await mod.visualization.axis('Z')
      const displayName = zed.parts[0].displayName


      // showing info of marked part of table, may use later
      // rows?.forEach((item, index) => {
      //   item.isMarked() ? console.log(item.leafNode("Z")?.value()) : null
      // })

        ReactDOM.render(
            <App
                {...{
                    properties: properties,
                    currentProperty: currentProperty.value() + "",
                    rows,
                    axes,
                    signalsPropertiesVal,
                    signalsImageVal,
                    document,
                    cols,
                    dataView,
                    displayName
                }
              }
            />,
            root
        );

        context.signalRenderComplete();
    });
});
