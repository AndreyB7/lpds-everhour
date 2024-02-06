import { revalidateTag } from "next/cache";

type Params = {
  params: {
    slug: string
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const res = await fetch(`${ process.env.API_URL }/project/${ params.slug }/delete`, {
    method: 'DELETE',
  })
  if (res.ok) {
    revalidateTag('dashboard')
    return Response.json(await res.json())
  }
  return new Response(`Server error: ${ (await res.json()).error }`, {
    status: 400,
  })
}