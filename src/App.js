import './Components/Assets/css/bootstrap.css';
import './Components/Assets/css/weather-icons.min.css';
import './Style.css';

import Footer from './Components/Includes/Footer';
import Header from './Components/Includes/Header';
import WeatherApp from './Components/WeatherApp/WeatherApp';
// import WeatherForecast from './Components/WeatherApp/WeatherForecast';

function App() {
  return (
    <div className="App">
      <Header />
        <WeatherApp />
        {/* <WeatherForecast /> */}
      <Footer />
    </div>
  );
}

export default App;
