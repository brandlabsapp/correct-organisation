# Supabase Vault Storage Setup

## Does the bucket need to be public?

**No.** The `vault` bucket can stay **private**. Uploads work when you add **Storage policies** that allow the operations you need. Public vs private only controls whether files are readable without auth; uploads still require explicit policies.

## Why "Failed to fetch" / StorageUnknownError?

With **0 policies** on a private bucket, Supabase Storage denies all access. The app uploads from the browser using the **anon** key, so you must add a policy that allows **INSERT** (upload) for that bucket.

## Add a policy so uploads work

1. In **Supabase Dashboard** go to **Storage** → select the **vault** bucket → **Policies** (or **SQL Editor**).
2. Run one of the following.

### Option A: Allow uploads to the vault bucket (anon key, path under `vault/`)

Use this if your app only uses the anon key (no Supabase Auth):

```sql
-- Allow uploads to the vault bucket under the vault/ path (vault/{companyId}/...)
CREATE POLICY "Allow vault uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'vault'
  AND (storage.foldername(name))[1] = 'vault'
);
```

### Option B: Allow all uploads to the vault bucket (simpler, less restrictive)

```sql
CREATE POLICY "Allow vault uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'vault');
```

### Optional: Allow read/update/delete for the same paths

If you need to read or update objects (e.g. for signed URLs or overwrites):

```sql
-- Allow SELECT (read) for vault bucket
CREATE POLICY "Allow vault read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'vault');

-- Allow UPDATE (overwrite) for vault bucket
CREATE POLICY "Allow vault update"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'vault')
WITH CHECK (bucket_id = 'vault');

-- Allow DELETE for vault bucket
CREATE POLICY "Allow vault delete"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'vault');
```

After adding the INSERT policy, try uploading again from the app.

## Are company folders created automatically?

**Yes.** Supabase Storage has no separate “create folder” step. When you upload a file to a path like:

- `vault/1/root/123-file.pdf`
- `vault/1/a80a866f-ba82-4873-96ec-a442b42b4635/456-doc.pdf`
- `vault/2/root/789-report.pdf`

the path is the object key; any “folder” (e.g. `vault`, `vault/1`, `vault/1/root`) is just a prefix. So **vault**, **company IDs**, and **folder IDs** are created automatically as part of the object path when you upload. You don’t need to create them beforehand.
