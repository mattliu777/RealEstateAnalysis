# Real Estate Market Lab

Upload a Chinese real-estate survey Excel (支持多 Sheet，如 “经开区市调2025.12.2.xlsx”), normalize the data on the backend with SheetJS, visualize monthly performance with Recharts, and call DeepSeek (OpenAI-compatible) to auto-generate a Chinese market analysis.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (inline `@import "tailwindcss"`)
- Recharts for charts
- SheetJS (`xlsx`) for Excel parsing (server)
- DeepSeek (OpenAI-compatible) API for AI-written analysis

## Getting Started

1. Install dependencies (updates `package-lock.json`):
   ```bash
   npm install
   ```
2. Add your DeepSeek key (optional for offline demo):
   ```bash
   echo "DEEPSEEK_API_KEY=sk-xxx" > .env.local
   # 如需自定义网关:
   echo "DEEPSEEK_BASE_URL=https://api.deepseek.com" >> .env.local
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) and either:
   - Upload your Excel (`.xlsx` / `.xls`, Chinese headers supported: 项目/案名、区域/板块、均价、套数、产品类型、面积、月份).
   - Or click “加载示例数据” to explore the dashboard without a file.

## Notes

- Excel parsing runs on the server (`/api/upload`), not persisted.
- If `DEEPSEEK_API_KEY` is missing, `/api/analyze` returns a local placeholder summary so you can still demo the flow.
- Styling/theme, language toggle, and charts are client-side; parsing and AI calls are server-side.
