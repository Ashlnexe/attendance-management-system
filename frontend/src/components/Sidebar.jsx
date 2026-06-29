import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Button
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';

const Sidebar = ({ user, onLogout, activeView, setActiveView, navItems }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const drawerWidth = 260;

  return (
    <Box
      component="nav"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        height: '100vh',
        position: 'fixed',
        left: 0,
        backgroundColor: '#000000', // black
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #333333',
        zIndex: 1200,
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 40,
            height: 40,
          }}
        >
          <AssignmentIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="800" sx={{ lineHeight: 1.2 }}>
            AMS
          </Typography>
          <Typography variant="caption" sx={{ color: 'slate.400', opacity: 0.7 }}>
            Attendance System
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#333333', mx: 2 }} />

      {/* Navigation List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
        <List sx={{ px: 2 }}>
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => setActiveView(item.id)}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    px: 2,
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    color: isActive ? '#ffffff' : '#9e9e9e',
                    '&:hover': {
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      color: isActive ? '#ffffff' : '#ffffff',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: 'inherit',
                      fontSize: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: '#333333', mx: 2 }} />

      {/* User Info Footer */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 1,
          }}
        >
          <Avatar
            sx={{
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              width: 40,
              height: 40,
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            {getInitials(user.name)}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" fontWeight="600" sx={{ noWrap: true, color: '#ffffff' }}>
              {user.name}
            </Typography>
            <Typography variant="caption" sx={{ textTransform: 'capitalize', color: '#a6a6a6' }}>
              {user.role}
            </Typography>
          </Box>
        </Box>

        {/* Logout Button */}
        <Button
          fullWidth
          variant="text"
          onClick={onLogout}
          startIcon={<LogoutIcon />}
          sx={{
            justifyContent: 'flex-start',
            color: '#f43f5e',
            py: 1,
            px: 2,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
