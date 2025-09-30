import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header */}
      <header className="text-center py-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
          🎨 Calli 테스트 페이지
        </h1>
        <p className="text-lg text-gray-600">
          Tailwind CSS가 제대로 적용되었는지 확인해보세요!
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card 1 - Colors */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🎨 색상 테스트</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full"></div>
                <span className="text-sm text-gray-600">Primary Color</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary rounded-full"></div>
                <span className="text-sm text-gray-600">Secondary Color</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Success</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Error</span>
              </div>
            </div>
          </div>

          {/* Card 2 - Buttons */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🔘 버튼 테스트</h3>
            <div className="space-y-3">
              <button className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Primary Button
              </button>
              <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                Secondary Button
              </button>
              <button className="w-full border-2 border-primary text-primary py-2 px-4 rounded-lg hover:bg-primary hover:text-white transition-colors">
                Outline Button
              </button>
            </div>
          </div>

          {/* Card 3 - Counter */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">🔢 카운터 테스트</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-4">{count}</div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setCount(count - 1)}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                  -
                </button>
                <button 
                  onClick={() => setCount(0)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setCount(count + 1)}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Test */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📱 반응형 테스트</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <div className="text-sm font-medium text-blue-800">Mobile</div>
              <div className="text-xs text-blue-600">기본</div>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <div className="text-sm font-medium text-green-800">Tablet</div>
              <div className="text-xs text-green-600">sm: 이상</div>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg text-center">
              <div className="text-sm font-medium text-purple-800">Desktop</div>
              <div className="text-xs text-purple-600">lg: 이상</div>
            </div>
            <div className="bg-orange-100 p-4 rounded-lg text-center">
              <div className="text-sm font-medium text-orange-800">Large</div>
              <div className="text-xs text-orange-600">xl: 이상</div>
            </div>
          </div>
        </div>

        {/* Typography Test */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📝 타이포그래피 테스트</h3>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">Heading 1</h1>
            <h2 className="text-2xl font-semibold text-gray-700">Heading 2</h2>
            <h3 className="text-xl font-medium text-gray-600">Heading 3</h3>
            <p className="text-base text-gray-600 leading-relaxed">
              이것은 일반 텍스트입니다. Tailwind CSS의 타이포그래피 클래스들이 제대로 적용되었는지 확인할 수 있습니다.
            </p>
            <p className="text-sm text-gray-500">
              작은 텍스트입니다. 설명이나 부가 정보에 사용됩니다.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 mt-12">
        <p className="text-gray-500">
          🎉 Tailwind CSS가 성공적으로 적용되었습니다!
        </p>
      </footer>
    </div>
  )
}

export default App
