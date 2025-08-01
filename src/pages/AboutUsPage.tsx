import React from 'react';
import { Typography, Stack, Box, Paper, useTheme } from '@mui/material';
import { Business, People, Security, TrendingUp } from '@mui/icons-material';
import GenericPage from '../components/UI/GenericPage';

const AboutUsPage: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const content = (
    <Stack spacing={4}>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          color: '#304FFE',
          fontWeight: 600
        }}
      >
        Making Home Loans Effortless
      </Typography>

      <Typography
        variant="body1"
        paragraph
        sx={{
          color: isDarkMode ? theme.palette.text.primary : '#2E2E2E'
        }}
      >
        HomeLoanMittra is India&apos;s leading digital platform that simplifies the home loan journey
        for millions of customers. We connect borrowers with the best lenders, providing transparent
        comparisons, instant eligibility checks, and seamless application processes.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Paper
          elevation={isDarkMode ? 3 : 1}
          sx={{
            p: 3,
            height: '100%',
            backgroundColor: isDarkMode ? theme.palette.background.paper : '#FFFFFF',
            border: isDarkMode ? '1px solid rgba(48, 79, 254, 0.12)' : 'none'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Business sx={{ color: '#304FFE', mr: 2, fontSize: 32 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: isDarkMode ? theme.palette.text.primary : '#2E2E2E'
              }}
            >
              Our Mission
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: isDarkMode ? theme.palette.text.secondary : '#2E2E2E'
            }}
          >
            To democratize home loan access by providing transparent, technology-driven
            solutions that empower customers to make informed financial decisions.
          </Typography>
        </Paper>

        <Paper
          elevation={isDarkMode ? 3 : 1}
          sx={{
            p: 3,
            height: '100%',
            backgroundColor: isDarkMode ? theme.palette.background.paper : '#FFFFFF',
            border: isDarkMode ? '1px solid rgba(0, 200, 200, 0.12)' : 'none'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <People sx={{ color: '#00C8C8', mr: 2, fontSize: 32 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: isDarkMode ? theme.palette.text.primary : '#2E2E2E'
              }}
            >
              Our Vision
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: isDarkMode ? theme.palette.text.secondary : '#2E2E2E'
            }}
          >
            To be the most trusted and preferred home loan platform in India,
            making homeownership dreams accessible to everyone.
          </Typography>
        </Paper>

        <Paper
          elevation={isDarkMode ? 3 : 1}
          sx={{
            p: 3,
            height: '100%',
            backgroundColor: isDarkMode ? theme.palette.background.paper : '#FFFFFF',
            border: isDarkMode ? '1px solid rgba(255, 167, 38, 0.12)' : 'none'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Security sx={{ color: '#FFA726', mr: 2, fontSize: 32 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: isDarkMode ? theme.palette.text.primary : '#2E2E2E'
              }}
            >
              Security First
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: isDarkMode ? theme.palette.text.secondary : '#2E2E2E'
            }}
          >
            We employ bank-grade security measures and comply with RBI guidelines
            to ensure your financial data is always protected.
          </Typography>
        </Paper>

        <Paper
          elevation={isDarkMode ? 3 : 1}
          sx={{
            p: 3,
            height: '100%',
            backgroundColor: isDarkMode ? theme.palette.background.paper : '#FFFFFF',
            border: isDarkMode ? '1px solid rgba(48, 79, 254, 0.12)' : 'none'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TrendingUp sx={{ color: '#304FFE', mr: 2, fontSize: 32 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: isDarkMode ? theme.palette.text.primary : '#2E2E2E'
              }}
            >
              Innovation
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: isDarkMode ? theme.palette.text.secondary : '#2E2E2E'
            }}
          >
            Leveraging cutting-edge technology and AI to provide personalized
            loan recommendations and seamless digital experiences.
          </Typography>
        </Paper>
      </Box>

      <Typography
        variant="h5"
        component="h2"
        sx={{
          color: '#304FFE',
          fontWeight: 600,
          mt: 4
        }}
      >
        Why Choose HomeLoanMittra?
      </Typography>

      <Stack spacing={2}>
        <Typography
          variant="body1"
          sx={{
            color: isDarkMode ? theme.palette.text.primary : '#2E2E2E'
          }}
        >
          • <strong style={{ color: '#304FFE' }}>Compare 50+ Lenders:</strong> Get the best rates from top banks and NBFCs
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDarkMode ? theme.palette.text.primary : '#2E2E2E'
          }}
        >
          • <strong style={{ color: '#00C8C8' }}>Instant Approval:</strong> Get pre-approved in minutes, not days
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDarkMode ? theme.palette.text.primary : '#2E2E2E'
          }}
        >
          • <strong style={{ color: '#FFA726' }}>Zero Hidden Charges:</strong> Complete transparency in all fees and charges
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDarkMode ? theme.palette.text.primary : '#2E2E2E'
          }}
        >
          • <strong style={{ color: '#304FFE' }}>Expert Support:</strong> Dedicated relationship managers for personalized assistance
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDarkMode ? theme.palette.text.primary : '#2E2E2E'
          }}
        >
          • <strong style={{ color: '#00C8C8' }}>Digital Process:</strong> Complete your loan journey from application to disbursal online
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <GenericPage
      title="About Us"
      content={content}
      breadcrumb="About HomeLoanMittra"
    />
  );
};

export default AboutUsPage;