import cors from 'cors'
import express from 'express'
import { courses } from '../src/data/courses.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res
    .status(200)
    .type('html')
    .send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Learning Skills Hub API</title>
    <style>
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;margin:32px;line-height:1.5}
      code{background:#f4f4f5;padding:.1rem .3rem;border-radius:.25rem}
      a{color:#2563eb;text-decoration:none}
      a:hover{text-decoration:underline}
      ul{padding-left:18px}
    </style>
  </head>
  <body>
    <h2>Learning Skills Hub API</h2>
    <p>This server provides JSON endpoints:</p>
    <ul>
      <li><a href="/api/health"><code>GET /api/health</code></a></li>
      <li><a href="/api/courses"><code>GET /api/courses</code></a></li>
      <li><code>GET /api/courses/:id</code> (example: <a href="/api/courses/1"><code>/api/courses/1</code></a>)</li>
    </ul>
    <p>Frontend runs separately on Vite (check your terminal for the exact port).</p>
  </body>
</html>`)
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/courses', (_req, res) => {
  res.json(courses)
})

app.get('/api/courses/:id', (req, res) => {
  const { id } = req.params
  const numeric = Number(id)
  const course = courses.find((c) => String(c.id) === String(id) || c.id === numeric)
  if (!course) return res.status(404).json({ error: 'Course not found' })
  return res.json(course)
})

const port = Number(process.env.PORT ?? 5000)
app.listen(port, () => {
  console.log(`[server] listening on http://localhost:${port}`)
})

