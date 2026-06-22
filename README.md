<p align="center">
  <img src="https://github.com/user-attachments/assets/b8a90d9d-1d2d-4ff4-9caa-d597dac354d9" alt="Eclipsium Logo" width="300">
</p>

<h1 align="center">eclipsium</h1>

<p align="center">
  <strong>The Ultimate Offline-First Fitness Tracker</strong>
</p>

---

🌑 **Eclipsium** is a privacy-focused, offline-first personal fitness tracker built for iOS, Android, and web. No accounts, no cloud sync, and zero internet required — your data stays entirely on your device.

💪 **Key Features:**
* 📊 **Dashboard:** Streaks, progress rings, 7-day volume charts, and instant AI insights.
* 📈 **Progress Tracking:** Log weight, body fat, muscle mass, and 6 key body measurements with 1-year timeline charts.
* 🏋️ **Workout Builder:** Create custom routines by muscle groups. Active session mode with precise rest timers and haptic feedback.
* 🤖 **AI Coach:** Chat 100% offline with an AI trained to answer questions about workouts, progress, nutrition, and recovery.
* 🔒 **Security & Freedom:** Data shielded by AES-256 encryption via iOS Keychain/Android Keystore. Full ownership with JSON export.

---
⚠️ **WARNING:** The app is in v1.0.0 (some features are in beta). If you find any bugs, please write an email to: francyx613@gmail.com

1. How to start 
REQUIREMENTS
------------

  - Node.js 18 or higher
  - npm 9+
  - Expo Go app on your phone (https://expo.dev/go)
    OR Xcode iOS Simulator / Android Emulator


INSTALLATION AND SETUP
----------------------

  git clone https://github.com/fraa33/eclipsium.git
  cd eclipsium
  npm install
  npx expo start

After running "npx expo start":

  Open on iPhone (Expo Go)    -> Scan the QR code with the Camera app
  Open on Android (Expo Go)   -> Scan the QR code with the Expo Go app
  Open in iOS Simulator       -> Press i
  Open in Android Emulator    -> Press a
  Open in Browser             -> Press w


USEFUL COMMANDS
---------------

  Type-check TypeScript
    npx tsc --noEmit

  Run streak logic self-check
    node --experimental-strip-types src/store/streak.test.ts


PROJECT STRUCTURE
-----------------
  src/
  +-- app/
  |   +-- (tabs)/        Main screens: Dashboard, Progress, Workout, Profile
  |   +-- onboarding/    First-run flow (5 steps)
  |   +-- ai-coach.tsx   AI Coach modal
  |   +-- _layout.tsx    Root layout, onboarding/tab gating
  +-- components/
  |   +-- ui/            Reusable primitives: Button, Card, BottomSheet, ProgressRing...
  |   +-- layout/        ScreenWrapper, Header, TabBar
  |   +-- charts/        Data-agnostic charts: LineChart, BarChart, Sparkline, Heatmap
  +-- store/             Zustand stores by domain: user, stats, workout, ai
  +-- constants/         Design system (theme.ts), animations, exercise database
  +-- hooks/             Shared hooks: useTheme, useHaptics, useAnimatedEntry
  +-- utils/             Utilities: encrypted-storage.ts


