'use server'

import { getServerSession } from "next-auth";
import { authConfig } from "@/configs/auth";
import { z } from 'zod'
import { Project, projectFormState, tProject } from "../../types/types";
import { revalidatePath } from "next/cache";

const schema = z.object({
  shortName: z.string().min(1, { message: 'Required' }),
  emailNotify: z.string().min(1, { message: 'Required' }),
  everhourId: z.string().min(1, { message: 'Required' }),
  fullLimit: z.number().gte(1),
  slackChatWebHook: z.string().min(1, { message: 'Required' })
})

export async function actionUpdateParams(prevState: projectFormState, formData: FormData): Promise<projectFormState> {
  const session = await getServerSession(authConfig);
  if (!session) return {
    message: 'Not Logged In',
  }

  const resetResponse = !formData.get('shortName');
  if (resetResponse) return { message: '', errors: {} }

  const project: tProject = {
    shortName: formData.get('shortName') as string,
    emailNotify: formData.get('emailNotify') as string,
    everhourId: formData.get('everhourId') as string,
    fullLimit: Number(formData.get('fullLimit')) as number,
    slackChatWebHook: formData.get('slackChatWebHook') as string,
  }

  const validatedFields = schema.safeParse(project)
  if (!validatedFields.success) {
    return {
      message: 'Submission failed - check form errors',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    await fetch(`${ process.env.API_URL }/parameters`, {
      method: 'POST',
      body: JSON.stringify(project),
      headers: { 'Content-Type': 'application/json' },
    })
    revalidatePath('/parameters')
    revalidatePath('/')
    return {
      message: 'Sucsess - parameters saved!',
    }
  } catch (e) {
    console.log(JSON.stringify(e))
    return {
      message: 'Save parameters error'
    }
  }
}

export const handleRefreshAction = async () => {
  const session = await getServerSession(authConfig);
  if (!session) return {
    message: 'Not Logged In',
  }
  try {
    const res: Response = await fetch(`${ process.env.API_URL }/refresh`, { next: { revalidate: 0 } })
    revalidatePath('/project/[slug]', 'page')
    revalidatePath('/')
    return res.json()
  } catch (e) {
    return { message: 'Refresh request error' }
  }
}

const addProjectSchema = z.object({
  slug: z.string()
    .min(1, { message: 'Required' })
    .regex( /^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Enter a URL compatible string'),
  shortName: z.string().min(1, { message: 'Required' }),
  fullName: z.string().min(1, { message: 'Required' }),
})
export async function addProjectFormAction(prevState: projectFormState, formData: FormData): Promise<projectFormState> {
  const session = await getServerSession(authConfig);
  if (!session) return {
    message: 'Not Logged In',
  }

  const project: Project = {
    slug: formData.get('slug') as string,
    shortName: formData.get('shortName') as string,
    fullName: formData.get('fullName') as string,
  }

  console.log(project)

  const validatedFields = addProjectSchema.safeParse(project)
  if (!validatedFields.success) {
    return {
      message: 'Submission failed - check form errors',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  return { message: JSON.stringify(project) }
}