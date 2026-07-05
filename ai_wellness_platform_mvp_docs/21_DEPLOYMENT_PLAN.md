# Deployment Plan

## MVP Deployment Recommendation

Use a simple but production-ready deployment:

- Frontend/API: Vercel or Railway
- Database: Neon, Supabase, Railway Postgres, AWS RDS, or Azure Database for PostgreSQL
- Redis: Upstash Redis or Railway Redis
- Storage: Cloudflare R2
- AI: OpenAI API
- WhatsApp: Meta WhatsApp Cloud API
- CI/CD: GitHub Actions

## Environments

Use:
- local
- staging
- production

## Environment Variables

```env
DATABASE_URL=
REDIS_URL=
AUTH_SECRET=
APP_URL=
OPENAI_API_KEY=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_APP_SECRET=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET=
CLOUDFLARE_R2_ENDPOINT=
```

## Deployment Steps

1. Create GitHub repository.
2. Add app code.
3. Configure database.
4. Run migrations.
5. Configure Redis.
6. Configure WhatsApp webhook.
7. Configure environment variables.
8. Deploy staging.
9. Run tests.
10. Deploy production.
11. Verify WhatsApp inbound/outbound.
12. Verify daily reminder job.
13. Verify admin access.
14. Verify account deletion.
15. Enable monitoring.

## Database Migrations

Use Drizzle migrations.

Commands:
```bash
npm run db:generate
npm run db:migrate
```

## CI/CD Pipeline

Minimum checks:
- TypeScript check
- Lint
- Unit tests
- Build
- Migration check

## Monitoring

MVP:
- Application logs
- Error tracking
- AI usage logs
- Failed jobs dashboard
- WhatsApp failed message logs

Later:
- Sentry
- OpenTelemetry
- Logtail/Better Stack
- Uptime monitoring

## Backup

Minimum:
- Daily database backups
- Backup retention 7 to 30 days
- Test restore procedure

## Production Launch Checklist

- Terms page live
- Privacy page live
- Wellness disclaimer live
- WhatsApp opt-in working
- Webhook verified
- Admin role protected
- Rate limits enabled
- AI safety tests passed
- Database backups enabled
- Error tracking enabled
- Logs do not contain secrets
