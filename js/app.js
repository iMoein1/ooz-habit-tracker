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
    applyTranslations(); // Update texts immediately
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
// Translations (global)
// -----------------------------
const translations = {
  en: {
    homeTitle: "Welcome to Habit Tracker",
    homeDesc: "Track your habits, manage tasks, and stay productive.",
    habitsTitle: "Habits",
    tasksTitle: "Planner",
    settingsTitle: "Settings",
    themeBtn: "🌙 Dark / ☀️ Light",
    langBtn: "English / فارسی",
    clearBtn: "🗑️ Clear All",
  },
  fa: {
    homeTitle: "به عادت‌سنج خوش آمدید",
    homeDesc: "عادت‌هایت را پیگیری کن، وظایف را مدیریت کن و بهره‌ور بمان.",
    habitsTitle: "عادت‌ها",
    tasksTitle: "برنامه‌ریز",
    settingsTitle: "تنظیمات",
    themeBtn: "🌙 تاریک / ☀️ روشن",
    langBtn: "English / فارسی",
    clearBtn: "🗑️ پاک کردن همه",
  }
};

function applyTranslations() {
  const lang = localStorage.getItem("lang") || "en";
  const t = translations[lang];

  // Home page (if exists)
  const homeCard = document.querySelector("main .card");
  if (homeCard) {
    const h2 = homeCard.querySelector("h2");
    const p = homeCard.querySelector("p");
    if (h2) h2.textContent = t.homeTitle;
    if (p) p.textContent = t.homeDesc;
  }

  // Habits section title (if exists)
  const habitsSection = document.querySelector("#habits h2");
  if (habitsSection) habitsSection.textContent = t.habitsTitle;

  // Tasks section title (if exists)
  const tasksSection = document.querySelector("#tasks h2");
  if (tasksSection) tasksSection.textContent = t.tasksTitle;

  // Settings page texts (if exists)
  const settingsSectionTitle = document.querySelector("#settings h2");
  if (settingsSectionTitle) settingsSectionTitle.textContent = t.settingsTitle;
  const themeBtn = document.getElementById("theme-toggle");
  const langBtn = document.getElementById("lang-toggle");
  const clearBtn = document.getElementById("clear-data");
  if (themeBtn) themeBtn.textContent = t.themeBtn;
  if (langBtn) langBtn.textContent = t.langBtn;
  if (clearBtn) clearBtn.textContent = t.clearBtn;
}

// -----------------------------
// Common init
// -----------------------------
function initCommon() {
  // Apply saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  } else {
    document.body.classList.remove("light-theme");
  }

  // Apply translations
  applyTranslations();
}

// -----------------------------
// Boot
// -----------------------------
window.addEventListener("DOMContentLoaded", () => {
  initCommon();
  initHabitsPage();
  initTasksPage();
  initSettingsPage();
});
