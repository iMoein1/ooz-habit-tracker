// js/app.js
// ----------------------------------------------
// ooz-habit-tracker
// HTML + SCSS + JS (Vanilla)
// Features: Habit list, Streak Counter, Goals & Progress (%),
// Dashboard chart (Chart.js), Notifications (browser/Toast)
// ----------------------------------------------

let habits = JSON.parse(localStorage.getItem("habits")) || [];
let chart; // برای نمودار
const STORAGE_KEY = "habits";

// ----------------------------------------------
// ابزار ذخیره‌سازی
// ----------------------------------------------
function saveHabits() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

// ----------------------------------------------
// افزودن عادت جدید (با هدف روزها)
// نیاز به inputهای: #habit-input و #goal-input در HTML
// ----------------------------------------------
document.getElementById("add-btn").addEventListener("click", () => {
  const nameInput = document.getElementById("habit-input");
  const goalInput = document.getElementById("goal-input");

  const name = nameInput.value.trim();
  const goal = parseInt(goalInput.value, 10);

  if (!name) {
    alert("نام عادت را وارد کنید.");
    return;
  }
  if (!goal || goal <= 0) {
    alert("هدف (روز) باید یک عدد مثبت باشد.");
    return;
  }

  habits.push({
    name,
    goal,            // تعداد روز هدف (مثلاً 30)
    streak: 0,       // روزهای متوالی انجام شده
    lastDone: null   // آخرین تاریخی که انجام شده (toDateString)
  });

  saveHabits();
  renderHabits();

  nameInput.value = "";
  goalInput.value = "";
});

// ----------------------------------------------
// ثبت انجام شدن عادت در امروز و محاسبه streak
// ----------------------------------------------
function markDone(index) {
  const today = new Date().toDateString();

  // اگر امروز قبلاً ثبت شده
  if (habits[index].lastDone === today) {
    alert("این عادت امروز قبلاً ثبت شده ✅");
    return;
  }

  // دیروز را محاسبه کن
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  // اگر آخرین انجام مربوط به دیروز بود → ادامه streak
  if (habits[index].lastDone === yesterdayStr) {
    habits[index].streak += 1;
  } else {
    // اگر فاصله افتاده → شروع دوباره از 1
    habits[index].streak = 1;
  }

  habits[index].lastDone = today;
  saveHabits();
  renderHabits();
}

// ----------------------------------------------
// رندر لیست عادت‌ها با نمایش درصد پیشرفت نسبت به هدف
// ----------------------------------------------
function renderHabits() {
  const list = document.getElementById("habits");
  list.innerHTML = "";

  habits.forEach((habit, index) => {
    const li = document.createElement("li");

    // درصد پیشرفت: streak / goal
    const progressPercent =
      habit.goal && habit.goal > 0
        ? Math.min(100, Math.round((habit.streak / habit.goal) * 100))
        : 0;

    // متن
    const info = document.createElement("div");
    info.style.display = "flex";
    info.style.flexDirection = "column";
    info.innerHTML = `
      <strong>${habit.name}</strong>
      <span>Streak: ${habit.streak}/${habit.goal} روز (${progressPercent}%)</span>
    `;

    // دکمه انجام شد
    const btn = document.createElement("button");
    btn.textContent = "✅ انجام شد";
    btn.addEventListener("click", () => markDone(index));

    // نوار پیشرفت ساده
    const barWrap = document.createElement("div");
    barWrap.style.width = "100%";
    barWrap.style.background = "#eee";
    barWrap.style.borderRadius = "6px";
    barWrap.style.marginTop = "6px";

    const bar = document.createElement("div");
    bar.style.height = "8px";
    bar.style.width = `${progressPercent}%`;
    bar.style.background = "#4caf50";
    bar.style.borderRadius = "6px";
    barWrap.appendChild(bar);
    info.appendChild(barWrap);

    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.justifyContent = "space-between";
    li.appendChild(info);
    li.appendChild(btn);

    list.appendChild(li);
  });

  updateChart();
}

// ----------------------------------------------
// آپدیت نمودار پیشرفت (درصد) با Chart.js
// ----------------------------------------------
function updateChart() {
  const canvas = document.getElementById("progressChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const labels = habits.map(h => h.name);
  const data = habits.map(h => {
    if (!h.goal || h.goal <= 0) return 0;
    return Math.min(100, Math.round((h.streak / h.goal) * 100));
  });

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "پیشرفت (%)",
          data,
          backgroundColor: "#4caf50"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } }
      }
    }
  });
}

// ----------------------------------------------
// Notifications: اجازه و نمایش (Browser/Toast)
// ----------------------------------------------
function requestNotificationPermission() {
  if (!("Notification" in window)) return;

  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("اجازه نوتیفیکیشن داده شد ✅");
    } else {
      console.log("اجازه نوتیفیکیشن داده نشد ❌");
    }
  });
}

function showNotification(habitName) {
  // اگر مرورگر پشتیبانی و اجازه داده شده
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("یادآوری عادت", {
      body: `وقتشه عادت "${habitName}" رو انجام بدی! ✅`
    });
    return;
  }

  // Toast ساده در صفحه
  const toast = document.createElement("div");
  toast.textContent = `⏰ وقتشه "${habitName}" رو انجام بدی!`;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "#4caf50";
  toast.style.color = "white";
  toast.style.padding = "10px 12px";
  toast.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
  toast.style.borderRadius = "6px";
  toast.style.zIndex = "9999";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// نمونه ساده: یادآوری برای اولین عادت هر 30 ثانیه (برای تست)
function remindFirstHabit() {
  if (habits.length > 0) {
    showNotification(habits[0].name);
  }
}

// ----------------------------------------------
// بارگذاری اولیه
// ----------------------------------------------
renderHabits();
requestNotificationPermission();

// تست یادآوری (هر 30 ثانیه)
setInterval(remindFirstHabit, 30000);
