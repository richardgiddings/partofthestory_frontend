## About

A front-end using react router that calls the FastAPI backend at:
https://github.com/richardgiddings/partofthestory_backend/

This is using client side routing so that it can be deployed as a static site on Render.

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

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