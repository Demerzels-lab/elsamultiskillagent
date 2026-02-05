import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { LoadingSpinner } from '../components/Loading'

export function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      const hashFragment = window.location.hash

      if (hashFragment && hashFragment.length > 0) {
        try {
          const { data, error } = await supabase.auth.getSession()

          if (error) {
            console.error('Error getting session:', error.message)
            navigate('/login?error=' + encodeURIComponent(error.message))
            return
          }

          if (data.session) {
            navigate('/')
            return
          }
        } catch (err: any) {
          console.error('Error during auth callback:', err)
          navigate('/login?error=' + encodeURIComponent(err.message || 'Authentication failed'))
          return
        }
      }

      // If no hash fragment, try to get session anyway
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        navigate('/')
      } else {
        navigate('/login')
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-text-secondary">Completing sign in...</p>
      </div>
    </div>
  )
}
