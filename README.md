
Team-Techbaras

This repository contains both the backend and frontend code for a fitness and posture correction application. Follow the instructions below to set up and run the project locally.


---

LIVE DEPLOYMENT

The application is deployed and running at:

https://sanhosting.site

For the best experience, access it via a mobile device.


---

Optimized for Mobile View

This application is designed with a mobile-first approach.

Use a mobile device for a better user experience.

The UI and features are optimized for smartphones and tablets, ensuring smooth navigation and accessibility.



---

Project Overview

Backend: Developed using Python. Python 3.10 is recommended for optimal performance, especially for posture correction features.

Frontend: Built with Node.js to provide a responsive and dynamic user experience.



---

For now, we have implemented only squat analysis

<p align="center">
  <img src="https://i.ibb.co/dxWqZ7b/Screenshot-20250326-122913.jpg" alt="Squat Analysis 1" width="30%">
  <img src="https://i.ibb.co/mFqbKKRF/Screenshot-20250326-122936.jpg" alt="Squat Analysis 2" width="30%">
  <img src="https://i.ibb.co/CKh8dJ3K/Screenshot-20250326-123008.jpg" alt="Squat Analysis 3" width="30%">
</p>  
---

Prerequisites

Backend

Python 3.10 (Recommended). Download it here.


Frontend

Node.js (LTS version recommended). Install it from nodejs.org.



---

Getting Started

Backend Setup

1. Clone the Repository

git clone https://github.com/SanjaiM89/Team-Techbaras.git
cd Team-Techbaras/BackEnd


2. Create Python Virtual Environment

python3.10 -m venv venv #(Recommended)
source venv/bin/activate  # On Windows: venv\Scripts\activate


3. Install Dependencies

pip install -r requirements.txt


4. Run the Backend

python server.py




---

Frontend Setup

1. Navigate to Frontend Directory

cd Team-Techbaras/FrontEnd


2. Install Node.js Dependencies

npm install


3. Launch the Development Server

npm run dev




---

Requirements

Backend: Dependencies listed in requirements.txt.

Frontend: Dependencies managed via package.json.



---

Future Enhancements

Planned features include:

Wearable Device Integration (Coming Soon)

The project will integrate wearable devices for real-time posture and fitness tracking, including:

Live posture monitoring.

Instant feedback and correction alerts.

AI-driven fitness tracking insights.



---

Troubleshooting

Backend Issues: If the virtual environment setup fails, verify the Python version with:

python --version  # or python3 --version

Frontend Issues: If dependencies cause issues, clear and reinstall:

rm -rf node_modules && npm install



---

License

This project is licensed under the MIT License. See LICENSE for details.



