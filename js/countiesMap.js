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

        // Setup visualization parameters
        vis.margin = {top: 0, right: 0, bottom: 0, left: 0};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = vis.width * 0.5;

        // Create SVG canvas
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + (vis.margin.left + 250) + "," + (vis.margin.top + 50) + ")");

        // Prepare county and pixel data
        vis.geo = topojson.feature(vis.geoData, vis.geoData.objects.counties).features;
        vis.path = d3.geoPath();

        vis.counties = vis.svg.append("g")
            .attr("class", "counties")
            .selectAll(".county")
            .data(vis.geo)
            .enter().append("path")
            .attr("class", d => "county " + handleGetMobility(d))
            .attr("d", vis.path)
            .attr("opacity", 1);

        // Color matching and animation function
        vis.counties.each(function(d, i) {
            const countyElement = d3.select(this);
            setTimeout(() => {
                const currentCountyColor = d3.rgb(countyElement.style("fill")); // Get RGB values from style
                const pixelIndex = i % vis.pixelData.length;
                const pixel = vis.pixelData[pixelIndex];
                const pixelColor = hexToRgb(pixel.hex); // Convert hex to RGB

                // Use a very high tolerance to include all counties
                if (colorSimilar(currentCountyColor, pixelColor, 255)) { // Maximum tolerance
                    const initialPath = this.getAttribute("d");
                    const targetPath = `M${pixel.x * 10 + 200},${pixel.y * 10} h10 v10 h-10 Z`;

                    const interpolator = flubber.interpolate(initialPath, targetPath, {maxSegmentLength: 10});

                    countyElement.transition().duration(6000)
                        .attrTween("d", function() {
                            return function(t) { return interpolator(t); };
                        })
                        .on("end", function() {
                            countyElement
                                .attr("fill", pixel.hex)
                                .attr("class", null);
                        });
                }
            }, 1000);
        });

        function handleGetMobility(d) {
            for (let i = 0; i < vis.mobilityData.length; i++) {
                if (d.id == vis.mobilityData[i].geoid) {
                    return handleGetColor(vis.mobilityData[i].kfr_pooled_pooled_p25);
                }
            }
        }

        function handleGetColor(x) {
            if (x <= .35) return "color-01";
            else if (x > .35 && x <= .37) return "color-02";
            else if (x > .37 && x <= .39) return "color-03";
            else if (x > .39 && x <= .41) return "color-04";
            else if (x > .41 && x <= .43) return "color-05";
            else if (x > .43 && x <= .45) return "color-06";
            else if (x > .45 && x <= .47) return "color-07";
            else if (x > .47 && x <= .49) return "color-08";
            else if (x > .49 && x <= .50) return "color-09";
            else if (x > .50 && x <= .54) return "color-10";
            else if (x > .54) return "color-11";
            else return "color-error"; // Fallback color
        }
    }

    updateVis() {
        let vis = this;
        // Define how to update the visualization when data changes
    }
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Function to check if two colors are similar within a given tolerance
function colorSimilar(rgb1, rgb2, tolerance) {
    // Setting tolerance to the maximum difference in RGB channels, effectively always returning true
    return Math.abs(rgb1.r - rgb2.r) <= tolerance &&
        Math.abs(rgb1.g - rgb2.g) <= tolerance &&
        Math.abs(rgb1.b - rgb2.b) <= tolerance;
}