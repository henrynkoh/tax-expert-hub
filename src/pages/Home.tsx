import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import {
  Search as SearchIcon,
  Security as SecurityIcon,
  Chat as ChatIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

const features = [
  {
    title: 'Find Tax Experts',
    description: 'Connect with certified tax professionals who specialize in your specific needs.',
    icon: <SearchIcon sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Secure Platform',
    description: 'Your sensitive tax information is protected with enterprise-grade security.',
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Real-time Communication',
    description: 'Chat directly with tax professionals to get your questions answered quickly.',
    icon: <ChatIcon sx={{ fontSize: 40 }} />,
  },
  {
    title: 'Secure Payments',
    description: 'Make secure payments with our integrated payment system.',
    icon: <PaymentIcon sx={{ fontSize: 40 }} />,
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Find the Perfect Tax Service Provider
              </Typography>
              <Typography variant="h5" paragraph>
                Connect with certified tax professionals for all your tax needs.
                Whether you're an individual or a business, we've got you covered.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ mr: 2 }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/tax-hero.jpg"
                alt="Tax Services"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Why Choose Our Platform?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 2,
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            How It Works
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    1. Create Your Profile
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign up and create your profile as either a service provider or seeker.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    2. Find Your Match
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Browse through verified tax professionals or post your service request.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    3. Get Started
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Connect with your chosen professional and begin your tax journey.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 