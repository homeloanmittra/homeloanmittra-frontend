import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  useTheme as muiUseTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import ThemeToggle from '../UI/ThemeToggle';
import {
  AccountCircle,
  Dashboard,
  Calculate,
  Login,
  Logout,
  Home,
  Apps,
  Settings,
  Person,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const Navbar: React.FC = () => {
  const muiTheme = muiUseTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between('md', 'lg'));
  const isSmallMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileDrawerOpen(false);
  };

  // Determine dashboard path based on user role
  const getDashboardPath = () => {
    if (!user) return '/dashboard';

    // Check both role and userType for compatibility
    const userRole = user.role;
    const userType = user.userType;

    console.log('Navbar Debug - User:', user);
    console.log('Navbar Debug - User Role:', userRole);
    console.log('Navbar Debug - User Type:', userType);

    // Primary role checking
    if (userRole === 'admin') return '/admin-dashboard';
    if (userRole === 'broker') return '/broker-dashboard';
    if (userRole === 'builder') return '/builder-dashboard';
    if (userRole === 'customer') return '/customer-dashboard';

    // Fallback to userType checking
    if (userType === 'admin') return '/admin-dashboard';
    if (userType === 'broker') return '/broker-dashboard';
    if (userType === 'builder') return '/builder-dashboard';
    if (userType === 'customer') return '/customer-dashboard';

    // Default fallback
    return '/customer-dashboard';
  };

  const dashboardPath = getDashboardPath();
  console.log('Navbar Debug - Final Dashboard Path:', dashboardPath);

  const menuItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    // { label: 'Compare Loans', path: '/compare', icon: <Compare /> }, // Removed as per request
    { label: 'EMI Calculator', path: '/emi-calculator', icon: <Calculate /> },
    { label: 'Eligibility Checker', path: '/eligibility-checker', icon: <Calculate /> },
  ];

  const userMenuItems = user
    ? [
        {
          label: 'Dashboard',
          path: getDashboardPath(),
          icon: <Dashboard />,
        },
        { label: 'Applications', path: '/applications', icon: <Apps /> },
        { label: 'Profile', path: '/profile', icon: <Person /> },
        { label: 'Settings', path: '/settings', icon: <Settings /> },
      ]
    : [];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderMobileDrawer = () => (
    <Drawer
      anchor='left'
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      PaperProps={{
        sx: {
          width: { xs: '80vw', sm: 280, md: 320 },
          maxWidth: 400,
          bgcolor: isDark ? '#1e293b' : '#fff',
          color: isDark ? '#fff' : '#222',
        },
      }}
    >
      <Box sx={{ width: '100%' }} role='presentation'>
        {/* Enhanced Mobile Header */}
        <Box
          sx={{
            p: 3,
            background: isDark
              ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              component='img'
              src={logo}
              alt='Home Loan Mittra Logo'
              sx={{
                height: 40,
                width: 'auto',
                maxWidth: 80,
                borderRadius: 2,
                objectFit: 'contain',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
            <Box>
              <Typography
                variant='h6'
                sx={{
                  fontWeight: 700,
                  color: isDark ? '#60a5fa' : '#1976d2',
                  lineHeight: 1.2,
                  fontSize: 18,
                }}
              >
                Home Loan Mittra
              </Typography>
              <Typography
                variant='caption'
                sx={{
                  color: isDark ? '#94A3B8' : '#64748B',
                  fontWeight: 500,
                  letterSpacing: 0.5,
                  fontSize: 11,
                }}
              >
                Making Home Loans Effortless
              </Typography>
            </Box>
          </Box>

          {user && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 2,
                bgcolor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(25, 118, 210, 0.08)',
                borderRadius: 2,
                border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(25, 118, 210, 0.15)'}`,
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: isDark ? '#3b82f6' : '#1976d2',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography
                  variant='body2'
                  sx={{
                    fontWeight: 600,
                    color: isDark ? '#f1f5f9' : '#1e293b',
                    fontSize: 14,
                    lineHeight: 1.2,
                  }}
                >
                  {user.firstName || user.email?.split('@')[0] || 'User'}
                </Typography>
                <Typography
                  variant='caption'
                  sx={{
                    color: isDark ? '#94A3B8' : '#64748B',
                    fontSize: 11,
                    textTransform: 'capitalize',
                  }}
                >
                  {user.role || 'User'}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        <List sx={{ pt: 2 }}>
          <Divider sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)' }} />

          {menuItems.map(item => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  py: { xs: 1.5, sm: 1.8 },
                  px: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  '&.Mui-selected': {
                    bgcolor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(25, 118, 210, 0.08)',
                    '&:hover': {
                      bgcolor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(25, 118, 210, 0.12)',
                    },
                  },
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'inherit',
                    minWidth: { xs: 40, sm: 56 },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: { xs: 14, sm: 16 },
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}

          {user && (
            <>
              <Divider
                sx={{
                  my: 2,
                  bgcolor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                }}
              />
              {userMenuItems.map(item => (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    selected={location.pathname === item.path}
                    sx={{
                      py: { xs: 1.5, sm: 1.8 },
                      px: { xs: 2, sm: 3 },
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      '&.Mui-selected': {
                        bgcolor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(25, 118, 210, 0.08)',
                      },
                      '&:hover': {
                        bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: 'inherit',
                        minWidth: { xs: 40, sm: 56 },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: { xs: 14, sm: 16 },
                        fontWeight: 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              <Divider />
              <ListItem>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText primary='Logout' />
                </ListItemButton>
              </ListItem>
            </>
          )}

          {!user && (
            <>
              <Divider />
              <ListItem>
                <ListItemButton onClick={() => handleNavigation('/login')}>
                  <ListItemIcon>
                    <Login />
                  </ListItemIcon>
                  <ListItemText primary='Login' />
                </ListItemButton>
              </ListItem>
            </>
          )}

          {/* Theme Toggle Section in Mobile Drawer */}
          <Divider
            sx={{ mt: 2, bgcolor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)' }}
          />
          <ListItem sx={{ py: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                px: 1,
              }}
            >
              <Typography
                variant='body2'
                sx={{
                  color: isDark ? '#CBD5E1' : '#64748B',
                  fontWeight: 500,
                  fontSize: { xs: 14, sm: 16 },
                }}
              >
                Theme
              </Typography>
              <ThemeToggle />
            </Box>
          </ListItem>

          {/* App Info Section */}
          <ListItem sx={{ pt: 1, pb: 2 }}>
            <Box sx={{ textAlign: 'center', width: '100%' }}>
              <Typography
                variant='caption'
                sx={{
                  color: isDark ? '#94A3B8' : '#94A3B8',
                  fontSize: 11,
                  fontWeight: 400,
                  letterSpacing: 0.5,
                }}
              >
                Home Loan Mittra v1.0
              </Typography>
            </Box>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar
        position='sticky'
        sx={{
          backgroundColor: scrolled
            ? isDark
              ? 'rgba(15,22,43,0.85)'
              : 'rgba(255,255,255,0.85)'
            : isDark
              ? '#0f162b'
              : '#fff',
          color: isDark ? '#fff' : '#222',
          boxShadow: '0 2px 12px 0 rgba(30,41,59,0.10)',
          transition: 'background-color 0.3s cubic-bezier(.4,0,.2,1)',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 60, sm: 64, md: 72 },
            px: { xs: 1, sm: 2, md: 3, lg: 4 },
            gap: { xs: 1, sm: 2 },
          }}
        >
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='start'
              onClick={() => setMobileDrawerOpen(true)}
              sx={{
                mr: { xs: 1, sm: 2 },
                display: { md: 'none' },
              }}
            >
              <Apps />
            </IconButton>
          )}

          {/* Logo and Business Name */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.5 },
              cursor: 'pointer',
              minWidth: { xs: 'auto', sm: 200, md: 260 },
              pl: { xs: 0, sm: 1 },
              flexShrink: 0,
            }}
            onClick={() => navigate('/')}
          >
            <Box
              component='img'
              src={logo}
              alt='Home Loan Mittra Logo'
              sx={{
                height: { xs: 32, sm: 40, md: 48 },
                width: 'auto',
                maxWidth: { xs: 80, sm: 100, md: 120 },
                borderRadius: 2,
                boxShadow: '0 2px 8px 0 rgba(30,41,59,0.10)',
                objectFit: 'contain',
                display: 'block',
              }}
            />
            {!isSmallMobile && (
              <Box>
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 700,
                    color: isDark ? '#60a5fa' : '#1976d2',
                    lineHeight: 1,
                    fontSize: { xs: 16, sm: 20, md: 24 },
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  Home Loan Mittra
                </Typography>
                <Typography
                  variant='caption'
                  sx={{
                    color: isDark ? '#CBD5E1' : '#64748B',
                    fontWeight: 500,
                    letterSpacing: 1,
                    fontSize: { xs: 10, sm: 12 },
                    display: { xs: 'none', md: 'block' },
                  }}
                >
                  MAKING HOME LOANS EFFORTLESS
                </Typography>
              </Box>
            )}
          </Box>

          {/* Spacer to push nav to right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { md: 0.8, lg: 1.2 },
                pr: { md: 1, lg: 2 },
                flexWrap: 'wrap',
              }}
            >
              {menuItems.map(item => (
                <Button
                  key={item.label}
                  color='inherit'
                  onClick={() => navigate(item.path)}
                  sx={{
                    backgroundColor:
                      location.pathname === item.path
                        ? isDark
                          ? 'rgba(255,255,255,0.06)'
                          : 'rgba(30,41,59,0.06)'
                        : 'transparent',
                    color: isDark ? '#fff' : '#222',
                    fontWeight: 500,
                    fontSize: { md: 12, lg: 14 },
                    borderRadius: 2,
                    px: { md: 1, lg: 1.5 },
                    py: { md: 0.5, lg: 0.7 },
                    minWidth: 0,
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(30,41,59,0.10)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* User Menu (avatar) */}
              {user && (
                <Box sx={{ ml: { md: 0.5, lg: 1 } }}>
                  <Tooltip title='Account settings'>
                    <IconButton
                      onClick={handleProfileMenuOpen}
                      size='small'
                      sx={{ ml: { md: 0.5, lg: 1 } }}
                      aria-controls={anchorEl ? 'account-menu' : undefined}
                      aria-haspopup='true'
                      aria-expanded={anchorEl ? 'true' : undefined}
                    >
                      <Avatar
                        sx={{
                          width: { md: 28, lg: 32 },
                          height: { md: 28, lg: 32 },
                          backgroundColor: '#fff',
                          color: '#1976d2',
                          fontWeight: 700,
                          fontSize: { md: 12, lg: 14 },
                        }}
                      >
                        {user.firstName || user.name
                          ? (user.firstName || user.name).charAt(0).toUpperCase()
                          : 'U'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    id='account-menu'
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    disableScrollLock
                    PaperProps={{
                      elevation: 2,
                      sx: {
                        mt: 1.5,
                        minWidth: 180,
                        borderRadius: 2,
                        boxShadow: '0 4px 24px 0 rgba(30,41,59,0.18)',
                        bgcolor: isDark ? '#232b3b' : '#fff',
                        color: isDark ? '#fff' : '#222',
                        p: 0,
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate(dashboardPath);
                      }}
                    >
                      <ListItemIcon>
                        <Dashboard fontSize='small' />
                      </ListItemIcon>
                      <ListItemText primary='Dashboard' />
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate('/profile');
                      }}
                    >
                      <ListItemIcon>
                        <Person fontSize='small' />
                      </ListItemIcon>
                      <ListItemText primary='Profile' />
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate('/settings');
                      }}
                    >
                      <ListItemIcon>
                        <Settings fontSize='small' />
                      </ListItemIcon>
                      <ListItemText primary='Settings' />
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate('/support');
                      }}
                    >
                      <ListItemIcon>
                        <AccountCircle fontSize='small' />
                      </ListItemIcon>
                      <ListItemText primary='Support' />
                    </MenuItem>
                    <Divider sx={{ my: 1, bgcolor: isDark ? '#374151' : '#e0e0e0' }} />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <Logout fontSize='small' />
                      </ListItemIcon>
                      <ListItemText primary='Logout' />
                    </MenuItem>
                  </Menu>
                </Box>
              )}
              {/* Theme Toggle at extreme right */}
              <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
                <ThemeToggle />
              </Box>
            </Box>
          )}

          {/* Remove Login button from Navbar */}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      {renderMobileDrawer()}
    </>
  );
};

export default Navbar;
