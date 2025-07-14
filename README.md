<div align="center">
  <a href="https://github.com/tyronejosee/project_synthesis#gh-light-mode-only" target="_blank">
    <img src="./.github/logo_color.svg" alt="logo-light" width="80">
  </a>
  <a href="https://github.com/tyronejosee/project_synthesis/#gh-dark-mode-only" target="_blank">
    <img src="./.github/logo_color.svg" alt="logo-dark" width="80">
  </a>
</div>

<div align="center">
  <h1><strong>Synthesis</strong></h1>
</div>

<p align="center">
  Comprehensive personal productivity dashboard built with React and Vite. It includes key features like a Pomodoro timer, an interactive Kanban board, customizable timers and alarms, and useful calculators for project management and development.
</p>

<p align="center">
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/typescript-5.x-007ACC" alt="typescript-version">
  </a>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/react-18.3.1-61DAFB" alt="react-version">
  </a>
  <a href="https://vitejs.dev/">
    <img src="https://img.shields.io/badge/vite-5.x-646CFF" alt="vite-version">
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/tailwind_css-3.x-06B6D4" alt="tailwind-css-version">
  </a>
  <a href="https://www.npmjs.com/package/@heroui/react">
    <img src="https://img.shields.io/badge/HeroUI-2.2.9-blueviolet" alt="heroui-version">
  </a>
  <a href="https://zustand-store.github.io/">
    <img src="https://img.shields.io/badge/zustand-4.4.7-FF5733" alt="zustand-version">
  </a>
  <a href="https://reactrouter.com/">
    <img src="https://img.shields.io/badge/react--router--dom-6.20.1-CA4245" alt="react-router-dom-version">
  </a>
</p>

## 🗃️ Repository

Clone the repository.

```bash
git clone git@github.com:tyronejosee/project_synthesis.git
```

## 🌱 Contributing

If you'd like to contribute to the project:

1. Fork the repository.
2. Create a branch with your feature: `git checkout -b feature/new-feature`.
3. Make your changes and commit them: `git commit -m 'feat: added new feature'`.
4. Push your changes: `git push origin feature/new-feature`.
5. Open a Pull Request and submit your changes to the `main` branch.

The app was created with **React** and **Vite**, using **React Router DOM** for routing and **PNPM** as the package manager.

## ✅ Requirements

* [Node.js](https://nodejs.org/) >= 16.8.0
* [PNPM](https://pnpm.io/installation) >= 7.0

## ⚙️ Installation

To get started, make sure you have [PNPM](https://pnpm.io/installation) installed. Then follow these steps from the project root:

Install dependencies:

```bash
pnpm install
```

Start the development server at `http://localhost:5173/` (Vite's default port).

```bash
pnpm dev
```

Build the app for production:

```bash
pnpm build
```

Preview the app in production mode:

```bash
pnpm preview
```

Run the linter to check code quality:

```bash
pnpm lint
```

Run the tests (if available):

```bash
pnpm test
```

## 📂 Routing Configuration

This project uses **React Router DOM** to manage routing. Page components are defined in the `src/app/App.tsx` file using `<Route>` components. Example:

```tsx
<Routes>
  <Route path="/" element={<DashboardPage />} />
  <Route path="/pomodoro" element={<PomodoroPage />} />
  <Route path="/kanban" element={<KanbanPage />} />
  <Route path="/timers" element={<TimersPage />} />
  <Route path="/alarms" element={<AlarmsPage />} />
  <Route path="/calculators" element={<CalculatorsPage />} />
</Routes>
```

You can deploy this app to platforms like [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/), or any service that supports Node.js and React applications.

## ⚖️ License

This project is licensed under the [Apache License 2.0](https://github.com/tyronejosee/project_synthesis/blob/main/LICENSE).

Enjoy! 🎉
