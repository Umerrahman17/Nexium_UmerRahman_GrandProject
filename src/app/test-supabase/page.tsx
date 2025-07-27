'use client'

import { useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function TestSupabasePage() {
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const testConnection = async () => {
    try {
      setStatus('Testing connection...')
      setError('')
      
      // Test basic connection
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      
      if (error) {
        setError(`Connection error: ${error.message}`)
        setStatus('Failed')
      } else {
        setStatus('Connection successful!')
        setError('')
      }
    } catch (err) {
      setError(`Unexpected error: ${err}`)
      setStatus('Failed')
    }
  }

  const testAuth = async () => {
    try {
      setStatus('Testing auth...')
      setError('')
      
      // Test auth configuration
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setError(`Auth error: ${error.message}`)
        setStatus('Failed')
      } else {
        setStatus('Auth configuration successful!')
        setError('')
      }
    } catch (err) {
      setError(`Unexpected error: ${err}`)
      setStatus('Failed')
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Configuration</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</p>
            <p><strong>Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
            <p><strong>Is Configured:</strong> {isSupabaseConfigured() ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Tests</h2>
          <div className="space-y-2">
            <button 
              onClick={testConnection}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test Database Connection
            </button>
            
            <button 
              onClick={testAuth}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
            >
              Test Auth Configuration
            </button>
          </div>
        </div>

        {status && (
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Status:</strong> {status}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 p-4 rounded text-red-800">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
      </div>
    </div>
  )
} 