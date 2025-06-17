import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setRequests, setLoading, setError } from '../store/slices/serviceRequestSlice';
import { supabase } from '../config/supabase';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'completed';
  budget: {
    min: number;
    max: number;
  };
  seeker_id: string;
  provider_id?: string;
  created_at: string;
}

interface ServiceRequestState {
  requests: ServiceRequest[];
  loading: boolean;
  error: string | null;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { requests, loading, error } = useSelector((state: RootState) => state.serviceRequest) as ServiceRequestState;
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;

    dispatch(setLoading(true));
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq(user.role === 'provider' ? 'provider_id' : 'seeker_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      dispatch(setRequests(data || []));
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredRequests = requests.filter((request: ServiceRequest) => {
    switch (tabValue) {
      case 0: // Open
        return request.status === 'open';
      case 1: // In Progress
        return request.status === 'in-progress';
      case 2: // Completed
        return request.status === 'completed';
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3} component="div">
        <Grid item xs={12} component="div">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Dashboard
            </Typography>
            {user?.role === 'seeker' && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/service-request/new')}
              >
                New Request
              </Button>
            )}
          </Box>
        </Grid>

        {error && (
          <Grid item xs={12} component="div">
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <Grid item xs={12} component="div">
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Open" />
                <Tab label="In Progress" />
                <Tab label="Completed" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              {filteredRequests.length === 0 ? (
                <Typography variant="body1" color="text.secondary" align="center">
                  No open requests found.
                </Typography>
              ) : (
                <Box sx={{ display: 'grid', gap: 2 }}>
                  {filteredRequests.map((request: ServiceRequest) => (
                    <Card key={request.id}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {request.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {request.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Budget: ${request.budget.min} - ${request.budget.max}
                          </Typography>
                          <Button
                            variant="outlined"
                            onClick={() => navigate(`/service-request/${request.id}`)}
                          >
                            View Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {filteredRequests.length === 0 ? (
                <Typography variant="body1" color="text.secondary" align="center">
                  No in-progress requests found.
                </Typography>
              ) : (
                <Box sx={{ display: 'grid', gap: 2 }}>
                  {filteredRequests.map((request: ServiceRequest) => (
                    <Card key={request.id}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {request.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {request.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Budget: ${request.budget.min} - ${request.budget.max}
                          </Typography>
                          <Button
                            variant="outlined"
                            onClick={() => navigate(`/service-request/${request.id}`)}
                          >
                            View Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              {filteredRequests.length === 0 ? (
                <Typography variant="body1" color="text.secondary" align="center">
                  No completed requests found.
                </Typography>
              ) : (
                <Box sx={{ display: 'grid', gap: 2 }}>
                  {filteredRequests.map((request: ServiceRequest) => (
                    <Card key={request.id}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {request.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {request.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Budget: ${request.budget.min} - ${request.budget.max}
                          </Typography>
                          <Button
                            variant="outlined"
                            onClick={() => navigate(`/service-request/${request.id}`)}
                          >
                            View Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </TabPanel>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 