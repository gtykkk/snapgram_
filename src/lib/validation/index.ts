import { z } from "zod"

// 이제 정규형식에 맞는지 확인하는 파일

export const SignupValidation = z.object({
    name: z.string().min(2, { message: '너무 짧습니다.' }),
    username: z.string().min(2, { message: '너무 짧습니다.' }),
    email: z.string().email({ message: '유효하지 않은 이메일 형식입니다.' }),
    password: z.string().min(8, { message: '비밀번호는 8글자 이상이어야 합니다.'})
})

export const SigninValidation = z.object({
    email: z.string().email({ message: '유효하지 않은 이메일 형식입니다.' }),
    password: z.string().min(8, { message: '비밀번호는 8글자 이상이어야 합니다.'})
})

export const PostValidation = z.object({
    caption: z.string().min(20, { message: '설명은 20자 이상을 작성해야 합니다.'}),
    file: z.custom<File[]>(),
    location: z.string().min(2, { message: '두글자 이상 작성하여야 합니다.'}).max(100),
    tags: z.string()
})