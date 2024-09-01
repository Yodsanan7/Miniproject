"use client";
import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import styles from './Dashboard.module.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Force dynamic rendering in Next.js
export const dynamic = 'force-dynamic';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [lastData, setLastData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [attackCount, setAttackCount] = useState(null);

  // Fetch latest data for the bar charts
  async function fetchLastData() {
    try {
      const res = await fetch("/api/lastestData");
      const data = await res.json();
      setLastData(data);
      console.log("Latest Data:", data);
    } catch (error) {
      console.error("Error fetching latest data:", error);
    }
  }

  // Fetch all data for the line charts
  async function fetchAllData() {
    try {
      const res = await fetch("/api/alldata");
      const data = await res.json();
      setAllData(data);
      console.log("All Data:", data);
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  }

  async function fetchAttackCount() {
    try {
      const res = await fetch("/api/attackCount");  // Replace with actual API endpoint
      const data = await res.json();
      setAttackCount(data.att);  // Assuming the API returns an object with 'att' key
      console.log("Attack Count:", data.att);
    } catch (error) {
      console.error("Error fetching attack count:", error);
    }
  }

  // Process data for bar charts
  const chartData1 = lastData.length > 0 ? {
    labels: ['LDR', 'VR'],
    datasets: lastData.map((dataPoint, index) => ({
      label: `Data Point ${index + 1}`,
      data: [dataPoint.ldr, dataPoint.vr],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
    })),
  } : null;

  const chartData2 = lastData.length > 0 ? {
    labels: ['Temperature', 'Distance'],
    datasets: lastData.map((dataPoint, index) => ({
      label: `Data Point ${index + 1}`,
      data: [dataPoint.temp, dataPoint.distance],
      backgroundColor: [
        'rgba(255, 159, 64, 0.6)',
        'rgba(255, 99, 132, 0.6)',
      ],
    })),
  } : null;

  // Process data for line charts
  const lineChartData1 = allData.length > 0 ? {
    labels: allData.map((dataPoint) => 
      new Date(dataPoint.date).toLocaleString('th-TH', {
        timeZone: 'Asia/Bangkok',
        dateStyle: 'short',
        timeStyle: 'short',
      })
    ),
    datasets: [
      {
        label: 'LDR',
        data: allData.map((dataPoint) => dataPoint.ldr),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 0.6)',
        tension: 0.1,
      },
      {
        label: 'VR',
        data: allData.map((dataPoint) => dataPoint.vr),
        fill: false,
        borderColor: 'rgba(153, 102, 255, 0.6)',
        tension: 0.1,
      },
    ],
  } : null;

  const lineChartData2 = allData.length > 0 ? {
    labels: allData.map((dataPoint) => 
      new Date(dataPoint.date).toLocaleString('th-TH', {
        timeZone: 'Asia/Bangkok',
        dateStyle: 'short',
        timeStyle: 'short',
      })
    ),
    datasets: [
      {
        label: 'Temperature',
        data: allData.map((dataPoint) => dataPoint.temp),
        fill: false,
        borderColor: 'rgba(255, 159, 64, 0.6)',
        tension: 0.1,
      },
      {
        label: 'Distance',
        data: allData.map((dataPoint) => dataPoint.distance),
        fill: false,
        borderColor: 'rgba(255, 99, 132, 0.6)',
        tension: 0.1,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Latest Sensor Data Visualization',
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sensor Data Trends Over Time',
      },
    },
  };

  useEffect(() => {
    fetchLastData();
    fetchAllData();
    fetchAttackCount();

    // Set up interval to fetch latest data every 10 seconds
    const intervalId = setInterval(() => {
      fetchLastData();
      fetchAllData();
      fetchAttackCount();
    }, 10000); // 10 seconds

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.heading}>Dashboard</h1>

      <div className={styles.chartRow}>
        {lastData.length > 0 && chartData1 ? (
          <div className={styles.chartContainer}>
            <h2>LDR and VR</h2>
            <Bar data={chartData1} options={chartOptions} />
          </div>
        ) : (
          <p>No data available for LDR and VR chart</p>
        )}

        {lastData.length > 0 && chartData2 ? (
          <div className={styles.chartContainer}>
            <h2>Temperature and Distance</h2>
            <Bar data={chartData2} options={chartOptions} />
          </div>
        ) : (
          <p>No data available for Temperature and Distance chart</p>
        )}
      </div>

      <div className={styles.chartRow}>
        {allData.length > 0 && lineChartData1 ? (
          <div className={styles.chartContainer}>
            <h2>LDR and VR Trends</h2>
            <Line data={lineChartData1} options={lineChartOptions} />
          </div>
        ) : (
          <p>No data available for the LDR and VR line chart</p>
        )}

        {allData.length > 0 && lineChartData2 ? (
          <div className={styles.chartContainer}>
            <h2>Temperature and Distance Trends</h2>
            <Line data={lineChartData2} options={lineChartOptions} />
          </div>
        ) : (
          <p>No data available for the Temperature and Distance line chart</p>
        )}
      </div>

      {/* Display the attack count */}
      <div className={styles.attackCountContainer}>
        <h2>Number of Attacks</h2>
        {attackCount !== null ? (
          <p className={styles.attackCount}>{attackCount}</p>
        ) : (
          <p>Loading attack data...</p>
        )}
      </div>

        
      <h1 className={styles.heading}>Lastest Data</h1>
      <table className={`table table-striped table-bordered ${styles.table}`}>
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>LDR</th>
            <th>VR</th>
            <th>Temperature</th>
            <th>Distance</th>
            <th>Create At</th>
          </tr>
        </thead>
        <tbody>
          {lastData.map((ldata) => (
            <tr key={ldata.id}>
              <td>{ldata.id}</td>
              <td>{ldata.ldr}</td>
              <td>{ldata.vr}</td>
              <td>{ldata.temp}</td>
              <td>{ldata.distance}</td>
              <td>
                {new Date(ldata.date).toLocaleString('th-TH', {
                  timeZone: 'Asia/Bangkok',
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
