import { z } from "zod";

export const updateProjectParamsSchema = z.object({
  shortName: z.string().min(1, { message: 'Required' }),
  emailNotify: z.string().min(1, { message: 'Required' }),
  everhourId: z.string().min(1, { message: 'Required' }),
  fullLimit: z.coerce.number().gte(1),
  slackChatWebHook: z.string().min(1, { message: 'Required' })
})

export const addProjectSchema = z.object({
  slug: z.string()
    .min(1, { message: 'Required' })
    .regex( /^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Enter a URL compatible string'),
  shortName: z.string().min(1, { message: 'Required' }),
  fullName: z.string().min(1, { message: 'Required' }),
})