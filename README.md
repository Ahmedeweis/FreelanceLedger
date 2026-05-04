# Freelance Ledger - Project & Income Tracker

![Project Banner](https://img.shields.io/badge/Freelance--Ledger-Project--Tracker-4F39F6?style=for-the-badge)

![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

## Overview

Freelance Ledger is a financial management application designed for freelancers and small businesses. It facilitates tracking project progress, managing multi-currency income, and calculating earnings over custom date ranges. The system includes professional PDF reporting and a responsive dashboard for comprehensive data visualization.

## Key Features

### Financial Management
*   **Real-time Analytics**: Instant visibility into total earnings, pending balances, and monthly performance.
*   **Transaction Logging**:
    *   **Project-specific Income**: Associate payments directly with active project milestones.
    *   **Standalone Entries**: Log miscellaneous income outside of formal project structures.
    *   **Status Indicators**: Visual differentiation between received and pending payments.
*   **Earnings Calculator**: Automated calculation of total and average monthly income for user-defined periods.

### Project Operations
*   **Lifecycle Tracking**: Monitor project status through distinct phases: New, Completed, Pending, At Risk, or Canceled.
*   **Financial Timeline**: Monthly grouping of all transactions for historical auditing.
*   **Reporting**: Export filtered timelines and financial data to PDF format.
*   **Data Organization**: Multi-parameter sorting by Date, Project Name, or Transaction Amount.

### Technical UI/UX
*   **Responsive Interface**: Optimized layout for mobile and desktop environments using Tailwind CSS.
*   **Modern Components**: Custom-built dropdowns, modal systems, and high-contrast data badges.
*   **User Feedback**: Integrated notification system for real-time operation confirmation.

## Technical Stack

*   **Frontend**: Vue 3 (Composition API)
*   **Build Engine**: Vite
*   **Styling**: Tailwind CSS
*   **Backend**: Node.js / Express
*   **Database**: SQLite
*   **Key Libraries**: `jspdf`, `sweetalert2`, `vue-toastification`, `dayjs`.

## Project Architecture

```
FreelanceLedger/
├── projectscostfront/   # Vue.js Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI Elements
│   │   ├── views/       # Application Pages
│   │   ├── services/    # API & Data Fetching
│   │   └── assets/      # Styles & Static Assets
│   ├── manifest.json    # PWA Support
│   └── index.html       # Application Entry
├── projectscosback/    # Express.js Backend
│   ├── controllers/    # Business Logic
│   ├── routes/         # API Endpoints
│   ├── db.js           # SQLite Configuration
│   └── server.js       # Main Entry Point
└── README.md           # Documentation
```

## Getting Started

### Prerequisites
*   Node.js (LTS recommended)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd FreelanceLedger
    ```

2.  **Backend Configuration**
    ```bash
    cd projectscosback
    npm install
    npm start
    ```

3.  **Frontend Configuration**
    ```bash
    cd ../projectscostfront
    npm install
    npm run dev
    ```

4.  **Access Application**
    Open `http://localhost:5173` in your browser.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss the proposed updates. Ensure consistent coding standards and UI patterns are maintained.
