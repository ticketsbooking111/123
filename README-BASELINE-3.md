# baseline-3 (Minimal Patch)
שדרוג מ-baseline-2 ל-baseline-3 עם טפסי יצירה/עריכה + העלאת קובץ חוזה.
חילוץ את התיקייה הזו על שורש הפרויקט (התיקייה שבה יש `package.json`). אשר דריסה של קבצים קיימים.

## צעדים
1. סגור כל חלון `npm run dev` (אם פתוח).
2. חלץ את ה-ZIP הזה **אל תוך תיקיית הפרויקט** (מאשר דריסה).
3. הרץ:
   ```bash
   npm install
   npm run dev
   ```

## מה נכלל
- src/app/router.tsx (עודכן – ראוטים ל-new/edit)
- src/components/ui/Form.tsx (חדש)
- src/pages/Properties/Edit.tsx (חדש)
- src/pages/Tenants/Edit.tsx (חדש)
- src/pages/Leases/Edit.tsx (חדש, כולל העלאת קובץ)
- src/pages/Options/New.tsx (חדש)
- src/data/db.ts (עודכן – Dexie v2 + טבלת files)
- src/data/migrations.ts (עודכן – migrateToV2)
- src/data/DataProvider.ts (עודכן – saveFile/getFile/removeFile)
