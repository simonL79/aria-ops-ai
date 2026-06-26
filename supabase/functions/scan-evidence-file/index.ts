import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

// Allowed evidence MIME types (mirrors the client allow-list).
const ACCEPTED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/heic',
  'application/pdf',
])

const MAX_FILE_BYTES = 15 * 1024 * 1024 // 15MB

// EICAR anti-malware test signature (industry-standard harmless test virus).
const EICAR =
  'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*'

type ScanResult = { safe: boolean; reason?: string }

function bytesToAscii(bytes: Uint8Array, limit = 4096): string {
  const slice = bytes.subarray(0, limit)
  let s = ''
  for (let i = 0; i < slice.length; i++) s += String.fromCharCode(slice[i])
  return s
}

function fullAscii(bytes: Uint8Array): string {
  // Decode the whole file as latin1 so we can string-match payloads anywhere.
  let s = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    s += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)))
  }
  return s
}

function magicMatches(declaredType: string, bytes: Uint8Array): boolean {
  const b = bytes
  const startsWith = (...sig: number[]) => sig.every((v, i) => b[i] === v)
  switch (declaredType) {
    case 'application/pdf':
      return startsWith(0x25, 0x50, 0x44, 0x46) // %PDF
    case 'image/png':
      return startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)
    case 'image/jpeg':
      return startsWith(0xff, 0xd8, 0xff)
    case 'image/gif':
      return startsWith(0x47, 0x49, 0x46, 0x38) // GIF8
    case 'image/webp':
      return (
        startsWith(0x52, 0x49, 0x46, 0x46) && // RIFF
        b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50 // WEBP
      )
    case 'image/heic':
      // ftyp box at offset 4
      return b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70
    default:
      return false
  }
}

function hasExecutableSignature(bytes: Uint8Array): boolean {
  const head = bytes
  const eq = (off: number, ...sig: number[]) => sig.every((v, i) => head[off + i] === v)
  // DOS/PE executable (MZ)
  if (eq(0, 0x4d, 0x5a)) return true
  // ELF
  if (eq(0, 0x7f, 0x45, 0x4c, 0x46)) return true
  // Mach-O (32/64, both endian) + universal binary
  const mach = [0xfeedface, 0xfeedfacf, 0xcefaedfe, 0xcffaedfe, 0xcafebabe]
  const word =
    (head[0] << 24) | (head[1] << 16) | (head[2] << 8) | head[3]
  if (mach.includes(word >>> 0)) return true
  // Java class
  if (eq(0, 0xca, 0xfe, 0xba, 0xbe)) return true
  // Windows shortcut / script wrappers handled via text scan below
  return false
}

function scan(declaredType: string, bytes: Uint8Array): ScanResult {
  if (bytes.length === 0) return { safe: false, reason: 'File is empty.' }
  if (bytes.length > MAX_FILE_BYTES) return { safe: false, reason: 'File exceeds the 15MB limit.' }
  if (!ACCEPTED_TYPES.has(declaredType))
    return { safe: false, reason: 'Unsupported file type.' }

  // 1. Magic-byte verification — declared type must match real content.
  if (!magicMatches(declaredType, bytes))
    return { safe: false, reason: 'File contents do not match its declared type (possible disguised file).' }

  // 2. Embedded executable signatures.
  if (hasExecutableSignature(bytes))
    return { safe: false, reason: 'Embedded executable code detected.' }

  const fullText = fullAscii(bytes)

  // 3. EICAR test signature.
  if (fullText.includes(EICAR))
    return { safe: false, reason: 'Malware test signature (EICAR) detected.' }

  // 4. Dangerous active content. PDFs may legitimately contain some keywords,
  //    but auto-executing / launching constructs are treated as unsafe.
  if (declaredType === 'application/pdf') {
    const danger = ['/Launch', '/OpenAction', '/AA', '/JavaScript', '/JS', '/EmbeddedFile']
    const hit = danger.find((d) => fullText.includes(d))
    if (hit) return { safe: false, reason: `PDF contains active/auto-run content (${hit}).` }
  }

  // 5. Script / HTML injection inside files that should be pure binary images.
  const lowerHead = bytesToAscii(bytes, 8192).toLowerCase()
  const scriptMarkers = ['<script', '<?php', '<%', '<!doctype html', '<html', 'powershell', 'cmd.exe']
  const sHit = scriptMarkers.find((m) => lowerHead.includes(m))
  if (sHit) return { safe: false, reason: `Suspicious script content detected (${sHit}).` }

  return { safe: true }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body.dataUrl !== 'string' || typeof body.type !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { dataUrl, type, name } = body
    const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl
    let bytes: Uint8Array
    try {
      const bin = atob(base64)
      bytes = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    } catch {
      return new Response(JSON.stringify({ error: 'Could not decode file.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const result = scan(type, bytes)
    return new Response(
      JSON.stringify({ name: name ?? null, safe: result.safe, reason: result.reason ?? null }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (_err) {
    return new Response(JSON.stringify({ error: 'Scan failed. Please try again.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
