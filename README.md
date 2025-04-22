# CPSC471-DBMS-project

## Setup

### Download Requirements

#### Backend (Django)
- Python 3.10+
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

### Additional Frontend Libraries
If you encounter missing packages, install them:
```sh
npm install recharts react-icons
```

---

## Running the Project

### Backend (Django)
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
npm start
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