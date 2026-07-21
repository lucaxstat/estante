import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req) {
  try {
    const data = await req.json()
    const senha = data?.password
    const adminSenha = process.env.ADMIN_PASSWORD
    const jwtSecret = process.env.ADMIN_JWT_SECRET || 'dev-secret'

    if (!adminSenha || !jwtSecret) {
      return NextResponse.json({ success: false, error: 'Server not configured' }, { status: 500 })
    }

    if (senha !== adminSenha) {
      return NextResponse.json({ success: false, error: 'Senha incorreta' }, { status: 401 })
    }

    // Create a simple HMAC-based token (not a full JWT) for dev/testing
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
    const payload = Buffer.from(JSON.stringify({ role: 'admin', iat: Date.now() })).toString('base64url')
    const signature = crypto.createHmac('sha256', jwtSecret).update(`${header}.${payload}`).digest('base64url')
    const token = `${header}.${payload}.${signature}`

    const res = NextResponse.json({ success: true })
    res.headers.set('Set-Cookie', `admin_token=${token}; HttpOnly; Path=/; SameSite=Strict`)
    return res
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
