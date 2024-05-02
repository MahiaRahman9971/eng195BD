
/*
 * StickFigureVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data
 */

class StickFigureVis {

    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.race = document.getElementById('raceSelector').value;
        this.gender = document.getElementById('genderSelector').value;
        this.percentile = document.getElementById('percentileSelector').value;

        this.initVis();
    }


    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis() {
        let vis = this;

        vis.margin = { top: 50, right: 50, bottom: 50, left: 50 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right,
            vis.height = 700 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.x = d3.scaleLinear()
            .domain([0,19])
            .range([0,0.9*(vis.width / 4)])

        vis.y = d3.scaleLinear()
            .domain([0, 5])
            .range([vis.height / 3,0])

        // initialize header
        vis.svg.append("text")
            .attr("class", "headertext")
            .attr("x", -10);

        // initialize has_dad stick figures
        let has_dad = vis.svg.append("g")
            .attr("id", "has_dad")
            .attr("transform", "translate(" + 0 + "," + 0 + ")")
            .append("text")
            .attr("class", "stickfig-label")
            .attr("x", -10)
            .attr("y", (vis.height / 3) + 50);
        initialize100Figures("has_dad")

        // initialize has_mom stick figures
        vis.svg.append("g")
            .attr("id", "has_mom")
            .attr("transform", "translate(" + (vis.width / 4) + "," + 0 + ")")
            .append("text")
            .attr("class", "stickfig-label")
            .attr("x", -10)
            .attr("y", (vis.height / 3) + 50);
        initialize100Figures("has_mom")

        // initialize jail stick figures
        vis.svg.append("g")
            .attr("id", "jail")
            .attr("transform", "translate(" + (vis.width / 2) + "," + 0 + ")")
            .append("text")
            .attr("class", "stickfig-label")
            .attr("x", -10)
            .attr("y", (vis.height / 3) + 50);
        initialize100Figures("jail")

        // initialize married stick figures
        vis.svg.append("g")
            .attr("id", "married")
            .attr("transform", "translate(" + 3*(vis.width / 4) + "," + 0 + ")")
            .append("text")
            .attr("class", "stickfig-label")
            .attr("x", -10)
            .attr("y", (vis.height / 3) + 50);
        initialize100Figures("married")

        // initialize stayhome stick figures
        vis.svg.append("g")
            .attr("id", "stayhome")
            .attr("transform", "translate(" + 0 + "," + 0.8*(vis.height / 2) + ")")
            .append("text")
            .attr("class", "stickfig-label")
            .attr("x", -10)
            .attr("y", (vis.height / 3) + 50);
        initialize100Figures("stayhome")

        // initialize staytract stick figures
        vis.svg.append("g")
            .attr("id", "staytract")
            .attr("transform", "translate(" + (vis.width / 4) + "," + 0.8*(vis.height / 2) + ")")
            .append("text")
            .attr("class", "stickfig-label")
            .attr("x", -10)
            .attr("y", (vis.height / 3) + 50);
        initialize100Figures("staytract")

        // initialize teenbrth stick figures
        vis.svg.append("g")
            .attr("id", "teenbrth")
            .attr("transform", "translate(" + (vis.width / 2) + "," + 0.8*(vis.height / 2) + ")")
            .append("text")
            .attr("class", "stickfig-label")
            .attr("x", -10)
            .attr("y", (vis.height / 3) + 50);
        initialize100Figures("teenbrth")

        // initialize working stick figures
        vis.svg.append("g")
            .attr("id", "working")
            .attr("transform", "translate(" + 3*(vis.width / 4) + "," + 0.8*(vis.height / 2) + ")")
            .append("text")
            .attr("class", "stickfig-label")
            .attr("x", -10)
            .attr("y", (vis.height / 3) + 50);
        initialize100Figures("working")

        // (Filter, aggregate, modify data)
        vis.wrangleData();

        function initialize100Figures(category) {
            let newSvg = vis.svg.select("#" + category);
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 20; j++) {
                    createStickFigure(newSvg, j, i, category);
                }
            }

        }

        function createStickFigure(svg, j, i, category) {
            // make svg group
            let stickFigure = svg.append("g")
                .attr("id", category + j.toString() + i.toString())
                .attr("transform", "translate(" + vis.x(j) + "," + vis.y(i) + ")");

            // Head
            stickFigure.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 8)
                .attr("fill", "#FFF")
                .attr("stroke", "#30B4A4")
                .attr("stroke-width", 1);

            // Body
            stickFigure.append("line")
                .attr("x1", 0)
                .attr("y1", 8)
                .attr("x2", 0)
                .attr("y2", 18)
                .attr("stroke", "#30B4A4")
                .attr("stroke-width", 1);

            // Arms
            stickFigure.append("line")
                .attr("x1", -8)
                .attr("y1", 13)
                .attr("x2", 8)
                .attr("y2", 13)
                .attr("stroke", "#30B4A4")
                .attr("stroke-width", 1);

            // Legs
            stickFigure.append("line")
                .attr("x1", 0)
                .attr("y1", 18)
                .attr("x2", -8)
                .attr("y2", 25)
                .attr("stroke", "#30B4A4")
                .attr("stroke-width", 1);

            stickFigure.append("line")
                .attr("x1", 0)
                .attr("y1", 18)
                .attr("x2", 8)
                .attr("y2", 25)
                .attr("stroke", "#30B4A4")
                .attr("stroke-width", 1);
        }
    }



    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        let columnNames = [];
        let has_dadColumnName = "has_dad_" + vis.race + "_" + vis.gender + "_" + vis.percentile;
        columnNames.push(has_dadColumnName);
        let has_momColumnName = "has_mom_" + vis.race + "_" + vis.gender + "_" + vis.percentile;
        columnNames.push(has_momColumnName);
        let jailColumnName = "jail_" + vis.race + "_" + vis.gender + "_" + vis.percentile;
        columnNames.push(jailColumnName);
        let marriedColumnName = "married_" + vis.race + "_" + vis.gender + "_" + vis.percentile;
        columnNames.push(marriedColumnName);
        let stayhomeColumnName = "stayhome_" + vis.race + "_" + vis.gender + "_" + vis.percentile;
        columnNames.push(stayhomeColumnName);
        let staytractColumnName = "staytract_" + vis.race + "_" + vis.gender + "_" + vis.percentile;
        columnNames.push(staytractColumnName);
        let teenbrthColumnName = "teenbrth_" + vis.race + "_female_" + vis.percentile;
        columnNames.push(teenbrthColumnName);
        let workingColumnName = "working_" + vis.race + "_" + vis.gender + "_" + vis.percentile;
        columnNames.push(workingColumnName);

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
                vis.averages.push(Math.round((sum / count)*100));
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
        console.log("hi")

        // update header
        let raceDisplayText = "";
        let genderDisplayText = "";
        let incomeDisplayText = "";
        switch(vis.race) {
            case "pooled":
                raceDisplayText = "of any race, "
                break;
            case "asian":
                raceDisplayText = "Asian, "
                break;
            case "black":
                raceDisplayText = "Black, "
                break;
            case "hisp":
                raceDisplayText = "Hispanic, "
                break;
            case "natam":
                raceDisplayText = "Native American, "
                break;
            case "white":
                raceDisplayText = "White, "
                break;
            case "other":
                raceDisplayText = "of a race that is not Asian, Black, Hispanic, Native American, or White, "
                break;
        }
        switch(vis.gender) {
            case "pooled":
                genderDisplayText = "are of any gender, "
                break;
            case "female":
                genderDisplayText = "female, "
                break;
            case "male":
                genderDisplayText = "male, "
                break;
        }
        switch(vis.percentile) {
            case "mean":
                incomeDisplayText = "and have average household income:"
                break;
            case "p1":
                incomeDisplayText = "and have household income in the 1st percentile:"
                break;
            case "p25":
                incomeDisplayText = "and have household income in the 25th percentile:"
                break;
            case "p50":
                incomeDisplayText = "and have household income in the 50th percentile:"
                break;
            case "p75":
                incomeDisplayText = "and have household income in the 75th percentile:"
                break;
            case "p100":
                incomeDisplayText = "and have household income in the 100th percentile:"
                break;
        }

        vis.svg.selectAll(".headertext")
            .text("Of 100 children who are " + raceDisplayText + genderDisplayText + incomeDisplayText)

        // update stick figures
        updateStickFigures("has_dad", vis.averages[0], " have a male claimer.")
        updateStickFigures("has_mom", vis.averages[1], " have a female claimer.")
        updateStickFigures("jail", vis.averages[2], " grow up to be incarcerated.")
        updateStickFigures("married", vis.averages[3], " get married.")
        updateStickFigures("stayhome", vis.averages[4], " stay in their childhood home as adults.")
        updateStickFigures("staytract", vis.averages[5], " live in the same census tract as adults.")
        updateStickFigures("teenbrth", vis.averages[6], " have a teen pregnancy come to term.")
        updateStickFigures("working", vis.averages[7], " have positive W-2 earnings.")


        function updateStickFigures(category, limit, text) {
            let stickFigures = vis.svg.select("#" + category);
            stickFigures.select(".stickfig-label")
                .text(limit + text)

            console.log("limit", limit)

            let count = 0;
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 20; j++) {
                    if (count < limit) {
                        stickFigures.select("#" + category + j.toString() + i.toString())
                            .transition()
                            .delay(count * 5)
                            .attr("opacity", 1);
                    } else {
                        stickFigures.select("#" + category + j.toString() + i.toString())
                            .transition()
                            .delay(count * 5)
                            .attr("opacity", 0);
                    }
                    count++;
                }
            }
        }

    }
}