
let upgraphsvgContainer = document.getElementById('upgraph-vis');

let upgraphsvgWidth = upgraphsvgContainer.clientWidth;
let upgraphsvgHeight = upgraphsvgContainer.clientHeight;

let upsvg = d3.select('#upgraph-vis').append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .style('z-index', '1');

let uppromises = [
    d3.csv("data/upGraph.csv", d => {
        d.perf = +d.perf;
        d.year = +d.year;
        return d;
    })
];


Promise.all(uppromises)
    .then(function (data) {
        upcreateVis(data[0])
    })
    .catch(function (err) {
        console.log(err)
    });


function upcreateVis(data) {

    const upObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                upanimateAreaGraph();
                upObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    upObserver.observe(upgraphsvgContainer);

    function upanimateAreaGraph() {
        const xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.year), d3.max(data, d => d.year)])
            .range([0, upgraphsvgWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.perf)])
            .range([upgraphsvgHeight, 0]);

        const area = d3.area()
            .x(d => xScale(d.year))
            .y0(upgraphsvgHeight)
            .y1(d => yScale(d.perf));


        const gradient = upsvg.append("defs")
            .append("linearGradient")
            .attr("id", "uparea-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", upgraphsvgHeight)
            .attr("x2", 0).attr("y2", 0);

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "white");

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#bdf1eb");

        const mask = upsvg.append("defs")
            .append("mask")
            .attr("id", "uparea-mask");

        mask.append("rect")
            .attr("width", 0)
            .attr("height", upgraphsvgHeight)
            .attr("fill", "white");

        const areaPath = upsvg.append("path")
            .datum(data)
            .attr("fill", "url(#uparea-gradient)")
            .attr("d", area)
            .attr("mask", "url(#uparea-mask)");

        mask.select("rect")
            .transition()
            .duration(5000)
            .ease(d3.easeLinear)
            .attr("width", upgraphsvgWidth);
    }



}
