import { z } from "zod"

export const SignupValidation = z.object({
    name: z.string().min(2, { message: 'Too short' }),
    username: z.string().min(2, { message: '너무 짧습니다.' }),
    email: z.string().email(),
    password: z.string().min(8, { message: '비밀번호는 8글자 이상이어야 합니다.'})
})