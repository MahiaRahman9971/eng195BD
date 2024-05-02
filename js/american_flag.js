let svgContainer = document.getElementById('section-flag');
let svgWidth = svgContainer.clientWidth;
let svgHeight = svgContainer.clientHeight;

let svg = d3.select('#section-flag').append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .style('z-index', '1');

// Draw Stripes
let stripeHeight = 100 / 13;
for (let i = 0; i < 13; i++) {
    svg.append('rect')
        .attr('width', '100%')
        .attr('height', stripeHeight + '%')
        .attr('y', (stripeHeight * i) + '%')
        .attr('fill', i % 2 === 0 ? '#a02e32' : 'white')
        .style('animation', i % 2 === 0 ? 'fadeToWhiteFromRed 5s linear forwards' : '');
}

// Draw Blue Field
let blueHeight = stripeHeight * 7;
svg.append('rect')
    .attr('width', '40%')
    .attr('height', blueHeight + '%')
    .attr('fill', '#195473')
    .style('animation', 'fadeToWhiteFromBlue 5s linear forwards');

// Group for stars
let starGroup = svg.append('g')
    .attr('class', 'star-group')
    .attr('transform', 'translate(-15, -10)');

// Star spacing
let starSpacingX = (svgWidth * 0.65) / 10;
let starSpacingY = (svgHeight * stripeHeight * 0.7) / 100;

// Drawing stars
for (let row = 0; row < 9; row++) {
    for (let col = 0; col < (row % 2 === 0 ? 6 : 5); col++) {
        let xPosition = (col + ((row % 2 === 0) ? 0.5 : 1)) * starSpacingX;
        let yPosition = row * starSpacingY + (stripeHeight * svgHeight * 0.01);

        starGroup.append('text')
            .attr('class', 'star')
            .text('\u2605')
            .attr('x', xPosition)
            .attr('y', yPosition)
            .attr('font-size', '40px')
            .attr('fill', 'white');
    }
}
