import { Typography, Box, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Projects = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Projects
      </Typography>
      <Paper sx={{ p: 3, minHeight: '60vh' }}>
        <Typography variant="body1" color="text.secondary">
          Welcome to your projects, {user?.firstName}! 
          Project management functionality will be implemented here.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Projects; 