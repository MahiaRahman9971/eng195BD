
/*
 * Stickfigurevis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data
 */

class LadderVis {

    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.race = "pooled";
        this.gender = "pooled";
        this.percentile = "mean";

        this.initVis();
    }


    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis() {
        let vis = this;

        vis.margin = { top: 100, right: 50, bottom: 50, left: 200 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right,
            vis.height = 500 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.y = d3.scaleLinear()
            .domain([0, 1])
            .range([vis.height, 0]);

        vis.yAxis = d3.axisRight()
            .scale(vis.y)
            .ticks(6)
            .tickFormat(x => x * 100);

        // Define ladder properties
        vis.ladderWidth = 100; // Width of the ladder
        vis.sideWidth = 15; // Width of side pole of the ladder
        vis.rungHeight = vis.height / 5; // Height of each rung
        let colors = ["#34687e", "#729d9d", "#f4d79e", "#d07e59", "#9b252f"]; // Colors for each rung
        let labels = ["Top quintile", "4th quintile", "3rd quintile", "2nd quintile", "Bottom quintile"]
        vis.toprung = (vis.rungHeight / 2) - (vis.sideWidth / 2);

        // draw y axis
        vis.svg.append("g")
            .attr("class", "y-axis axis")
            .call(vis.yAxis)
            .attr("transform", "translate(" + (vis.ladderWidth + 10) + ",0)");

        // Draw the ladder
        for (let i = 0; i < 5; i++) {
            vis.svg.append("rect")
                .attr("x", 0)
                .attr("y", i * vis.rungHeight)
                .attr("width", vis.sideWidth)
                .attr("height", vis.rungHeight)
                .attr("fill", colors[i]);
            vis.svg.append("rect")
                .attr("x", vis.ladderWidth - vis.sideWidth)
                .attr("y", i * vis.rungHeight)
                .attr("width", vis.sideWidth)
                .attr("height", vis.rungHeight)
                .attr("fill", colors[i]);
            vis.svg.append("rect")
                .attr("id", "rung" + i)
                .attr("x", 0)
                .attr("y", i * vis.rungHeight + (vis.rungHeight / 2) - (vis.sideWidth / 2))
                .attr("height", vis.sideWidth)
                .attr("width", vis.ladderWidth)
                .style("opacity", 0)
                .attr("fill", colors[i]);
            vis.svg.append("text")
                .text(labels[i])
                .attr("class", "ladder-label")
                .attr("text-anchor", "end")
                .attr("x", -10)
                .attr("y", i * vis.rungHeight + (vis.rungHeight / 2))
        }

        // initialize labels
        let avgLabelGroup = vis.svg.append("g")
            .attr("id", "average-group")

        avgLabelGroup.append("rect")
            .attr("x", 15)
            .attr("y", -25)
            .attr("width", 350)
            .attr("height", 40)
            .attr("fill", "#30B4A4")

        avgLabelGroup.append("polygon")
            .attr("points", "15,-25 15,15 0,-5")
            .attr("fill", "#30B4A4")

        avgLabelGroup.append("text")
            .attr("id", "average-label")
            .attr("fill", "white")

        // vis.svg.append("text")
        //     .attr("id", "average-label")
        vis.svg.append("text")
            .attr("id", "p20-label")
        vis.svg.append("text")
            .attr("id", "p1-label")

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }



    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        let columnNames = [];
        let kfrColumnName = "kfr_" + vis.race + "_" + vis.gender + "_" + vis.percentile;
        columnNames.push(kfrColumnName);
        let kfr01ColumnName = "kfr_top01_" + vis.race + "_" + vis.gender + "_" + vis.percentile;
        columnNames.push(kfr01ColumnName);
        let kfr20ColumnName = "kfr_top20_" + vis.race + "_" + vis.gender + "_" + vis.percentile;
        columnNames.push(kfr20ColumnName);

        vis.averages = [];

        columnNames.forEach((columnName) => {
            let sum = 0;
            let count = 0;

            for (const row of vis.data) {
                const columnValue = parseFloat(row[columnName]); // Convert string to numeric value
                if (!isNaN(columnValue)) {
                    sum += columnValue;
                    count++;
                }
            }
            if (sum < 0) {
                sum = 0;
            }
            if (count === 0) {
                vis.averages.push(0); // Avoid division by zero
            } else {
                vis.averages.push(sum / count);
            }

        });
        console.log(vis.averages);

        // Update the visualization
        vis.updateVis();
    }



    /*
     * The drawing function - should use the D3 update sequence (enter, update, exit)
     * Function parameters only needed if different kinds of updates are needed
     */

    updateVis() {
        let vis = this;

        let rungScale = d3.scaleLinear()
            .domain([vis.y(vis.averages[0]), vis.toprung])
            .range([1, vis.averages[2]])

        // update the rungs
        for (let i = 0; i < 5; i++) {
            vis.svg.select("#rung" + i)
                .style("opacity", rungScale(i * vis.rungHeight + (vis.rungHeight / 2) - (vis.sideWidth / 2)))
        }

        // update labels
        vis.svg.select("#average-group")
            .transition()
            .delay(.5)
            .attr("transform", "translate(" + (vis.ladderWidth + 40) + "," + vis.y(vis.averages[0]) + ")")
        vis.svg.select("#average-label")
            .text("Avg. household income percentile: " + (vis.averages[0] * 100).toFixed(2) + 'th')
            .attr("x", 20)
        vis.svg.select("#p1-label")
            .text("Proportion who achieve top 1% household income: " + vis.averages[1].toLocaleString(undefined,{style: 'percent', minimumFractionDigits:3}))
            .attr("x", -100)
            .attr("y", -50)
        vis.svg.select("#p20-label")
            .text("Proportion who achieve top 20% household income: " + vis.averages[2].toLocaleString(undefined,{style: 'percent', minimumFractionDigits:3}))
            .attr("x", -100)
            .attr("y", -30)

    }
}