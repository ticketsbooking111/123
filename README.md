# מערכת ניהול נכסים ודיירים — baseline-0

שלד מערכת עם Vite + React + Electron + TailwindCSS.
מוכן להרצה ולהמשך פיתוח לפי שלבי ה־Roadmap.

## איך מריצים (Development)

1. ודא שמותקן Node.js (LTS מומלץ).
2. בתיקייה זו הרץ:
   ```bash
   npm install
   npm run dev
   ```
3. הסקריפט יאתחל את שרת הפיתוח של Vite,
   וברגע שיעלה על פורט 5173 — Electron ייפתח אוטומטית.

> טיפ: אם Electron לא נפתח, אפשר להריץ בנפרד:
> `npm run dev` (Vite) ואז בחלון נוסף `npm run electron:dev`.

## Build ל־Frontend (Production Preview)

```bash
npm run build
npm run preview
```

> בשלב מאוחר יותר (release-1.0.0) נוסיף תהליך אריזה מלא ל־Electron.

## מה בפנים

- **Vite + React**: ממשק בסיסי עם Tailwind.
- **Electron**: חלון דסקטופ שמציג את ה־React App.
- **TailwindCSS**: מוכן לשימוש (postcss + tailwind.config).
- **Zod**: מוכן לשימוש לוולידציה בשלבים הבאים.

## מבנה תיקיות קצר

```
property-manager-baseline-0/
├─ electron/
│  └─ main.js           # תהליך ראשי של Electron
├─ src/
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css
├─ index.html
├─ package.json
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
└─ README.md
```

## הערות

- זהו **baseline-0**: תשתית בלבד. בשלבים הבאים נוסיף מודל נתונים, UI, יבוא, דשבורד וכו'.
- קבצי ESLint הוגדרו כתלות בלבד — חוקים יתווספו כשנרצה.
