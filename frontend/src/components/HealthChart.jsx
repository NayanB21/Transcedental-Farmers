import {

  ResponsiveContainer,

  LineChart,
  Line,

  XAxis,
  YAxis,

  Tooltip,

  CartesianGrid

}
from "recharts";

export default function HealthChart({

  data

}){

  return(

    <ResponsiveContainer

      width="100%"

      height={400}

    >

      <LineChart
        data={data}
      >

        <CartesianGrid
          strokeDasharray="3 3"
        />

        <XAxis
          dataKey="date"
        />

        <YAxis
  ticks={[
    0,
    20,
    40,
    60,
    80,
    100
  ]}
/>

        <Tooltip />

        <Line

          type="monotone"

          dataKey="healthScore"

          stroke="#f57c00"

          strokeWidth={3}

        />

      </LineChart>

    </ResponsiveContainer>

  );

}