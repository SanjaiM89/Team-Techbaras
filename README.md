

# Team-Techbaras 🚀

Welcome to the Team-Techbaras project! This repository contains both the backend and frontend code for an awesome application. Follow the instructions below to get started with setting up and running the project locally.

## ✨ Project Overview

- **Backend**: Built with Python, with Python 3.10 recommended for posture correction features.
- **Frontend**: Crafted with Node.js for a sleek and dynamic user experience.

## 🛠️ Prerequisites

### Backend
- **Python**: Any recent version will work, but Python 3.10 is recommended for optimal performance (especially for posture correction features). Download it [here](https://www.python.org/downloads/) if needed.

### Frontend
- **Node.js**: Install Node.js (includes npm) from [nodejs.org](https://nodejs.org/). Recommended: LTS version.

## 🚀 Getting Started

### Backend Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/SanjaiM89/Team-Techbaras.git
   cd Team-Techbaras/BackEnd
   ```

2. **Create Python Virtual Environment**
   ```bash
   python -m venv venv #(NOT RECOMMENDED)
   python3.10 -m venv venv #(RECOMMENDED)
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Backend**
   ```bash
   python server.py
   ```

### Frontend Setup

1. **Navigate to Frontend Directory**
2. open another terminal, and move to front end using :

   ```bash
   cd Team-Techbaras/FrontEnd
   ```

3. **Install Node.js Dependencies**
   ```bash
   npm i
   ```

4. **Launch the Development Server**
   ```bash
   npm run dev
   ```
   - Open your browser to `http://localhost:3000` (or the port specified in your console) to see the app in action!

## 📋 Requirements

- **Backend**: See `requirements.txt` for Python packages.
- **Frontend**: Managed via `package.json`.

## 🌟 Tips

- Ensure your terminal is in the correct directory (`BackEnd` or `FrontEnd`) before running commands.
- If you encounter issues, check the **Troubleshooting** section below.

## 🛠️ Troubleshooting

- **Backend**: If the virtual environment fails, verify your Python version with `python --version`. Use `python3 --version` on some systems.
- **Frontend**: Clear `node_modules` and reinstall with `rm -rf node_modules && npm i` if dependencies act up.

## 📜 License
This project is licensed under the MIT License. See `LICENSE` for details.

 
