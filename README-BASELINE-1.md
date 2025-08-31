# baseline-1 — מודל נתונים, אימות, שירות, מיגרציה (ללא UI חדש)

בנייה על גבי baseline-0: Vite + React + Electron + Tailwind, ללא שינויי UI.
גרסה זו מוסיפה **מודלים (TypeScript), סכמות Zod, Dexie (IndexedDB) עם מיגרציות, שכבת שירות, Seed, בדיקות, וסקריפט sanity**.

## התקנה והרצה

```bash
npm install
npm run sanity    # מריץ reset → seed → בדיקות מהירות לקונסול
npm run test      # Vitest (Node + fake-indexeddb)
npm run dev       # (אופציונלי) UI dev כמו ב-baseline-0
```

> סביבת Node לא כוללת IndexedDB, לכן בריצות sanity/test נעשה שימוש ב־**fake-indexeddb** כדי לאפשר לדאטה־לייר לעבוד מחוץ לדפדפן.

## sanity-check (מה מצופה בקונסול)

- הודעת `[seeded]` עם ספירת ישויות (2 נכסים, 3 דיירים, 2 חוזים).
- הודעת `[stats]` עם מזהי חוזים שפג תוקפם בקרוב ו־checksUntil קרוב.
- הודעת `[after endLease]` שבה סטטוס הנכס של החוזה הראשון מתעדכן ל־`vacant`.
- בסוף: `Sanity OK ✅`.

## מבנה נתונים (תקציר)

- `Property`, `Tenant`, `Lease`, `Option` מוגדרים ב־`src/domain/types.ts`
- סכמות Zod ב־`src/domain/schemas.ts` משמשות ל־validate לפני כתיבה
- Dexie DB + טבלאות ב־`src/data/db.ts` (גרסה 1)
- מיגרציות אפליקטיביות ב־`src/data/migrations.ts` (דוגמה: הוספת `checksUntil`)
- שכבת שירות ב־`src/data/DataProvider.ts` עם CRUD וקשרים

## החלטות יישומיות

- **מחיקת נכס** תיכשל אם קיימים דיירים/חוזים משויכים (אפשר לשנות למחיקה מדורגת בשלבים מתקדמים).
- **מחיקת דייר** תיכשל אם יש `leaseId` פעיל.
- **מחיקת חוזה** מנתקת את `tenant.leaseId`, מעדכנת `property.status` ל־`vacant` ומוחקת אופציות של החוזה.
- **מיגרציה**: מנגנון פשוט מבוסס meta(`schemaVersion`). ב־targetVersion=2 נוסף שדה `checksUntil` ל־Lease (איידמפוטנט).

## קבצים עיקריים

- `src/domain/types.ts`, `src/domain/schemas.ts`
- `src/data/db.ts`, `src/data/migrations.ts`, `src/data/DataProvider.ts`, `src/data/seed.ts`
- `src/scripts/sanity.ts`
- `src/tests/*` + `vitest.config.ts`

## שדרוג מ-baseline-0

- לא נשברו סקריפטי dev/build של Vite/Electron.
- נוספו סקריפטים: `sanity`, `test`.
- נוספו תלויות: `dexie`, `nanoid`, `zod` (אם טרם היה).
- תלויות dev: `vitest`, `@types/node`, `tsx`, `typescript`, `fake-indexeddb`.
