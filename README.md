Deploying Mobile App (React Native) & Creating the SuperAdmin
------------------------
. Download and install Node JS here: https://nodejs.org/en/download/
. Download and install a development IDE of your choice, recommended: https://code.visualstudio.com/download
. Open Visual Studio Code application
. Create a new Workspace
. Set workspace destination to your "Frontend" folder in the envato download given.
. Edit app.json | package.json | .env | files to match your name/version and other needs
. Open the Visual Studio Code terminal via the top menu bar (Terminal -> New Terminal) or (shortcut key: CTRL + SHIFT + `)
. Type in the terminal: npm install
. Wait until it installs
. Install Expo CLI by also typing the command: npm install --global expo-cli
You are almost there.
. Edit the host URL by going to: /components/constants/Environment.js and changing the backendUrl = "your_host_here"
. (Optional) To view current build, type the command: npm run start
. (Optional) Wait until Expo Web appears, then select Run in Web Browser
. While the backend server is running: Once the application loads, select New User -> Register
. Type the superadmin email that you typed in the dashboard
. Register with the same superadmin email you typed in the backend .env file.
. You have now set up the superadmin and can now log in the dashboard.
You have finished the front-end setup. To deploy the application:
Building Android App:
. In the Visual Studio Code, type command: expo build:android
. You will receive the following message in the terminal:

	[exp] No currently active or previous builds for this project.
	Would you like to upload a keystore or have us generate one for you?
	If you don't know what this means, let us handle it! :)
	1) Let Expo handle the process!
	2) I want to upload my own keystore!

. Select option 1, or option 2 if you know what you are doing and have done this before.
. If chosen option 1, save the keystore file for uploading to Google Dev Console later.
. Wait until the application builds.
. Once complete, the terminal will show you a URL to download the apk file.
. Upload the apk file to Google and enjoy your application!

Building iOS app:
. In the Visual Studio Code, type command: expo build:ios
. You will receive the following message in the terminal:

	[exp] No currently active or previous builds for this project.
	? How would you like to upload your credentials?
	(Use arrow keys)
	❯ Expo handles all credentials, you can still provide overrides
	I will provide all the credentials and files needed, Expo does no validation

. If you have iOS credentials ready, select the option above.
. Optionally let Expo handle credentials if you are unsure what to do.
. Wait for the build to complete.
. You will be given a link to the .ipa file you will need to upload to the Apple Store.