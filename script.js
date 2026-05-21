// Array to store the scheduled times
let schedule = JSON.parse(localStorage.getItem("schedule")) || [];
let schedulerStarted = false;

// Function to add a new schedule
function addSchedule() {
  const timeInput = document.getElementById("time").value;
  const dateInput = document.getElementById("date").value;
  const dayCheckboxes = document.querySelectorAll(".day-checkbox");

  if (!timeInput) {
    alert("Please select a valid time.");
    return;
  }

  // Collect selected days
  const selectedDays = [];
  dayCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedDays.push(checkbox.value);
    }
  });

  // Validate inputs
  if (!dateInput && selectedDays.length === 0) {
    alert("Please select either a date or at least one day of the week.");
    return;
  }

  // Create a schedule object
  const newSchedule = {
    time: timeInput,
    date: dateInput || null,
    days: selectedDays,
  };

  // Check if the schedule already exists
  if (schedule.some((item) => JSON.stringify(item) === JSON.stringify(newSchedule))) {
    alert("This schedule already exists!");
    return;
  }

  // Add the new schedule
  schedule.push(newSchedule);

  // Save schedule to localStorage
  localStorage.setItem("schedule", JSON.stringify(schedule));

  // Update the schedule table
  updateScheduleTable();

  // Clear inputs
  document.getElementById("time").value = "";
  document.getElementById("date").value = "";
  dayCheckboxes.forEach((checkbox) => (checkbox.checked = false));
}

// Function to remove a scheduled time
function removeSchedule(index) {
  schedule.splice(index, 1);

  // Update localStorage
  localStorage.setItem("schedule", JSON.stringify(schedule));

  updateScheduleTable();
}

// Function to update the schedule table
function updateScheduleTable() {
  const tableBody = document.getElementById("scheduleTable");
  tableBody.innerHTML = "";

  schedule.forEach((item, index) => {
    const row = document.createElement("tr");

    const timeCell = document.createElement("td");
    timeCell.textContent = item.time;
    row.appendChild(timeCell);

    const dateCell = document.createElement("td");
    dateCell.textContent = item.date ? item.date : "N/A";
    row.appendChild(dateCell);

    const daysCell = document.createElement("td");
    daysCell.textContent = item.days.length > 0 ? item.days.join(", ") : "N/A";
    row.appendChild(daysCell);

    const actionCell = document.createElement("td");
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = () => removeSchedule(index);
    actionCell.appendChild(removeButton);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });
}

// Function to start the scheduler
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
    setInterval(checkAndRingBell, 1000); // Check every second for better accuracy
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
  const currentDay = currentTime.toLocaleString("en-US", { weekday: "long" });
  const currentDate = currentTime.toISOString().split("T")[0];
  const currentFormattedTime = `${currentHours}:${currentMinutes}`;

  console.log(`[${new Date().toLocaleTimeString()}] Current Time: ${currentFormattedTime}`);
  console.log(`[${new Date().toLocaleTimeString()}] Current Day: ${currentDay}`);
  console.log(`[${new Date().toLocaleTimeString()}] Current Date: ${currentDate}`);
  console.log(`[${new Date().toLocaleTimeString()}] Scheduled Times:`, schedule);

  // Check if the current time matches any scheduled time
  schedule.forEach((item) => {
    if (
      item.time === currentFormattedTime &&
      (item.date === currentDate || item.days.includes(currentDay))
    ) {
      console.log(`[${new Date().toLocaleTimeString()}] Ringing bell at: ${currentFormattedTime}`);
      const bellSound = document.getElementById("bellSound");
      bellSound.play().catch((error) => {
        console.error(`[${new Date().toLocaleTimeString()}] Error playing sound:`, error);
        alert("Unable to play the bell sound. Check your audio settings or file path.");
      });
    }
  });
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

// Initialize the schedule table on page load
updateScheduleTable();
