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
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Snackbar,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { fetchUsers, fetchAttendance, saveAttendanceRecords } from '../db';

const FacultyDashboard = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('mark');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState('');

  const navItems = [
    { id: 'mark', label: 'Mark Attendance', icon: <EditIcon /> },
    { id: 'records', label: 'View Records', icon: <AssignmentIcon /> },
  ];

  useEffect(() => {
    loadStudents();
    loadAttendance();
  }, []);

  // When date changes, load existing attendance for that date
  useEffect(() => {
    loadAttendanceForDate();
  }, [selectedDate, attendance, students]);

  const loadStudents = async () => {
    try {
      const data = await fetchUsers('student');
      setStudents(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadAttendance = async () => {
    try {
      const data = await fetchAttendance();
      setAttendance(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadAttendanceForDate = () => {
    const dateRecords = attendance.filter((a) => a.date === selectedDate);
    const map = {};
    // Default all students to 'Present'
    students.forEach((s) => {
      map[s._id] = 'Present';
    });
    // Override with existing records
    dateRecords.forEach((record) => {
      const studentId = record.studentId?._id || record.studentId;
      map[studentId] = record.status;
    });
    setAttendanceMap(map);
  };

  const handleSaveAttendance = async () => {
    setLoading(true);
    try {
      const records = students.map((s) => ({
        date: selectedDate,
        studentId: s._id,
        status: attendanceMap[s._id] || 'Present',
      }));

      await saveAttendanceRecords(records);
      setMessage('Attendance saved successfully!');
      loadAttendance();
    } catch (err) {
      console.log(err);
      setMessage('Failed to save attendance');
    } finally {
      setLoading(false);
    }
  };

  const renderMarkAttendance = () => {
    const presentCount = Object.values(attendanceMap).filter((s) => s === 'Present').length;
    const absentCount = Object.values(attendanceMap).filter((s) => s === 'Absent').length;

    return (
      <>
        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 1 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: '16px !important' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mb: 0.5 }}>
                    Total Students
                  </Typography>
                  <Typography variant="h4" fontWeight="800">
                    {students.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'primary.main', width: 48, height: 48 }}>
                  <PeopleIcon />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 1 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: '16px !important' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mb: 0.5 }}>
                    Present
                  </Typography>
                  <Typography variant="h4" fontWeight="800">
                    {presentCount}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'secondary.main', width: 48, height: 48 }}>
                  <CheckCircleIcon />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 1 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: '16px !important' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mb: 0.5 }}>
                    Absent
                  </Typography>
                  <Typography variant="h4" fontWeight="800">
                    {absentCount}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'error.main', width: 48, height: 48 }}>
                  <CancelIcon />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="h6" fontWeight="700" color="text.primary">
              Mark Student Attendance
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                type="date"
                size="small"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                onClick={handleSaveAttendance}
                disabled={loading || students.length === 0}
              >
                {loading ? 'Saving...' : 'Save Attendance'}
              </Button>
            </Box>
          </Box>

          {students.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="body1" color="text.secondary" fontWeight="500">
                No students registered. Please contact the administrator.
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: 80 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Student Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow key={student._id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{student.name}</TableCell>
                      <TableCell>{student.username}</TableCell>
                      <TableCell align="right">
                        <ToggleButtonGroup
                          value={attendanceMap[student._id] || 'Present'}
                          exclusive
                          onChange={(e, val) => {
                            if (val) {
                              setAttendanceMap((prev) => ({ ...prev, [student._id]: val }));
                            }
                          }}
                          size="small"
                        >
                          <ToggleButton
                            value="Present"
                            color="secondary"
                            sx={{
                              fontWeight: 600,
                              textTransform: 'capitalize',
                              px: 2,
                              '&.Mui-selected': {
                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                                color: 'secondary.dark',
                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' }
                              }
                            }}
                          >
                            Present
                          </ToggleButton>
                          <ToggleButton
                            value="Absent"
                            color="error"
                            sx={{
                              fontWeight: 600,
                              textTransform: 'capitalize',
                              px: 2,
                              '&.Mui-selected': {
                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                                color: 'error.dark',
                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' }
                              }
                            }}
                          >
                            Absent
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </>
    );
  };

  const renderRecords = () => {
    const filteredAttendance = selectedStudentForReport
      ? attendance.filter((a) => a.studentId?._id === selectedStudentForReport)
      : attendance;

    const byDate = {};
    filteredAttendance.forEach((a) => {
      if (!byDate[a.date]) byDate[a.date] = [];
      byDate[a.date].push(a);
    });
    const dates = Object.keys(byDate).sort().reverse();

    let studentStats = null;
    if (selectedStudentForReport) {
      const totalClasses = filteredAttendance.length;
      const presentCount = filteredAttendance.filter((a) => a.status === 'Present').length;
      const rate = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(1) : 0;
      studentStats = { totalClasses, presentCount, rate };
    }

    return (
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" fontWeight="700" color="text.primary">
            Attendance Records History
          </Typography>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="student-filter-label">Filter by Student</InputLabel>
            <Select
              labelId="student-filter-label"
              value={selectedStudentForReport}
              label="Filter by Student"
              onChange={(e) => setSelectedStudentForReport(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">
                <em>All Students</em>
              </MenuItem>
              {students.map((s) => (
                <MenuItem key={s._id} value={s._id}>{s.name} ({s.username})</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {studentStats && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">Total Classes</Typography>
                <Typography variant="h5" fontWeight="bold">{studentStats.totalClasses}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">Present</Typography>
                <Typography variant="h5" fontWeight="bold">{studentStats.presentCount}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">Attendance Rate</Typography>
                <Typography variant="h5" fontWeight="bold" color={studentStats.rate >= 75 ? 'success.main' : 'error.main'}>
                  {studentStats.rate}%
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}

        {dates.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="body1" color="text.secondary">
              No records found. Mark attendance to populate history.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  {!selectedStudentForReport && <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>}
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dates.map((date) =>
                  byDate[date].map((record) => (
                    <TableRow key={record._id} hover>
                      <TableCell>{date}</TableCell>
                      {!selectedStudentForReport && <TableCell sx={{ fontWeight: 500 }}>{record.studentId?.name || 'Unknown'}</TableCell>}
                      <TableCell>
                        <Chip
                          label={record.status}
                          size="small"
                          color={record.status === 'Present' ? 'secondary' : 'error'}
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    );
  };

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
            {activeView === 'mark' ? 'Mark Attendance' : 'Attendance Records'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeView === 'mark'
              ? 'Select a date and click Save once you have updated the statuses'
              : 'Detailed look at previously submitted student attendance logs'}
          </Typography>
        </Box>

        {activeView === 'mark' && renderMarkAttendance()}
        {activeView === 'records' && renderRecords()}
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={() => setMessage('')}
        message={message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        ContentProps={{
          sx: { borderRadius: 2, bgcolor: 'slate.900' }
        }}
      />
    </Box>
  );
};

export default FacultyDashboard;
