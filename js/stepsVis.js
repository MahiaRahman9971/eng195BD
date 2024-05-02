// // Set the dimensions for the svg2 container
// let width = 600; // Adjust as necessary
// let height = 200; // Adjust as necessary
//
// // Select the svg2 element and set its size
// let svg22 = d3.select('#stepsVisualization')
//     .attr('width', width)
//     .attr('height', height);
//
// // Data for the steps (heights and widths)
// let stepsData = [
//     { width: 100, height: 20 },
//     { width: 150, height: 40 },
//     { width: 200, height: 60 }
// ];
//
// // Create the steps
// let steps = svg2.selectAll('.step')
//     .data(stepsData)
//     .enter()
//     .append('rect')
//     .attr('class', 'step')
//     .attr('x', (d, i) => i * 100) // Adjust spacing as necessary
//     .attr('y', d => height - d.height)
//     .attr('width', d => d.width)
//     .attr('height', d => d.height)
//     .style('fill', '#ccc'); // Style as needed
//
// // Create the ball
// let ball = svg2.append('circle')
//     .attr('cx', 10) // Starting x position
//     .attr('cy', height - 30) // Starting y position
//     .attr('r', 10) // Radius of the ball
//     .style('fill', 'steelblue'); // Style as needed
//
// // Animate the ball
// function animateBall() {
//     ball.transition()
//         .duration(500)
//         .attr('cy', d => height - 60) // Adjust as necessary
//         .transition()
//         .duration(500)
//         .attr('cy', d => height - 30) // Adjust as necessary
//         .on('end', animateBall); // Loop the animation
// }
//
// animateBall(); // Start the animation
