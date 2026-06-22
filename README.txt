# eclipsium
🌑 Eclipsium is an offline-first fitness tracker for iOS, Android &amp; web. 100% private: no accounts, no internet required. 
✨ Key Features
    📊 Dynamic Dashboard – Track your daily streak, close weekly progress rings, view a 7-day volume chart, and get instant, privacy-safe AI insights.
    📈 Advanced Progress Tracking – Log weight, body fat, muscle mass, and 6 key body measurements. Visualize your journey with interactive line charts covering up to a 1-year timeline.
    🏋️ Smart Workout Builder – Create custom routines organized by muscle groups. Crush your sessions with an active workout mode featuring precise rest timers and haptic feedback.
    🏆 Gamified Profile & Freedom – Level up through a tiered badge system (from Bronze all the way to Eclipse). Swap themes effortlessly and retain full ownership of your data with seamless JSON exports.
    🤖 On-Device AI Coach – Chat 100% offline with an AI trained to answer questions about your progress, workouts, nutrition, and recovery.
    🔒 Military-Grade Security – Your personal data is shielded by AES-256 encryption, with keys securely locked inside iOS Keychain or Android Keystore.
    !!WARNING!! The app is in v1.0.0 some feature are in beta if you found any bug write me an email to: francyx613@gmail.com.
---------------------
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
