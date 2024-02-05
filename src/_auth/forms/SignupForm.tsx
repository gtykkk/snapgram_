import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { SignupValidation } from '@/lib/validation'
import { z } from "zod"
import Loader from '@/components/shared/Loader'
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"


const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();

  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: '',
      username: "",
      email: '',
      password: ''
    },
  })

  // 2. submit 버튼 눌렀을 때.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    // 사용자 만들기
    const newUser = await createUserAccount(values)

    if(!newUser) {
      return toast({ title: '회원가입이 실패하였습니다. 다시 시도하여 주세요.' })
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password
    })

    if(!session) {
      return toast({ title: '로그인이 실패하였습니다. 다시 시도하여 주세요.' })
    }

    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn) {
      form.reset();
      navigate('/');
    } else {
      toast({ title: '로그인이 실패하였습니다. 다시 시도하여 주세요.'})
    }
  }
  return (
    <Form {...form}>
      <div className='sm:w-420 flex-center flex-col'>
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>새로운 이메일 만들기</h2>
        <p className='text-light-3 small-medium md:base-regular'>Snapgram에서 사용할 이름</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input type="text" className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>닉네임</FormLabel>
                <FormControl>
                  <Input type="text" className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input type="text" className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>패스워드</FormLabel>
                <FormControl>
                  <Input type="password" className='shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='shad-button_primary'>
            {isCreatingAccount ? (
              <div className="flex-center gap-2">
                <Loader />로딩중...
              </div>
            ) : "가입하기"}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
              이미 가입한 이메일이 있으시다면?
              <Link to="/sign-in" className='text-primary-500 text-small-semibold ml-1'>로그인</Link> 
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm
