## About

A front-end using react router that calls the FastAPI backend at:
https://github.com/richardgiddings/partofthestory_backend/

This is using client side routing so that it can be deployed as a static site on Render.

## Screenshots

### About page

![About page](screenshots/about_page.png?raw=true)

### Logged Out - Home page

![Logged Out - Home page](screenshots/logged_out_home_page.png?raw=true)

### Logged In - Home page

![Logged In - Home page](screenshots/logged_in_home_page.png?raw=true)

### Logged In - My Stories

![Logged In - My Stories](screenshots/logged_in_my_stories.png?raw=true)

### Logged In - Write a part of a story

![Logged In - Write a part of a story](screenshots/logged_in_write_part.png?raw=true)

## Installation

Install the dependencies:

```bash
npm install
```

## Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Environment variables

We need an environment variable (in an .env file or the like) VITE_APP_URL for the backend url, with port if required.

e.g. 
VITE_APP_URL=http://127.0.0.1:8000

To email support from the About page we need an environment variable VITE_APP_EMAIL with the email address.