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
