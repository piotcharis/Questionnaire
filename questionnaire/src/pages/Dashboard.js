import React from "react";
import { Container, Grid, Paper, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Question 1", Yes: 4000, No: 2400, amt: 2400 },
  { name: "Question 2", Yes: 3000, No: 1398, amt: 2210 },
  { name: "Question 3", Yes: 2000, No: 9800, amt: 2290 },
  { name: "Question 4", Yes: 2780, No: 3908, amt: 2000 },
  { name: "Question 5", Yes: 1890, No: 4800, amt: 2181 },
];

const Dashboard = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Questionnaire Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            <Typography variant="h6" gutterBottom>
              Answers Visualization
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Yes" fill="#8884d8" />
                <Bar dataKey="No" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
