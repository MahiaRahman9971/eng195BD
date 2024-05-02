class MapVis {

    // constructor method to initialize Timeline object
    constructor(parentElement, geoData, mobilityData, stateData) {
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.mobilityData = mobilityData;
        this.stateData = stateData;


        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 20, right: 0, bottom: 20, left: 0 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right,
            vis.height = vis.width * 0.375 ;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Converting TopoJSON data into GeoJSON data structure
        vis.geo = topojson.feature(vis.geoData, vis.geoData.objects.counties).features;

        // Drawing counties
        vis.viewpoint = {'width': 975, 'height': 610};
        vis.zoom = vis.width / vis.viewpoint.width * 0.65;

        let translate = [
            (vis.width - vis.viewpoint.width * vis.zoom) / 2,
            (vis.height - vis.viewpoint.height * vis.zoom) / 2
        ];

        // Adjusting map position
        vis.map = vis.svg.append("g")
            .attr("class", "counties")
            .attr('transform', `translate(${translate[0]},${translate[1]}) scale(${vis.zoom})`);

        vis.path = d3.geoPath();

        // Drawing the map
        vis.map.selectAll(".county")
            .data(vis.geo)
            .enter().append("path")
            .attr("class", "county")
            .attr("d", vis.path)
            .attr("class", d => handleGetMobility(d))
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);

        vis.statesGeo = topojson.feature(vis.stateData, vis.stateData.objects.states).features;

        // Draw state borders
        vis.map.append("g")
            .attr("class", "states")
            .selectAll("path")
            .data(vis.statesGeo)
            .enter().append("path")
            .attr("class", "state")
            .attr("d", vis.path)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", "2");

        function handleGetMobility (d) {
            for (let i = 0; i < vis.mobilityData.length; i++){
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


        var tooltip = d3.select("#" + vis.parentElement)
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "#fcfbfb")
            .style("color", "black")
            .style("border", "solid")
            .style("border-width", "0px")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("box-shadow", "2px 2px 20px")
            .attr("id", "tooltip");

        function handleMouseOver (event, d) {
            d3.select(this)
                .attr("stroke", "black") // Highlight border color
                .attr("stroke-width", "3"); // Increase border width to make it more noticeable

            tooltip
                .style("visibility", "visible")
                .style("top", (event.pageY) - 40 + "px").style("left", (event.pageX) + 10 + "px")
                .html("<center> " +  handleGetLocation(d.id) + " </center>");
        }

        let usStates = [
            "","Alabama","Alaska","","Arizona", "Arkansas", "California","","Colorado",
            "Connecticut", "Delaware","District of Columbia","Florida", "Georgia","","Hawaii", "Idaho",
            "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
            "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
            "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
            "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma",
            "Oregon", "Pennsylvania","", "Rhode Island", "South Carolina", "South Dakota",
            "Tennessee", "Texas", "Utah", "Vermont", "Virginia","","Washington",
            "West Virginia", "Wisconsin", "Wyoming"
        ];

        function handleGetLocation(x) {
            for (let i = 0; i < vis.mobilityData.length; i++) {
                if (x == vis.mobilityData[i].geoid) {
                    return vis.mobilityData[i].czname + ", " + usStates[(vis.mobilityData[i].state)] + ": " + Number(vis.mobilityData[i].kfr_pooled_pooled_p25).toLocaleString(undefined,{style: "percent", minimumFractionDigits:2});
                }
            }
        }

        function handleMouseOut (event, d) {
            d3.select(this)
                .attr("stroke", "none")
                .attr("stroke-width", "1"); // Revert border width back to normal

            tooltip.style("visibility", "hidden");
        };

        // Legend
        const legW = vis.width / 6;
        const legH = 20;
        const legendColors = [.35, .40, .42, .48, .50, .52, .55];

        let legend = vis.svg.append("g")
            .attr("transform", "translate(" + (vis.width * .75) + "," + (vis.height * .92) + ")")
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
            .call(xAxis);

        legend.append("text")
            .attr("x", legW / 2)
            .attr("y", legH + 40)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Percentage of Mobility");

        // Add a group for the descriptive text above the legend
        let legendDescriptionGroup = vis.svg.append("g")
            .attr("transform", "translate(" + (vis.width - legW / 2 - 125) + "," + ((vis.height * .92) - 80) + ")")
            .attr("id", "legend-description-group")
            .attr("text-anchor", "middle"); // Center the text

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
            .attr("x", 0) // Center the tspans
            .attr("dy", "1.2em") // Add space between lines
            .text(d => d);

        vis.wrangleData()
    }

    wrangleData() {
        let vis = this

        vis.updateVis();

    }

    updateVis() {
        let vis = this;

    }
}


