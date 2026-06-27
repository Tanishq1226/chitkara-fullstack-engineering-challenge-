# React + Vite Frontend Dashboard

This React dashboard provides a visual explorer for testing the graph relationship API.

## Setup & Running
```bash
npm install
npm run dev
```
By default, the development server runs on `http://localhost:5173`.

## Features
- **Student Details Header:** Displays credentials read from the backend API response.
- **Connection Health Indicator:** Ping checker that displays whether the backend server is active.
- **Graph Entry Textarea:** Free-form textbox to enter relationships.
- **Quick Templates / Presets:** Pre-defined graphs (Simple Tree, Multiple Trees, Cycles, Multi-Parent, etc.) to quickly populate the input.
- **Structural Summary Panel:** Displays total trees, total cycles, and largest root details.
- **Recursive Tree Renderer:** Renders hierarchies visually as interactive nested node lists with customized connectors and depth/cycle markers.

## Environment Variables
Create a `frontend/.env` to configure the API endpoint location:
```env
VITE_API_URL=http://localhost:3000
```
If omitted, it defaults to `http://localhost:3000`.
