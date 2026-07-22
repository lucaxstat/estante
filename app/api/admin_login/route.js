import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;

    // Busca a senha, verificando os dois nomes possíveis para evitar erro
    const adminPass = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!adminPass) {
      return NextResponse.json({ success: false, error: 'Server not configured' });
    }

    if (password === adminPass) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Senha incorreta' });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro interno no servidor' });
  }
}