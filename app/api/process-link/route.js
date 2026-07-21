import { NextResponse } from 'next/server'
import { insertDoc } from '../_store'

export async function POST(req) {
  try {
    const data = await req.json()
    const url = data?.url || process.env.TEST_DOCUMENT_URL || 'https://example.com/sample-doc'
    // Create a simple document record
    const doc = insertDoc({
      titulo: 'Documento de teste',
      conteudo_snippet: 'Resumo automático do documento fornecido pelo teste.',
      drive_url: url,
      tags: ['teste']
    })
    return NextResponse.json({ sucesso: true, documento: doc })
  } catch (err) {
    return NextResponse.json({ sucesso: false, erro: String(err) }, { status: 500 })
  }
}
