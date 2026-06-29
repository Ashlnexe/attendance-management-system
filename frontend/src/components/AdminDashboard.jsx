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
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { fetchUsers, createUser, deleteUser, fetchAttendance } from '../db';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: 'student' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState('');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'students', label: 'Students', icon: <SchoolIcon /> },
    { id: 'faculty', label: 'Faculty', icon: <SupervisorAccountIcon /> },
    { id: 'reports', label: 'Attendance Reports', icon: <AssessmentIcon /> },
  ];

  useEffect(() => {
    loadUsers();
    loadAttendance();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
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

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUser(newUser);
      setMessage(`${newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1)} "${newUser.name}" created successfully!`);
      setShowAddModal(false);
      setNewUser({ name: '', username: '', password: '', role: 'student' });
      loadUsers();
    } catch (err) {
      setError(err.message || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteUser(id);
      setMessage(`User "${name}" deleted successfully`);
      loadUsers();
      loadAttendance();
    } catch (err) {
      console.log(err);
    }
  };

  const students = users.filter((u) => u.role === 'student');
  const faculty = users.filter((u) => u.role === 'faculty');

  // Calculate attendance stats
  const totalRecords = attendance.length;
  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const attendanceRate = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0;

  const renderDashboard = () => (
    <>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
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
                <SchoolIcon />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 1 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: '16px !important' }}>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mb: 0.5 }}>
                  Total Faculty
                </Typography>
                <Typography variant="h4" fontWeight="800">
                  {faculty.length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'warning.main', width: 48, height: 48 }}>
                <SupervisorAccountIcon />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 1 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: '16px !important' }}>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mb: 0.5 }}>
                  Attendance Rate
                </Typography>
                <Typography variant="h4" fontWeight="800">
                  {attendanceRate}%
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'secondary.main', width: 48, height: 48 }}>
                <CheckCircleIcon />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 1 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: '16px !important' }}>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight="600" sx={{ mb: 0.5 }}>
                  Total Records
                </Typography>
                <Typography variant="h4" fontWeight="800">
                  {totalRecords}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', color: 'error.main', width: 48, height: 48 }}>
                <CalendarTodayIcon />
              </Avatar>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Students */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="700" color="text.primary">
            Recent Students
          </Typography>
          <Button variant="outlined" size="small" onClick={() => setActiveView('students')}>
            View All
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.slice(0, 5).map((s) => (
                <TableRow key={s._id} hover>
                  <TableCell fontWeight="500">{s.name}</TableCell>
                  <TableCell>{s.username}</TableCell>
                  <TableCell>
                    <Chip label="Student" size="small" color="primary" variant="outlined" sx={{ textTransform: 'capitalize' }} />
                  </TableCell>
                  <TableCell>{new Date(s.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                    No students yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );

  const renderUserList = (role) => {
    const filteredUsers = users.filter((u) => u.role === role);
    const title = role === 'student' ? 'Students' : 'Faculty';
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="700" color="text.primary">
            {title} List ({filteredUsers.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setNewUser({ ...newUser, role });
              setShowAddModal(true);
            }}
          >
            Add {role}
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u._id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{u.name}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => handleDeleteUser(u._id, u.name)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary" fontWeight="500">
                      No {role}s found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const renderReports = () => {
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
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" fontWeight="700" color="text.primary">
            Attendance Reports
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
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="body1" color="text.secondary">
              No attendance records found.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  {!selectedStudentForReport && <TableCell sx={{ fontWeight: 600 }}>Student Name</TableCell>}
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
            {activeView === 'dashboard' && 'Dashboard'}
            {activeView === 'students' && 'Student Management'}
            {activeView === 'faculty' && 'Faculty Management'}
            {activeView === 'reports' && 'Attendance Reports'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeView === 'dashboard' && 'Overview of your attendance management system'}
            {activeView === 'students' && 'Add, view, and manage student accounts'}
            {activeView === 'faculty' && 'Add, view, and manage faculty accounts'}
            {activeView === 'reports' && 'View all attendance records'}
          </Typography>
        </Box>

        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'students' && renderUserList('student')}
        {activeView === 'faculty' && renderUserList('faculty')}
        {activeView === 'reports' && renderReports()}
      </Box>

      {/* Add User Dialog */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight="700">Add New {newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1)}</DialogTitle>
        <form onSubmit={handleAddUser}>
          <DialogContent dividers sx={{ py: 1 }}>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
            
            <TextField
              select
              fullWidth
              margin="normal"
              label="Role"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="faculty">Faculty</MenuItem>
            </TextField>

            <TextField
              fullWidth
              margin="normal"
              label="Full Name"
              placeholder="Enter full name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Username"
              placeholder="Enter username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              placeholder="Enter password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setShowAddModal(false)} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Create User
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Success Notification Snackbar */}
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

export default AdminDashboard;
