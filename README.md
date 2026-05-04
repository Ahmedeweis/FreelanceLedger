# 📊 Freelance Ledger - Professional Project & Income Tracker

![Project Banner](https://img.shields.io/badge/Freelance--Ledger-Professional--Tracker-4F39F6?style=for-the-badge)

![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

## 📖 Overview

**Freelance Ledger** is a sophisticated, full-featured financial management application designed specifically for freelancers and small businesses. It provides a seamless experience for tracking project progress, managing multi-currency income, calculating monthly earnings, and generating professional PDF reports. It features a modern, responsive dashboard with advanced sorting and filtering capabilities.

## 🚀 Features

### 👤 Financial Management
*   **Comprehensive Summary**: Real-time view of Total Earned (Ever), Pending Balances, and Monthly Income.
*   **Income Tracking**:
    *   **Project-linked Income**: Track payments specific to active projects.
    *   **Standalone Income**: Log income not tied to a specific project.
    *   **Received vs Pending**: Visual indicators for payment status.
*   **Earnings Calculator**: Custom date range tool to calculate total and average monthly earnings.

### 🛠️ Project & Operation Management
*   **Active Project Tracking**: Manage project status (New, Completed, Pending, At Risk, Canceled).
*   **Monthly Timeline**: Interactive history of all financial transactions grouped by month.
*   **Professional Reporting**: Export your monthly timeline or filtered data to PDF with a single click.
*   **Advanced Sorting**: Sort projects and income by Date, Name, or Amount dynamically.

### 🎨 UI/UX Excellence
*   **Modern Dashboard**: Clean, professional interface with high-contrast status badges and responsive layouts.
*   **Custom Components**: Professional custom dropdowns, animated modals, and interactive charts.
*   **Real-time Feedback**: Integrated SweetAlert2 for confirmations and Vue-Toastification for live action updates.

## 🛠️ Tech Stack

*   **Frontend**: [Vue 3](https://vuejs.org/) (Composition API)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Backend**: [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
*   **Database**: [SQLite](https://www.sqlite.org/)
*   **Utilities**: `jspdf` (Reporting), `sweetalert2` (Dialogs), `vue-toastification` (Notifications), `dayjs` (Date Handling).

## 📂 Project Structure

```
FreelanceLedger/
├── projectscostfront/   # Frontend Vue application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── views/       # Main page views (Dashboard)
│   │   ├── services/    # API integration layer
│   │   └── assets/      # Static assets & styles
│   ├── manifest.json    # PWA configuration
│   └── index.html       # Entry point
├── projectscosback/    # Backend Express API
│   ├── db.js           # Database configuration
│   ├── server.js       # API routes & server logic
│   └── database.sqlite # SQLite data storage
└── README.md           # Project documentation
```

## ⚡ Getting Started

### Prerequisites
*   Node.js (LTS version recommended)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd FreelanceLedger
    ```

2.  **Setup Backend**:
    ```bash
    cd projectscosback
    npm install
    npm start
    ```

3.  **Setup Frontend**:
    ```bash
    cd ../projectscostfront
    npm install
    npm run dev
    ```

4.  **Open your browser** at `http://localhost:5173`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. We value clean code, consistent UI patterns, and thorough documentation.
