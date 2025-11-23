import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

function WeatherCard({ title, value, icon, subtext }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-gray300 flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-icons-outlined text-neutral-gray500 text-lg">{icon}</span>
        <p className="text-neutral-gray500 text-xs font-bold uppercase">{title}</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-neutral-gray900">{value}</p>
        {subtext && <p className="text-xs text-neutral-gray500 mt-1">{subtext}</p>}
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
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

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
    // AQUÍ IRÍA EL FETCH A OPENWEATHERMAP
    // Por ahora usamos datos estáticos para que veas el diseño
    setWeather({
        temp: "24°C",
        condition: "Soleado",
        humidity: "45%",
        wind: "12 km/h",
        location: "General Pico, LP"
    });
  }, []);

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
            <WeatherCard title="Temperatura" value={weather?.temp} icon="thermostat" subtext="Máx: 26° / Mín: 14°" />
            <WeatherCard title="Condición" value={weather?.condition} icon="wb_sunny" />
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