# **Team-Techbaras**  

This repository contains both the **backend** and **frontend** code for a fitness and posture correction application. Follow the instructions below to set up and run the project locally.  

---

## **LIVE DEPLOYMENT**  

The application is deployed and running at:  
### **[https://sanhosting.site](https://sanhosting.site)**  

For the best experience, access it via a mobile device.

---

## **Optimized for Mobile View**  

This application is designed with a mobile-first approach.  
- Use a mobile device for a better user experience.  
- The UI and features are optimized for smartphones and tablets, ensuring smooth navigation and accessibility.  

---

## **Project Overview**  
- **Backend:** Developed using Python. Python 3.10 is recommended for optimal performance, especially for posture correction features.  
- **Frontend:** Built with Node.js to provide a responsive and dynamic user experience.  

---

## **Prerequisites**  

### **Backend**  
- **Python 3.10** (Recommended). Download it [here](https://www.python.org/downloads/).  

### **Frontend**  
- **Node.js** (LTS version recommended). Install it from [nodejs.org](https://nodejs.org/).  

---

## **Getting Started**  

### **Backend Setup**  

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/SanjaiM89/Team-Techbaras.git
   cd Team-Techbaras/BackEnd
   ```

2. **Create Python Virtual Environment**  
   ```bash
   python3.10 -m venv venv #(Recommended)
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

---

### **Frontend Setup**  

1. **Navigate to Frontend Directory**  
   ```bash
   cd Team-Techbaras/FrontEnd
   ```

2. **Install Node.js Dependencies**  
   ```bash
   npm install
   ```

3. **Launch the Development Server**  
   ```bash
   npm run dev
   ```

---

## **Requirements**  
- **Backend:** Dependencies listed in `requirements.txt`.  
- **Frontend:** Dependencies managed via `package.json`.  

---

## **Future Enhancements**  
Planned features include:  

### **Wearable Device Integration (Coming Soon)**  
The project will integrate **wearable devices** for real-time posture and fitness tracking, including:  
- Live posture monitoring.  
- Instant feedback and correction alerts.  
- AI-driven fitness tracking insights.  

---

## **Troubleshooting**  
- **Backend Issues:** If the virtual environment setup fails, verify the Python version with:  
   ```bash
   python --version  # or python3 --version
   ```
- **Frontend Issues:** If dependencies cause issues, clear and reinstall:  
   ```bash
   rm -rf node_modules && npm install
   ```

---

## **License**  
This project is licensed under the **MIT License**. See `LICENSE` for details.  

