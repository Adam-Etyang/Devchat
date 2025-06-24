import { Typography, Box, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Chat = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Chat Room
      </Typography>
      <Paper sx={{ p: 3, minHeight: '60vh' }}>
        <Typography variant="body1" color="text.secondary">
          Welcome to the chat room, {user?.firstName}! 
          Real-time chat functionality will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Chat; 