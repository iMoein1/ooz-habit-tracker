// js/app.js
// -----------------------------
// پروژه ooz-habit-tracker
// مدیریت عادت‌ها + Streak Counter + Dashboard
// -----------------------------

let habits = JSON.parse(localStorage.getItem("habits")) || [];
let chart; // برای نمودار Chart.js

// -----------------------------
// رندر لیست عادت‌ها
// -----------------------------
function renderHabits() {
  const list = document.getElementById("habits");
  list.innerHTML = "";

  habits.forEach((habit, index) => {
    const li = document.createElement("li");
    li.textContent = `${habit.name} - Streak: ${habit.streak}`;

    // دکمه انجام شد
    const btn = document.createElement("button");
    btn.textContent = "✅ انجام شد";
    btn.addEventListener("click", () => markDone(index));

    li.appendChild(btn);
    list.appendChild(li);
  });

  updateChart(); // هر بار لیست رندر شد، نمودار هم آپدیت بشه
}

// -----------------------------
// ثبت انجام شدن عادت
// -----------------------------
function markDone(index) {
  const today = new Date().toDateString();

  // اگر امروز قبلاً ثبت شده
  if (habits[index].lastDone === today) {
    alert("این عادت امروز قبلاً ثبت شده ✅");
    return;
  }

  // بررسی دیروز
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (habits[index].lastDone === yesterday.toDateString()) {
    habits[index].streak += 1; // ادامه streak
  } else {
    habits[index].streak = 1; // شروع دوباره
  }

  habits[index].lastDone = today;
  localStorage.setItem("habits", JSON.stringify(habits));
  renderHabits();
}

// -----------------------------
// آپدیت نمودار
// -----------------------------
function updateChart() {
  const ctx = document.getElementById("progressChart").getContext("2d");
  const labels = habits.map(h => h.name);
  const data = habits.map(h => h.streak);

  if (chart) chart.destroy(); // پاک کردن نمودار قبلی

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Streak (روزهای متوالی)",
        data: data,
        backgroundColor: "#4caf50"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// -----------------------------
// افزودن عادت جدید
// -----------------------------
document.getElementById("add-btn").addEventListener("click", () => {
  const input = document.getElementById("habit-input");
  const name = input.value.trim();
  if (name) {
    habits.push({ name, streak: 0, lastDone: null });
    localStorage.setItem("habits", JSON.stringify(habits));
    renderHabits();
    input.value = "";
  }
});

// -----------------------------
// بارگذاری اولیه
// -----------------------------
renderHabits();
