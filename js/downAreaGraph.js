
let downgraphsvgContainer = document.getElementById('downgraph-vis');

let downgraphsvgWidth = downgraphsvgContainer.clientWidth;
let downgraphsvgHeight = downgraphsvgContainer.clientHeight;

let downsvg = d3.select('#downgraph-vis').append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .style('z-index', '1');

let downpromises = [
    d3.csv("data/downGraph.csv", d => {
        d.perf = +d.perf;
        d.year = +d.year;
        return d;
    })
];


Promise.all(downpromises)
    .then(function (data) {
        downcreateVis(data[0])
    })
    .catch(function (err) {
        console.log(err)
    });


function downcreateVis(data) {

    const downObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                downanimateAreaGraph();
                downObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    downObserver.observe(downgraphsvgContainer);

    function downanimateAreaGraph() {
        const xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.year), d3.max(data, d => d.year)])
            .range([0, downgraphsvgWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.perf)])
            .range([downgraphsvgHeight, 0]);

        const area = d3.area()
            .x(d => xScale(d.year))
            .y0(downgraphsvgHeight)
            .y1(d => yScale(d.perf));


        const gradient = downsvg.append("defs")
            .append("linearGradient")
            .attr("id", "downarea-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", downgraphsvgHeight)
            .attr("x2", 0).attr("y2", 0);

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "white");

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#bdf1eb");

        const mask = downsvg.append("defs")
            .append("mask")
            .attr("id", "downarea-mask");

        mask.append("rect")
            .attr("width", 0)
            .attr("height", downgraphsvgHeight)
            .attr("fill", "white");

        const areaPath = downsvg.append("path")
            .datum(data)
            .attr("fill", "url(#downarea-gradient)")
            .attr("d", area)
            .attr("mask", "url(#downarea-mask)");

        mask.select("rect")
            .transition()
            .duration(5000)
            .ease(d3.easeLinear)
            .attr("width", downgraphsvgWidth);
    }
}
