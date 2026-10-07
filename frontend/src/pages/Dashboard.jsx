import "../styles/dashboard.css";
import {
  useEffect,
  useState,
} from "react";

import {
  Droplets,
  Thermometer,
  Zap,
} from "lucide-react";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import SensorCard
  from "../components/SensorCard";

import DeviceToggle
  from "../components/DeviceToggle";

import {
  getLatestSensor,
  getSensors,
} from "../api/sensorApi";

import {
  getDevices,
  updateDevice,
} from "../api/deviceApi";

function Dashboard() {
  const [
    sensor,
    setSensor,
  ] = useState({
    temperature: 0,
    humidity: 0,
    light: 0,
  });

  const [
    history,
    setHistory,
  ] = useState([]);

  const [
    devices,
    setDevices,
  ] = useState([]);

  // =========================
  // LOAD DATA
  // =========================

  async function loadData() {
    try {
      const [
        latest,
        historyData,
        deviceData,
      ] = await Promise.all([
        getLatestSensor(),
        getSensors(),
        getDevices(),
      ]);

      setSensor(latest);

      setHistory(
        historyData
          .slice(0, 20)
          .reverse()
      );

      setDevices(
        deviceData
      );
    } catch (error) {
      console.error(
        "Load dashboard error:",
        error
      );
    }
  }

  // =========================
  // AUTO REFRESH
  // =========================

  useEffect(() => {
    loadData();

    const timer =
      setInterval(
        loadData,
        2000
      );

    return () =>
      clearInterval(timer);
  }, []);

  // =========================
  // DEVICE CONTROL
  // =========================

  async function handleToggle(
    device
  ) {
    try {
      await updateDevice(
        device.id,
        !device.state
      );

      const newDevices =
        await getDevices();

      setDevices(
        newDevices
      );
    } catch (error) {
      console.error(
        "Update device error:",
        error
      );
    }
  }

  // =========================
  // FORMAT HH:mm:ss
  // =========================

  function formatTime(
    value
  ) {
    const date =
      new Date(value);

    const hours =
      String(
        date.getHours()
      ).padStart(2, "0");

    const minutes =
      String(
        date.getMinutes()
      ).padStart(2, "0");

    const seconds =
      String(
        date.getSeconds()
      ).padStart(2, "0");

    return (
      `${hours}:${minutes}:${seconds}`
    );
  }

  // =========================
  // FORMAT dd/MM/yyyy HH:mm:ss
  // =========================

  function formatDateTime(
    value
  ) {
    const date =
      new Date(value);

    const day =
      String(
        date.getDate()
      ).padStart(2, "0");

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const year =
      date.getFullYear();

    const hours =
      String(
        date.getHours()
      ).padStart(2, "0");

    const minutes =
      String(
        date.getMinutes()
      ).padStart(2, "0");

    const seconds =
      String(
        date.getSeconds()
      ).padStart(2, "0");

    return (
      `${day}/${month}/${year} ` +
      `${hours}:${minutes}:${seconds}`
    );
  }

  // =========================
  // CHART DATA
  // =========================

  const chartData =
    history.map(
      (item) => ({
        ...item,

        timestamp:
          new Date(
            item.recordedAt
          ).getTime(),
      })
    );

  return (
    <div className="page-shell dashboard-page">

      <h1 className="page-title">
        Dashboard
      </h1>

      {/* SENSOR CARDS */}

      <div className="sensor-grid">

        <SensorCard
          title="Temperature"
          value={
            sensor.temperature
          }
          unit="°C"
          color="orange"
          icon={
            <Thermometer
              size={21}
            />
          }
        />

        <SensorCard
          title="Humidity"
          value={
            sensor.humidity
          }
          unit="%"
          color="blue"
          icon={
            <Droplets
              size={21}
            />
          }
        />

        <SensorCard
          title="Light Intensity"
          value={
            sensor.light
          }
          unit=" lux"
          color="yellow"
          icon={
            <Zap
              size={21}
            />
          }
        />

      </div>

      {/* DEVICE CONTROL */}

      <div className="device-grid">

        {devices.map(
          (device) => (
            <DeviceToggle
              key={
                device.id
              }
              device={
                device
              }
              onToggle={
                handleToggle
              }
            />
          )
        )}

      </div>

      {/* SENSOR HISTORY */}

      <section className="chart-card dashboard-chart">

        <h2>
          Sensor History
        </h2>

        <div className="chart-area">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <LineChart
              data={
                chartData
              }
              margin={{
                top: 5,
                right: 10,
                left: -10,
                bottom: 5,
              }}
            >

              <CartesianGrid
                vertical={
                  false
                }
                stroke="#EDF0F3"
              />

              {/* X AXIS */}

              <XAxis
                dataKey="timestamp"

                type="number"

                domain={[
                  "dataMin",
                  "dataMax",
                ]}

                tickFormatter={
                  formatTime
                }

                interval={0}

                tick={{
                  fontSize: 10,
                  fill: "#64748B",
                }}

                tickMargin={8}

                angle={-35}

                textAnchor="end"

                height={58}
              />

              {/* LEFT AXIS */}

              <YAxis
                yAxisId="left"

                domain={[
                  0,
                  100,
                ]}

                tick={{
                  fontSize: 11,
                  fill: "#64748B",
                }}
              />

              {/* RIGHT AXIS */}

              <YAxis
                yAxisId="right"

                orientation="right"

                domain={[
                  0,
                  1000,
                ]}

                tick={{
                  fontSize: 11,
                  fill: "#64748B",
                }}
              />

              {/* TOOLTIP */}

              <Tooltip
                labelFormatter={
                  (value) =>
                    formatDateTime(
                      Number(value)
                    )
                }

                cursor={{
                  stroke:
                    "#CBD5E1",

                  strokeWidth:
                    1,
                }}

                contentStyle={{
                  border:
                    "1px solid #E2E8F0",

                  borderRadius:
                    "8px",

                  boxShadow:
                    "0 4px 14px rgba(0,0,0,0.08)",

                  backgroundColor:
                    "#FFFFFF",
                }}
              />

              <Legend />

              {/* HUMIDITY */}

              <Line
                yAxisId="left"

                type="monotone"

                dataKey="humidity"

                name="Humidity"

                stroke="#3B82F6"

                strokeWidth={2}

                dot={false}

                activeDot={{
                  r: 4,
                  strokeWidth: 2,
                }}

                isAnimationActive={
                  false
                }
              />

              {/* LIGHT */}

              <Line
                yAxisId="right"

                type="monotone"

                dataKey="light"

                name="Light"

                stroke="#EAB308"

                strokeWidth={2}

                dot={false}

                activeDot={{
                  r: 4,
                  strokeWidth: 2,
                }}

                isAnimationActive={
                  false
                }
              />

              {/* TEMPERATURE */}

              <Line
                yAxisId="left"

                type="monotone"

                dataKey="temperature"

                name="Temperature"

                stroke="#F97316"

                strokeWidth={2}

                dot={false}

                activeDot={{
                  r: 4,
                  strokeWidth: 2,
                }}

                isAnimationActive={
                  false
                }
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;