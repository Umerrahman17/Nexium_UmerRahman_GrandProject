import { Suspense } from 'react'
import AuthCallbackHandler from './AuthCallbackHandler'

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <AuthCallbackHandler />
    </Suspense>
  )
}
