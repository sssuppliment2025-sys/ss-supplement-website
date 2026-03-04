import fs from "node:fs"
import path from "node:path"

const parseEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) return {}

  const raw = fs.readFileSync(filePath, "utf8")
  const out = {}
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    out[key] = value
  }
  return out
}

const docsDir = process.cwd()
const rootDir = path.resolve(docsDir, "..")

const mergedEnv = {
  ...parseEnvFile(path.join(rootDir, ".env.example")),
  ...parseEnvFile(path.join(rootDir, ".env")),
  ...parseEnvFile(path.join(rootDir, ".env.local")),
  ...parseEnvFile(path.join(docsDir, ".env.example")),
  ...parseEnvFile(path.join(docsDir, ".env")),
  ...parseEnvFile(path.join(docsDir, ".env.local")),
  ...process.env,
}

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: mergedEnv.NEXT_PUBLIC_API_URL || mergedEnv.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000",
    NEXT_PUBLIC_EMAILJS_SERVICE_ID:
      mergedEnv.NEXT_PUBLIC_EMAILJS_SERVICE_ID || mergedEnv.NEXT_PUBLIC_SERVICE_ID || mergedEnv.EMAILJS_SERVICE_ID || "",
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID:
      mergedEnv.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || mergedEnv.NEXT_PUBLIC_TEMPLATE_ID || mergedEnv.EMAILJS_TEMPLATE_ID || "",
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY:
      mergedEnv.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || mergedEnv.NEXT_PUBLIC_EMAILJS_KEY || mergedEnv.EMAILJS_PUBLIC_KEY || "",
  },
}

export default nextConfig
