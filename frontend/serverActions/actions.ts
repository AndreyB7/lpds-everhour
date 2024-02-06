'use server'

import { getServerSession } from "next-auth";
import { authConfig } from "@/configs/auth";
import { Project, projectFormState } from "../../types/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { addProjectSchema, updateProjectParamsSchema } from "@/serverActions/validationSchemas";

export async function actionSetProjectOptions(prevState: projectFormState, formData: FormData): Promise<projectFormState> {
  const session = await getServerSession(authConfig);
  if (!session) return {
    message: 'Not Logged In',
  }

  // reset if no project slug
  const resetResponse = !formData.get('slug');
  if (resetResponse) return { message: '', errors: {} }

  const project = formDataToObject<Project>(formData)

  const validatedFields = updateProjectParamsSchema.safeParse(project)
  if (!validatedFields.success) {
    return {
      message: 'Submission failed - check form errors',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    await fetch(`${ process.env.API_URL }/project/${project.slug}/options`, {
      method: 'POST',
      body: JSON.stringify(project),
      headers: { 'Content-Type': 'application/json' },
    })
    revalidateTag(`projectOptions${project.slug}`)
    revalidateTag('monitoringData')
    return {
      message: 'Sucsess - options saved!',
    }
  } catch (e) {
    console.log(JSON.stringify(e))
    return {
      message: 'Save options error'
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

export async function addProjectFormAction(prevState: projectFormState, formData: FormData): Promise<projectFormState> {
  const session = await getServerSession(authConfig);
  if (!session) return {
    message: 'Not Logged In',
  }

  const project = formDataToObject<Project>(formData)

  const validatedFields = addProjectSchema.safeParse(project)
  if (!validatedFields.success) {
    return {
      message: 'Submission failed - check form errors',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const res = await fetch(`${ process.env.API_URL }/add-project`, {
      method: 'POST',
      body: JSON.stringify(project),
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) {
      revalidateTag('dashboard')
      return {
        message: 'Sucsess - project created!',
      }
    }
    const data = await res.json()
    return {
      message: 'Save options server error',
      errors: data?.error
    }
  } catch (e) {
    console.log(JSON.stringify(e))
    return {
      message: 'Save options request error'
    }
  }
}

const formDataToObject = <T>(formData: FormData): T => {
  const object = {} as T;

  formData.forEach((value, key) => {
    object[key as keyof T] = value as T[keyof T];
  });

  return object;
};
