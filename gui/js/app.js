const updateDuration = 500;

function init() {
  var ctx2 = document.getElementById("smoolchart").getContext("2d");
  var chart2 = new Chart(ctx2, {
    type: "line",
    data: {
      labels: ["7am", "8am", "9am", "10am", "11am", "12pm"],
      datasets: [
        {
          fill: "origin",
          lineTension: 0.5,
          label: "Average Blink Frequency",
          backgroundColor: "#46347fcc",
          borderWidth: 0,
          data: [38, 20, 42, 35, 46, 29, 0],
          elements: {
            point: {
              radius: 0,
            },
          },
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      tooltips: {
        enabled: false,
      },
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          // end at 60
          max: 60,
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            display: false,
          },
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            display: false,
          },
        },
      },
    },
  });

  var ctx3 = document.getElementById("piChart").getContext("2d");
  var pieData = {
    labels: ["Elapsed screen time", "Remaining recommended screen time"],
    datasets: [
      {
        data: [30, 70],
        backgroundColor: ["#46347fcc", "#545988aa"],
        borderColor: "#545988aa",
        borderWidth: 1,
      },
    ],
  };

  var pieChart = new Chart(ctx3, {
    type: "doughnut",
    data: pieData,
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      tooltips: {
        enabled: false,
      },
      cutoutPercentage: 70,
      responsive: true,
    },
  });

  var ctx = document.getElementById("myChart").getContext("2d");
  var chart = new Chart(ctx, {
    // disable animation
    animation: {
      duration: 0,
    },
    type: "line",
    data: {
      labels: ["7am", "8am", "9am", "10am", "11am", "12pm"],
      datasets: [
        {
          label: "Average Blink Frequency",
          backgroundColor: "#142127",
          borderColor: "#4d5175",
          data: [3, 5, 8, 5, 6, 9, 7],
          elements: {
            point: {
              radius: 5,
              borderWidth: 2,
            },
          },
        },
        {
          label: "Baseline Blink Frequency",
          backgroundColor: "#142127",
          borderColor: "rgb(50,53,69)",
          data: Array(10).fill(5),
          elements: {
            point: {
              radius: 0,
            },
          },
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      tooltips: {
        enabled: false,
      },
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          gridLines: {
            color: "#142127",
          },
          grid: {
            display: false,
            drawBorder: false,
          },
          // hide labels
          ticks: {
            display: false,
          },
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
        },
      },
    },
  });

  pieData.datasets[0].data[0] = 40;
  pieData.datasets[0].data[1] = 60;
  pieChart.update();
  return [chart, chart2];
}

// running page

import { ErrorToast } from "../svonk-util/util.js";
let maxBlinks = 60;
function updateCount(inputChart1, inputChart2) {
  try {
    // load the data from ./storage.json and print it to the console
    console.log("Loading data...");
    //send request
    let request = new XMLHttpRequest();
    request.open("GET", "./storage.json", false);
    request.send(null);
    // get request data
    let data = JSON.parse(request.responseText);
    console.log(data);
    let blinks = data?.blinkcounter || 0;
    maxBlinks = data?.maxblinks || 250;
    if (!data?.blinkcounter && data?.blinkcounter !== 0) {
      console.warn("Blinks are undefined");
    }
    inputChart2.data.datasets[0].data = data?.blinkhistory || [];

    $("#progress-label").text(blinks);
    $("#progress-fill").css("top", `${(1 - Math.min(blinks / maxBlinks, 1.1)) * 100}%`);

    // update the chart2 to have the last data point be the blink count
  } catch (err) {
    new ErrorToast(
      "Failed to load data from storage.json",
      err?.code || err || "Unknown error",
      updateDuration
    );
    return;
  }
}
function updateCharts(charts) {
  for (let chart of charts) {
    chart.update();
  }
}
$(document).ready(() => {
  let chartRefs = init();
  updateCount(...chartRefs);

  updateCharts(chartRefs);
  window.setInterval(() => {
    updateCount(...chartRefs);
  }, updateDuration);
  // every 10 normal updates, update the graph
  window.setInterval(() => {
    updateCharts(chartRefs);
  }, updateDuration * 10);
});
// setup graphs
