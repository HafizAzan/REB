# EstateX API

NestJS REST API for EstateX. Runs independently from the Next.js frontend.

```bash
copy .env.example .env
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

- API: http://localhost:4000/api
- Swagger: http://localhost:4000/api/docs
- Health: http://localhost:4000/api/health

See the root [README](../README.md) for full setup, seed accounts, and architecture notes.
