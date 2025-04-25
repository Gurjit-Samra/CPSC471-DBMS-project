# CPSC471-DBMS-project

## Setup

### Download Requirements

#### Backend (Django)
- Python 3.10+
- MySQL
- pip
- [Recommended] Create a virtual environment:
  ```sh
  python3 -m venv venv
  source venv/bin/activate
  ```
- Install backend dependencies:
  ```sh
  pip install -r requirements.txt
  ```

#### Frontend (React)
- Node.js (v18+ recommended)
- npm (comes with Node.js)

Install frontend dependencies:
```sh
cd tech_storefront/frontend
npm install
```

### Additional Frontend Libraries & Setup

If you encounter missing packages, install them:

```sh
npm init -y
npm i webpack webpack-cli --save-dev
npm i @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
npm i react react-dom --save-dev
npm install @mui/material @emotion/react @emotion/styled
npm install @babel/plugin-proposal-class-properties
npm install react-router-dom
npm install @mui/icons-material
npm install recharts react-icons
```

---

## Running the Project

### Backend (Django)

Make sure you have edited `settings.py` (tech_storefront\tech_storefront\settings.py) to configure your current MySQL database details before continuing!

From the project root:
```sh
cd tech_storefront
python manage.py migrate
python manage.py runserver
```
The backend will be available at [http://localhost:8000](http://localhost:8000).

### Frontend (React)
In a new terminal:
```sh
cd tech_storefront/frontend
npm run dev
```
The frontend will be available at [http://localhost:3000](http://localhost:3000).

---

## Admin Access

- Create a superuser for admin access:
  ```sh
  cd tech_storefront
  python manage.py createsuperuser
  ```
- Access the Django admin at [http://localhost:8000/admin/](http://localhost:8000/admin/)

---

## Notes

- Make sure both backend and frontend servers are running for full functionality.
- If you add new Python or JS dependencies, update `requirements.txt` or run `npm install <package>` as needed.
- For any issues, check the terminal output for errors and install missing dependencies as prompted.