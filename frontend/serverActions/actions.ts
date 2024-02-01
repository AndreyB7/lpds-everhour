'use server'

import { getServerSession } from "next-auth";
import { authConfig } from "@/configs/auth";
import { Project, projectFormState, tProject } from "../../types/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { addProjectSchema, updateProjectParamsSchema } from "@/serverActions/validationSchemas";

export async function actionUpdateParams(prevState: projectFormState, formData: FormData): Promise<projectFormState> {
  const session = await getServerSession(authConfig);
  if (!session) return {
    message: 'Not Logged In',
  }

  const resetResponse = !formData.get('shortName');
  if (resetResponse) return { message: '', errors: {} }

  const project = formDataToObject<tProject>(formData)

  const validatedFields = updateProjectParamsSchema.safeParse(project)
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
    revalidateTag('monitoringData')
    revalidateTag('projectOptions')
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
    await fetch(`${ process.env.API_URL }/add-project`, {
      method: 'POST',
      body: JSON.stringify(project),
      headers: { 'Content-Type': 'application/json' },
    })
    revalidatePath('/dashboard')
    revalidateTag('projectOptions')
    return {
      message: 'Sucsess - project created!',
    }
  } catch (e) {
    console.log(JSON.stringify(e))
    return {
      message: 'Save parameters error'
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
