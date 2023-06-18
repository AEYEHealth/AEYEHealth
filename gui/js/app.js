window.onload = function () {
  var ctx = document.getElementById("myChart").getContext("2d");
  var chart = new Chart(ctx, {
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  let eyeStrainPercentage = 0;

  setInterval(() => {
    //  actual calc that does the thingy with the thingy for eyeStrainPercentage
    var eyeHealth = 85;

    document.getElementById("eyeHealthPercentage").innerText = eyeHealth + "%";

    eyeStrainPercentage = (eyeStrainPercentage + 1) % 101;

    const progressBar = document.getElementById("progress-bar");
    const progressLabel = document.getElementById("progress-label");

    progressBar.style.width = `${eyeStrainPercentage}%`;
    progressLabel.innerText = `${eyeStrainPercentage}%`;
  }, 1000); // updates ev 1 sec

  // create wavy graph
  createWavyGraph();
};
function createWavyGraph() {
  // Data to plot
  let data = [
    { x: 0, y: 30 },
    { x: 1, y: 20 },
    { x: 2, y: 50 },
    { x: 3, y: 40 },
    { x: 4, y: 60 },
    { x: 5, y: 30 },
    // Continue this list with your data
  ];

  // Set the dimensions and margins of the graph
  let margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  // Append the svg object to the body of the page
  let svg = d3
    .select("#waveyGraph")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  let x = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.x)])
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  let y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.y)])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Add the area
  svg
    .append("path")
    .datum(data)
    .attr("fill", "#cce5df")
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .area()
        .x((d) => x(d.x))
        .y0(height)
        .y1((d) => y(d.y))
    );
}
