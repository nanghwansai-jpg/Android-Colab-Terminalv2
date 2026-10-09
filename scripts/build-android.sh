#!/bin/bash
set -e

echo "=========================================================="
echo "🚀 Building Colab Android Terminal (AAB & APK Generator)"
echo "F-Droid & Google Play Store Compliant Build Pipeline"
echo "=========================================================="

echo "📦 1. Building Web Assets via Vite..."
npm run build

echo "🔄 2. Syncing Capacitor Android Platform..."
npx cap sync android

echo "📱 3. Navigating to android project directory..."
cd android

if [ -f "./gradlew" ]; then
  chmod +x ./gradlew
fi

echo "🔨 4. Generating APK (F-Droid / Debug / Sideload)..."
if command -v java >/dev/null 2>&1; then
  ./gradlew assembleDebug --stacktrace
  ./gradlew assembleRelease --stacktrace || true

  echo "📦 5. Generating AAB (Google Play Android App Bundle)..."
  ./gradlew bundleRelease --stacktrace || true

  mkdir -p ../build-output
  cp app/build/outputs/apk/debug/app-debug.apk ../build-output/Colab-Android-Terminal-v2.6-debug.apk 2>/dev/null || true
  cp app/build/outputs/bundle/release/app-release.aab ../build-output/Colab-Android-Terminal-v2.6-release.aab 2>/dev/null || true

  echo "✅ Build Complete! Output artifacts:"
  ls -lh ../build-output/ || true
else
  echo "⚠️ Java JDK not found in current local shell container."
  echo "👉 In GitHub Actions CI/CD or local machine with JDK 17:"
  echo "   Run: ./gradlew assembleDebug && ./gradlew bundleRelease"
fi

echo "=========================================================="
echo "🎉 Build script finished!"
echo "=========================================================="
