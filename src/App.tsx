import { Routes, Route } from 'react-router-dom'

import './globals.css'
import SigninForm from './_auth/forms/SigninForm'
import { Home } from './_root/pages'
import SignupForm from './_auth/forms/SignupForm'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'

import { Toaster } from '@/components/ui/toaster'

const App = () => {
    return (
        <main className='flex h-screen'>
            <Routes>
                {/* public routes 로그인을 안해도 볼 수 있는 화면 */}
                <Route element={<AuthLayout />}>
                    <Route path="/sign-in" element={<SigninForm />} />
                    <Route path="/sign-up" element={<SignupForm />} />
                </Route>
                {/* private routes 로그인을 해야지 볼 수 있는 화면 */}
                <Route element={<RootLayout />} >
                    <Route index element={<Home />} />
                </Route>
            </Routes>

            <Toaster />
        </main>
    )
}

export default App
