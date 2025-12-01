// =============================
// Storage and globals
// =============================
let habits = JSON.parse(localStorage.getItem("habits")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let habitChart = null; // Chart.js instance (Habits page)

// =============================
// Common init (theme, language)
// =============================
function initCommon() {
  // Theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") document.body.classList.add("light-theme");

  // Language
  const savedLang = localStorage.getItem("lang") || "en";
  document.documentElement.lang = savedLang;
  applyTranslations(); // stub for now
}

// Simple i18n stub (extend later)
function applyTranslations() {
  // Placeholder: hook into your DOM text nodes if/when needed.
}

// =============================
// Home: Overview + Extras
// =============================
function initHomeOverview() {
  const ov = document.getElementById("overview");
  if (!ov) return;

  const habitsData = JSON.parse(localStorage.getItem("habits")) || [];
  const tasksData = JSON.parse(localStorage.getItem("tasks")) || [];
  const todayStr = toYMD(new Date());

  const activeHabits = habitsData.length;
  const tasksToday = tasksData.filter(t => t.date === todayStr).length;
  const progressPercent = computeOverallProgress(habitsData);

  const elHabits = document.getElementById("ov-habits");
  const elTasksToday = document.getElementById("ov-tasks-today");
  const elProgBar = document.getElementById("ov-progress");
  const elProgText = document.getElementById("ov-progress-text");
  const elQuote = document.getElementById("ov-quote");

  if (elHabits) elHabits.textContent = String(activeHabits);
  if (elTasksToday) elTasksToday.textContent = String(tasksToday);
  if (elProgBar) elProgBar.style.width = `${progressPercent}%`;
  if (elProgText) elProgText.textContent = `${progressPercent}%`;

  const quotes = [
    "Small steps every day lead to big changes.",
    "Consistency beats intensity.",
    "Focus on the next right action.",
    "Your future is built by your daily choices."
  ];
  if (elQuote) elQuote.textContent = quotes[new Date().getDay() % quotes.length];
}

function initHomeExtras() {
  // Welcome date
  const dateEl = document.getElementById("today-date");
  if (dateEl) {
    dateEl.textContent = new Date().toDateString();
  }

  // Motivation
  const quotes = [
    "Small steps every day lead to big changes.",
    "Consistency beats intensity.",
    "Focus on the next right action.",
    "Your future is built by your daily choices."
  ];
  const motEl = document.getElementById("motivation-text");
  if (motEl) motEl.textContent = quotes[new Date().getDay() % quotes.length];

  // Upcoming tasks (next 3 by date order)
  const upcomingEl = document.getElementById("upcoming-list");
  if (upcomingEl) {
    const tasksData = JSON.parse(localStorage.getItem("tasks")) || [];
    const sorted = tasksData
      .slice()
      .sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0))
      .slice(0, 3);

    upcomingEl.innerHTML = "";
    sorted.forEach(t => {
      const li = document.createElement("li");
      li.textContent = `${t.date} — ${t.name}`;
      upcomingEl.appendChild(li);
    });
  }
}

// =============================
// Habits page
// =============================
function initHabitsPage() {
  const list = document.getElementById("habits");
  const addBtn = document.getElementById("add-btn");
  const nameInput = document.getElementById("habit-input");
  const goalInput = document.getElementById("goal-input");
  const chartCanvas = document.getElementById("progressChart");

  if (!list) return; // not on habits page

  function renderHabits() {
    list.innerHTML = "";
    habits.forEach((habit, index) => {
      const li = document.createElement("li");
      const progressPercent = safePercent(habit.streak, habit.goal);

      li.innerHTML = `
        <div>
          <strong>${habit.name}</strong>
          <span style="display:block;margin-top:4px;">Streak: ${habit.streak}/${habit.goal} days (${progressPercent}%)</span>
          <div style="background:#333;border-radius:6px;margin-top:8px;">
            <div style="height:8px;width:${progressPercent}%;background:#6A0DAD;border-radius:6px;"></div>
          </div>
        </div>
      `;

      const btn = document.createElement("button");
      btn.textContent = "✅ Done";
      btn.addEventListener("click", () => markDone(index));
      li.appendChild(btn);

      list.appendChild(li);
    });

    updateHabitChart(chartCanvas);
    updateHabitStats();
  }

  function markDone(index) {
    const today = new Date().toDateString();
    if (habits[index].lastDone === today) {
      alert("Already marked today ✅");
      return;
    }
    habits[index].streak = (parseInt(habits[index].streak || 0, 10) || 0) + 1;
    habits[index].lastDone = today;
    persistHabits();
    renderHabits();
  }

  function updateHabitChart(canvas) {
    if (!canvas || typeof Chart === "undefined") return;
    const ctx = canvas.getContext("2d");
    const labels = habits.map(h => h.name);
    const data = habits.map(h => safePercent(h.streak, h.goal));

    if (habitChart) habitChart.destroy();
    habitChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{ label: "Progress (%)", data, backgroundColor: "#6A0DAD" }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 100 } }
      }
    });
  }

  function updateHabitStats() {
    const elTotal = document.getElementById("stats-total");
    const elBest = document.getElementById("stats-best");
    const elAvg = document.getElementById("stats-avg");
    if (!elTotal || !elBest || !elAvg) return;

    const total = habits.length;
    const best = habits.reduce((max, h) => Math.max(max, parseInt(h.streak || 0, 10) || 0), 0);
    const avg = computeOverallProgress(habits);

    elTotal.textContent = String(total);
    elBest.textContent = String(best);
    elAvg.textContent = `${avg}%`;
  }

  addBtn?.addEventListener("click", () => {
    const name = (nameInput?.value || "").trim();
    const goal = parseInt(goalInput?.value || "0", 10);
    if (!name || !goal || goal <= 0) {
      alert("Enter habit name and valid goal.");
      return;
    }
    habits.push({ name, goal, streak: 0, lastDone: null });
    persistHabits();
    renderHabits();
    if (nameInput) nameInput.value = "";
    if (goalInput) goalInput.value = "";
  });

  renderHabits();
}

// =============================
// Tasks page (enhanced)
// =============================
function initTasksPage() {
  const list = document.getElementById("task-list");
  if (!list) return; // not on tasks page

  const addTaskBtn = document.getElementById("add-task-btn");
  const nameInput = document.getElementById("task-input");
  const dateInput = document.getElementById("task-date");
  const filterTodayBtn = document.getElementById("filter-today-btn");

  const prodBar = document.getElementById("prod-bar");
  const prodText = document.getElementById("prod-text");

  const calLabel = document.getElementById("cal-label");
  const calGrid = document.getElementById("calendar-grid");
  const calPrev = document.getElementById("cal-prev");
  const calNext = document.getElementById("cal-next");

  // Local state
  tasks = (tasks || []).map(t => ({ ...t, done: !!t.done }));
  let selectedDate = null; // 'YYYY-MM-DD' or null
  let calendarRef = getMonthRef(new Date()); // {year, month}

  function renderTasks() {
    list.innerHTML = "";

    const filtered = tasks.filter(t => {
      if (selectedDate) return t.date === selectedDate;
      return true;
    });

    filtered.forEach(task => {
      const li = document.createElement("li");
      if (task.done) li.classList.add("done");

      const left = document.createElement("div");
      left.className = "task-left";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.addEventListener("change", () => {
        task.done = checkbox.checked;
        persistTasks();
        updateProductivity();
        renderTaskStats();
        li.classList.toggle("done", task.done);
      });

      const title = document.createElement("span");
      title.className = "task-title";
      title.textContent = task.name;

      const date = document.createElement("span");
      date.className = "task-date";
      date.textContent = task.date;

      left.appendChild(checkbox);
      left.appendChild(title);
      left.appendChild(date);

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const delBtn = document.createElement("button");
      delBtn.className = "delete-btn";
      delBtn.textContent = "❌ Delete";
      delBtn.addEventListener("click", () => {
        const idx = tasks.findIndex(t => t === task);
        if (idx >= 0) tasks.splice(idx, 1);
        persistTasks();
        renderTasks();
        updateProductivity();
        renderTaskStats();
      });

      actions.appendChild(delBtn);
      li.appendChild(left);
      li.appendChild(actions);
      list.appendChild(li);
    });

    updateProductivity();
    renderTaskStats();
  }

  addTaskBtn?.addEventListener("click", () => {
    const name = (nameInput?.value || "").trim();
    const date = dateInput?.value || "";
    if (!name || !date) {
      alert("Enter task name and date.");
      return;
    }
    tasks.push({ name, date, done: false });
    persistTasks();
    renderTasks();
    if (nameInput) nameInput.value = "";
    if (dateInput) dateInput.value = "";
  });

  filterTodayBtn?.addEventListener("click", () => {
    selectedDate = toYMD(new Date());
    renderCalendar(); // highlight
    renderTasks();
  });

  function updateProductivity() {
    if (!prodBar || !prodText) return;
    const todayStr = toYMD(new Date());
    const todayTasks = tasks.filter(t => t.date === todayStr);
    if (todayTasks.length === 0) {
      prodBar.style.width = "0%";
      prodText.textContent = "0%";
      return;
    }
    const doneCount = todayTasks.filter(t => t.done).length;
    const pct = Math.round((doneCount / todayTasks.length) * 100);
    prodBar.style.width = `${pct}%`;
    prodText.textContent = `${pct}%`;
  }

  function renderTaskStats() {
    const elTotal = document.getElementById("tasks-total");
    const elDone = document.getElementById("tasks-done");
    const elUpcoming = document.getElementById("tasks-upcoming");
    if (!elTotal || !elDone || !elUpcoming) return;

    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;

    const today = startOfDay(new Date());
    const in7 = new Date(today);
    in7.setDate(in7.getDate() + 7);

    const upcoming = tasks.filter(t => {
      const d = parseYMD(t.date);
      return d >= today && d <= in7;
    }).length;

    elTotal.textContent = String(total);
    elDone.textContent = String(done);
    elUpcoming.textContent = String(upcoming);
  }

  function renderCalendar() {
    if (!calGrid || !calLabel) return;

    const { year, month } = calendarRef;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const monthName = firstDay.toLocaleString("en-US", { month: "long" });
    calLabel.textContent = `${monthName} ${year}`;

    const startWeekday = firstDay.getDay(); // 0..6 (Sun..Sat)
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    calGrid.innerHTML = "";

    // Weekday labels
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(wd => {
      const hd = document.createElement("div");
      hd.className = "calendar-cell muted";
      hd.textContent = wd;
      calGrid.appendChild(hd);
    });

    // Leading cells (prev month days)
    for (let i = 0; i < startWeekday; i++) {
      const dayNum = daysInPrevMonth - startWeekday + 1 + i;
      const cell = document.createElement("div");
      cell.className = "calendar-cell muted";
      cell.textContent = String(dayNum);
      calGrid.appendChild(cell);
    }

    // Current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const cell = document.createElement("div");
      cell.className = "calendar-cell";
      cell.textContent = String(day);

      const cellDate = toYMD(new Date(year, month, day));
      const todayStr = toYMD(new Date());
      if (cellDate === todayStr) cell.classList.add("today");
      if (selectedDate === cellDate) cell.classList.add("active");

      cell.addEventListener("click", () => {
        selectedDate = cellDate;
        renderTasks();
        renderCalendar(); // refresh highlight
      });

      calGrid.appendChild(cell);
    }
  }

  calPrev?.addEventListener("click", () => {
    const m = calendarRef.month - 1;
    if (m < 0) {
      calendarRef.month = 11;
      calendarRef.year -= 1;
    } else {
      calendarRef.month = m;
    }
    renderCalendar();
  });

  calNext?.addEventListener("click", () => {
    const m = calendarRef.month + 1;
    if (m > 11) {
      calendarRef.month = 0;
      calendarRef.year += 1;
    } else {
      calendarRef.month = m;
    }
    renderCalendar();
  });

  // Init
  renderTasks();
  renderCalendar();
}

// =============================
// Settings page (enhanced)
// =============================
function initSettingsPage() {
  const container = document.getElementById("settings");
  if (!container) return; // not on settings page

  const themeBtn = document.getElementById("theme-toggle");
  const langBtn = document.getElementById("lang-toggle");
  const clearBtn = document.getElementById("clear-data");
  const langCurrent = document.getElementById("lang-current");

  const exportBtn = document.getElementById("export-data");
  const importBtn = document.getElementById("import-data");
  const importFile = document.getElementById("import-file");

  // Theme
  themeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    localStorage.setItem("theme", document.body.classList.contains("light-theme") ? "light" : "dark");
  });

  // Language
  const savedLang = localStorage.getItem("lang") || "en";
  if (langCurrent) langCurrent.textContent = savedLang;

  langBtn?.addEventListener("click", () => {
    const currentLang = localStorage.getItem("lang") || "en";
    const newLang = currentLang === "en" ? "fa" : "en";
    localStorage.setItem("lang", newLang);
    document.documentElement.lang = newLang;
    if (langCurrent) langCurrent.textContent = newLang;
    applyTranslations();
  });

  // Clear all data
  clearBtn?.addEventListener("click", () => {
    if (!confirm("Are you sure you want to clear all data?")) return;
    localStorage.removeItem("habits");
    localStorage.removeItem("tasks");
    habits = [];
    tasks = [];
    alert("All data cleared ✅");
    location.reload();
  });

  // Export data
  exportBtn?.addEventListener("click", () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      habits,
      tasks
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ooz-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Import data
  importBtn?.addEventListener("click", () => {
    importFile?.click();
  });

  importFile?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      if (!payload || typeof payload !== "object") throw new Error("Invalid JSON");

      habits = Array.isArray(payload.habits) ? payload.habits : [];
      tasks = Array.isArray(payload.tasks) ? payload.tasks : [];

      localStorage.setItem("habits", JSON.stringify(habits));
      localStorage.setItem("tasks", JSON.stringify(tasks));

      alert("Data imported successfully ✅");
      location.reload();
    } catch (err) {
      alert("Import failed. Please check the JSON file.");
      console.error(err);
    } finally {
      e.target.value = "";
    }
  });
}

// =============================
// Helpers (shared)
// =============================
function persistHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}
function persistTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function safePercent(streak, goal) {
  const g = Math.max(1, parseInt(goal || 1, 10));
  const s = Math.max(0, parseInt(streak || 0, 10));
  return Math.round(Math.min(100, (s / g) * 100));
}

function computeOverallProgress(habitsData) {
  if (!habitsData || habitsData.length === 0) return 0;
  const percents = habitsData.map(h => safePercent(h.streak, h.goal));
  const avg = Math.round(percents.reduce((a, b) => a + b, 0) / percents.length);
  return Math.min(100, Math.max(0, avg));
}

function toYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function parseYMD(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function getMonthRef(d) {
  return { year: d.getFullYear(), month: d.getMonth() };
}

// =============================
// Boot sequence
// =============================
window.addEventListener("DOMContentLoaded", () => {
  initCommon();
  initHomeOverview();
  initHomeExtras();
  initHabitsPage();
  initTasksPage();
  initSettingsPage();
});
