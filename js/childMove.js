class ChildMove {

    constructor(_parentElement) {
        this.parentElement = _parentElement;

        this.initVis();
    }

    initVis() {
        let vis = this;

        const circRad = 100;

        vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right,
            vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        const leftCirc = vis.svg.append("circle")
            .attr("cx", vis.width / 4)
            .attr("cy", vis.height / 2)
            .attr("r", circRad)
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        const rightCirc = vis.svg.append("circle")
            .attr("cx", vis.width / 4 * 3)
            .attr("cy", vis.height / 2)
            .attr("r", circRad)
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        vis.numFigs = 3;
        vis.spacing = 50;


        // Left figure

        const leftFig = vis.svg.append("g")
            .attr("transform", "translate(" + (vis.width / 4 - (vis.numFigs - 1) * vis.spacing / 2) + "," + vis.height / 2 + ")");
        // Head
        leftFig.append("circle")
            .attr("r", 10)
            .attr("fill", "#9b252f")
            .attr("class", "leftFig");

        // Body
        leftFig.append("line")
            .attr("x1", 0)
            .attr("y1", 10)
            .attr("x2", 0)
            .attr("y2", 30)
            .attr("stroke", "#9b252f")
            .attr("stroke-width", 2)
            .attr("class", "leftFig");

        // Left leg
        leftFig.append("line")
            .attr("x1", 0)
            .attr("y1", 30)
            .attr("x2", -10)
            .attr("y2", 40)
            .attr("stroke", "#9b252f")
            .attr("stroke-width", 2)
            .attr("class", "leftFig");

        // Right leg
        leftFig.append("line")
            .attr("x1", 0)
            .attr("y1", 30)
            .attr("x2", 10)
            .attr("y2", 40)
            .attr("stroke", "#9b252f")
            .attr("stroke-width", 2)
            .attr("class", "leftFig");

        // Left arm
        leftFig.append("line")
            .attr("x1", 0)
            .attr("y1", 20)
            .attr("x2", -15)
            .attr("y2", 20)
            .attr("stroke", "#9b252f")
            .attr("stroke-width", 2)
            .attr("class", "leftFig");

        // Right arm
        leftFig.append("line")
            .attr("x1", 0)
            .attr("y1", 20)
            .attr("x2", 15)
            .attr("y2", 20)
            .attr("stroke", "#9b252f")
            .attr("stroke-width", 2)
            .attr("class", "leftFig");


        // leftCirc
        for (let i = 1; i < vis.numFigs; i++) {
            const stickFigure = vis.svg.append("g")
                .attr("transform", "translate(" + (vis.width / 4 - (vis.numFigs - 1) * vis.spacing / 2 + i * vis.spacing) + "," + vis.height / 2 + ")");

            // Head
            stickFigure.append("circle")
                .attr("r", 10)
                .attr("fill", "#9b252f");

            // Body
            stickFigure.append("line")
                .attr("x1", 0)
                .attr("y1", 10)
                .attr("x2", 0)
                .attr("y2", 30)
                .attr("stroke", "black")
                .attr("stroke-width", 2);

            // Left leg
            stickFigure.append("line")
                .attr("x1", 0)
                .attr("y1", 30)
                .attr("x2", -10)
                .attr("y2", 40)
                .attr("stroke", "#9b252f")
                .attr("stroke-width", 2);

            // Right leg
            stickFigure.append("line")
                .attr("x1", 0)
                .attr("y1", 30)
                .attr("x2", 10)
                .attr("y2", 40)
                .attr("stroke", "#9b252f")
                .attr("stroke-width", 2);

            // Left arm
            stickFigure.append("line")
                .attr("x1", 0)
                .attr("y1", 20)
                .attr("x2", -15)
                .attr("y2", 20)
                .attr("stroke", "#9b252f")
                .attr("stroke-width", 2);

            // Right arm
            stickFigure.append("line")
                .attr("x1", 0)
                .attr("y1", 20)
                .attr("x2", 15)
                .attr("y2", 20)
                .attr("stroke", "#9b252f")
                .attr("stroke-width", 2);
        }

        // rightCirc
        for (let i = 0; i < vis.numFigs; i++) {
            const stickFigure = vis.svg.append("g")
                .attr("transform", "translate(" + (vis.width / 4 * 3 - vis.numFigs * vis.spacing / 2 + i * vis.spacing) + "," + vis.height / 2 + ")");

            // Head
            stickFigure.append("circle")
                .attr("r", 10)
                .attr("fill", "#34687e");

            // Body
            stickFigure.append("line")
                .attr("x1", 0)
                .attr("y1", 10)
                .attr("x2", 0)
                .attr("y2", 30)
                .attr("stroke", "#34687e")
                .attr("stroke-width", 2);

            // Left leg
            stickFigure.append("line")
                .attr("x1", 0)
                .attr("y1", 30)
                .attr("x2", -10)
                .attr("y2", 40)
                .attr("stroke", "#34687e")
                .attr("stroke-width", 2);

            // Right leg
            stickFigure.append("line")
                .attr("x1", 0)
                .attr("y1", 30)
                .attr("x2", 10)
                .attr("y2", 40)
                .attr("stroke", "#34687e")
                .attr("stroke-width", 2);

            // Left arm
            stickFigure.append("line")
                .attr("x1", 0)
                .attr("y1", 20)
                .attr("x2", -15)
                .attr("y2", 20)
                .attr("stroke", "#34687e")
                .attr("stroke-width", 2);

            // Right arm
            stickFigure.append("line")
                .attr("x1", 0)
                .attr("y1", 20)
                .attr("x2", 15)
                .attr("y2", 20)
                .attr("stroke", "#34687e")
                .attr("stroke-width", 2);
        }

        vis.sliderScale = d3.scaleLinear()
            .domain(slideBounds)
            .range([0, (vis.width / 4 * 3 - vis.numFigs * vis.spacing / 2 + 3 * vis.spacing) - (vis.width / 4 - (vis.numFigs - 1) * vis.spacing / 2)]);

        vis.colorScale = d3.scaleLinear()
            .domain(slideBounds)
            .range(["#9b252f", "#34687e"]);


        vis.slider = noUiSlider.create(document.getElementById("child-slider"), {
            start: [0],
            range: {
                "min": slideBounds[0],
                "max": slideBounds[1]
            }
        });

        vis.svg.append("line")
            .attr("class", "slider-track")
            .attr("x1", 0 - vis.margin.left)
            .attr("x2", vis.width + vis.margin.right)
            .attr("y1", vis.height + vis.margin.top - 2)
            .attr("y2", vis.height + vis.margin.top - 2)
            .attr("stroke", "black")
            .attr("stroke-width", 5);

        vis.svg.append("text")
            .attr("x", vis.width / 4)
            .attr("y", vis.height / 2 - circRad - 10)
            .attr("text-anchor", "middle")
            .text("Low-Opportunity Area");

        vis.svg.append("text")
            .attr("x", vis.width / 4 * 3)
            .attr("y", vis.height / 2 - circRad - 10)
            .attr("text-anchor", "middle")
            .text("High-Opportunity Area");

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.updateVis();
    }


    updateVis() {
        let vis = this;

        const leftStickFigure = vis.svg.selectAll(".leftFig");

        vis.slider.on("update", function (values, handle) {
            slideVal = parseInt(values[0]);
            leftStickFigure
                .attr("fill", vis.colorScale(slideVal))
                .attr("stroke", vis.colorScale(slideVal))
                .attr("transform", "translate(" + vis.sliderScale(slideVal) + ",0)");
            moveGraphs.updateVis();
        });
    }
}
