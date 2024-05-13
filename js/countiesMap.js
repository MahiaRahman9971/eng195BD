class MapVis {
    constructor(parentElement, geoData, mobilityData, pixelData) {
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.mobilityData = mobilityData;
        this.pixelData = pixelData;
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 0, right: 0, bottom: 0, left: 0};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = vis.width * 0.5;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + (vis.margin.left + 250) + "," + (vis.margin.top) + ")"); // Adjust these values

        vis.geo = topojson.feature(vis.geoData, vis.geoData.objects.counties).features;
        vis.path = d3.geoPath();

        const numItems = vis.geo.length;
        const numCols = Math.ceil(Math.sqrt(numItems));
        const numRows = numCols;
        const squareSize = 10;

        vis.counties = vis.svg.append("g")
            .attr("class", "counties")
            .selectAll(".county")
            .data(vis.geo)
            .enter().append("path")
            .attr("class", d => "county " + handleGetMobility(d))
            .attr("d", vis.path)
            .attr("opacity", 1);

        vis.counties.transition().duration(15000)
            .delay(5000)
            .ease(d3.easeCubic)  // Using a cubic easing for smoother transitions
            .attrTween("d", function (d, i) {
                const pixelIndex = i % vis.pixelData.length;
                const pixel = vis.pixelData[pixelIndex];
                const initialColor = d3.select(this).style("fill");
                const targetColor = pixel.hex;
                const targetPath = `M${pixel.x * squareSize + 150},${pixel.y * squareSize} h${squareSize} v${squareSize} h${-squareSize} Z`;
                const pathInterpolator = flubber.interpolate(this.getAttribute("d"), targetPath, {maxSegmentLength: 10});
                const colorInterpolator = d3.interpolateRgb(initialColor, targetColor);

                return function (t) {
                    this.setAttribute("fill", colorInterpolator(Math.sqrt(t)));  // Apply a non-linear progression for color
                    return pathInterpolator(t);  // Apply linear progression for shape
                };
            })
            .on("end", function (d, i) {
                const pixelIndex = i % vis.pixelData.length;
                const pixel = vis.pixelData[pixelIndex];
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("fill", pixel.hex)
                    .attr("class", null);
            });

        function handleGetMobility(d) {
            for (let i = 0; i < vis.mobilityData.length; i++) {
                if (d.id == vis.mobilityData[i].geoid) {
                    return handleGetColor(vis.mobilityData[i].kfr_pooled_pooled_p25);
                }
            }
        }

        function handleGetColor(x) {
            if (x <= .35) {
                return "color-01";
            } else if (x > .35 && x <= .37) {
                return "color-02";
            } else if (x > .37 && x <= .39) {
                return "color-03";
            } else if (x > .39 && x <= .41) {
                return "color-04";
            } else if (x > .41 && x <= .43) {
                return "color-05";
            } else if (x > .43 && x <= .45) {
                return "color-06";
            } else if (x > .45 && x <= .47) {
                return "color-07";
            } else if (x > .47 && x <= .49) {
                return "color-08";
            } else if (x > .49 && x <= .50) {
                return "color-09";
            } else if (x > .50 && x <= .54) {
                return "color-10";
            } else if (x > .54) {
                return "color-11";
            } else {
                return "color-error";
            }
        }

        // Legend
        const legW = vis.width / 6;
        const legH = 20;
        const legendColors = [.35, .40, .42, .48, .50, .52, .55];

        let legend = vis.svg.append("g")
            .attr("transform", "translate(" + (vis.width * .50 + 150) + "," + (vis.height * .85 - 50) + ")") // Move up
            .attr("id", "legend");

        let xScale = d3.scaleLinear()
            .domain([0, 70])
            .range([0, legW]);

        let xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(9)
            .tickSize(30)
            .tickFormat((d, i) => ['35%', '40%', '42%', '44%', '46%', '48%', '50%', '55%'][i]);

        legend.selectAll("rect")
            .data(legendColors)
            .enter()
            .append("rect")
            .attr("width", legW / legendColors.length)
            .attr("height", legH)
            .attr("x", (d, i) => i * (legW / legendColors.length))
            .attr("class", d => handleGetColor(d));

        legend.append("g")
            .attr("transform", "translate(0, -10)") // Move axis text up by 10 pixels
            .call(xAxis);

        legend.append("text")
            .attr("x", legW / 2)
            .attr("y", legH + 30)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Percentage of Mobility");

        // Add a group for the descriptive text above the legend
        let legendDescriptionGroup = vis.svg.append("g")
            .attr("transform", "translate(" + (vis.width * 0.50 - 125) + "," + ((vis.height * .85) - 140) + ")") // Adjust position
            .attr("id", "legend-description-group")
            .attr("text-anchor", "middle");

        // Append text with multiple tspans for line breaks
        legendDescriptionGroup.append("text")
            .style("font-size", "10px") // Smaller font size
            .selectAll("tspan")
            .data([
                "Mean household income rank for children whose parents were",
                "at the 25th percentile of the national income distribution.",
                "Incomes for children were measured as meanearnings in",
                "2014-2015 when they were between the ages 31-37. Household",
                " income is defined as the sum of own and spouse’s income."
            ])
            .enter()
            .append("tspan")
            .attr("x", 390) // Center the tspans
            .attr("dy", "1.2em") // Add space between lines
            .text(d => d);
    }
    updateVis() {
        let vis = this;
        // Optional: Define how to update the visualization when data changes
    }
}