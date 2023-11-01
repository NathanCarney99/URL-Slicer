# URL Slicer

URL Slicer is a web application that allows you to take a long URL and shorten it. This project consists of both a front-end built with React and a back-end implemented in Flask, connected to a Firebase Realtime Database for URL management.

## Front-end (React)

### Technologies Used
- React
- nanoid
- Firebase Realtime Database
- valid-url
- react-bootstrap

### How to Run

1. Install the required dependencies using `npm install`.
2. Set up a Firebase project and configure it by replacing the Firebase configuration in `src/App.js` with your project's configuration.
3. Run the front-end by executing `npm start`.

### Features

- Shorten a long URL.
- Optionally choose a custom alias for your shortened URL.
- Copy the shortened URL to the clipboard.

### How it Works

1. Enter the original URL you want to shorten.
2. Optionally enter a custom alias for your shortened URL.
3. Click the "Slice It" button to generate the shortened URL.
4. If successful, the shortened URL will be displayed, and you can copy it to the clipboard.

## Back-end (Flask)

### Technologies Used
- Flask
- Firebase Realtime Database

### How to Run

1. Install the required dependencies using `pip install Flask firebase-admin`.
2. Set up your Firebase project and download the `ServiceAccountKey.json` to the root directory.
3. Run the back-end by executing `python server.py`.

### Features

- Redirect short URLs to their original long URLs.

### How it Works

- Access a short URL, and the server will redirect you to the corresponding original long URL if it exists in the Firebase database.

## Deployment

This project can be deployed to a hosting service of your choice, ensuring the necessary environment variables are set and Firebase configuration is correctly set up.

Enjoy!