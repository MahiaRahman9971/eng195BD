let mapVis;
let pixelVis;
let slideVal = 0;
let slideBounds = [0, 500];
let guessAccuracy = 0;

// Define promises for data loading
let promises = [
    d3.csv("data/upwardMobility.csv", d => {
        d.year = +d.year;
        d.percent = +d.percent * 100;
        return d;
    }),
    d3.csv("data/filtered_tract_outcomes_early.csv"),
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json"),
    d3.csv("data/mobility_counties.csv"),
    d3.csv("data/locationBasedEarnings.csv", d => {
        d.earnings = +d.earnings;
        return d;
    }),
    d3.csv("data/locationBasedNeighborhood.csv"),
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"),
    d3.csv("data/newImgData2.csv", d => {
        d.x = +d.x;
        d.y = +d.y;
        d.r = +d.r;
        d.g = +d.g;
        d.b = +d.b;
        return d;
    })
];

// Load all data using Promise.all
Promise.all(promises)
    .then(function (data) {
        createVis(data);
    })
    .catch(function (err) {
        console.error("Error loading data: ", err);
    });

// Function to initialize the visualizations after data is loaded
function createVis(data) {
    console.log("Data loaded", data);  // Check if data is correctly passed
    mapVis = new MapVis("map-vis", data[2], data[3], data[6], data[7]); // Pass the pixel data as the last argument
}