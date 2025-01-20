import { z } from "zod";
export const subjectSchema = z.object({
      subjectName: z
        .string()
        .min(1, { message: 'subjectName is required' }),
        Teacher: z
        .string()
        .min(1, { message: 'subjectName is required' }),
        Lesson: z
        .string()
        .min(1, { message: 'subjectName is required' }),
})
export type SubjectSchema = z.infer<typeof subjectSchema>;