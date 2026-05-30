
import { useState, useEffect, useRef } from "react"

import background from '../assets/background.png'
import styles from "./Stats.module.css" 


import {
  Chart,
  Colors,
  BarController,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,        
  LineElement, 
  
  BarElement,
  Legend
} from 'chart.js'

Chart.register(
  Colors,
  BarController,
  LineElement,         
  PointElement,
   LineController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend
);


export default function Stats(){

const [view, setView] = useState('week') //default
const[viewIndividual, setViewIndividual] = useState('week') //default


//this is all to be filled with actual user data
 const chartRef = useRef(null)
 const chartInstance = useRef(null) 


 const xValues = [100,200,300,400,500,600,700,800,900,1000]; // to be date 
  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy() 

    chartInstance.current = new Chart(chartRef.current,{  // 👈 use ref, not a string ID
      type: "line",
      data: {
        labels: xValues,
        datasets: [{
        data: [860,1140,1060,1060,1070,1110,1330,2210,7830,2478],
      borderColor: "red",
      fill: false
    },{
      data: [1600,1700,1700,1900,2000,2700,4000,5000,6000,7000],
      borderColor: "green",
      fill: false
    },{
      data: [300,700,2000,5000,6000,4000,2000,1000,200,100],
      borderColor: "blue",
      fill: false
        }]
      },
      options: {
        legend: { display: false }
      }
    })
   return () => {if (chartInstance.current) chartInstance.current.destroy()}
  }, [])


return(
<>
 <div >
      <h1 className={styles.title}>Statistics</h1>

        <button className={view ==='week' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setView('week')}
        >Week</button>
        <button className={view === 'month' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setView('month')}
        >Month</button>
        <button className={view === 'year' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setView('year')}
        >Year</button>
{/* toggle for week month year chart (percent of habits completed(for week each data point is a day, for month it should be day, then for year maybe week or month ) */} 
</div>

<div className={styles.container}>
    {/*  here is that completion percent overview  */}
     <canvas ref={chartRef} /> 

</div>


<div  >
{/* search bar into same toggle for completion*/ }


 <button className={viewIndividual==='week' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setViewIndividual('week')}
        >Week</button>
        <button className={viewIndividual=== 'month' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setViewIndividual('month')}
        >Month</button>
        <button className={viewIndividual === 'year' ? styles.toggleActive : styles.toggleBtn}
            onClick={() => setViewIndividual('year')}
        >Year</button>

</div>
<div className={styles.container}>
{/* complettion graph for that one habit*/ }
    
</div>
</>

)
}

