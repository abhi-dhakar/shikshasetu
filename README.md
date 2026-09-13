# ShikshaSetu Tuition

ShikshaSetu is a Next.js tuition platform for demo bookings, contact enquiries, tutor applications, and a protected admin desk.

## Requirements

- Node.js 20 or newer
- PostgreSQL 14 or newer

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` in the project root:

   ```env
   DATABASE_URL=postgresql://postgres:<password>@127.0.0.1:5432/shiksha
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=<temporary-password>
   ADMIN_SESSION_SECRET=<long-random-secret>
   ADMIN_RATE_LIMIT_PEPPER=<long-random-value>
   ```

   URL-encode special characters in the PostgreSQL password. For example, `@` becomes `%40`.

3. Create or update the database tables:

   ```bash
   npx drizzle-kit push
   ```

4. Create the admin account configured in `.env`:

   ```bash
   npm run seed:admin
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000` for the website or `http://localhost:3000/admin/login` for the admin desk.

## Scripts

| Command                | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Start the development server                  |
| `npm run build`        | Create a production build                     |
| `npm run start`        | Start the production server                   |
| `npm run lint`         | Run ESLint                                    |
| `npm run typecheck`    | Run TypeScript checks                         |
| `npm run seed:admin`   | Create or update the configured admin account |
| `npx drizzle-kit push` | Apply the Drizzle schema to PostgreSQL        |

## Database

The schema is defined in `src/db/schema.ts`. The main tables are:

- `demo_requests`
- `tutor_applications`
- `contact_messages`
- `admin_accounts`
- `admin_login_attempts`
- `admin_audit_logs`

Do not commit `.env` or production credentials. Use strong, unique secrets outside local development.
