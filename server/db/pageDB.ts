import { pageDb } from "./db";

type Page = {
  slug: string
}
export const setPage = async (slug: string, data: Page) => {
  await pageDb.doc(slug).set(data)
}

export const getPage = async (slug: string): Promise<Page> => {
  return (await pageDb.doc(slug).get()).data() as Page
}
