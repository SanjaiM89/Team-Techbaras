
# Team-Techbaras 🚀

Welcome to the **Team-Techbaras** project! This repository contains both the backend and frontend code for an awesome application. Follow the instructions below to get started with setting up and running the project locally.

---

## ✨ Project Overview
- **Backend**: Built with Python 3.10, powered by a virtual environment.
- **Frontend**: Crafted with Node.js for a sleek and dynamic user experience.

---

## 🛠️ Prerequisites

### Backend
- **Python 3.10**  
  Ensure you have Python 3.10 installed. [Download it here](https://www.python.org/downloads/release/python-3100/) if needed.

### Frontend
- **Node.js**  
  Install Node.js (includes npm) from [nodejs.org](https://nodejs.org/). Recommended: LTS version.

---

## 🚀 Getting Started

### Backend Setup
1. **Clone the Repository**
   ```bash
   git clone https://github.com/SanjaiM89/Team-Techbaras.git
   cd Team-Techbaras/BackEnd
   ```

2. **Set Up Virtual Environment**
   ```bash
   python3.10 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Backend**
   ```bash
   python server.py  # Adjust this based on your entry point
   ```

### Frontend Setup
1. **Navigate to Frontend Directory**
   ```bash
   cd ../FrontEnd  # Adjust path if different
   ```

2. **Install Node.js Dependencies**
   ```bash
   npm i
   ```

3. **Launch the Development Server**
   ```bash
   npm run dev
   ```

   Open your browser to `http://localhost:3000` (or the port specified in your console) to see the app in action!

---

## 📋 Requirements
- **Backend**: See `requirements.txt` for Python packages.
- **Frontend**: Managed via `package.json`.

---

## 🌟 Tips
- Ensure your terminal is in the correct directory (`BackEnd` or `FrontEnd`) before running commands.
- If you encounter issues, check the [Troubleshooting](#troubleshooting) section below.

---

## 🛠️ Troubleshooting
- **Backend**: If `venv` fails, verify Python 3.10 with `python3.10 --version`.
- **Frontend**: Clear `node_modules` and reinstall with `rm -rf node_modules && npm i` if dependencies act up.

---

## 📜 License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

