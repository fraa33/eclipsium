ECLIPSIUM
=========

Eclipsium is a personal fitness tracking app built with Expo SDK 56 and React Native.
It works completely offline, requires no account, and stores all data locally on the device.
Track workouts, body measurements, and progress over time — nothing ever leaves your phone.


WHAT THE APP DOES
-----------------

Dashboard
  Displays a daily streak counter with fire animation, weekly progress rings
  (volume / calories / sessions), a 7-day bar chart, and a personalized AI tip.

Progress (Body Stats)
  Log weight, body fat percentage, lean muscle mass, and 6 body measurements
  (chest, waist, hips, arm, thigh, calf). View trends on a smooth line chart
  for periods from 1 week up to 1 year.

Workout
  Create custom workout routines with exercises grouped by muscle. Start an
  active session with a live progress bar, rest timer with haptic alerts, and
  quick-start from the last used routine.

Profile
  7-tier badge system (Bronze to Eclipse) that unlocks as you train. Export all
  your data as JSON. Toggle between Dark Premium and Glassmorphism themes.
  Reset account to start fresh.

AI Coach
  Offline chat assistant with context-aware responses about your progress,
  workout splits, nutrition, and recovery. No API calls, no data sent anywhere.

Onboarding
  5-step first-run flow: name, gender/age, weight/height (metric or imperial),
  goal selection, celebration screen.

Security
  All persisted data is AES-256 encrypted. The encryption key is stored in the
  iOS Keychain or Android Keystore (via expo-secure-store). Data survives app
  restarts and is wiped only on explicit logout or app uninstall.


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


PRIVACY AND SECURITY
--------------------

All data stays on the device (AsyncStorage + Keychain/Keystore).
No backend, no account, no telemetry. The AI Coach runs entirely offline.
Closing and reopening the app never deletes your data.
Data is only removed if you explicitly log out from the Profile screen
or uninstall the app from your device.


LICENSE
-------

MIT
