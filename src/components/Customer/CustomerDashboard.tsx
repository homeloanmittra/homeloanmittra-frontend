import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Drawer,
  Stack,
  Divider,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Visibility,
  Close,
  Refresh,
  TrendingUp,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import applicationApi, { Application } from '../../services/applicationApi';

const CustomerDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date().toISOString());

  // Fetch customer applications
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationApi.getMyApplications();
      setApplications(data);
      setLastUpdateTime(new Date().toISOString());
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, []);

  // Real-time polling for updates
  const pollForUpdates = useCallback(async () => {
    try {
      const updates = await applicationApi.pollApplicationUpdates(lastUpdateTime);
      if (updates.length > 0) {
        fetchApplications();
      }
    } catch (err) {
      console.error('Failed to poll for updates:', err);
    }
  }, [lastUpdateTime, fetchApplications]);

  // Initialize data and polling
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Set up real-time polling every 30 seconds
  useEffect(() => {
    const interval = setInterval(pollForUpdates, 30000);
    return () => clearInterval(interval);
  }, [pollForUpdates]);

  // Get status configuration
  const getStatusConfig = (status: Application['status']) => {
    const configs = {
      submitted: { color: '#304FFE', label: 'Submitted', icon: '', progress: 15 },
      under_review: { color: '#304FFE', label: 'Under Review', icon: '', progress: 25 },
      documents_pending: { color: '#FFA726', label: 'Documents Pending', icon: '', progress: 35 },
      documents_received: { color: '#00C8C8', label: 'Documents Received', icon: '', progress: 50 },
      submitted_to_bank: { color: '#9C27B0', label: 'Submitted to Bank', icon: '', progress: 65 },
      under_bank_review: { color: '#673AB7', label: 'Under Bank Review', icon: '', progress: 75 },
      approved_by_bank: { color: '#4CAF50', label: 'Approved by Bank', icon: '', progress: 85 },
      rejected_by_bank: { color: '#F44336', label: 'Rejected by Bank', icon: '', progress: 100 },
      sanctioned: { color: '#2E7D32', label: 'Sanctioned', icon: '', progress: 95 },
      disbursed: { color: '#1B5E20', label: 'Disbursed', icon: '', progress: 100 },
      rejected: { color: '#D32F2F', label: 'Rejected', icon: '', progress: 100 },
    };
    return configs[status] || { color: '#757575', label: status, icon: '', progress: 0 };
  };

  // Get application statistics
  const getApplicationStats = () => {
    const totalApplications = applications.length;
    const activeApplications = applications.filter(
      app => !['rejected', 'rejected_by_bank', 'disbursed'].includes(app.status)
    ).length;
    const totalLoanAmount = applications
      .filter(app => ['approved_by_bank', 'sanctioned', 'disbursed'].includes(app.status))
      .reduce((sum, app) => sum + app.loanDetails.requestedAmount, 0);

    return {
      totalApplications,
      activeApplications,
      totalLoanAmount,
      completedApplications: applications.filter(app =>
        ['approved_by_bank', 'sanctioned', 'disbursed'].includes(app.status)
      ).length,
    };
  };

  const stats = getApplicationStats();

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Container maxWidth='xl' sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          mb: { xs: 3, md: 4 },
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3 },
          borderRadius: 3,
          background: isDark
            ? 'linear-gradient(90deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(90deg, #e3f0ff 0%, #f9fbfd 100%)',
          boxShadow: isDark
            ? '0 2px 12px 0 rgba(30,41,59,0.30)'
            : '0 2px 12px 0 rgba(30,41,59,0.08)',
        }}
      >
        <Box display='flex' alignItems='center' gap={2}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: isDark ? theme.palette.primary.dark : theme.palette.primary.main,
            }}
          >
            <AccountBalanceIcon sx={{ fontSize: 32, color: '#fff' }} />
          </Avatar>
          <Box>
            <Typography
              variant='h5'
              fontWeight='bold'
              color={isDark ? '#fff' : theme.palette.primary.main}
            >
              Welcome Back!
            </Typography>
            <Typography
              variant='subtitle1'
              color={isDark ? theme.palette.grey[300] : theme.palette.text.secondary}
            >
              Here’s a summary of your loan journey
            </Typography>
          </Box>
        </Box>
        <Button
          variant='outlined'
          startIcon={<Refresh />}
          onClick={fetchApplications}
          disabled={loading}
          sx={{
            color: isDark ? theme.palette.primary.light : theme.palette.primary.main,
            borderColor: isDark ? theme.palette.primary.light : theme.palette.primary.main,
            fontWeight: 600,
            px: 3,
            py: 1.2,
            borderRadius: 2,
            boxShadow: isDark
              ? '0 2px 12px 0 rgba(30,41,59,0.20)'
              : '0 2px 12px 0 rgba(30,41,59,0.05)',
            '&:hover': {
              background: isDark ? theme.palette.primary.dark : theme.palette.primary.light,
              color: '#fff',
              borderColor: isDark ? theme.palette.primary.dark : theme.palette.primary.light,
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box display='flex' flexWrap='wrap' gap={3} mb={4}>
        <Box sx={{ flex: '1 1 100%', maxWidth: { xs: '100%', sm: '50%', md: '25%' } }}>
          <Card
            sx={{
              height: '100%',
              background: isDark
                ? 'linear-gradient(135deg, #304FFE 0%, #222B45 100%)'
                : 'linear-gradient(135deg, #304FFE 0%, #5C6FFF 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: isDark ? 6 : 2,
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: isDark ? 12 : 6 },
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center' gap={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.14)', width: 48, height: 48 }}>
                  <AssignmentIcon sx={{ fontSize: 28, color: '#fff' }} />
                </Avatar>
                <Box>
                  <Typography variant='h4' fontWeight='bold' color='white'>
                    {stats.totalApplications}
                  </Typography>
                  <Typography color='rgba(255,255,255,0.8)'>Total Applications</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 100%', maxWidth: { xs: '100%', sm: '50%', md: '25%' } }}>
          <Card
            sx={{
              height: '100%',
              background: isDark
                ? 'linear-gradient(135deg, #00C8C8 0%, #1e293b 100%)'
                : 'linear-gradient(135deg, #00C8C8 0%, #4DD0E1 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: isDark ? 6 : 2,
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: isDark ? 12 : 6 },
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center' gap={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.14)', width: 48, height: 48 }}>
                  <PendingIcon sx={{ fontSize: 28, color: '#fff' }} />
                </Avatar>
                <Box>
                  <Typography variant='h4' fontWeight='bold' color='white'>
                    {stats.activeApplications}
                  </Typography>
                  <Typography color='rgba(255,255,255,0.8)'>Active Applications</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 100%', maxWidth: { xs: '100%', sm: '50%', md: '25%' } }}>
          <Card
            sx={{
              height: '100%',
              background: isDark
                ? 'linear-gradient(135deg, #4CAF50 0%, #1B5E20 100%)'
                : 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: isDark ? 6 : 2,
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: isDark ? 12 : 6 },
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center' gap={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.14)', width: 48, height: 48 }}>
                  <CheckCircleIcon sx={{ fontSize: 28, color: '#fff' }} />
                </Avatar>
                <Box>
                  <Typography variant='h4' fontWeight='bold' color='white'>
                    {stats.completedApplications}
                  </Typography>
                  <Typography color='rgba(255,255,255,0.8)'>Completed</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 100%', maxWidth: { xs: '100%', sm: '50%', md: '25%' } }}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #FFA726 0%, #FFB74D 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box display='flex' alignItems='center'>
                <TrendingUp sx={{ mr: 2, fontSize: 40, color: 'white' }} />
                <Box>
                  <Typography variant='h4' fontWeight='bold' color='white'>
                    ₹{(stats.totalLoanAmount / 100000).toFixed(1)}L
                  </Typography>
                  <Typography color='rgba(255,255,255,0.8)'>Total Sanctioned</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant='scrollable'
          scrollButtons='auto'
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-scrollButtons': {
              '&.Mui-disabled': { opacity: 0.3 },
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              minWidth: { xs: 140, sm: 180 },
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
            },
          }}
        >
          <Tab label='My Applications' icon={<AssignmentIcon />} />
          <Tab label='Application History' icon={<TimelineIcon />} />
        </Tabs>
      </Box>

      {/* Applications Tab */}
      {tabValue === 0 && (
        <Card sx={{ border: '1px solid #E0E0E0' }}>
          <CardContent sx={{ p: 0 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity='error' sx={{ m: 3 }}>
                {error}
              </Alert>
            ) : applications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <AssignmentIcon sx={{ fontSize: 64, color: '#E0E0E0', mb: 2 }} />
                <Typography variant='h6' color='#757575' gutterBottom>
                  No applications found
                </Typography>
                <Typography variant='body2' color='#757575' mb={3}>
                  You haven&lsquo;t submitted any loan applications yet.
                </Typography>
                <Button variant='contained' sx={{ bgcolor: '#304FFE' }}>
                  Apply for Loan
                </Button>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: '#F5F7FA' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', color: '#2E2E2E' }}>
                        Application #
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#2E2E2E' }}>
                        Loan Amount
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#2E2E2E' }}>Bank</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#2E2E2E' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#2E2E2E' }}>Progress</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#2E2E2E' }}>
                        Last Updated
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#2E2E2E', textAlign: 'center' }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applications.map(application => {
                      const statusConfig = getStatusConfig(application.status);
                      return (
                        <TableRow
                          key={application._id}
                          hover
                          sx={{
                            '&:hover': {
                              bgcolor: '#F8F9FA',
                              cursor: 'pointer',
                            },
                          }}
                        >
                          <TableCell sx={{ fontWeight: 500, color: '#304FFE' }}>
                            {application.applicationNumber}
                          </TableCell>
                          <TableCell>
                            <Typography variant='body2' fontWeight={500}>
                              ₹{application.loanDetails.requestedAmount.toLocaleString()}
                            </Typography>
                            <Typography variant='caption' color='#757575'>
                              {application.loanDetails.tenure} years •{' '}
                              {application.loanDetails.interestRate}% p.a.
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant='body2'>
                              {application.loanDetails.selectedBank}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={statusConfig.label}
                              size='small'
                              sx={{
                                bgcolor: statusConfig.color,
                                color: 'white',
                                fontWeight: 500,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ width: 100 }}>
                              <LinearProgress
                                variant='determinate'
                                value={statusConfig.progress}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: '#E0E0E0',
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: statusConfig.color,
                                    borderRadius: 3,
                                  },
                                }}
                              />
                              <Typography variant='caption' color='#757575' sx={{ mt: 0.5 }}>
                                {statusConfig.progress}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant='body2' color='#757575'>
                              {new Date(application.updatedAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell align='center'>
                            <IconButton
                              size='small'
                              onClick={() => {
                                setSelectedApplication(application);
                                setDrawerOpen(true);
                              }}
                              sx={{ color: '#304FFE' }}
                            >
                              <Visibility fontSize='small' />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Application History Tab */}
      {tabValue === 1 && (
        <Card sx={{ border: '1px solid #E0E0E0' }}>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Application Timeline
            </Typography>
            {applications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <TimelineIcon sx={{ fontSize: 48, color: '#E0E0E0', mb: 2 }} />
                <Typography color='#757575'>No application history available</Typography>
              </Box>
            ) : (
              <Box>
                {applications.map(application => (
                  <Card key={application._id} sx={{ mb: 2, border: '1px solid #E0E0E0' }}>
                    <CardContent>
                      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
                        <Typography variant='subtitle1' fontWeight='bold'>
                          {application.applicationNumber}
                        </Typography>
                        <Chip
                          label={getStatusConfig(application.status).label}
                          size='small'
                          sx={{
                            bgcolor: getStatusConfig(application.status).color,
                            color: 'white',
                          }}
                        />
                      </Box>
                      <Stepper orientation='vertical'>
                        {application.timeline.map((item, index) => (
                          <Step key={index} completed={true}>
                            <StepLabel>
                              <Typography variant='body2' fontWeight={500}>
                                {item.event}
                              </Typography>
                            </StepLabel>
                            <StepContent>
                              <Typography variant='body2' color='#757575'>
                                {item.description}
                              </Typography>
                              <Typography variant='caption' color='#757575'>
                                {new Date(item.date).toLocaleString()} • {item.performedBy}
                              </Typography>
                            </StepContent>
                          </Step>
                        ))}
                      </Stepper>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Application Details Drawer */}
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 500,
            maxWidth: '90vw',
          },
        }}
      >
        {selectedApplication && (
          <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
              <Typography variant='h6' fontWeight='bold'>
                Application Details
              </Typography>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <Close />
              </IconButton>
            </Box>

            {/* Application Info */}
            <Card sx={{ mb: 3, border: '1px solid #E0E0E0' }}>
              <CardContent>
                <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
                  <Typography variant='subtitle1' fontWeight='bold'>
                    {selectedApplication.applicationNumber}
                  </Typography>
                  <Chip
                    label={getStatusConfig(selectedApplication.status).label}
                    size='small'
                    sx={{
                      bgcolor: getStatusConfig(selectedApplication.status).color,
                      color: 'white',
                    }}
                  />
                </Box>
                <LinearProgress
                  variant='determinate'
                  value={getStatusConfig(selectedApplication.status).progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#E0E0E0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getStatusConfig(selectedApplication.status).color,
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography variant='body2' color='#757575' sx={{ mt: 1 }}>
                  {getStatusConfig(selectedApplication.status).progress}% Complete
                </Typography>
              </CardContent>
            </Card>

            {/* Loan Details */}
            <Card sx={{ mb: 3, border: '1px solid #E0E0E0' }}>
              <CardContent>
                <Typography variant='subtitle1' fontWeight='bold' mb={2}>
                  Loan Details
                </Typography>
                <Stack spacing={1}>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='body2' color='#757575'>
                      Loan Amount:
                    </Typography>
                    <Typography variant='body2' fontWeight={500}>
                      ₹{selectedApplication.loanDetails.requestedAmount.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='body2' color='#757575'>
                      Interest Rate:
                    </Typography>
                    <Typography variant='body2'>
                      {selectedApplication.loanDetails.interestRate}% p.a.
                    </Typography>
                  </Box>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='body2' color='#757575'>
                      Tenure:
                    </Typography>
                    <Typography variant='body2'>
                      {selectedApplication.loanDetails.tenure} years
                    </Typography>
                  </Box>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='body2' color='#757575'>
                      Monthly EMI:
                    </Typography>
                    <Typography variant='body2' fontWeight={500}>
                      ₹{selectedApplication.loanDetails.monthlyEMI.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box display='flex' justifyContent='space-between'>
                    <Typography variant='body2' color='#757575'>
                      Bank:
                    </Typography>
                    <Typography variant='body2'>
                      {selectedApplication.loanDetails.selectedBank}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Documents Status */}
            <Card sx={{ mb: 3, border: '1px solid #E0E0E0' }}>
              <CardContent>
                <Typography variant='subtitle1' fontWeight='bold' mb={2}>
                  Documents
                </Typography>
                <Box>
                  <Typography variant='body2' color='#757575' mb={1}>
                    Submitted:
                  </Typography>
                  {selectedApplication.documents.submitted.length === 0 ? (
                    <Typography variant='body2' color='#999'>
                      No documents submitted
                    </Typography>
                  ) : (
                    selectedApplication.documents.submitted.map((doc: string, index: number) => (
                      <Chip
                        key={index}
                        label={doc}
                        size='small'
                        sx={{ mr: 1, mb: 1, bgcolor: '#E8F5E8' }}
                      />
                    ))
                  )}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography variant='body2' color='#757575' mb={1}>
                    Pending:
                  </Typography>
                  {selectedApplication.documents.pending.length === 0 ? (
                    <Typography variant='body2' color='#999'>
                      No pending documents
                    </Typography>
                  ) : (
                    selectedApplication.documents.pending.map((doc: string, index: number) => (
                      <Chip
                        key={index}
                        label={doc}
                        size='small'
                        sx={{ mr: 1, mb: 1, bgcolor: '#FFF3E0' }}
                      />
                    ))
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card sx={{ border: '1px solid #E0E0E0' }}>
              <CardContent>
                <Typography variant='subtitle1' fontWeight='bold' mb={2}>
                  Recent Updates
                </Typography>
                <List dense>
                  {selectedApplication.timeline.slice(0, 5).map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText
                        primary={item.event}
                        secondary={
                          <Box>
                            <Typography variant='body2' color='#757575'>
                              {item.description}
                            </Typography>
                            <Typography variant='caption' color='#757575'>
                              {new Date(item.date).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        )}
      </Drawer>
    </Container>
  );
};

export default CustomerDashboard;
