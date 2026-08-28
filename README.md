# Storely React

## Tech Stack
- React
- Tailwind CSS
- shadcn/ui

## Steps to Run

### 1. Using Docker

```bash
docker build --build-arg VITE_API_BASE_URL=https://admin.storly.co.in -t storely-dashboard .
docker run -p 8080:80 storely-dashboard
```

Then visit [http://localhost:8080](http://localhost:8080)

### 2. Using npm (local development)

Create a `.env` file in the project root:

```bash
VITE_API_BASE_URL=https://admin.storly.co.in
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Then visit [http://localhost:5173](http://localhost:5173)