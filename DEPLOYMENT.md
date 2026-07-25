# Deployment Guide for GramAI

Since the application requires authentication to deploy (such as logging into Vercel or Firebase), you'll need to run one of these commands manually in your terminal:

## Option 1: Deploy with Vercel (Recommended for Next.js)

Vercel is the creators of Next.js and offers the most seamless deployment experience.

1. Install the Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Run the deploy command from this project directory (`/Users/megha/GRAM_AI/`):
   ```bash
   vercel
   ```

3. Follow the CLI prompts:
   - **Log in** to your Vercel account when prompted in the browser.
   - **Set up and deploy**: Choose "Y"
   - **Scope**: Select your personal account
   - **Link to existing project**: "N"
   - **Project name**: `gram-ai`
   - **Directory**: `./` (default)
   - **Build Settings**: Leave as default (it will autodetect Next.js)

4. Once tested, deploy to production:
   ```bash
   vercel --prod
   ```

## Option 2: Deploy to Firebase Hosting

Since you're using Firebase for your backend, you can also host the Next.js app there using their experimental web frameworks support.

1. Ensure the Firebase CLI is installed:
   ```bash
   npm install -g firebase-tools
   ```

2. Log in to your Google Account:
   ```bash
   firebase login
   ```

3. Initialize Firebase Hosting:
   ```bash
   firebase experiments:enable webframeworks
   firebase init hosting
   ```
   *Select your existing Firebase project or create a new one.*

4. Deploy the application:
   ```bash
   firebase deploy --only hosting
   ```
