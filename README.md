# CPSC471-DBMS-project

NOTE: All the project functionalities can be found in our Final Report with images included (in the visual interface section).

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
python manage.py runserver 0.0.0.0:8000
```
The backend will be available at [http://localhost:8000](http://localhost:8000).

### Frontend (React)
In a new terminal:
```sh
cd tech_storefront/frontend
npm run dev
```
The frontend will be available at [http://localhost:3000](http://localhost:3000).

### Visiting the Storefront

Once the Backend and the Frontend have been configured, you can now visit http://127.0.0.1:8000/ to play with the site!

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

## Bonuses

### Configuring the AI

This techfront can be configured to include an AI support chatbot for customers. The Chatbot is tailored and has access to the non-sensitive parts of the database, the website structure, the support email, etc.

- Head over to https://platform.openai.com/api-keys and create a new secret key.
- Log in to the techfront with an admin user, and head over to the admin dashboard
- At the very bottom, you can set your respective Open AI API Key to power the tailored the Chatbot!

### The Mobile App

As seen in the final report, this techfront also has a companion app. We have developed this companion app with Capacitor (https://capacitorjs.com/).

To use the companion app, you will need to download Android Studio and all it's respective dependencies from here: https://developer.android.com/studio

- Load Android Studio and load/compile the app files in \TechFrontMobile.
- This time, when running the backend, use `py manage.py runserver 0.0.0.0:8000`, this makes it so that the Android Studio emulator can interact with the local database.
- You must also have capacitor-android and capcitor-cordova-android-plugins within this director (they are not included because they are big files), so install them within your project root 
``
npm install @capacitor/android @capacitor/cli
npm install @capacitor/cordova-android-plugins
``
Then sync
``
npx cap add android
npx cap sync android
``
Then assemble/build the app in Android Studio

- Now click the green play button on the middle top of the screen on Android Studio, this should boot up one of your virtual devices (it should prompt you to create one if you don't already have one created).
- Once the phone boots up, the app might either automatically open, or you will have to find the app icon, if it is the latter, please refer to the final report *Screenshots of the UI* section to see the app icon.
- Now you will have the app fully installed on your virtual device, and everything is synced with other devices as well! For example, if you log into the account on your PC's Chrome, and add something to the wishlist, this change is also reflected on the app!

Note: Configuring this app may lead to some issues depending on your machine, for example, firewall/security configurations may not allow the emulator to interact with http://127.0.0.1:8000/, etc. I did not experience this, but I am referencing it just in case. Sometimes I had A LOT of issues with the virtual devices, I found that if an error occurs, shut down the virtual device from the device manager in Android Studio, and click the run app green play icon again, rather than clicking the run app green play icon while the virtual device is already on.

### MySQL Workbench

Once the database is configured, you can use MySQL Workbench to easily inspect the relational model of the database.