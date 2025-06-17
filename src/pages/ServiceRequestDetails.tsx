import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  AttachMoney,
  CalendarToday,
  Description,
  Person,
  Category,
  AttachFile,
  Send,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { supabase } from '../lib/supabase';
import { ServiceRequest, Message } from '../types';

const ServiceRequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [openProposalDialog, setOpenProposalDialog] = useState(false);
  const [proposalAmount, setProposalAmount] = useState('');
  const [proposalMessage, setProposalMessage] = useState('');

  useEffect(() => {
    fetchRequestDetails();
    fetchMessages();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*, seekers:seeker_id(name), providers:provider_id(name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      setRequest(data);
    } catch (err) {
      setError('Failed to load request details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, users:sender_id(name)')
        .eq('request_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data.map((msg: any) => ({
        ...msg,
        sender_name: msg.users.name,
      })));
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase.from('messages').insert({
        request_id: id,
        sender_id: user.id,
        content: newMessage,
      });

      if (error) throw error;

      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleSubmitProposal = async () => {
    try {
      const { error } = await supabase.from('proposals').insert({
        request_id: id,
        provider_id: user.id,
        amount: parseFloat(proposalAmount),
        message: proposalMessage,
      });

      if (error) throw error;

      setOpenProposalDialog(false);
      setProposalAmount('');
      setProposalMessage('');
      fetchRequestDetails();
    } catch (err) {
      console.error('Failed to submit proposal:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !request) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Request not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {request.title}
          </Typography>
          <Chip
            label={request.status}
            color={
              request.status === 'open'
                ? 'success'
                : request.status === 'in_progress'
                ? 'primary'
                : 'default'
            }
          />
        </Box>

        <Box sx={{ display: 'grid', gap: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person />
            <Typography>
              Posted by: {request.seekers?.name || 'Unknown'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Category />
            <Typography>Category: {request.category}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoney />
            <Typography>
              Budget: ${request.budget.min} - ${request.budget.max}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday />
            <Typography>
              Deadline: {new Date(request.deadline).toLocaleDateString()}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography>{request.description}</Typography>
          </Box>

          {request.documents && request.documents.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Attached Documents
              </Typography>
              <List>
                {request.documents.map((doc: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <AttachFile />
                    </ListItemIcon>
                    <ListItemText primary={doc} />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => window.open(doc, '_blank')}
                    >
                      Download
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>

        {user.role === 'provider' && request.status === 'open' && (
          <Box sx={{ mb: 4 }}>
            <Button
              variant="contained"
              onClick={() => setOpenProposalDialog(true)}
            >
              Submit Proposal
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h5" gutterBottom>
            Messages
          </Typography>
          <List sx={{ mb: 3 }}>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  bgcolor: message.sender_id === user.id ? 'action.hover' : 'background.paper',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Person fontSize="small" />
                  <Typography variant="subtitle2">
                    {message.sender_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(message.created_at).toLocaleString()}
                  </Typography>
                </Box>
                <Typography>{message.content}</Typography>
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              sx={{ alignSelf: 'flex-end' }}
            >
              <Send />
            </Button>
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={openProposalDialog}
        onClose={() => setOpenProposalDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Submit Proposal</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
            <TextField
              label="Proposal Amount"
              type="number"
              value={proposalAmount}
              onChange={(e) => setProposalAmount(e.target.value)}
              fullWidth
            />
            <TextField
              label="Message"
              multiline
              rows={4}
              value={proposalMessage}
              onChange={(e) => setProposalMessage(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProposalDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitProposal}
            variant="contained"
            disabled={!proposalAmount || !proposalMessage.trim()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ServiceRequestDetails; 