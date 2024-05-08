class MapVis {
    // Constructor method to initialize MapVis object
    constructor(parentElement, geoData, mobilityData, stateData) {
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.mobilityData = mobilityData;
        this.stateData = stateData;

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 10, right: 0, bottom: 10, left: 0 };
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = vis.width * 0.5; // Changed the aspect ratio to increase the height

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Converting TopoJSON data into GeoJSON data structure
        vis.geo = topojson.feature(vis.geoData, vis.geoData.objects.counties).features;

        // Setting up path
        vis.path = d3.geoPath()

        // Initial placement of counties
        vis.counties = vis.svg.append("g")
            .attr("class", "counties")
            .selectAll(".county")
            .data(vis.geo)
            .enter().append("path")
            .attr("class", "county")
            .attr("d", vis.path)
            .attr("class", d => handleGetMobility(d))
            .attr("opacity", 1); // Start fully visible

        // Move counties to the right edge
        // Transition counties to squares and move to the right edge
        vis.counties.transition().duration(6000)
            .attrTween("d", function(d) {
                const node = d3.select(this);
                const bounds = vis.path.bounds(d);
                const initialWidth = bounds[1][0] - bounds[0][0];
                const initialHeight = bounds[1][1] - bounds[0][1];
                const size = Math.min(initialWidth, initialHeight); // Fixed size for the square for simplicity
                const initialCenterX = (bounds[0][0] + bounds[1][0]) / 2;
                const initialCenterY = (bounds[0][1] + bounds[1][1]) / 2;

                const initialPath = node.attr("d");

                return function(t) {
                    // Calculate new center X position as t interpolates from 0 to 1
                    const newCenterX = initialCenterX + t * (vis.width - initialCenterX + size); // Adjust so it moves rightwards

                    // Define target path using new center X position
                    const targetPath = `M${newCenterX - size/2},${initialCenterY - size/2} h${size} v${size} h${-size} Z`;

                    // Use flubber to interpolate between initial and target path
                    const interpolator = flubber.interpolate(initialPath, targetPath, { maxSegmentLength: 10 });

                    // Return interpolated path at time t
                    return interpolator(t);
                };
            })
            .attr("opacity", 0.7) // Fade slightly but not completely
            .end() // Ensures the next transition only starts after the first one completes
            .catch(error => console.error('Error during transition:', error));

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
        // Optional: Define how to update the visualization when data changes
        let vis = this;
    }
}
