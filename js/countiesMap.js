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

        // Setup margins and canvas dimensions
        vis.margin = { top: 10, right: 0, bottom: 10, left: 0 };
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = vis.width * 0.5; // Height set as half of width for aspect ratio

        // Create SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

        // Convert TopoJSON to GeoJSON (for easier handling)
        vis.geo = topojson.feature(vis.geoData, vis.geoData.objects.counties).features;

        // Create path generator
        vis.path = d3.geoPath();

        // Determine the number of duplicates for each county
        let duplicatesPerCounty = Math.floor(vis.pixelData.length / vis.geo.length);
        let expandedCounties = [];

        // Duplicate each county's data to match the number of pixels needed
        vis.geo.forEach(county => {
            for (let i = 0; i < duplicatesPerCounty; i++) {
                expandedCounties.push({...county});
            }
        });

        // Initialize each county path
        vis.counties = vis.svg.selectAll(".county")
            .data(expandedCounties)
            .enter().append("path")
            .attr("class", "county")
            .attr("d", vis.path)
            .attr("fill", (d, i) => {
                const pixelIndex = i % vis.pixelData.length;
                const pixel = vis.pixelData[pixelIndex];
                return `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`; // Initial color from pixel data
            });

        // Transition counties to form the pixelated image
        vis.counties.transition().duration(6000)
            .attrTween("d", function (d, i) {
                const pixelIndex = i % vis.pixelData.length;
                const pixel = vis.pixelData[pixelIndex];
                const squareSize = 1; // Size of each "pixel"
                const targetPath = `M${pixel.x},${pixel.y} h${squareSize} v${squareSize} h${-squareSize} Z`;

                const interpolator = flubber.interpolate(this.getAttribute("d"), targetPath, { maxSegmentLength: 10 });
                return function (t) {
                    return interpolator(t);
                };
            })
            .attr("opacity", 0.7) // Adjust opacity as needed
            .end() // Ensure transitions end properly
            .catch(error => console.error('Error during transition:', error));
    }
}

// Initialization and data loading logic would be handled in a separate script, typically your main.js