import './App.css';
import Chart from 'chart.js';
import { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {
const [date,setDate] = useState(new Date()) 

const getStartAndEndOfDay=(date)=> {
  const startOfDay = new Date(date.getTime() - 24 * 60 * 60 * 1000)
  startOfDay.setUTCHours(23, 59, 59, 999);

  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);


  return {
    start: startOfDay.toISOString().replace('Z', '+05:30'),
    end: endOfDay.toISOString().replace('Z', '+05:30')
  };
}

const fetchData =async()=> {
    try {
      const response = await fetch(
        `https://api.openaq.org/v2/measurements?location_id=8118&date_from=${getStartAndEndOfDay(date).start}&date_to=${getStartAndEndOfDay(date).end}&limit=1000&sort=asc`
      );
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const plotData = async () => {
    const data = await fetchData();
    const labels = data?.map((entry) =>
      `${new Date(entry.date.local).getHours()}:00`
    );
    const values = data?.map((entry) => entry.value);
    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "PM2.5",
            data: values,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        showTooltips:false,
        plotOptions: { series: { states: { hover: { enabled: false } } } }, 
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        hover: {
          enabled: false,
          mode: null,
      }
      },
    });
  }
  useEffect(()=>{
    plotData()
    console.log("dnd")
   },[date])

  return (
    <div className="App">
       <DatePicker selected={date} onChange={(dt) => setDate(dt)}  />
       <div className="chartContainer">
          <canvas id="myChart" width="400" height="400"></canvas>
       </div>
    </div>
  );
}

export default App;
