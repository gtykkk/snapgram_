import { INewUser } from '@/types'
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { createUserAccount, signInAccount } from '../appwrite/api'

// 유저 생성
export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

// 로그인 계정
export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { 
            email: string;
            password: string
        }) => signInAccount(user)
    })
}

