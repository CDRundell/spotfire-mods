/*
 * Copyright © 2020. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

//@ts-check - Get type warnings from the TypeScript language server. Remove if not wanted.

// Get access to the Spotfire Mod API by providing a callback to the initialize method.
Spotfire.initialize(async (mod) => {
    const context = mod.getRenderContext();

    const canvasDiv = findElem("#canvas");
    const yScaleDiv = findElem("#y-scale");
    const xScaleDiv = findElem("#x-scale");

    const xScaleHeight = 20;
    const yScaleWidth = 100;

    const reader = mod.createReader(
        mod.visualization.data(),
        mod.property("y-axis-mode"),
        mod.property("split-bars"),
        mod.visualization.axis("Y"),
        mod.visualization.axis("X"),
        mod.windowSize()
    );

    // This Mod does not rely on data outside the
    // mod itself so no read errors are expected.
    reader.subscribe(render);

    /**
     * Render the bar chart.
     * This visualization is a simplified example to highlight how the mod API can be used. It is not a fully functioning visualization.
     *
     * Limitations:
     * - The bars cannot handle negative values
     * - Naive rendering of y-axis labels
     * - No labels on the x-axis
     *
     * @param {Spotfire.DataView} dataView
     * @param {Spotfire.ModProperty<string>} yAxisMode
     * @param {Spotfire.ModProperty<boolean>} splitBars
     * @param {Spotfire.Axis} yAxis
     */
    async function render(dataView, yAxisMode, splitBars, yAxis) {
        /**
         * Check for any errors.
         */
        let errors = await dataView.getErrors();
        if (errors.length > 0) {
            mod.controls.errorOverlay.show(errors, "dataView");
            // TODO clear DOM
            return;
        }

        mod.controls.errorOverlay.hide("dataView");

        // Get the leaf nodes for the x hierarchy. We will iterate over them to
        // render the bars.
        let xHierarchy = await dataView.hierarchy("X");
        let xRoot = await xHierarchy.root();
        if (xRoot == null) {
            // Return and wait for next call to render when reading data was aborted.
            // Last rendered data view is still valid from a users perspective since
            // a document modification was made during a progress indication.
            return;
        }

        let dataViewYAxis = await dataView.continuousAxis("Y");
        if (dataViewYAxis == null) {
            mod.controls.errorOverlay.show("No data on y axis.", "y");
            return;
        } else {
            mod.controls.errorOverlay.hide("y");
        }

        // Hide tooltip
        mod.controls.tooltip.hide();

        let xLeaves = xRoot.leaves();

        // Figure out if we use categorical coloring, and if so retrieve the
        // number or colors. We need that to render split bars rather than stacked.
        let colorHierarchy = await dataView.hierarchy("Color");
        let categoricalColorCount = colorHierarchy ? colorHierarchy.leafCount : 0;

        let maxYValue = calculateMaxYValue(xLeaves, splitBars, categoricalColorCount);
        renderBars(dataView, xLeaves, categoricalColorCount, maxYValue, splitBars);
        renderYScale(maxYValue, yAxis, yAxisMode);
        renderXScale(splitBars);

        context.signalRenderComplete();
    }

    /**
     * Render the vertical scale.
     * @param {number} max Max value on Y scale
     * @param {Spotfire.Axis} yAxis - The Y axes
     * @param {Spotfire.ModProperty<string>} yAxisMode - Property used to determine if the scale should be rendered in percent.
     */
    function renderYScale(max, yAxis, yAxisMode) {
        const stroke = context.styling.scales.line.stroke;

        yScaleDiv.style.width = yScaleWidth + "px";
        yScaleDiv.style.bottom = xScaleHeight + "px";
        if (stroke === "none") {
            yScaleDiv.style.borderWidth = "0px";
        } else {
            yScaleDiv.style.color = stroke;
            yScaleDiv.style.borderWidth = "1px";
        }

        yScaleDiv.innerHTML = "";

        // Do not render any scale if there is no max value.
        if (max === 0) {
            return;
        }

        if (yAxisMode.value() === "percentage") {
            max = 100;
        }

        let percent = 0;
        let value = Math.round((max * percent) / 100);
        do {
            yScaleDiv.appendChild(createLabel(value, percent));

            percent += 10;
            value = Math.round((max * percent) / 100);
            if (value === 0) {
                break;
            }
        } while (percent <= 100);

        yScaleDiv.onmouseenter = () => mod.controls.tooltip.show(yAxis.name + ": " + yAxis.expression);
        yScaleDiv.onmouseleave = () => mod.controls.tooltip.hide();

        yScaleDiv.oncontextmenu = function (e) {
            e.preventDefault(); // Prevents browser native context menu from being shown.
            e.stopPropagation(); // Prevents default mod context menu to be shown.

            mod.controls.contextMenu
                .show(e.clientX, e.clientY, [
                    {
                        text: "Percentage",
                        checked: yAxisMode.value() === "percentage",
                        enabled: yAxisMode.value() !== "percentage"
                    },
                    {
                        text: "Numeric",
                        checked: yAxisMode.value() === "numeric",
                        enabled: yAxisMode.value() !== "numeric"
                    }
                ])
                .then((clickedItem) => {
                    if (clickedItem.text === "Percentage") {
                        yAxisMode.set("percentage");
                    } else if (clickedItem.text === "Numeric") {
                        yAxisMode.set("numeric");
                    }
                });
        };

        yScaleDiv.onclick = function (e) {
            if (!context.isEditing) {
                return;
            }

            mod.controls.tooltip.hide();
            let factory = mod.controls.popout.components;
            let section = mod.controls.popout.section;
            let box = yScaleDiv.getBoundingClientRect();

            mod.controls.popout.show(
                {
                    x: box.width + box.left,
                    y: e.clientY,
                    autoClose: true,
                    alignment: "Left",
                    onChange(e) {
                        if (e.name === "mode") {
                            yAxisMode.set(e.value);
                        }
                    }
                },
                () => {
                    return [
                        section({
                            heading: "Scale mode",
                            children: [
                                factory.radioButton({
                                    name: "mode",
                                    text: "Percentage",
                                    value: "percentage",
                                    checked: yAxisMode.value() === "percentage"
                                }),
                                factory.radioButton({
                                    name: "mode",
                                    text: "Numeric",
                                    value: "numeric",
                                    checked: yAxisMode.value() !== "percentage"
                                })
                            ]
                        })
                    ];
                }
            );
        };

        /**
         * Render a scale label
         * @param {number} value
         * @param {number} yPosition
         */
        function createLabel(value, yPosition) {
            let label = createDiv("scale-label", "" + value);
            label.style.color = context.styling.scales.font.color;
            label.style.fontSize = context.styling.scales.font.fontSize + "px";
            label.style.fontFamily = context.styling.scales.font.fontFamily;
            label.style.bottom = yPosition + "%";
            return label;
        }
    }

    /**
     * Render the horizontal scale.
     * @param {Spotfire.ModProperty<boolean>} splitBars - Whether or not bars should be stacked or split into individual bars.
     */
    function renderXScale(splitBars) {
        const stroke = context.styling.scales.line.stroke;
        xScaleDiv.style.height = xScaleHeight + "px";
        xScaleDiv.style.left = yScaleWidth + "px";
        xScaleDiv.style.bottom = "0px";
        xScaleDiv.style.right = "0px";
        xScaleDiv.style.top = "unset";
        // xScaleDiv.style.display = 'flex';
        // xScaleDiv.style.justifyContent = 'space-between';
        // xScaleDiv.style.width = `${yScaleWidth} px`

        if (stroke === "none") {
            xScaleDiv.style.borderWidth = "0px";
        } else {
            xScaleDiv.style.color = stroke;
            xScaleDiv.style.borderWidth = "1px";
        }

        xScaleDiv.onclick = function (e) {
            if (!context.isEditing) {
                return;
            }

            let factory = mod.controls.popout.components;
            let section = mod.controls.popout.section;
            let box = xScaleDiv.getBoundingClientRect();

            mod.controls.popout.show(
                {
                    x: e.clientX,
                    y: box.top,
                    autoClose: true,
                    alignment: "Bottom",
                    onChange(e) {
                        splitBars.set(e.value);
                    }
                },
                () => {
                    let content = [
                        section({
                            heading: "Split bars",
                            children: [
                                factory.radioButton({
                                    name: "mode",
                                    text: "Stacked",
                                    value: false,
                                    checked: splitBars.value() === false
                                }),
                                factory.radioButton({
                                    name: "mode",
                                    text: "Separate bars",
                                    value: true,
                                    checked: splitBars.value() === true
                                })
                            ]
                        })
                    ];

                    return content;
                }
            );
        };
    }

    /**
     * Render all bars on the canvas div.
     * @param {Spotfire.DataView} dataView
     * @param {Spotfire.DataViewHierarchyNode[]} xLeafNodes
     * @param {number} maxYValue
     * @param {Spotfire.ModProperty<boolean>} splitBars
     */
    function renderBars(dataView, xLeafNodes, categoricalColorCount, maxYValue, splitBars) {
        canvasDiv.innerHTML = "";
        canvasDiv.style.left = yScaleWidth + "px";
        canvasDiv.style.bottom = xScaleHeight + "px";
        canvasDiv.style.right = "0px";

        canvasDiv.onclick = (e) => {
            if (e.target === canvasDiv) {
                dataView.clearMarking();
            }
        };

        const canvasHeight = canvasDiv.offsetHeight;

        xLeafNodes.forEach((leafNode) => canvasDiv.appendChild(renderBar(leafNode)));

        /**
         * Renders bars/segments for a single x axis node.
         * @param {Spotfire.DataViewHierarchyNode} xLeafNode
         */
        function renderBar(xLeafNode) {
            let fragment = document.createDocumentFragment();
            let rows = xLeafNode.rows();

            if (splitBars.value() && categoricalColorCount > 1) {
                // Render bars side by side. We need to add one bar per color to
                // keep all groups equally wide. So we create a sparse array where
                // we store the rows per color index, and render a bar for each
                // element in the array.
                let bars = new Array(categoricalColorCount).fill(null);
                rows.forEach((row) => {
                    let colorValue = row.categorical("Color");
                    bars[colorValue.leafIndex] = row;
                });

                bars.forEach((row) => {
                    fragment.appendChild(renderStackedBar(xLeafNode, row ? [row] : []));
                });
            } else {
                fragment.appendChild(renderStackedBar(xLeafNode, rows));
            }

            return fragment;
        }

        /**
         * Render a stacked bar in the bar chart from a set of source rows.
         * @param {Spotfire.DataViewHierarchyNode} xLeafNode
         * @param {Spotfire.DataViewRow[]} rows
         */
        function renderStackedBar(xLeafNode, rows) {
            let bar = createDiv("bar");

            let totalBarValue = sumValue(rows, "Y");
            let height = (totalBarValue / maxYValue) * canvasHeight
            bar.style.height = Math.round(height) + "px";
            let vh = window.innerHeight - 20
            let backgroundImage = `linear-gradient(0deg,hsl(240deg 100% 20%) ${Math.round(vh * 0)}px, hsl(289deg 100% 21%) ${Math.round(vh * 0.11)}px, hsl(315deg 100% 27%) ${Math.round(vh * 0.22)}px, hsl(329deg 100% 36%) ${Math.round(vh * 0.33)}px, hsl(337deg 100% 43%) ${Math.round(vh * 0.44)}px, hsl(357deg 91% 59%) ${Math.round(vh * 0.56)}px, hsl(17deg 100% 59%) ${Math.round(vh * 0.67)}px, hsl(34deg 100% 53%) ${Math.round(vh * 0.78)}px, hsl(45deg 100% 50%) ${Math.round(vh * 0.89)}px, hsl(55deg 100% 50%) ${Math.round(vh * 1)}px)`
            bar.style.backgroundImage = backgroundImage

            // function emptyDiv() {
            //   let xSegment = createDiv("xSegment");
            //   xSegment.innerText = ""
            //   xSegment.style.backgroundColor = "peachpuff"
            //   xSegment.style.flexGrow = "1"
            //   xSegment.style.flexShrink = "1"
            //   xSegment.style.maxWidth = `${xScaleDiv.clientWidth / 2 } px`
            //   xScaleDiv.appendChild(xSegment)
            // }
            // rows.length < 2 && emptyDiv()

            // function filledDiv() {
            //   const rowName = xLeafNode.key
            //   xScaleDiv.insertAdjacentHTML('beforeend', `<div class="xSegment" style="font-size: 12px; color: black; font: roboto; flex-grow: 1; flex-shrink: 1; flex-grow: 3; text-align: center; width: fit-content; text-align: center; overflow: hidden; white-space: nowrap: text-overflow: ellipsis; width: ${xScaleDiv.clientWidth}px; transform: rotate(-90deg);">${rowName}</div>`)
            //   xScaleDiv.style.textOverflow = "ellipsis"
            // }

            rows.forEach((row, index) => {
                let y = row.continuous("Y");
                if (y.value() === null) {
                    return;
                }
                const rowName = xLeafNode.key

                let segment = createDiv("segment");
                segment.style.height = (+y.value() / maxYValue) * canvasHeight + "px";
                segment.style.backgroundColor = row.color().hexCode;
                bar.style.display = 'flex';
                bar.style.flexDirection = 'column-reverse';
                bar.innerHTML = `<p class="bar-tag" style="font-family: roboto; position: relative; opacity: 0.9; top: 28px; color: gray; border-radius: 8px; white-space: nowrap; text-overflow: ellipsis;">${rowName}</p>`

                segment.onmouseover = (e) => {
                    mod.controls.tooltip.show(row);
                };
                segment.onmouseout = (e) => {
                    mod.controls.tooltip.hide();
                };

                segment.onclick = (e) => {
                    /** @type{Spotfire.MarkingOperation} */
                    let mode = e.ctrlKey ? "Toggle" : "Replace";
                    if (e.shiftKey) {
                        rows.forEach((m) => m.mark(mode));
                    } else {
                        row.mark(mode);
                    }
                };

              bar.appendChild(segment);
              // filledDiv()
            });
        return bar;
        }
    }
});

/**
 * Calculate the maximum value from a hierarchy. If split bars is enabled, the single maximum value from all rows will be used.
 * @param {Spotfire.DataViewHierarchyNode[]} xLeaves
 * @param {Spotfire.ModProperty<boolean>} splitBars
 * @param {number} categoricalColorCount
 */
function calculateMaxYValue(xLeaves, splitBars, categoricalColorCount) {
    let maxYValue = 0;
    if (splitBars.value() && categoricalColorCount > 0) {
        xLeaves.forEach((node) => {
            maxYValue = Math.max(maxValue(node.rows(), "Y"), maxYValue);
        });
    } else {
        xLeaves.forEach((node) => {
            let sum = sumValue(node.rows(), "Y");
            maxYValue = Math.max(maxYValue, sum);
        });
    }

    return maxYValue;
}

/**
 * Calculate the total value for an axis from a set of rows. Null values are treated a 0.
 * @param {Spotfire.DataViewRow[]} rows Rows to calculate the total value from
 * @param {string} axis Name of Axis to use to calculate the value.
 */
function sumValue(rows, axis) {
    return rows.reduce((p, c) => +c.continuous(axis).value() + p, 0);
}

/**
 * Calculate the max value for an axis from a set of rows. Null values are treated a 0.
 * @param {Spotfire.DataViewRow[]} rows Rows to calculate the max value from
 * @param {string} axis Name of Axis to use to calculate the value.
 */
function maxValue(rows, axis) {
    return rows.reduce((p, c) => Math.max(+c.continuous(axis).value(), p), 0);
}

/** @returns {HTMLElement} */
function findElem(selector) {
    return document.querySelector(selector);
}

/**
 * Create a div element.
 * @param {string} className class name of the div element.
 * @param {string | HTMLElement} [content] Content inside the div
 */
function createDiv(className, content) {
    let elem = document.createElement("div");
    elem.classList.add(className);
    if (typeof content === "string") {
        elem.appendChild(document.createTextNode(content));
    } else if (content) {
        elem.appendChild(content);
    }

    return elem;
}
