import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

function WeatherCard({ title, value, icon, subtext, iconColor = "text-neutral-gray500" }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-gray300 flex flex-col justify-between h-full">
      <div className="flex items-center gap-3 mb-2">
        
        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 flex-shrink-0 ${iconColor}`}>
          <span className="material-icons-outlined text-xl">{icon}</span>
        </div>

        <p className="text-neutral-gray500 text-xs font-bold uppercase tracking-wider truncate">
            {title}
        </p>
      </div>
      
      <div>
        <p className="text-2xl font-bold text-neutral-gray900">{value}</p>
        {subtext && <p className="text-xs text-neutral-gray500 mt-1 font-medium">{subtext}</p>}
      </div>
    </div>
  );
}

function InsightCard({ title, value, subtitle, icon, colorClass }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-gray300 relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform ${colorClass}`}>
        <span className="material-icons-outlined text-6xl">{icon}</span>
      </div>
      <div className="relative z-10">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${colorClass} bg-opacity-10`}>
            <span className={`material-icons-outlined ${colorClass.replace('bg-', 'text-')}`}>{icon}</span>
        </div>
        <h3 className="text-neutral-gray500 font-medium text-sm">{title}</h3>
        <p className="text-3xl font-bold text-neutral-gray900 mt-1">{value}</p>
        <p className="text-sm text-neutral-gray400 mt-2">{subtitle}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ campos: 0, lotes: 0 });
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState({ 
      temp: "--", 
      condition: "Cargando...", 
      humidity: "--", 
      wind: "--", 
      location: "General Pico, LP",
      icon: "hourglass_empty",
      minMax: "-- / --"
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!currentUser) return;
        
        const q = query(collection(db, "campos"), where("userId", "==", currentUser.uid));
        const snapshot = await getDocs(q);
        
        let totalLotes = 0;
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.lotes && Array.isArray(data.lotes)) {
                totalLotes += data.lotes.length;
            }
        });

        setStats({
            campos: snapshot.size,
            lotes: totalLotes
        });

      } catch (error) {
        console.error("Error cargando estadísticas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentUser]);

  useEffect(() => {
    const fetchWeather = async () => {
      // Coordenadas de General Pico, La Pampa
      const lat = -35.6586;
      const lon = -63.7568;
      // Coordenadas de Santa Rosa, La Pampa
      //const lat = -36.61617;
      //const lon = -64.28991;
      
      // URL de Open-Meteo (Pide temperatura, humedad, código de clima y viento en km/h)
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&wind_speed_unit=kmh&timezone=auto&forecast_days=1`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.current) {
          const { temperature_2m, relative_humidity_2m, weather_code, wind_speed_10m } = data.current;
          
          const maxTemp = Math.round(data.daily.temperature_2m_max[0]);
          const minTemp = Math.round(data.daily.temperature_2m_min[0]);
          const infoClima = getWeatherInfo(weather_code);

          setWeather({
            temp: Math.round(temperature_2m) + "°C",
            condition: infoClima.text,
            humidity: relative_humidity_2m + "%",
            wind: Math.round(wind_speed_10m) + " km/h",
            location: "General Pico, LP",
            icon: infoClima.icon,
            minMax: `Máx: ${maxTemp}° / Mín: ${minTemp}°`
          });
        }
      } catch (e) {
        console.error("Error obteniendo clima:", e);
        setWeather(prev => ({ ...prev, condition: "No disponible" }));
      }
    };

    fetchWeather();
  }, []);

  function getWeatherInfo(code) {
    if (code === 0) return { text: "Despejado", icon: "wb_sunny" };
    if (code >= 1 && code <= 3) return { text: "Nublado", icon: "cloud" };
    if (code >= 45 && code <= 48) return { text: "Niebla", icon: "foggy" };
    if (code >= 51 && code <= 67) return { text: "Lluvia", icon: "rainy" };
    if (code >= 71 && code <= 77) return { text: "Nieve", icon: "ac_unit" };
    if (code >= 80 && code <= 82) return { text: "Chubascos", icon: "umbrella" };
    if (code >= 95 && code <= 99) return { text: "Tormenta", icon: "thunderstorm" };
    
    return { text: "Desconocido", icon: "help_outline" };
  }

  const firstName = currentUser?.nombre || "Usuario";

  return (
    <div className="space-y-8 animate-fade-in">
      
      <div className="bg-primary text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">¡Hola de nuevo, {firstName}!</h1>
            <p className="text-green-100 opacity-90">Aquí tenés el resumen de actividad en tus campos hoy.</p>
          </div>
          <span className="material-icons-outlined absolute -right-4 -bottom-8 text-9xl text-white opacity-10 rotate-12">agriculture</span>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-gray900 flex items-center gap-2">
                <span className="material-icons-outlined text-orange-500">wb_sunny</span> 
                Pronóstico - {weather?.location}
            </h2>
            <span className="text-xs text-neutral-gray500 bg-white px-2 py-1 rounded border">Hoy</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <WeatherCard title="Temperatura" value={weather?.temp} icon="thermostat" subtext={weather?.minMax} />
            <WeatherCard title="Condición" value={weather?.condition} icon={weather?.icon} />
            <WeatherCard title="Humedad" value={weather?.humidity} icon="water_drop" />
            <WeatherCard title="Viento" value={weather?.wind} icon="air" />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-neutral-gray900 mb-4">Estado de la producción</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Campos */}
            <InsightCard 
                title="Campos activos"
                value={loading ? "..." : stats.campos}
                subtitle="Propiedades registradas"
                icon="landscape"
                colorClass="text-green-600 bg-green-600"
            />

            {/* Card 2: Lotes */}
            <InsightCard 
                title="Lotes totales"
                value={loading ? "..." : stats.lotes}
                subtitle="Parcelas delimitadas"
                icon="grid_on"
                colorClass="text-blue-600 bg-blue-600"
            />

            {/* Card 3: Alertas */}
            <InsightCard 
                title="Alertas del sistema"
                value="0 Riesgos"
                subtitle="Todo opera con normalidad"
                icon="verified_user"
                colorClass="text-orange-500 bg-orange-500"
            />
        </div>
      </section>

      {/* Sección accesos directos */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-neutral-gray300">
        <h3 className="font-bold text-neutral-gray900 mb-4">Accesos directos</h3>
        <div className="flex gap-3 flex-wrap">
            <button className="px-4 py-2 bg-neutral-gray50 hover:bg-neutral-gray100 rounded-lg text-sm font-medium text-neutral-gray700 border border-neutral-gray200 transition flex items-center gap-2">
                <span className="material-icons-outlined text-base">add_circle</span> Nuevo 
                campo
            </button>
            <button className="px-4 py-2 bg-neutral-gray50 hover:bg-neutral-gray100 rounded-lg text-sm font-medium text-neutral-gray700 border border-neutral-gray200 transition flex items-center gap-2">
                <span className="material-icons-outlined text-base">description</span> Exportar reporte
            </button>
        </div>
      </section>
    </div>
  );
}