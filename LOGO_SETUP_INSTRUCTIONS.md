# Logo Setup Instructions

https://expo.dev/accounts/codewarriorstech/projects/linkpalm/builds/11289d69-ae0a-4920-b1a1-0ff3610c8282

To use the "Palm Link" logo in your app, please follow these steps:

## Step 1: Save the Logo Image

1. Save the logo image file to the `assets` folder in your project
2. Name the file: `logo.png`
3. Recommended dimensions:
   - **Icon**: 1024x1024 pixels (square)
   - **Splash Screen**: 1284x2778 pixels (iPhone 14 Pro Max size) or 2048x2732 pixels
   - **Adaptive Icon**: 1024x1024 pixels (square, with safe area)

## Step 2: Image Requirements

For best results:
- **Icon**: Should be square (1024x1024px) with the logo centered
- **Splash Screen**: Can use the full logo with gradient background
- **Adaptive Icon**: Square format with logo centered (Android will handle the shape)

## Step 3: File Location

Place the logo file at: `assets/logo.png`

## Step 4: Verify Configuration

The `app.json` has been updated to use:
- App name: "Palm Link"
- Icon: `./assets/logo.png`
- Splash screen: `./assets/logo.png` with olive-green background (#8B9A5B)
- Adaptive icon: `./assets/logo.png` with matching background

## Step 5: Rebuild the App

After adding the logo file, you may need to:
1. Clear the Expo cache: `npx expo start -c`
2. Rebuild the app for native changes to take effect

## Notes

- The splash screen background color (#8B9A5B) matches the olive-green from your logo gradient
- If you have separate files for different sizes, you can create:
  - `logo-icon.png` (1024x1024 for icon)
  - `logo-splash.png` (for splash screen)
  - Update `app.json` accordingly

