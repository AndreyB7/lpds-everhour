import { revalidatePath, revalidateTag } from "next/cache";

type Params = {
  params: {
    slug: string
  }
}

export async function GET(request: Request, { params }: Params) {
  const res = await fetch(`${ process.env.API_URL }/page/${ params.slug }`)
  if (res.ok) {
    // revalidatePath('/dashboard')
    revalidatePath('/', 'layout')
    return Response.json(await res.json())
  }
  return new Response(`Server error: ${ (await res.json()).error }`, {
    status: 400,
  })
}

export async function POST(request: Request, { params }: Params) {
  const data = await request.json()
  const res = await fetch(`${ process.env.API_URL }/page/${ params.slug }`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
  if (res.ok) {
    revalidateTag(`page${ params.slug }`)
    return Response.json(await res.json())
  }
  return new Response(`Server error: ${ (await res.json()).error }`, {
    status: 400,
  })
}
