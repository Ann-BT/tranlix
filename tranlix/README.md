# Frontend — Office Translator (React + MUI + TypeScript)

Tổ chức theo **Feature-Based Structure**: mỗi nghiệp vụ là một thư mục khép kín trong
`src/features/`, tự chứa `api / hooks / components / store / types` và **expose ra ngoài
qua `index.ts` (public API)**. Phần còn lại của app chỉ import từ barrel này, không
chọc thẳng vào file nội bộ của feature → giảm coupling, dễ tách/dời feature.

```
src/
  app/        # khởi tạo app: providers, router, theme, query client
  config/     # biến môi trường
  shared/     # dùng chung mọi feature: api client, ui, hooks, lib, types
  features/
    auth/         api/ hooks/ store/ components/ types.ts index.ts
    translation/  api/ hooks/ components/ types.ts index.ts
    jobs/         api/ hooks/ components/ types.ts index.ts
  pages/      # lắp ráp các feature thành màn hình, map với route
```

## Quy ước
- Import chéo feature **chỉ** qua barrel: `import { JobList } from "@features/jobs"`.
- Server state dùng TanStack Query (`hooks/use*`); UI/auth state nhẹ dùng Zustand.
- Gọi API tập trung ở `shared/api/client.ts` (axios + interceptor token + chuẩn hoá lỗi).
- Alias: `@app @shared @features @/...` (khai báo ở `tsconfig.json` + `vite.config.ts`).

## Luồng chính
`HomePage` → `TranslationForm` (upload + chọn ngôn ngữ) → `useCreateTranslation` →
`POST /translations` → job vào hàng đợi. `JobsPage` → `JobList` poll trạng thái
(`useJobPolling`) → tải file khi `completed`.

## Chạy
```bash
npm install
npm run dev      # proxy /api -> http://localhost:8000
```
