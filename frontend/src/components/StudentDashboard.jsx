import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { fetchAttendance } from '../db';

const StudentDashboard = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('overview');
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <DashboardIcon /> },
    { id: 'history', label: 'Attendance History', icon: <HistoryIcon /> },
  ];

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const data = await fetchAttendance({ studentId: user._id });
      setAttendance(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const totalClasses = attendance.length;
  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const absentCount = attendance.filter((a) => a.status === 'Absent').length;
  const attendanceRate = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(1) : 0;

  const getAlertSeverity = (rate) => {
    if (rate >= 75) return 'success';
    if (rate >= 50) return 'warning';
    return 'error';
  };

  const renderOverview = () => (
    <>
      <Grid container spacing={3}>
        {/* Circle Progress Card */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 3,
            }}
          >
            <Typography variant="subtitle1" fontWeight="700" color="text.secondary" sx={{ mb: 4 }}>
              Overall Attendance Percentage
            </Typography>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              {/* Underlay track */}
              <CircularProgress
                variant="determinate"
                value={100}
                size={200}
                thickness={4.5}
                sx={{ color: 'rgba(255, 255, 255, 0.05)' }}
              />
              {/* Main determinate ring */}
              <CircularProgress
                variant="determinate"
                value={parseFloat(attendanceRate)}
                size={200}
                thickness={4.5}
                color={attendanceRate >= 75 ? 'secondary' : attendanceRate >= 50 ? 'warning' : 'error'}
                sx={{
                  position: 'absolute',
                  left: 0,
                  [`& .MuiCircularProgress-circle`]: {
                    strokeLinecap: 'round',
                  },
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight="800"
                  color={attendanceRate >= 75 ? 'secondary.main' : attendanceRate >= 50 ? 'warning.main' : 'error.main'}
                >
                  {attendanceRate}%
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight="600">
                  ATTENDED
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Stats Lists Grid */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%', justifyContent: 'center' }}>
            <Card sx={{ p: 1 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: '16px !important' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mb: 0.5 }}>
                    Total Classes
                  </Typography>
                  <Typography variant="h5" fontWeight="800">
                    {totalClasses}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'primary.main', width: 44, height: 44 }}>
                  <CalendarTodayIcon />
                </Avatar>
              </CardContent>
            </Card>

            <Card sx={{ p: 1 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: '16px !important' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mb: 0.5 }}>
                    Days Present
                  </Typography>
                  <Typography variant="h5" fontWeight="800">
                    {presentCount}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'secondary.main', width: 44, height: 44 }}>
                  <CheckCircleIcon />
                </Avatar>
              </CardContent>
            </Card>

            <Card sx={{ p: 1 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: '16px !important' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mb: 0.5 }}>
                    Days Absent
                  </Typography>
                  <Typography variant="h5" fontWeight="800">
                    {absentCount}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'error.main', width: 44, height: 44 }}>
                  <CancelIcon />
                </Avatar>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Warning/Alert notification message */}
      {totalClasses > 0 && (
        <Alert
          severity={getAlertSeverity(attendanceRate)}
          sx={{ mt: 3, borderRadius: 2.5, fontWeight: 500 }}
        >
          {attendanceRate >= 75
            ? `Great job! Your attendance is above 75%. Keep it up! 🎉`
            : attendanceRate >= 50
            ? `Warning: Your attendance has dropped below 75%. Try to attend more classes to cover the threshold.`
            : `Critical: Your attendance is critically low (${attendanceRate}%). Please contact your faculty immediately.`}
        </Alert>
      )}
    </>
  );

  const renderHistory = () => {
    const sortedAttendance = [...attendance].sort((a, b) => b.date.localeCompare(a.date));

    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="700" color="text.primary" sx={{ mb: 2 }}>
          Attendance History ({totalClasses} records)
        </Typography>
        {sortedAttendance.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="body1" color="text.secondary" fontWeight="500">
              No attendance records found yet.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, width: 80 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Day of Week</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedAttendance.map((record, index) => {
                  const dateObj = new Date(record.date + 'T00:00:00');
                  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                  return (
                    <TableRow key={record._id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{record.date}</TableCell>
                      <TableCell>{dayName}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={record.status}
                          size="small"
                          color={record.status === 'Present' ? 'secondary' : 'error'}
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Sidebar user={user} onLogout={onLogout} activeView={activeView} setActiveView={setActiveView} navItems={navItems} />
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', ml: '260px' }}>
          <CircularProgress size={50} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Sidebar user={user} onLogout={onLogout} activeView={activeView} setActiveView={setActiveView} navItems={navItems} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          ml: '260px',
          width: 'calc(100% - 260px)',
          minHeight: '100vh',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="800" color="text.primary" sx={{ mb: 1 }}>
            {activeView === 'overview' ? `Welcome, ${user.name}` : 'Attendance History'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeView === 'overview'
              ? 'General overview of your attendance rate and statistics'
              : 'Chronological index of your marked attendance records'}
          </Typography>
        </Box>

        {activeView === 'overview' && renderOverview()}
        {activeView === 'history' && renderHistory()}
      </Box>
    </Box>
  );
};

export default StudentDashboard;
