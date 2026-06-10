import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const ACCOUNT_ID = '4942421717b64dea6563f65c1081e51d'
const KV_NAMESPACE_ID = 'd5bea23310f24ffe862ec5d21849acef'
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN

if (!API_TOKEN) {
  console.error('✘ CLOUDFLARE_API_TOKEN is not set. Skipping KV sync.')
  process.exit(0)
}

const dataDir = join(process.cwd(), 'src/data')
const files = readdirSync(dataDir).filter(f => f.endsWith('.json'))

const pairs = files.map(file => ({
  key: file,
  value: readFileSync(join(dataDir, file), 'utf8'),
}))

const res = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}/bulk`,
  {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pairs),
  }
)

const result = await res.json()

if (!result.success) {
  console.error('✘ KV sync failed:', JSON.stringify(result.errors, null, 2))
  process.exit(1)
}

console.log(`✓ Synced ${files.length} files to KV: ${files.join(', ')}`)
