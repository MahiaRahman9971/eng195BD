let userGuess;
let ladderVis;
let mapVis;
let moveGraphs;
let slideVal = 0;
let slideBounds = [0,500];
let guessAccuracy = 0;

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
];


Promise.all(promises)
    .then(function (data) {
        createVis(data)
    })
    .catch(function (err) {
        console.log(err)
    });


function createVis(data) {

    // Flag Vis
    userGuess = new UserGuess("flag", data[0]);
    document.getElementById("final-button").addEventListener("click", function() {
        userGuess.finalizeVis();
    });
    document.getElementById("reset-button").addEventListener("click", function() {
        userGuess.resetVis();
    });


    // Map Vis
    mapVis = new MapVis("map-vis", data[2], data[3], data[6])

    // Ladder Vis
    ladderVis = new LadderVis("ladder-vis", data[1]);

    // Stick Figure Vis
    stickFigureVis = new StickFigureVis("stick-figure-vis", data[1]);

    moveGraphs = new MoveGraphs("graphs", data[4], data[5]);

    childMove = new ChildMove("child-slider");

    document.getElementById("final-button").addEventListener("click", function() {
        userGuess.finalizeVis();
    });
    document.getElementById("reset-button").addEventListener("click", function() {
        userGuess.resetVis();
    });
}


function newSelection(category, value) {
    const container = document.getElementById(category + 'SelectorLadder');
    const selectedButton = container.querySelector('button.selected');

    if (selectedButton) {
        selectedButton.classList.remove('selected');
    }

    const clickedButton = event.currentTarget;
    clickedButton.classList.add('selected');

    const selectedValue = document.getElementById(category + value).value;
    console.log(`Selected value for ${category}: ${selectedValue}`);
    // Use the selectedValue as needed in your JavaScript logic
    if (category === "race") {
        ladderVis.race = selectedValue;
    } else if (category === "gender") {
        ladderVis.gender = selectedValue;
    } else {
        ladderVis.percentile = selectedValue;
    }
    ladderVis.wrangleData();
}


function newSelection2() {
    stickFigureVis.race = document.getElementById('raceSelector').value;
    stickFigureVis.gender = document.getElementById('genderSelector').value;
    stickFigureVis.percentile = document.getElementById('percentileSelector').value;
    stickFigureVis.wrangleData();
}

