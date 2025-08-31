# baseline-2 — UI בסיסי לקריאה בלבד (על Dexie)

בנייה על baseline-1: הוספת Router, עמודי רשימות/פרטים לנכסים ודיירים, קומפוננטות UI קלות, וחיבור ל־DataProvider באמצעות React Query.
אין יצירה/עריכה בשלב זה.

## התקנה והרצה
```bash
npm install
npm run dev
```
בזמן פיתוח ניתן להשתמש בכפתור **"טען דמו"** (מופיע רק ב־DEV) כדי לאכלס את ה-DB בנתוני seed.

## ניווט
- `/` → Redirect ל־`/properties`
- `/properties` → רשימת נכסים
- `/properties/:id` → פרטי נכס
- `/tenants` → רשימת דיירים
- `/tenants/:id` → פרטי דייר

## QA ידני (sanity)
1. פתח `npm run dev` וחכה לחלון Electron.
2. עבור ל־"דיירים" או "נכסים" → אמור להופיע מצב "אין רשומות".
3. לחץ על **"טען דמו"** (בכותרת העמוד) → הרשימות יתמלאו.
4. היכנס לדף פרטי נכס ודף פרטי דייר, וודא:
   - סטטוס מוצג עם Badge.
   - קישורים דו־כיווניים דייר↔נכס עובדים.
   - בטבלאות יש גלילה אופקית במובייל (overflow-x-auto).
5. רפרוש הדף → הנתונים נשמרים (IndexedDB).
6. אין פתיחה אוטומטית של DevTools (אפשר לפתוח ידנית ב־Ctrl+Shift+I).

## דב-כלים
- `src/components/Dev/LoadDemoButton.tsx` — מריץ `seed()` ומרענן קאש של react-query.

## החלטות
- ניהול נתונים בקריאה בלבד דרך hooks: `usePropertiesList`, `useProperty`, `useTenantsList`, `useTenant`.
- שימוש ב־React Query לקאש/טעינה/שגיאות.
- Tailwind לעימוד/ריווחים; RTL נשמר.
