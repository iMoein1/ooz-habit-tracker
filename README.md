# 🟣 ooz Habit Tracker

> **Your personal command center for focus, consistency, and delight.**
> *Design meets productivity in a privacy-first, lightweight package.*

![Project Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Tech](https://img.shields.io/badge/Built%20With-Vanilla%20JS-yellow?style=for-the-badge)

**ooz** is a beautifully designed, responsive, and feature-rich habit and task tracker built entirely with **Vanilla JavaScript**. No frameworks, no backend dependencies, just pure performance. It focuses on user experience with smooth animations, dark/light modes, and full localization support (English & Persian).

---

## ✨ Key Features

### 🎨 UI/UX & Customization
* **Glassmorphism Design:** Modern aesthetic with smooth transitions and interactions.
* **Dark/Light Mode:** Toggle between a deep, focus-oriented dark mode and a crisp light mode.
* **Bilingual (i18n):** Full support for **English (LTR)** and **Persian (RTL)** with automatic layout adjustment.

### 📋 Productivity Tools
* **Habit Tracking:** * Visual progress bars and streak counters.
    * Interactive charts (Chart.js) to visualize consistency.
    * "Best Streak" and "Average Progress" analytics.
* **Task Management:** * Add tasks with dates.
    * **Smart Calendar:** Filter tasks by selecting dates on a custom-built mini-calendar.
    * **Soft Delete:** Accidentally deleted a task? Undo it immediately with the Toast notification system.
    * Daily productivity meter.

### 🔒 Privacy & Data
* **100% Client-Side:** All data lives in your browser's **LocalStorage**. No servers, no tracking.
* **Client-Side Auth:** A simulated authentication system with hashing (SHA-256) to support multiple profiles on one device.
* **Data Portability:** Export your entire history to JSON and import it anytime.

### ⚡ Power User Features
* **Keyboard Shortcuts:** Navigate and create tasks without lifting your fingers from the keyboard.

---

## 🚀 Quick Start

Since **ooz** is a static web application, you don't need `npm` or `build` steps.

1.  **Clone the repository:**
    ```bash
    git clone (https://github.com/iMoein1/ooz-habit-tracker.git)
    ```
2.  **Open the project:**
    Navigate to the folder and open `index.html` in your browser.
    
    *Tip: For the best experience, run it with a lightweight local server (like Live Server in VS Code) to avoid CORS issues with modules.*

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| **`H`** | Go to **Home** |
| **`B`** | Go to **Habits** |
| **`K`** | Go to **Tasks** |
| **`S`** | Go to **Settings** |
| **`N`** | **New** Habit or Task (Context aware) |
| **`T`** | Filter Tasks for **Today** |
| **`D`** | Toggle **Dark/Light** Theme |
| **`L`** | Switch **Language** (EN/FA) |

---

## 📂 Project Structure

```text
ooz-tracker/
├── css/
│   ├── style.css       # Main styling (Glassmorphism, Layouts)
│   └── style.css.map   # Source maps
├── js/
│   ├── app.js          # Core logic (UI, CRUD, Charts, DOM Manipulation)
│   └── auth.js         # Authentication, Hashing, Session Management
├── index.html          # Dashboard & Overview
├── habits.html         # Habit Tracker Interface
├── tasks.html          # Task Management & Calendar
├── settings.html       # Theme, Lang, Data Management
├── login.html          # Auth Entry
└── signup.html         # Registration


🛠️ Tech Stack
HTML5: Semantic structure.

CSS3: Custom Properties (Variables), Flexbox, Grid, Media Queries.

JavaScript (ES6+): * LocalStorage API for database.

SubtleCrypto API for password hashing.

Intl API for date formatting.

Libraries: * Chart.js (via CDN) for data visualization.

🤝 Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
Distributed under the MIT License. See LICENSE for more information.

 Made with ❤️ by ooz 

