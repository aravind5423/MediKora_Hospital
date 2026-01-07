# MediKora Hospital

**MediKora Hospital** is a modern, comprehensive Hospital Management System designed to streamline healthcare facility operations. It allows hospitals to manage doctors, departments, and appointment slots efficiently while providing a seamless booking experience for patients.


## 🚀 Key Features

*   **🏥 Hospital Dashboard**: An interactive command center with real-time statistics, upcoming appointments, and recent activity logs.
*   **👨‍⚕️ Doctor Management**: easily add, edit, and categorize doctors by specialization and department.
*   **🏢 Department Organization**: Manage various hospital departments and assign doctors accordingly.
*   **📅 Smart Scheduling**: Automated slot generation and management for appointment bookings.
*   **🔐 Secure Authentication**: Robust hospital login and registration system powered by Firebase.
*   **🎨 Modern UI/UX**: A fully responsive, professional interface built with React, Tailwind CSS, and polished animations.

## 🛠️ Tech Stack

*   **Frontend**: React.js (Vite), TypeScript
*   **Styling**: Tailwind CSS, Shadcn/ui (Radix Primitives)
*   **Icons**: Lucide React
*   **Routing**: React Router DOM (v6)
*   **State Management**: React Context API
*   **Forms & Validation**: React Hook Form, Zod
*   **Database & Auth**: Firebase (Firestore, Auth)
*   **Visualization**: Recharts

## 📦 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/medikora-hospital.git
    cd medikora-hospital
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    *   Create a `.env` file in the root directory.
    *   Add your Firebase configuration keys (see `.env.example` if available, or use your own Firebase project settings).
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open in Browser**
    Visit `http://localhost:5173` to view the application.

## 📂 Project Structure

```bash
src/
├── components/       # Reusable UI components
│   ├── dashboard/    # Dashboard-specific widgets (Sidebar, Stats)
│   ├── landing/      # Landing page sections (Hero)
│   └── ui/           # Base UI elements (Buttons, Cards, Inputs)
├── contexts/         # React Contexts (Auth, HospitalData)
├── pages/            # Main application pages (Dashboard, Login, Doctors)
├── lib/              # Utilities and helper functions
├── types/            # TypeScript interfaces
└── App.tsx           # Main application entry point
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
