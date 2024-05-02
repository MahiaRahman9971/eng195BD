class UserGuess {

    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.match = [];

        vis.margin = { top: 20, right: 20, bottom: 50, left: 50 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right,
            vis.height = vis.width * 0.67;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        vis.y = d3.scaleBand()
            .domain(vis.data.map(d => d.year).reverse())
            .rangeRound([vis.height, 0]);


        vis.x = d3.scaleLinear()
            .domain([0, 100])
            .range([0, vis.width]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.svg.select(".x-axis")
            .call(vis.xAxis);

        vis.svg.select(".y-axis")
            .call(vis.yAxis);

        vis.svg.selectAll(".y-axis .tick")
            .append("rect")
            .attr("class", (d, i) => i % 2 === 0 ? "stripe even" : " stripe odd")
            .attr("id", (d, i) => "stripe-" + i)
            .attr("x", 0)
            .attr("y", 0 - vis.y.bandwidth() / 2)
            .attr("width", vis.width)
            .attr("height", vis.y.bandwidth());

        vis.svg.append("text")
            .attr("x", -50)
            .attr("y", -8)
            .attr("class", "axis-label")
            .text("Birth Year");

        vis.svg.append("text")
            .attr("x", vis.width - 200)
            .attr("y", vis.height + 35)
            .attr("class", "axis-label")
            .text("% Children Earning More than Parents");


        vis.blueSquareGroup = vis.svg.append("g")
            .attr("transform", "translate(0," + (vis.height / 116.044) + ")");


        vis.blueSquareGroup.append("rect")
            .attr("width", vis.width / 2.5)
            .attr("height", vis.y.bandwidth() * 7)
            .attr("fill", "#195473");


        vis.svg.selectAll(".y-axis .tick")
            .append("rect")
            .attr("class", "white-bar")
            .attr("id", function(d, i) {
                vis.match.push(d);
                return "white-bar-" + i;
            } )
            .attr("x", vis.width)
            .attr("y", 0 - vis.y.bandwidth() / 2)
            .attr("width", 0)
            .attr("height", vis.y.bandwidth())
            .attr("fill", "white");

        const starSpacing = vis.width / 2.5 / 6;

        const starGroup = vis.blueSquareGroup.append("g")
            .attr("class", "star-group");

        starGroup.selectAll(".star")
            .data(d3.range(9))
            .enter()
            .append("g")
            .attr("transform", (d, i) => "translate(" + ((i % 2) * vis.width / 2.5 / 12) + "," + (i * vis.y.bandwidth() / 1.35) + ")")
            .selectAll(".star")
            .data((d, i) => (i % 2 === 0) ? d3.range(6) : d3.range(5))
            .enter().append("text")
            .attr("class", "star")
            .text("\u2605")
            .attr("x", (d, i) => i * starSpacing + vis.width / 50)
            .attr("y", vis.height / 25)
            .attr("font-size", "10px")
            .attr("fill", "white");

        document.getElementById("final-button").addEventListener("click", function () {
            document.getElementById("explanation-text").style.display = "block";
        });

        document.getElementById("final-button").addEventListener("click", function () {
            vis.calculateAverageDistance();
            guessAccuracy *= 100;
            const formattedAccuracy = guessAccuracy.toFixed(1);
            const guessAccuracyDiv = document.getElementById("guess-accuracy");
            guessAccuracyDiv.textContent = "Your guess accuracy is " + formattedAccuracy + "%";
        });

        document.getElementById("reset-button").addEventListener("click", function () {
            const guessAccuracyDiv = document.getElementById("guess-accuracy");
            guessAccuracyDiv.textContent = "";
        });


        vis.blackCircleGroup = vis.svg.append("g")
            .attr("class", "black-circle-group");

        vis.svg.selectAll(".white-bar")
            .each(function (d, i) {
                const xPosition = vis.width;
                vis.createBlackCircle(i, xPosition);
            });

        vis.wrangleData();

    }

    createBlackCircle(index, xPosition) {
        let vis = this;

        vis.blackCircleGroup.append("circle")
            .attr("cx", xPosition)
            .attr("cy", vis.y(vis.data[index].year) + vis.y.bandwidth() / 2)
            .attr("r", 5)
            .attr("fill", "black")
            .attr("class", "black-circle");
    }

    updateBlackCircle(index, newX) {
        let vis = this;

        vis.blackCircleGroup.selectAll(".black-circle")
            .filter(function (d, i) {
                return i === index;
            })
            .attr("cx", newX);
    }

    wrangleData() {
        let vis = this;

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.svg.selectAll(".y-axis .tick rect")
            .on("mousedown", function (event, d) {
                const year = d3.select(this).datum();
                const dataPoint = vis.data.find(data => data.year === year);

                if (dataPoint) {
                    const barId = "white-bar-" + vis.match.indexOf(dataPoint.year);

                    let whiteBar = vis.svg.select("#" + barId);

                    if (whiteBar.empty()) {
                        whiteBar = vis.svg.append("rect")
                            .attr("id", barId)
                            .attr("class", "white-bar")
                            .attr("fill", "white")
                            .attr("height", vis.y.bandwidth());
                    }

                    const initialX = d3.pointer(event, vis.svg.node())[0];
                    const initialWidth = vis.width - initialX;

                    whiteBar
                        .attr("x", initialX)
                        .attr("width", initialWidth)
                        .attr("height", vis.y.bandwidth());


                    const index = (vis.match.length - 1) / 2 - (vis.match.indexOf(dataPoint.year) - (vis.match.length - 1) / 2);

                    vis.updateBlackCircle(index, initialX);


                    function dragmove(event) {
                        const mouseX = d3.pointer(event, vis.svg.node())[0];
                        const newWidth = vis.width - mouseX;

                        whiteBar
                            .attr("x", mouseX)
                            .attr("width", newWidth);


                        vis.updateBlackCircle(index, mouseX);
                    }

                    function dragend() {
                        vis.svg.on("mousemove", null);
                        vis.svg.on("mouseup", null);
                    }

                    vis.svg.on("mousemove", dragmove);
                    vis.svg.on("mouseup", dragend);
                }
            });


    }

    resetVis() {
        let vis = this;

        vis.svg.selectAll(".white-bar")
            .attr("width", 0);

        vis.svg.selectAll(".stripe")
            .attr("fill-opacity", 1);

        vis.svg.selectAll(".black-circle")
            .attr("cx", vis.width);

        vis.updateVis();

    }


    calculateAverageDistance() {
        let vis = this;

        const blackCircles = vis.blackCircleGroup.selectAll(".black-circle").nodes();

        let totalDistance = 0;
        let count = 0;

        blackCircles.forEach((circle, i) => {
            const whiteBarId = "white-bar-" + i;
            const whiteBar = vis.svg.select("#" + whiteBarId);

            if (!whiteBar.empty()) {
                const circleX = +d3.select(circle).attr("cx");
                const whiteBarX = +whiteBar.attr("x") + (+whiteBar.attr("width")) / 2;

                totalDistance += Math.abs(circleX - whiteBarX);
                count++;
            }
        });

        if (count > 0) {
            vis.averageDistance = totalDistance / count;
            guessAccuracy = (1 - vis.averageDistance / vis.width);


            // console.log("accuracy " + (1 - vis.averageDistance) + " or " + (1 - vis.averageDistance / vis.width));
        }
    }

    finalizeVis() {
        let vis = this;

        vis.svg.selectAll(".y-axis .tick rect")
            .on("mouseover mousemove", null);

        vis.svg.selectAll(".white-bar")
            .transition()
            .duration(800)
            .attr("x", (d, i) => {
                const dataPoint = vis.data[vis.data.length - 1 - i];
                return vis.x(dataPoint.percent);
            })
            .attr("width", (d, i) => {
                const dataPoint = vis.data[vis.data.length - 1 - i];
                return vis.width - vis.x(dataPoint.percent);
            });


        vis.svg.selectAll(".stripe")
            .transition()
            .duration(800)
            .attr("fill-opacity", (d, i) => {
                const dataPoint = vis.data[vis.data.length - 1 - i];
                const newWidth = vis.width - vis.x(dataPoint.percent);

                return 1 - (newWidth / (vis.width * 1.5));
            })
            .on("end", function (d, i) {
                if (i === 0) {
                    vis.calculateAverageDistance();
                }
            });

    }
}