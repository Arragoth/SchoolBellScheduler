// Array to store the scheduled times
let schedule = [];
let schedulerStarted = false;

// Function to add a new schedule
function addSchedule() {
  const timeInput = document.getElementById("time");
  const time = timeInput.value;

  if (!time) {
    alert("Please select a valid time.");
    return;
  }

  // Check if the time is already scheduled
  if (schedule.includes(time)) {
    alert("This time is already scheduled!");
    return;
  }

  // Add the time to the schedule
  schedule.push(time);

  // Update the schedule table
  updateScheduleTable();

  // Clear the input
  timeInput.value = "";
}

// Function to remove a scheduled time
function removeSchedule(index) {
  schedule.splice(index, 1);
  updateScheduleTable();
}

// Function to update the schedule table
function updateScheduleTable() {
  const tableBody = document.getElementById("scheduleTable");
  tableBody.innerHTML = "";

  schedule.forEach((time, index) => {
    const row = document.createElement("tr");

    const timeCell = document.createElement("td");
    timeCell.textContent = time;
    row.appendChild(timeCell);

    const actionCell = document.createElement("td");
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = () => removeSchedule(index);
    actionCell.appendChild(removeButton);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });
}

// Function to start the scheduler (required to comply with autoplay policy)
function startScheduler() {
  if (schedulerStarted) {
    alert("Scheduler is already running!");
    return;
  }

  const bellSound = document.getElementById("bellSound");
  bellSound.play().then(() => {
    bellSound.pause(); // Pause immediately after playing to initialize audio context
    console.log("Audio context initialized. Scheduler started!");
    schedulerStarted = true;

    // Update the status message
    const statusMessage = document.getElementById("status");
    statusMessage.textContent = "Scheduler is running...";
    statusMessage.style.color = "green";

    // Start checking for scheduled times
    setInterval(checkAndRingBell, 60000); // Check every minute
    alert("Scheduler started!");
  }).catch((error) => {
    console.error("Error initializing audio context:", error);
    alert("Please make sure your browser allows audio playback.");
  });
}

// Function to check and ring the bell at the scheduled times
function checkAndRingBell() {
  const currentTime = new Date();
  const currentHours = String(currentTime.getHours()).padStart(2, "0");
  const currentMinutes = String(currentTime.getMinutes()).padStart(2, "0");
  const currentFormattedTime = `${currentHours}:${currentMinutes}`;

  // Log the current time and timestamp
  console.log(`[${new Date().toLocaleTimeString()}] Current Time: ${currentFormattedTime}`);
  console.log(`[${new Date().toLocaleTimeString()}] Scheduled Times:`, schedule);

  // Check if the current time matches any scheduled time
  if (schedule.includes(currentFormattedTime)) {
    console.log(`[${new Date().toLocaleTimeString()}] Ringing bell at: ${currentFormattedTime}`);
    const bellSound = document.getElementById("bellSound");
    bellSound.play().catch((error) => {
      console.error(`[${new Date().toLocaleTimeString()}] Error playing sound:`, error);
      alert("Unable to play the bell sound. Check your audio settings or file path.");
    });
  }
}


// Function to test the bell sound
function testBell() {
  const bellSound = document.getElementById("bellSound");
  bellSound.play().then(() => {
    console.log("Test bell played successfully.");
  }).catch((error) => {
    console.error("Error playing sound:", error);
    alert("Unable to play the bell sound. Check your audio settings or file path.");
  });
}
