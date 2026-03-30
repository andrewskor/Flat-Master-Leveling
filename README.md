# FlatMasterLeveling - Static Site

Converted from Spring Boot + Thymeleaf to plain HTML/CSS/JS for Netlify hosting.

## Folder Structure
```
/
├── index.html          → Home page
├── self-level.html     → Self-Level services page
├── epoxy-page.html     → Epoxy services page
├── _redirects          → Netlify routing config
├── js/                 → Copy from src/main/resources/static/js/
├── styles/             → Copy from src/main/resources/static/styles/
└── images/             → Copy from src/main/resources/static/images/
```

## What you need to copy manually
Copy these folders from your Spring Boot project into this folder:
- `src/main/resources/static/js/` → `js/`
- `src/main/resources/static/styles/` → `styles/`
- `src/main/resources/static/images/` → `images/`

## Deploy to Netlify
1. Push this folder to a GitHub repo
2. Connect repo to Netlify
3. No build command needed — just set publish directory to `/`
