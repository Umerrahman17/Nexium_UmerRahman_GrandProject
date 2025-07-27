export default function TestEnvPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
          <div className="bg-gray-100 p-4 rounded space-y-2">
            <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</p>
            <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set'}</p>
            <p><strong>SUPABASE_SERVICE_ROLE_KEY:</strong> {process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set (hidden)' : 'Not set'}</p>
            <p><strong>MONGODB_URI:</strong> {process.env.MONGODB_URI ? 'Set (hidden)' : 'Not set'}</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Raw Values (First 20 chars)</h2>
          <div className="bg-gray-100 p-4 rounded space-y-2">
            <p><strong>SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) || 'Not set'}</p>
            <p><strong>ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) || 'Not set'}</p>
            <p><strong>SERVICE_ROLE:</strong> {process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) || 'Not set'}</p>
            <p><strong>MONGODB:</strong> {process.env.MONGODB_URI?.substring(0, 20) || 'Not set'}</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Node Environment</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
            <p><strong>NEXT_PUBLIC_NODE_ENV:</strong> {process.env.NEXT_PUBLIC_NODE_ENV}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 