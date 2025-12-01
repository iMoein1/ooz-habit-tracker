// =============================
// app.js — کامل با i18n (en/fa), RTL, toast, shortcuts, pages init
// جایگزین کامل فایل js/app.js کن
// =============================

// =============================
// TRANSLATIONS (انگلیسی و فارسی)
// =============================
const TRANSLATIONS = {
  en: {
    // Home
    welcome_title: "Welcome back, ooz 👋",
    welcome_sub: "Today is {date}. Stay productive!",
    btn_add_habit: "➕ Add Habit",
    btn_add_task: "➕ Add Task",
    overview_active_habits: "Active habits",
    overview_tasks_today: "Tasks today",
    overview_overall_progress: "Overall progress",
    quote_default: "Small steps every day lead to big changes.",
    motivation_default: "Consistency beats intensity.",
    upcoming_title: "Upcoming Tasks",

    // Habits
    habits_title: "Add New Habit",
    habit_input_placeholder: "Habit name",
    habit_goal_placeholder: "Goal (days)",
    habit_add_btn: "➕ Add Habit",
    habits_list_title: "Your Habits",
    stats_title: "Habit Stats",
    stats_total: "Total habits",
    stats_best: "Best streak",
    stats_avg: "Average progress",
    tips_title: "Tips",
    empty_habits: "You don't have any habits yet — add one to get started!",

    // Tasks
    tasks_add_title: "Add new task",
    task_input_placeholder: "Task name",
    task_date_placeholder: "Select date",
    task_add_btn: "➕ Add Task",
    task_filter_today: "📅 Show today",
    productivity_title: "Today's productivity",
    tasks_stats_title: "Task stats",
    tasks_total: "Total tasks",
    tasks_done: "Done tasks",
    tasks_upcoming: "Upcoming (next 7 days)",
    tasks_list_title: "Your tasks",
    empty_tasks: "No tasks yet — add one to get started!",
    toast_deleted: "Task deleted — Undo",

    // Settings
    settings_theme: "Theme",
    btn_toggle_theme: "🌗 Toggle theme",
    settings_language: "Language",
    settings_lang_current: "Current:",
    quick_actions: "Quick actions",
    clear_data: "🧹 Clear all data",
    export_data: "📦 Export data (JSON)",
    import_data: "📥 Import data",
    shortcuts_title: "Keyboard shortcuts",
    about_title: "About ooz",
    about_text: "ooz is a personal, beautiful, and practical habit & task tracker. Designed for focus, consistency, and delight.",

    // Generic
    btn_undo: "Undo",
    btn_delete: "Delete",
    btn_done: "Done",
    placeholder_search: "Search...",
  },

  fa: {
    // Home
    welcome_title: "خوش برگشتی، ooz 👋",
    welcome_sub: "امروز {date} است. به مسیرت ادامه بده!",
    btn_add_habit: "➕ افزودن عادت",
    btn_add_task: "➕ افزودن وظیفه",
    overview_active_habits: "عادت‌های فعال",
    overview_tasks_today: "وظایف امروز",
    overview_overall_progress: "پیشرفت کلی",
    quote_default: "قدم‌های کوچک روزانه، تغییرات بزرگ می‌سازند.",
    motivation_default: "پیوستگی از شدت بهتر است.",
    upcoming_title: "وظایف آینده",

    // Habits
    habits_title: "افزودن عادت جدید",
    habit_input_placeholder: "نام عادت",
    habit_goal_placeholder: "هدف (روز)",
    habit_add_btn: "➕ افزودن عادت",
    habits_list_title: "عادت‌های شما",
    stats_title: "آمار عادت‌ها",
    stats_total: "تعداد عادت‌ها",
    stats_best: "بهترین استریک",
    stats_avg: "میانگین پیشرفت",
    tips_title: "نکات",
    empty_habits: "هنوز عادتی اضافه نکرده‌ای — یکی اضافه کن تا شروع کنیم!",

    // Tasks
    tasks_add_title: "افزودن وظیفه جدید",
    task_input_placeholder: "نام وظیفه",
    task_date_placeholder: "انتخاب تاریخ",
    task_add_btn: "➕ افزودن وظیفه",
    task_filter_today: "📅 نمایش امروز",
    productivity_title: "بهره‌وری امروز",
    tasks_stats_title: "آمار وظایف",
    tasks_total: "کل وظایف",
    tasks_done: "وظایف انجام‌شده",
    tasks_upcoming: "آینده (۷ روز آینده)",
    tasks_list_title: "وظایف شما",
    empty_tasks: "هنوز وظیفه‌ای نداری — یکی اضافه کن تا شروع کنیم!",
    toast_deleted: "وظیفه حذف شد — بازگردانی",

    // Settings
    settings_theme: "قالب",
    btn_toggle_theme: "🌗 تغییر قالب",
    settings_language: "زبان",
    settings_lang_current: "زبان فعلی:",
    quick_actions: "اقدامات سریع",
    clear_data: "🧹 پاک‌سازی همه داده‌ها",
    export_data: "📦 خروجی (JSON)",
    import_data: "📥 وارد کردن",
    shortcuts_title: "میانبرهای صفحه‌کلید",
    about_title: "دربارهٔ ooz",
    about_text: "ooz یک برنامهٔ ساده و زیبا برای پیگیری عادت‌ها و وظایف است. طراحی‌شده برای تمرکز، پیوستگی و لذت.",

    // Generic
    btn_undo: "بازگردانی",
    btn_delete: "حذف",
    btn_done: "انجام شد",
    placeholder_search: "جستجو...",
  }
};

// =============================
// Helpers for i18n
// =============================
function toPersianDigits(str) {
  const map = { '0':'۰','1':'۱','2':'۲','3':'۳','4':'۴','5':'۵','6':'۶','7':'۷','8':'۸','9':'۹' };
  return String(str).replace(/\d/g, d => map[d] ?? d);
}

function localizedDateString(lang, d = new Date()) {
  try {
    if (lang === "fa") {
      return new Date(d).toLocaleDateString("fa-IR");
    } else {
      return new Date(d).toLocaleDateString("en-US");
    }
  } catch (err) {
    return new Date(d).toDateString();
  }
}

function applyTranslations() {
  const lang = document.documentElement.lang || "en";
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // 1) Elements with data-i18n -> textContent
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    let text = dict[key] ?? TRANSLATIONS.en[key] ?? "";
    if (text.includes("{date}")) {
      text = text.replace("{date}", localizedDateString(lang, new Date()));
    }
    el.textContent = text;
  });

  // 2) Placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (!key) return;
    const text = dict[key] ?? TRANSLATIONS.en[key] ?? "";
    el.setAttribute("placeholder", text);
  });

  // 3) title attributes
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.getAttribute("data-i18n-title");
    if (!key) return;
    const text = dict[key] ?? TRANSLATIONS.en[key] ?? "";
    el.setAttribute("title", text);
  });

  // 4) aria-labels
  document.querySelectorAll("[data-i18n-aria]").forEach(el => {
    const key = el.getAttribute("data-i18n-aria");
    if (!key) return;
    const text = dict[key] ?? TRANSLATIONS.en[key] ?? "";
    el.setAttribute("aria-label", text);
  });

  // 5) data-i18n-empty (for static empty placeholders)
  document.querySelectorAll("[data-i18n-empty]").forEach(el => {
    const key = el.getAttribute("data-i18n-empty");
    if (!key) return;
    const text = dict[key] ?? TRANSLATIONS.en[key] ?? "";
    el.textContent = text;
  });

  // 6) Update dynamic small pieces (today-date, quotes, etc.)
  const todayDateEl = document.getElementById("today-date");
  if (todayDateEl) {
    todayDateEl.textContent = localizedDateString(lang, new Date());
  }

  const ovQuote = document.getElementById("ov-quote");
  if (ovQuote) {
    ovQuote.textContent = dict.quote_default ?? TRANSLATIONS.en.quote_default;
  }

  const motEl = document.getElementById("motivation-text");
  if (motEl) {
    motEl.textContent = dict.motivation_default ?? TRANSLATIONS.en.motivation_default;
  }

  // 7) Convert numeric displays if desired (elements with data-i18n-num)
  if (lang === "fa") {
    document.querySelectorAll("[data-i18n-num]").forEach(el => {
      el.textContent = toPersianDigits(el.textContent || "");
    });
  }
}

// =============================
// Storage and globals
// =============================
let habits = JSON.parse(localStorage.getItem("habits")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let habitChart = null;
let trashBuffer = [];

// =============================
// Common init (theme, language, RTL)
// =============================
function initCommon() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") document.body.classList.add("light-theme");

  const savedLang = localStorage.getItem("lang") || "en";
  document.documentElement.lang = savedLang;
  applyTranslations();
  applyRTLByLang();
}

// RTL helper
function applyRTLByLang() {
  const lang = document.documentElement.lang || "en";
  document.body.classList.toggle("rtl", lang === "fa");
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

  if (elHabits) { elHabits.textContent = String(activeHabits); elHabits.setAttribute("data-i18n-num", ""); }
  if (elTasksToday) { elTasksToday.textContent = String(tasksToday); elTasksToday.setAttribute("data-i18n-num", ""); }
  if (elProgBar) elProgBar.style.width = `${progressPercent}%`;
  if (elProgText) elProgText.textContent = `${progressPercent}%`;

  applyTranslations();
}

function initHomeExtras() {
  const dateEl = document.getElementById("today-date");
  if (dateEl) dateEl.textContent = localizedDateString(document.documentElement.lang || "en", new Date());

  const motEl = document.getElementById("motivation-text");
  if (motEl) motEl.textContent = TRANSLATIONS[document.documentElement.lang || "en"].motivation_default;
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

  if (!list) return;

  function renderHabits() {
    // remove any previous empty-state
    const prevEmpty = list.parentElement.querySelector(".empty-state");
    if (prevEmpty) prevEmpty.remove();

    list.innerHTML = "";
    if (!habits || habits.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.setAttribute("data-i18n-empty", "empty_habits");
      list.parentElement.appendChild(empty);
      applyTranslations();
      return;
    }

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
      btn.textContent = TRANSLATIONS[document.documentElement.lang || "en"].btn_done || "Done";
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
      data: { labels, datasets: [{ label: "Progress (%)", data, backgroundColor: "#6A0DAD" }] },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }
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

    // mark numbers for possible persian conversion
    elTotal.setAttribute("data-i18n-num", "");
    elBest.setAttribute("data-i18n-num", "");
    elAvg.setAttribute("data-i18n-num", "");
    applyTranslations();
  }

  addBtn?.addEventListener("click", () => {
    const name = (nameInput?.value || "").trim();
    const goal = parseInt(goalInput?.value || "0", 10);
    if (!name || !goal || goal <= 0) {
      // inline simple alert — you can replace with inline error UI
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
// Tasks page
// =============================
function initTasksPage() {
  const list = document.getElementById("task-list");
  if (!list) return;

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

  tasks = (tasks || []).map(t => ({ ...t, done: !!t.done }));
  let selectedDate = null;
  let calendarRef = getMonthRef(new Date());

  function renderTasks() {
    // remove previous empty-state
    const prevEmpty = list.parentElement.querySelector(".empty-state");
    if (prevEmpty) prevEmpty.remove();

    list.innerHTML = "";

    const filtered = tasks.filter(t => {
      if (selectedDate) return t.date === selectedDate;
      return true;
    });

    if (!filtered || filtered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.setAttribute("data-i18n-empty", "empty_tasks");
      list.parentElement.appendChild(empty);
      applyTranslations();
      updateProductivity();
      renderTaskStats();
      return;
    }

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
      delBtn.textContent = TRANSLATIONS[document.documentElement.lang || "en"].btn_delete || "Delete";
      delBtn.addEventListener("click", () => softDeleteTask(task, renderTasks, updateProductivity, renderTaskStats));

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
    renderCalendar();
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
    prodText.setAttribute("data-i18n-num", "");
    applyTranslations();
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

    elTotal.setAttribute("data-i18n-num", "");
    elDone.setAttribute("data-i18n-num", "");
    elUpcoming.setAttribute("data-i18n-num", "");
    applyTranslations();
  }

  function renderCalendar() {
    if (!calGrid || !calLabel) return;

    const { year, month } = calendarRef;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const monthName = firstDay.toLocaleString(document.documentElement.lang === "fa" ? "fa-IR" : "en-US", { month: "long" });
    calLabel.textContent = `${monthName} ${year}`;

    const startWeekday = firstDay.getDay();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    calGrid.innerHTML = "";

    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(wd => {
      const hd = document.createElement("div");
      hd.className = "calendar-cell muted";
      hd.textContent = wd;
      calGrid.appendChild(hd);
    });

    for (let i = 0; i < startWeekday; i++) {
      const dayNum = daysInPrevMonth - startWeekday + 1 + i;
      const cell = document.createElement("div");
      cell.className = "calendar-cell muted";
      cell.textContent = String(dayNum);
      calGrid.appendChild(cell);
    }

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
        renderCalendar();
      });

      calGrid.appendChild(cell);
    }
  }

  calPrev?.addEventListener("click", () => {
    const m = calendarRef.month - 1;
    if (m < 0) { calendarRef.month = 11; calendarRef.year -= 1; } else { calendarRef.month = m; }
    renderCalendar();
  });

  calNext?.addEventListener("click", () => {
    const m = calendarRef.month + 1;
    if (m > 11) { calendarRef.month = 0; calendarRef.year += 1; } else { calendarRef.month = m; }
    renderCalendar();
  });

  renderTasks();
  renderCalendar();
}

// =============================
// Settings page
// =============================
function initSettingsPage() {
  const container = document.getElementById("settings");
  if (!container) return;

  const themeBtn = document.getElementById("theme-toggle");
  const langBtn = document.getElementById("lang-toggle");
  const clearBtn = document.getElementById("clear-data");
  const langCurrent = document.getElementById("lang-current");

  const exportBtn = document.getElementById("export-data");
  const importBtn = document.getElementById("import-data");
  const importFile = document.getElementById("import-file");

  themeBtn?.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    localStorage.setItem("theme", document.body.classList.contains("light-theme") ? "light" : "dark");
  });

  const savedLang = localStorage.getItem("lang") || "en";
  if (langCurrent) langCurrent.textContent = savedLang;

  langBtn?.addEventListener("click", () => {
    const currentLang = localStorage.getItem("lang") || "en";
    const newLang = currentLang === "en" ? "fa" : "en";
    localStorage.setItem("lang", newLang);
    document.documentElement.lang = newLang;
    applyTranslations();
    applyRTLByLang();
  });

  clearBtn?.addEventListener("click", () => {
    if (!confirm("Are you sure you want to clear all data?")) return;
    localStorage.removeItem("habits");
    localStorage.removeItem("tasks");
    habits = [];
    tasks = [];
    alert("All data cleared ✅");
    location.reload();
  });

  exportBtn?.addEventListener("click", () => {
    const payload = { exportedAt: new Date().toISOString(), habits, tasks };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ooz-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  importBtn?.addEventListener("click", () => { importFile?.click(); });

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
// Keyboard shortcuts (use e.code for keyboard layout independence)
// =============================
function initShortcuts() {
  document.addEventListener("keydown", (e) => {
    const active = document.activeElement;
    const typing = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable);
    if (typing) return;

    const code = e.code;

    if (code === "KeyH") { location.href = "index.html"; return; }
    if (code === "KeyB") { location.href = "habits.html"; return; }
    if (code === "KeyK") { location.href = "tasks.html"; return; }
    if (code === "KeyS") { location.href = "settings.html"; return; }

    if (code === "KeyD") {
      document.body.classList.toggle("light-theme");
      localStorage.setItem("theme", document.body.classList.contains("light-theme") ? "light" : "dark");
      return;
    }

    if (code === "KeyL") {
      const currentLang = localStorage.getItem("lang") || "en";
      const newLang = currentLang === "en" ? "fa" : "en";
      localStorage.setItem("lang", newLang);
      document.documentElement.lang = newLang;
      applyTranslations();
      applyRTLByLang();
      return;
    }

    if (code === "KeyN") {
      const addHabitBtn = document.getElementById("add-btn");
      if (addHabitBtn) { addHabitBtn.click(); return; }
      const addTaskBtn = document.getElementById("add-task-btn");
      if (addTaskBtn) { addTaskBtn.click(); return; }
    }

    if (code === "KeyT") {
      const filterTodayBtn = document.getElementById("filter-today-btn");
      if (filterTodayBtn) filterTodayBtn.click();
      return;
    }

    if (e.key === "Escape") {
      if (document.getElementById("calendar-grid")) {
        if (typeof renderTasks === "function") renderTasks();
        if (typeof renderCalendar === "function") renderCalendar();
      }
    }
  });
}

// =============================
// Toast (Undo) helpers
// =============================
function showToast(message, onUndo) {
  const toast = document.getElementById("toast");
  const text = document.getElementById("toast-text");
  const undo = document.getElementById("toast-undo");
  if (!toast || !text || !undo) return;

  toast.style.display = "flex";
  text.textContent = message;
  toast.classList.add("show");

  function hide() {
    toast.classList.remove("show");
    setTimeout(() => { toast.style.display = "none"; }, 200);
    undo.removeEventListener("click", onUndoClick);
    document.removeEventListener("keydown", escHandler);
  }
  function onUndoClick() { onUndo?.(); hide(); }
  function escHandler(e) { if (e.key.toLowerCase() === "escape") hide(); }

  undo.addEventListener("click", onUndoClick);
  document.addEventListener("keydown", escHandler);

  setTimeout(() => hide(), 5000);
}

function softDeleteTask(task, rerenderTasks, updateProductivity, renderStats) {
  const idx = tasks.findIndex(t => t === task);
  if (idx < 0) return;

  const removed = tasks.splice(idx, 1)[0];
  persistTasks();
  rerenderTasks?.();
  updateProductivity?.();
  renderStats?.();

  const entry = { item: removed, index: idx, finalized: false };
  trashBuffer.push(entry);

  entry.timeoutId = setTimeout(() => {
    entry.finalized = true;
    trashBuffer = trashBuffer.filter(x => x !== entry);
  }, 5000);

  const lang = document.documentElement.lang || "en";
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  showToast(dict.toast_deleted || TRANSLATIONS.en.toast_deleted, () => {
    if (entry.finalized) return;
    clearTimeout(entry.timeoutId);
    const restoreIndex = Math.min(entry.index, tasks.length);
    tasks.splice(restoreIndex, 0, entry.item);
    persistTasks();
    rerenderTasks?.();
    updateProductivity?.();
    renderStats?.();
    trashBuffer = trashBuffer.filter(x => x !== entry);
  });
}

// =============================
// Helpers (shared)
// =============================
function persistHabits() { localStorage.setItem("habits", JSON.stringify(habits)); }
function persistTasks() { localStorage.setItem("tasks", JSON.stringify(tasks)); }

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
function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function getMonthRef(d) { return { year: d.getFullYear(), month: d.getMonth() }; }

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
  initShortcuts();
});
