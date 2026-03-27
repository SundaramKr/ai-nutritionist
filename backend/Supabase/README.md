## Supabase public endpoints (hackathon-simple)

You asked for 3 publicly callable endpoints (phone is the only identifier).

### Endpoints (after deploy)

- **POST** `/api/save-user?phone=...`
  - Deployed as Edge Function: `save-user`
- **GET** `/api/get-plan?phone=...`
  - Deployed as Edge Function: `get-plan`
- **GET** `/api/get-details?phone=...`
  - Deployed as Edge Function: `get-details`

- **POST** `/auth-upsert`
  - Deployed as Edge Function: `auth-upsert`
  - Upserts `public.users` based on `phone` so your signup/login flow creates the DB entry.

- **POST** `/password-signup`
  - Deployed as Edge Function: `password-signup`
  - Stores a bcrypt `password_hash` in `public.users`.

- **POST** `/password-login`
  - Deployed as Edge Function: `password-login`
  - Verifies phone/password and returns `{ ok: true }` on success.

Supabase Edge Function URLs look like:

`https://<PROJECT_REF>.functions.supabase.co/<FUNCTION_NAME>?phone=...`

So your 3 URLs will be:

- `https://<PROJECT_REF>.functions.supabase.co/save-user?phone=...`
- `https://<PROJECT_REF>.functions.supabase.co/get-plan?phone=...`
- `https://<PROJECT_REF>.functions.supabase.co/get-details?phone=...`
- `https://<PROJECT_REF>.functions.supabase.co/auth-upsert`

`auth-upsert` request body:

```json
{
  "phone": "15551234567",
  "name": "Sam",
  "user_details": { "age": 26, "goal": "cut" }
}
```

`password-signup` request body:

```json
{
  "phone": "15551234567",
  "name": "Sam",
  "password": "yourStrongPassword",
  "user_details": { "age": 26, "goal": "cut" }
}
```

`password-login` request body:

```json
{
  "phone": "15551234567",
  "password": "yourStrongPassword"
}
```

### Database setup

Run `supabase/sql/schema.sql` in the Supabase SQL editor.

### Deploy

Recommended: install Supabase CLI, then:

```bash
supabase login
supabase link --project-ref <PROJECT_REF>
supabase functions deploy save-user
supabase functions deploy get-plan
supabase functions deploy get-details
```

Set secrets for the functions (service-role stays server-side):

```bash
supabase secrets set PROJECT_URL="https://<PROJECT_REF>.supabase.co"
supabase secrets set SERVICE_ROLE_KEY="<SERVICE_ROLE_KEY>"
```

### Request bodies

Save details:

```json
{
  "type": "details",
  "name": "Sam",
  "user_details": { "age": 26, "goal": "cut", "allergies": ["peanuts"] }
}
```

Save a meal plan (also upserts user row):

```json
{
  "type": "plan",
  "meal_plan": { "days": [ { "day": 1, "meals": [] } ] }
}
```

Note: `meal_plans` keeps only the latest plan per phone (new saves overwrite the old row).

