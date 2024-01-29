import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
    const data = await request.json()
    const res = await fetch(`${ process.env.API_URL }/add-project`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
    console.log(res)
    if (res.ok) {
      revalidatePath('/dashboard')
      return Response.json({ ...data })
    }
    return new Response(`Server error: ${(await res.json()).error}`, {
      status: 400,
    })
}
