import clientPromise from '@/lib/mongodb'

export default async function TestMongoDBPage() {
  let mongoStatus = 'Not tested'
  let testData = null
  let error = null

  try {
    const client = await clientPromise
    const db = client.db('grandproject')
    
    // Test connection by listing collections
    const collections = await db.listCollections().toArray()
    
    // Test inserting and reading data
    const collection = db.collection('test')
    const testDoc = {
      message: 'Hello from MongoDB!',
      timestamp: new Date(),
      test: true
    }
    
    const insertResult = await collection.insertOne(testDoc)
    const readResult = await collection.findOne({ _id: insertResult.insertedId })
    
    // Clean up test data
    await collection.deleteOne({ _id: insertResult.insertedId })
    
    mongoStatus = 'Connected and working!'
    testData = {
      collections: collections.map(c => c.name),
      testDocument: readResult
    }
  } catch (err) {
    mongoStatus = 'Error connecting to MongoDB'
    error = err instanceof Error ? err.message : 'Unknown error'
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">MongoDB Connection Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
          <div className={`p-4 rounded ${
            mongoStatus.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            <p><strong>Status:</strong> {mongoStatus}</p>
          </div>
        </div>

        {error && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Error Details</h2>
            <div className="bg-red-100 p-4 rounded">
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {testData && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Test Results</h2>
            <div className="bg-gray-100 p-4 rounded space-y-2">
              <div>
                <strong>Collections in database:</strong>
                <ul className="list-disc list-inside ml-4">
                  {testData.collections.map((collection: string) => (
                    <li key={collection}>{collection}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Test Document:</strong>
                <pre className="bg-white p-2 rounded mt-2 text-sm overflow-x-auto">
                  {JSON.stringify(testData.testDocument, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-2">Database Architecture</h2>
          <div className="bg-blue-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Supabase (PostgreSQL):</h3>
            <ul className="list-disc list-inside ml-4 mb-3">
              <li>User profiles & authentication</li>
              <li>Resume metadata (title, file_path, user_id)</li>
              <li>Jobs and applications</li>
              <li>AI analysis results</li>
            </ul>
            
            <h3 className="font-semibold mb-2">MongoDB:</h3>
            <ul className="list-disc list-inside ml-4">
              <li>Resume content (full document text)</li>
              <li>File attachments and large documents</li>
              <li>Flexible document storage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 