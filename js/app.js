// js/app.js
// ----------------------------------------------
// ooz-habit-tracker
// Features: Habits, Streak Counter, Goals, Dashboard, Notifications, Planner with filter
// ----------------------------------------------

let habits = JSON.parse(localStorage.getItem("habits")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let chart;
const STORAGE_KEY_HABITS = "habits";
const STORAGE_KEY_TASKS = "tasks";

// Save helpers
function saveHabits() { localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits)); }
function saveTasks() { localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks)); }

// -----------------------------
// Habits
// -----------------------------
document.getElementById("add-btn").addEventListener("click", () => {
  const nameInput = document.getElementById("habit-input");
  const goalInput = document.getElementById("goal-input");

  const name = nameInput.value.trim();
  const goal = parseInt(goalInput.value, 10);

  if (!name || !goal || goal <= 0) {
    alert("Enter habit name and valid goal.");
    return;
  }

  habits.push({ name, goal, streak: 0, lastDone: null });
  saveHabits();
  renderHabits();

  nameInput.value = "";
  goalInput.value = "";
});

function markDone(index) {
  const today = new Date().toDateString();
  if (habits[index].lastDone === today) {
    alert("Already marked today ✅");
    return;
  }
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (habits[index].lastDone === yesterday.toDateString()) {
    habits[index].streak += 1;
  } else {
    habits[index].streak = 1;
  }
  habits[index].lastDone = today;
  saveHabits();
  renderHabits();
}

function renderHabits() {
  const list = document.getElementById("habits");
  list.innerHTML = "";
  habits.forEach((habit, index) => {
    const li = document.createElement("li");
    const progressPercent = Math.min(100, Math.round((habit.streak / habit.goal) * 100));
    li.innerHTML = `
      <div>
        <strong>${habit.name}</strong>
        <span>Streak: ${habit.streak}/${habit.goal} days (${progressPercent}%)</span>
        <div style="background:#333;border-radius:6px;margin-top:6px;">
          <div style="height:8px;width:${progressPercent}%;background:#9c27b0;border-radius:6px;"></div>
        </div>
      </div>
    `;
    const btn = document.createElement("button");
    btn.textContent = "✅ Done";
    btn.addEventListener("click", () => markDone(index));
    li.appendChild(btn);
    list.appendChild(li);
  });
  updateChart();
}

function updateChart() {
  const ctx = document.getElementById("progressChart").getContext("2d");
  const labels = habits.map(h => h.name);
  const data = habits.map(h => Math.min(100, Math.round((h.streak / h.goal) * 100)));
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets: [{ label: "Progress (%)", data, backgroundColor: "#9c27b0" }] },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }
  });
}

// -----------------------------
// Notifications
// -----------------------------
function requestNotificationPermission() {
  if (!("Notification" in window)) return;
  Notification.requestPermission().then(permission => {
    console.log("Notification permission:", permission);
  });
}

function showNotification(habitName) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Habit Reminder", { body: `Time to do "${habitName}" ✅` });
    return;
  }
  const toast = document.createElement("div");
  toast.textContent = `⏰ Time to do "${habitName}"`;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "#9c27b0";
  toast.style.color = "white";
  toast.style.padding = "10px 12px";
  toast.style.borderRadius = "6px";
  toast.style.zIndex = "9999";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function remindFirstHabit() {
  if (habits.length > 0) showNotification(habits[0].name);
}

// -----------------------------
// Planner (Tasks)
// -----------------------------
document.getElementById("add-task-btn").addEventListener("click", () => {
  const nameInput = document.getElementById("task-input");
  const dateInput = document.getElementById("task-date");
  const name = nameInput.value.trim();
  const date = dateInput.value;
  if (!name || !date) {
    alert("Enter task name and date.");
    return;
  }
  tasks.push({ name, date });
  saveTasks();
  renderTasks();
  nameInput.value = "";
  dateInput.value = "";
});

function renderTasks(filterToday = false) {
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  const todayStr = new Date().toISOString().split("T")[0];
  tasks.forEach((task, index) => {
    if (filterToday && task.date !== todayStr) return;
    const li = document.createElement("li");
    li.textContent = `${task.date} - ${task.name}`;
    const btn = document.createElement("button");
    btn.textContent = "❌ Delete";
    btn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks(filterToday);
    });
    li.appendChild(btn);
    list.appendChild(li);
  });
}

document.getElementById("filter-today-btn").addEventListener("click", () => {
  renderTasks(true);
});

// -----------------------------
// Init
// -----------------------------
renderHabits();
renderTasks();
requestNotificationPermission();
setInterval(remindFirstHabit, 30000);
