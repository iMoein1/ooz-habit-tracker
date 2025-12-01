// -----------------------------
// Storage
// -----------------------------
let habits = JSON.parse(localStorage.getItem("habits")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let chart; // Chart.js instance (only on habits page)

// -----------------------------
// Habits page
// -----------------------------
function initHabitsPage() {
  const list = document.getElementById("habits");
  const addBtn = document.getElementById("add-btn");
  const nameInput = document.getElementById("habit-input");
  const goalInput = document.getElementById("goal-input");
  const chartCanvas = document.getElementById("progressChart");

  if (!list) return; // Not on habits page

  function renderHabits() {
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
      btn.addEventListener("click", () => markDone(index, renderHabits));
      li.appendChild(btn);
      list.appendChild(li);
    });
    updateChart(chartCanvas);
  }

  function markDone(index, rerender) {
    const today = new Date().toDateString();
    if (habits[index].lastDone === today) {
      alert("Already marked today ✅");
      return;
    }
    habits[index].streak += 1;
    habits[index].lastDone = today;
    localStorage.setItem("habits", JSON.stringify(habits));
    rerender();
  }

  function updateChart(canvas) {
    if (!canvas || typeof Chart === "undefined") return;
    const ctx = canvas.getContext("2d");
    const labels = habits.map(h => h.name);
    const data = habits.map(h => Math.min(100, Math.round((h.streak / h.goal) * 100)));
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: "bar",
      data: { labels, datasets: [{ label: "Progress (%)", data, backgroundColor: "#9c27b0" }] },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }
    });
  }

  addBtn?.addEventListener("click", () => {
    const name = (nameInput?.value || "").trim();
    const goal = parseInt(goalInput?.value || "0", 10);
    if (!name || !goal || goal <= 0) {
      alert("Enter habit name and valid goal.");
      return;
    }
    habits.push({ name, goal, streak: 0, lastDone: null });
    localStorage.setItem("habits", JSON.stringify(habits));
    renderHabits();
    if (nameInput) nameInput.value = "";
    if (goalInput) goalInput.value = "";
  });

  renderHabits();
}

// -----------------------------
// Tasks page
// -----------------------------
function initTasksPage() {
  const list = document.getElementById("task-list");
  const addTaskBtn = document.getElementById("add-task-btn");
  const nameInput = document.getElementById("task-input");
  const dateInput = document.getElementById("task-date");
  const filterTodayBtn = document.getElementById("filter-today-btn");

  if (!list) return; // Not on tasks page

  function renderTasks(filterToday = false) {
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
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks(filterToday);
      });
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  addTaskBtn?.addEventListener("click", () => {
    const name = (nameInput?.value || "").trim();
    const date = dateInput?.value || "";
    if (!name || !date) {
      alert("Enter task name and date.");
      return;
    }
    tasks.push({ name, date });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    if (nameInput) nameInput.value = "";
    if (dateInput) dateInput.value = "";
  });

  filterTodayBtn?.addEventListener("click", () => renderTasks(true));

  renderTasks();
}

// -----------------------------
// Settings page
// -----------------------------
function initSettingsPage() {
  const container = document.getElementById("settings");
  if (!container) return; // Not on settings page

  const themeBtn = document.getElementById("theme-toggle");
  const langBtn = document.getElementById("lang-toggle");
  const clearBtn = document.getElementById("clear-data");

  themeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    localStorage.setItem("theme", document.body.classList.contains("light-theme") ? "light" : "dark");
  });

  langBtn?.addEventListener("click", () => {
    const currentLang = localStorage.getItem("lang") || "en";
    const newLang = currentLang === "en" ? "fa" : "en";
    localStorage.setItem("lang", newLang);
    applyTranslations();
  });

  clearBtn?.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all data?")) {
      localStorage.removeItem("habits");
      localStorage.removeItem("tasks");
      alert("All data cleared ✅");
      location.reload();
    }
  });
}

// -----------------------------
// Home overview + extras
// -----------------------------
function initHomeOverview() {
  const ov = document.getElementById("overview");
  if (!ov) return;

  const habitsData = JSON.parse(localStorage.getItem("habits")) || [];
  const tasksData = JSON.parse(localStorage.getItem("tasks")) || [];
  const todayStr = new Date().toISOString().split("T")[0];

  const activeHabits = habitsData.length;
  const tasksToday = tasksData.filter(t => t.date === todayStr).length;
  const progressPercent = computeOverallProgress(habitsData);

  document.getElementById("ov-habits").textContent = activeHabits;
  document.getElementById("ov-tasks-today").textContent = tasksToday;
  document.getElementById("ov-progress").style.width = `${progressPercent}%`;
  document.getElementById("ov-progress-text").textContent = `${progressPercent}%`;

  const quotes = [
    "Small steps every day lead to big changes.",
    "Consistency beats intensity.",
    "Focus on the next right action.",
    "Your future is built by your daily choices."
  ];
  document.getElementById("ov-quote").textContent =
    quotes[new Date().getDay() % quotes.length];
}

function computeOverallProgress(habitsData) {
  if (!habitsData.length) return 0;
  const percents = habitsData.map(h => {
    const goal = Math.max(1, parseInt(h.goal || 1, 10));
    const streak = Math.max(0, parseInt(h.streak || 0, 10));
    return Math.round(Math.min(100, (streak / goal) * 100));
  });
  return Math.round(percents.reduce((a, b) => a + b, 0) / percents.length);
}

function initHomeExtras() {
  const dateEl = document.getElementById("today-date");
  if (dateEl) {
    const today = new Date();
    dateEl.textContent = today.toDateString();
  }
  }

  const quotes = [
    "Small steps every day lead to big changes.",
    "Consistency beats intensity.",
    "Focus on the next right action.",
    "Your future is built by your daily choices."
  ];
  const motEl = document.getElementById("motivation-text");
  if (motEl) motEl.textContent = quotes[new Date().getDay() % quotes.length];

  const tasksData = JSON.parse(localStorage.getItem("tasks")) || [];
  const upcomingEl = document.getElementBy
  function initHomeExtras() {
  const dateEl = document.getElementById("today-date");
  if (dateEl) {
    const today = new Date();
    dateEl.textContent = today.toDateString();
  }

  const quotes = [
    "Small steps every day lead to big changes.",
    "Consistency beats intensity.",
    "Focus on the next right action.",
    "Your future is built by your daily choices."
  ];
  const motEl = document.getElementById("motivation-text");
  if (motEl) motEl.textContent = quotes[new Date().getDay() % quotes.length];

  const tasksData = JSON.parse(localStorage.getItem("tasks")) || [];
  const upcomingEl = document.getElementById("upcoming-list");
  if (upcomingEl) {
    upcomingEl.innerHTML = "";
    tasksData.slice(0, 3).forEach(t => {
      const li = document.createElement("li");
      li.textContent = `${t.date} - ${t.name}`;
      upcomingEl.appendChild(li);
    });
  }
}

// -----------------------------
// Boot sequence
// -----------------------------
window.addEventListener("DOMContentLoaded", () => {
  initCommon();        // تنظیمات عمومی
  initHomeOverview();  // کارت Overview
  initHomeExtras();    // کارت‌های Welcome, Motivation, Upcoming
  initHabitsPage();    // صفحه Habits
  initTasksPage();     // صفحه Tasks
  initSettingsPage();  // صفحه Settings
});
