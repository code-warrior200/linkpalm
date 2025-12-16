# Building Android APK

## Option 1: Using EAS Build (Recommended - Cloud Build)

1. **Initialize EAS project** (if not already done):
   ```bash
   eas init
   ```
   When prompted, choose to create a new project or link to existing one.

2. **Build the APK**:
   ```bash
   eas build --platform android --profile preview
   ```
   
   This will:
   - Build your app in the cloud
   - Generate an APK file
   - Provide a download link when complete

3. **Download the APK**:
   - After the build completes, you'll get a download link
   - Or check your builds at: https://expo.dev/accounts/codewarriorstech/projects/linkpalm/builds

## Option 2: Using Expo Development Build

If you want to test the app during development:

```bash
eas build --platform android --profile development
```

## Build Profiles

- **preview**: Builds an APK for testing (configured in eas.json)
- **production**: Builds an APK for production release
- **development**: Builds a development client

## Notes

- The build process happens in the cloud, so you don't need Android SDK installed
- Builds typically take 10-20 minutes
- You'll receive an email notification when the build is complete
- APK files can be downloaded directly from the Expo dashboard

## Troubleshooting

If you encounter "EAS project not configured" error:
1. Run `eas init` to set up the project
2. Follow the prompts to create or link a project
3. Then run the build command again

