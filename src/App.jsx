import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [selectedCity, setSelectedCity] = useState('Москва')
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)

  // Список городов
  const cities = [
    { id: 1, name: 'Москва', country: 'Россия' },
    { id: 2, name: 'Санкт-Петербург', country: 'Россия' },
    { id: 3, name: 'Новосибирск', country: 'Россия' },
    { id: 4, name: 'Екатеринбург', country: 'Россия' },
    { id: 5, name: 'Казань', country: 'Россия' },
    { id: 6, name: 'Нижний Новгород', country: 'Россия' },
    { id: 7, name: 'Сочи', country: 'Россия' },
    { id: 8, name: 'Владивосток', country: 'Россия' }
  ]

  // Генерация фиктивных данных о погоде
  const generateMockWeather = (cityName) => {
    const seasons = {
      'Москва': { min: -15, max: 25 },
      'Санкт-Петербург': { min: -12, max: 22 },
      'Новосибирск': { min: -20, max: 20 },
      'Екатеринбург': { min: -18, max: 23 },
      'Казань': { min: -16, max: 24 },
      'Нижний Новгород': { min: -14, max: 23 },
      'Сочи': { min: 5, max: 28 },
      'Владивосток': { min: -8, max: 22 }
    }

    const season = seasons[cityName] || { min: -10, max: 25 }
    const temperature = Math.floor(Math.random() * (season.max - season.min + 1)) + season.min
    
    const conditions = [
      { type: 'Солнечно', icon: '☀️', humidity: 30, wind: 2 },
      { type: 'Облачно', icon: '☁️', humidity: 60, wind: 4 },
      { type: 'Пасмурно', icon: '🌫️', humidity: 70, wind: 3 },
      { type: 'Небольшой дождь', icon: '🌦️', humidity: 80, wind: 5 },
      { type: 'Снег', icon: '❄️', humidity: 85, wind: 6 }
    ]
    
    const condition = conditions[Math.floor(Math.random() * conditions.length)]
    
    return {
      temperature,
      condition: condition.type,
      icon: condition.icon,
      humidity: condition.humidity + Math.floor(Math.random() * 10),
      windSpeed: condition.wind + Math.floor(Math.random() * 5),
      feelsLike: temperature - Math.floor(Math.random() * 3),
      pressure: 750 + Math.floor(Math.random() * 20)
    }
  }

  // Загрузка данных о погоде
  const loadWeatherData = (city) => {
    setLoading(true)
    
    // Имитация задержки загрузки
    setTimeout(() => {
      const mockData = generateMockWeather(city)
      setWeatherData(mockData)
      setLoading(false)
      
      // Сохраняем в localStorage
      localStorage.setItem('lastCity', city)
      localStorage.setItem('lastWeather', JSON.stringify(mockData))
    }, 800)
  }

  // Загрузка начальных данных
  useEffect(() => {
    const savedCity = localStorage.getItem('lastCity') || 'Москва'
    const savedWeather = localStorage.getItem('lastWeather')
    
    setSelectedCity(savedCity)
    
    if (savedWeather) {
      setWeatherData(JSON.parse(savedWeather))
    } else {
      loadWeatherData(savedCity)
    }
  }, [])

  const handleCityChange = (city) => {
    setSelectedCity(city)
    loadWeatherData(city)
  }

  const getTemperatureColor = (temp) => {
    if (temp < -10) return '#4FC3F7' // Очень холодно
    if (temp < 0) return '#81D4FA'   // Холодно
    if (temp < 10) return '#80CBC4'  // Прохладно
    if (temp < 20) return '#C5E1A5'  // Тепло
    if (temp < 30) return '#FFD54F'  // Жарко
    return '#FF8A65'                 // Очень жарко
  }

  const getBackgroundGradient = (temp) => {
    if (temp < 0) return 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'
    if (temp < 15) return 'linear-gradient(135deg, #81C784 0%, #4CAF50 100%)'
    return 'linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)'
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>🌤️ Погодный Виджет</h1>
          <p>Узнайте текущую погоду в выбранном городе</p>
        </header>

        <main className="main-content">
          <div className="city-selector-section">
            <label htmlFor="city-select" className="city-label">
              Выберите город:
            </label>
            <select
              id="city-select"
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="city-select"
              disabled={loading}
            >
              {cities.map(city => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Загружаем данные о погоде...</p>
            </div>
          ) : weatherData && (
            <div 
              className="weather-card"
              style={{ background: getBackgroundGradient(weatherData.temperature) }}
            >
              <div className="weather-header">
                <h2>{selectedCity}</h2>
                <div className="weather-icon-large">{weatherData.icon}</div>
              </div>
              
              <div className="weather-main">
                <div 
                  className="temperature-display"
                  style={{ color: getTemperatureColor(weatherData.temperature) }}
                >
                  {weatherData.temperature}°C
                </div>
                <div className="weather-condition">{weatherData.condition}</div>
                <div className="feels-like">
                  Ощущается как: {weatherData.feelsLike}°C
                </div>
              </div>

              <div className="weather-details">
                <div className="detail-item">
                  <span className="detail-icon">💧</span>
                  <div className="detail-info">
                    <span className="detail-label">Влажность</span>
                    <span className="detail-value">{weatherData.humidity}%</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <span className="detail-icon">💨</span>
                  <div className="detail-info">
                    <span className="detail-label">Ветер</span>
                    <span className="detail-value">{weatherData.windSpeed} м/с</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <span className="detail-icon">📊</span>
                  <div className="detail-info">
                    <span className="detail-label">Давление</span>
                    <span className="detail-value">{weatherData.pressure} мм рт. ст.</span>
                  </div>
                </div>
              </div>

              <div className="weather-footer">
                <p>🔄 Данные обновляются при смене города</p>
              </div>
            </div>
          )}
        </main>

        <footer className="footer">
          <p>© 2024 Погодный Виджет • Данные являются демонстрационными</p>
        </footer>
      </div>
    </div>
  )
}

export default App