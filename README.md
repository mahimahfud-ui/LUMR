# mahimahfud

A cinematic, media-first gallery for photographs, video and creator profiles.

## Included
- Original Three.js atmospheric background with reduced-motion and no-WebGL fallback.
- Editorial image/video gallery and fullscreen viewer.
- Instagram wired to `https://www.instagram.com/mahimahfud/`.
- Configurable YouTube channel via `YOUTUBE_URL`.
- Simple signup/login UI.
- Supabase-ready profiles + media schema with RLS.
- Direct browser-to-Supabase Storage upload architecture for original media.
- Public creator URLs using `/@username`.

## Enable real accounts/uploads
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Add Render env vars: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `YOUTUBE_URL`.
4. Redeploy the Render service.

Never expose a Supabase service-role/secret key in the browser or GitHub.