import React from 'react'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to My Website
        </h1>
        <p className="mt-4 text-gray-600">
          This is the main content area of your website. You can add more components and content here.
        </p>
      </main>
    </div>
  )
}

export default App