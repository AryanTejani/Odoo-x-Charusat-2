// WeeklyStatCard.jsx
import React, { useRef, useEffect } from "react";
import { BarChart } from "@mui/x-charts";
import { gsap } from "gsap";

const WeeklyStatCard = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      gsap.from(chartRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(1.7)"
      });
    }
  }, [data]);

  return (
    <div className="flex-1 min-w-[280px] p-6 sm:p-4 border border-gray-300/20 dark:border-gray-700/20 rounded-xl shadow-lg shadow-primary/15 flex flex-col gap-1.5">
      <h3 className="font-semibold text-base sm:text-sm text-primary">Weekly Calories Burned</h3>
      
      <div ref={chartRef}>
        {data?.totalWeeksCaloriesBurnt ? (
          <BarChart
            xAxis={[
              { scaleType: "band", data: data.totalWeeksCaloriesBurnt.weeks },
            ]}
            series={[{ data: data.totalWeeksCaloriesBurnt.caloriesBurned }]}
            height={300}
          />
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyStatCard;
