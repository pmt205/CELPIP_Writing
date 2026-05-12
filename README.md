# CELPIP Writing Practice Web App

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

A modern, single-page web application that mimics the official CELPIP Writing test environment for effective practice. Built with React and TypeScript, featuring AI-powered feedback, realistic timers, and comprehensive progress tracking.

## Screenshots

<!-- Add screenshots here -->
> _Screenshot placeholder: Add images of the app in action_

## Features

- **Two Task Types** - Email (Task 1) and Survey Response (Task 2) with accurate timers (27 min and 26 min)
- **Question Bank** - 30 practice questions (15 per task type) included out of the box
- **AI-Powered Feedback** - Integrated with Google Gemini API for detailed writing analysis
- **Realistic Writing Interface** - Countdown timer, word count, and browser spellcheck
- **Practice History** - Full history with progress tracking and statistics
- **Dark Mode** - Toggle between light and dark themes
- **PWA Installable** - Install as a native-like app on desktop and mobile
- **Admin Panel** - Add, edit, and delete questions without touching code
- **Auto-Save Drafts** - Never lose your writing; drafts persist in localStorage
- **Fully Responsive** - Works on desktop, tablet, and mobile devices

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool and dev server |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Zustand | State management |
| Google Generative AI SDK | AI feedback via Gemini API |
| React Router | Client-side routing |

## Quick Start

```bash
git clone <repo-url>
cd CELPIP_Writing
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Build for Production

```bash
npm run build
npm run preview
```

The production build will be output to the `dist/` directory.

## Project Structure

```
CELPIP_Writing/
├── index.html                  # Entry HTML file
├── package.json                # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS theme and plugins
├── postcss.config.js           # PostCSS config
├── public/
│   └── favicon.svg             # App icon (SVG)
└── src/
    ├── main.tsx                # App entry point
    ├── App.tsx                 # Root component with routing
    ├── index.css               # Global styles and Tailwind imports
    ├── types/index.ts          # TypeScript interfaces
    ├── store/
    │   ├── useAppStore.ts      # Main application state (Zustand)
    │   └── useTimerStore.ts    # Timer state management
    ├── data/
    │   └── questions.json      # Question bank (15 Task 1 + 15 Task 2)
    ├── utils/
    │   ├── localStorage.ts     # LocalStorage helpers
    │   ├── wordCount.ts        # Word counting utility
    │   └── gemini.ts           # Gemini API integration
    ├── components/
    │   ├── Layout/             # Header and Layout wrapper
    │   ├── Dashboard/          # Dashboard and stats cards
    │   ├── Practice/           # Practice session components
    │   ├── AI/                 # AI feedback and settings
    │   ├── History/            # History list and detail views
    │   ├── Admin/              # Admin panel for question management
    │   └── Instructions/       # Writing instructions panel
    └── pages/                  # Route page components
        ├── DashboardPage.tsx
        ├── PracticePage.tsx
        ├── HistoryPage.tsx
        ├── SettingsPage.tsx
        └── AdminPage.tsx
```

## API Key Setup

This app uses the Google Gemini API for AI-powered writing feedback. To set it up:

1. Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open the app and navigate to **Settings**
3. Enter your API key in the provided field
4. Select a model (default: `gemini-2.0-flash`)
5. Click Save

Your API key is stored locally in your browser's localStorage and is never sent to any server other than the Google Gemini API.

> **Note:** The AI feedback feature is optional. The app works fully without an API key for practice sessions, timers, and history tracking.

## Adding Questions

### Via Admin UI (Recommended)

1. Go to **Settings** and enable Admin Mode
2. Navigate to the **Admin** page
3. Use the form to add new questions for Task 1 (Email) or Task 2 (Survey)
4. Edit or delete existing questions as needed
5. Use the **Export** button to back up your question bank
6. Use the **Import** button to restore from a backup

### Via JSON File (Requires Rebuild)

Edit `src/data/questions.json` directly. The file follows this format:

**Task 1 (Email) example:**
```json
{
  "id": "t1_custom_1",
  "taskType": 1,
  "prompt": "Write an email to your landlord requesting a repair.",
  "context": "The kitchen faucet has been leaking for two weeks. You have already mentioned it verbally but nothing has been done.",
  "bulletPoints": [
    "Describe the problem",
    "Explain what you have already done",
    "Request specific action and timeline"
  ]
}
```

**Task 2 (Survey Response) example:**
```json
{
  "id": "t2_custom_1",
  "taskType": 2,
  "prompt": "Respond to a survey about remote work policies.",
  "context": "Your company is considering making remote work permanent. They want employee input.",
  "options": [
    "Fully remote",
    "Hybrid (3 days office, 2 days home)",
    "Return to office full-time"
  ],
  "questionText": "Which work arrangement do you prefer and why?"
}
```

### Import/Export

Use the Admin panel's Import and Export buttons to transfer question banks between browsers or share them with others.

## Customization

### Theme Colors

Edit `tailwind.config.js` to change the CELPIP brand colors:

```js
colors: {
  celpip: {
    blue: '#003366',
    lightblue: '#0066CC',
    accent: '#0099FF',
    dark: '#001a33'
  }
}
```

### Timer Durations

Timer durations are set to match the official CELPIP test:
- Task 1 (Email): 27 minutes
- Task 2 (Survey Response): 26 minutes

These values are defined in the practice session component.

### Word Count Ranges

The recommended word count ranges displayed during practice can be adjusted in the WritingArea component.

## PWA Installation

This app can be installed as a Progressive Web App for an app-like experience:

### Desktop (Chrome/Edge)

1. Open the app in your browser
2. Look for the install icon in the address bar (or the three-dot menu)
3. Click "Install" to add it to your desktop

### Mobile (Android - Chrome)

1. Open the app in Chrome
2. Tap the three-dot menu
3. Select "Add to Home screen" or "Install app"
4. The app will appear on your home screen

### Mobile (iOS - Safari)

1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

Once installed, the app works offline for practice sessions (AI feedback requires an internet connection).

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run the linter: `npm run lint`
5. Commit your changes: `git commit -m "feat: add your feature"`
6. Push to your branch: `git push origin feature/your-feature`
7. Open a Pull Request

## License

MIT License. See [LICENSE](LICENSE) for details.
