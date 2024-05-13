class MapVis {
    constructor(parentElement, geoData, mobilityData, stateData, pixelData) {
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.mobilityData = mobilityData;
        this.stateData = stateData;
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
            .attr("transform", "translate(" + (vis.margin.left + 250) + "," + (vis.margin.top + 50) + ")"); // Adjust these values

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

        vis.counties.transition().duration(6000)
            .attrTween("d", function (d, i) {
                const pixelIndex = i % vis.pixelData.length;
                const pixel = vis.pixelData[pixelIndex];
                const targetPath = `M${pixel.x * squareSize + 200},${pixel.y * squareSize} h${squareSize} v${squareSize} h${-squareSize} Z`;
                const interpolator = flubber.interpolate(this.getAttribute("d"), targetPath, {maxSegmentLength: 10});
                return function (t) {
                    return interpolator(t);
                };
            })
            .on("end", function (d, i) {
                const pixelIndex = i % vis.pixelData.length;
                const pixel = vis.pixelData[pixelIndex];
                d3.select(this)
                    .attr("fill", pixel.hex)  // Set fill directly instead of class for final color
                    .attr("class", null);     // Optionally remove the mobility class if no longer needed
                console.log(pixel);
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
    }
    updateVis() {
        let vis = this;
        // Optional: Define how to update the visualization when data changes
    }
}