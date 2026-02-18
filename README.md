## Smart Bookmark App

### Introduction
Smart Bookmark App is a web application built with Next.js and Supabase, designed to help users manage and organize bookmarks efficiently. It features a dashboard for easy access and management, leveraging modern web technologies for a seamless experience.

### Folder Structure
```
smart-bookmark-app/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── dashboard/
│       └── page.tsx
├── lib/
│   └── supabaseClient.ts
├── public/
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
```

### Initialization & Setup
1. **Clone the repository:**
	```bash
	git clone <repo-url>
	cd smart-bookmark-app
	```
2. **Install dependencies:**
	```bash
	npm install
	```
3. **Configure environment variables:**
	- Create a `.env.local` file in the root directory.
    - Copy variables from `.env.example` to `.env.local`.
	- Add your Supabase credentials and any other required environment variables.

### Running the App
To start the development server:
```bash
npm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

### Build for Production
To build the app for production:
```bash
npm run build
```
To start the production server:
```bash
npm start
```

---
For more details, see the codebase and comments within each file.
