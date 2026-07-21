import { NextResponse } from 'next/server'
import { listDocs, updateDoc, deleteDoc, distinctTags, insertDoc } from '../_store'

export async function GET(req) {
  const url = new URL(req.url)
  const distinct = url.searchParams.get('distinct_tags')
  if (distinct) {
    return NextResponse.json({ success: true, tags: distinctTags() })
  }
  const page = parseInt(url.searchParams.get('page') || '1')
  const per = parseInt(url.searchParams.get('per_page') || '10')
  const docs = listDocs()
  const start = (page - 1) * per
  const pageDocs = docs.slice(start, start + per)
  return NextResponse.json({ success: true, documents: pageDocs, page, has_more: start + per < docs.length })
}

export async function PUT(req) {
  const data = await req.json()
  const updated = updateDoc(data)
  if (!updated) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, document: updated })
}

export async function DELETE(req) {
  try {
    const body = await req.json()
    const ok = deleteDoc(body.id)
    if (!ok) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
