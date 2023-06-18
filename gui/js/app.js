import { ErrorToast } from "../svonk-util/util.js";
const maxBlinks = 60;
function updateCount() {
  try {
    // load the data from ./storage.json and print it to the console
    console.log("Loading data...");
    //send request
    let request = new XMLHttpRequest();
    request.open("GET", "./storage.json", false);
    request.send(null);
    // get request data
    let data = JSON.parse(request.responseText);
    console.log(data.blinkcounter);
    $("#progress-label").text(data.blinkcounter);

    $("#progress-fill").css("top", `${(1 - data.blinkcounter / maxBlinks) * 100}%`);
  } catch (err) {
    new ErrorToast("Failed to load data from storage.json", err?.code || err || "Unknown error");
    return;
  }
}
updateCount();
window.setInterval(updateCount, 500);
