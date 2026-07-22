import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;

    // Busca a senha, verificando os dois nomes possíveis para evitar erro
    const adminPass = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    const jwtSecret = process.env.ADMIN_JWT_SECRET;

    if (!adminPass || !jwtSecret) {
      return NextResponse.json({ success: false, error: 'Server not configured' });
    }

    if (password !== adminPass) {
      return NextResponse.json({ success: false, error: 'Senha incorreta' });
    }

    return NextResponse.json({ success: false, error: 'Erro interno no servidor' });
  }
}