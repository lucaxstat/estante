import { NextResponse } from 'next/server';

export function middleware(req) {
  // Puxa o cabeçalho de autenticação do navegador
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // Substitua 'admin' e 'senha123' pelas credenciais que você quiser
    if (user === 'admin' && pwd === 'senha123') {
      return NextResponse.next();
    }
  }

  // Se a senha estiver errada ou não foi inserida, bloqueia a tela
  return new NextResponse('Acesso Restrito. Digite as credenciais.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Acesso Fechado"',
    },
  });
}

// Define em quais rotas esse bloqueio vai funcionar (aqui, bloqueia o site inteiro)
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};