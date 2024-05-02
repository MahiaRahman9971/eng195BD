class MoveGraphs {

    constructor(_parentElement, _edata, _qdata) {
        this.parentElement = _parentElement;
        this.earningsData = _edata;
        this.qualityData = _qdata;

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 100, right: 20, bottom: 20, left: 60 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right,
            vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        console.log("w " + vis.width + " h " + vis.height);

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // console.log("earnings", vis.earningsData);
        // console.log("quality", vis.qualityData);

        vis.xScaleEarnings = d3.scaleBand()
            .domain(vis.earningsData.map(d => d.location))
            .range([0, vis.width / 4])
            .padding(0.1);

        vis.yScaleEarnings = d3.scaleLinear()
            .domain([0, d3.max(vis.earningsData, d => d.earnings)])
            .range([vis.height, 0]);

        vis.xAxisEarnings = d3.axisBottom(vis.xScaleEarnings);
        vis.yAxisEarnings = d3.axisLeft(vis.yScaleEarnings)
            .tickSize(5)
            .tickFormat(d3.format("$,.0f"));

        vis.leftGraph = vis.svg.append("g")
            .attr("class", "left-graph")
            .attr("transform", "translate(0, 0)");

        vis.leftGraph.selectAll(".bar")
            .data(vis.earningsData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => vis.xScaleEarnings(d.location))
            .attr("y", d => vis.yScaleEarnings(d.earnings))
            .attr("width", vis.xScaleEarnings.bandwidth())
            .attr("height", d => vis.height - vis.yScaleEarnings(d.earnings))
            .attr("fill", "none")
            .attr("stroke", "black");

        vis.leftGraph.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(vis.xAxisEarnings);

        vis.leftGraph.append("g")
            .attr("class", "earnings-y-axis")
            .call(vis.yAxisEarnings);

        vis.leftGraph.select(".earnings-y-axis").append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", vis.height)
            .attr("stroke", "black");

        vis.leftGraph.append("text")
            .attr("x", 0)
            .attr("y", -vis.margin.top / 2)
            .attr("text-anchor", "start")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text("Locational Affect on Lifetime Earnings");



        vis.xScaleQuality = d3.scaleBand()
            .domain(vis.qualityData.map(d => d.location))
            .range([vis.width / 2, vis.width * 3 / 4])
            .padding(0.1);

        vis.yScaleQuality = d3.scaleOrdinal()
            .domain(["", "Low Quality", "High Quality"])
            .range([vis.height, vis.height / 2, 0]);

        vis.xAxisQuality = d3.axisBottom(vis.xScaleQuality);
        vis.yAxisQuality = d3.axisLeft(vis.yScaleQuality)
            .ticks(3)
            .tickSize(5);

        vis.rightGraph = vis.svg.append("g")
            .attr("class", "right-graph")
            .attr("transform", "translate(" + (vis.width / 2) + ", 0)");

        vis.rightGraph.selectAll(".bar")
            .data(vis.qualityData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => vis.xScaleQuality(d.location) - vis.width / 2)
            .attr("y", d => vis.yScaleQuality(d.quality))
            .attr("width", vis.xScaleQuality.bandwidth())
            .attr("height", d => vis.height - vis.yScaleQuality(d.quality))
            .attr("fill", "none")
            .attr("stroke", "black");

        vis.rightGraph.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(" + (0 - vis.width / 2) + "," + vis.height + ")")
            .call(vis.xAxisQuality);

        vis.rightGraph.append("g")
            .attr("class", "quality-y-axis")
            .call(vis.yAxisQuality);

        vis.rightGraph.select(".quality-y-axis").append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", vis.height)
            .attr("stroke", "black");

        vis.rightGraph.append("text")
            .attr("x", 0)
            .attr("y", -vis.margin.top / 2)
            .attr("text-anchor", "start")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text("Locational Affect on Neighborhood Quality");


        vis.leftGraph.selectAll(".bars")
            .data([vis.earningsData[0]])
            .enter()
            .append("rect")
            .attr("class", "earnings-fill-bar")
            .attr("x", d => vis.xScaleEarnings(d.location))
            .attr("y", d => vis.yScaleEarnings(d.earnings))
            .attr("width", vis.xScaleEarnings.bandwidth())
            .attr("height", d => vis.height - vis.yScaleEarnings(d.earnings))
            .attr("fill", "black");

        vis.rightGraph.selectAll(".bars")
            .data([vis.qualityData[0]])
            .enter()
            .append("rect")
            .attr("class", "quality-fill-bar")
            .attr("x", d => vis.xScaleQuality(d.location) - vis.width / 2)
            .attr("y", d => vis.yScaleQuality(d.quality))
            .attr("width", vis.xScaleQuality.bandwidth())
            .attr("height", d => vis.height - vis.yScaleQuality(d.quality))
            .attr("fill", "black");

        vis.slideScale = d3.scaleLinear()
            .domain(slideBounds)
            .range([0,vis.xScaleEarnings(vis.earningsData[1].location) - vis.xScaleEarnings(vis.earningsData[0].location)]);

        vis.earningsYScale = d3.scaleLinear()
            .domain(slideBounds)
            .range([vis.yScaleEarnings(vis.earningsData[0].earnings), vis.yScaleEarnings(vis.earningsData[1].earnings)]);

        vis.earningsHeightScale = d3.scaleLinear()
            .domain(slideBounds)
            .range([vis.height - vis.yScaleEarnings(vis.earningsData[0].earnings), vis.height - vis.yScaleEarnings(vis.earningsData[1].earnings)]);


        vis.qualityYScale = d3.scaleLinear()
            .domain(slideBounds)
            .range([vis.yScaleQuality(vis.qualityData[0].quality), vis.yScaleQuality(vis.qualityData[1].quality)]);

        vis.qualityHeightScale = d3.scaleLinear()
            .domain(slideBounds)
            .range([vis.height - vis.yScaleQuality(vis.qualityData[0].quality), vis.height - vis.yScaleQuality(vis.qualityData[1].quality)]);


        vis.colorScale = d3.scaleLinear()
            .domain(slideBounds)
            .range(["#9b252f", "#34687e"]);

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.svg.selectAll(".earnings-fill-bar")
            .attr("x", vis.xScaleEarnings(vis.earningsData[0].location) + vis.slideScale(slideVal))
            .attr("y", vis.earningsYScale(slideVal))
            .attr("height", vis.earningsHeightScale(slideVal))
            .attr("fill", vis.colorScale(slideVal));

        vis.svg.selectAll(".quality-fill-bar")
            .attr("x", vis.xScaleQuality(vis.qualityData[0].location) + vis.slideScale(slideVal) - vis.width / 2)
            .attr("y", vis.qualityYScale(slideVal))
            .attr("height", vis.qualityHeightScale(slideVal))
            .attr("fill", vis.colorScale(slideVal));
    }
}
