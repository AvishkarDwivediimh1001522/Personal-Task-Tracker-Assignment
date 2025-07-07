# Personalised Task Tracker

## 1. Overview

Task Manager is an next-generation task management application that helps users organize, track, and prioritize their daily activities. Built with React and Vite, this application features a clean, intuitive interface with robust functionality for task management, filtering, and persistence.


- [Live demo of website (static)](https://avishkar-personalise-task-manager.netlify.app/) for the better Visual experiance. 

## 2. Features

- User authentication with localStorage persistence

- Task creation, editing, and deletion

- Task completion toggling

- Filtering by task status

- Data persistence across sessions

- Responsive design

## 3. Steup Instruction

###  1 - Prerequisites

- Node.js (v14+)
- npm (v7+)

### 2 - Installation

1.  **Create a new Vite project:**

    ```bash
    1.npm create vite@latest Personalised-Task-Tracker-Assignment

    2. cd Task-Tracker-Assignment
    ```
2.  **Install dependencies**

     ````bash
     npm install tailwindcss @tailwindcss/vite react-router-dom
     ````

3.  **Configure Vite (vite.config.js):**

    ````javascript
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import tailwindcss from '@tailwindcss/vite';

    export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ]
    });
    ````
    These code is in tailwind css vite opend source library.

4.  **Import Tailwind CSS in your main CSS file:**

    ````CSS
     @import "tailwindcss";
    ````

5.  **Install react-router-dom for next.js similar experice**

    ````bash
     npm install react-router-dom
    ````

6. **Start the server**

   ````bash
    npm run dev
   ````

## 4. **Project Structure/Architect**

   ````text
    src/
    ├── pages/
    │   ├── LoginPage.jsx
    │   ├── DashboardPage.jsx
    │   ├── TasksPage.jsx
    │   └── AboutPage.jsx
    ├── utilities/
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   └── Layout.jsx
    ├── components/
    │   ├── AuthGuard.jsx
    │   ├── TaskForm.jsx
    │   ├── TaskItem.jsx
    │   └── TaskFilter.jsx
    ├── router.jsx
    └── main.jsx
   ````

   These are the main file architecture of project.

## 5. **Key Implementation**

1. **Authentication system**

   ````jsx
        // LoginPage.jsx
        const handleLogin = (e) => {
        e.preventDefault();
        if (username.trim()) {
            localStorage.setItem('username', username);
            navigate('/dashboard');
        }
        };

        // AuthGuard.jsx
        useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) navigate('/');
        }, []);
    ````

2. **Task Management**

    ````jsx
        // TaskForm.jsx - Add Task
        const newTask = {
        id: Date.now(),
        title,
        description,
        completed: false,
        createdAt: new Date().toISOString()
        };

        // TaskItem.jsx - Delete Confirmation
        const handleDelete = () => {
        if (window.confirm('Delete this task?')) {
            onDelete(task.id);
        }
        };

    ````

3.  **Task Display**

    ````jsx
     // TaskItem.jsx
        <div className={`border-l-4 ${
        task.completed 
            ? 'border-green-500 bg-green-50' 
            : 'border-yellow-500 bg-yellow-50'
        }`}>
        <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
        </div>
    ````

4.  **Task Filtering**

    ````jsx
    // TasksPage.jsx
        const counts = {
        all: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        pending: tasks.filter(t => !t.completed).length
        };

        // TaskFilter.jsx
        <button onClick={() => onFilterChange('completed')}>
        Completed <span>{counts.completed}</span>
        </button>

    ````

5.  **Data Persistence**

    ````jsx
        // useLocalStorage.js
        const [tasks, setTasks] = useState(() => {
        const storedTasks = localStorage.getItem('tasks');
        return storedTasks ? JSON.parse(storedTasks) : [];
        });

        useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        }, [tasks]);
    
    ````

    It's simple meaning is that when we refresh the browser the data will store into localSotrage and will not lost/gone away after refreshing or restarting the browser.

## 6. **Technologies**

- React.js

- Vite

- Tailwind CSS

- React Router DOM

## 7. Acknowledgments

Special thanks to the open-source community for providing the tools and libraries that made this project possible. The React ecosystem continues to evolve and empower developers to create amazing web experiences.



## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
