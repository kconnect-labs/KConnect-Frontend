import React from 'react';
import { Card, Typography, Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';


const StyledCard = styled(motion(Card))(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 450,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, var(--primary-dark) 0%, var(--primary) 100%)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    maxWidth: '100%',
  }
}));


const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 269 275" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd"
          d="M220.614 15.4742C218.098 4.71887 207.34 -1.9603 196.584 0.555831L163.663 8.25758C163.989 6.08586 164.328 3.8414 164.68 1.52132C164.328 3.84215 163.989 6.08731 163.657 8.25889L15.4743 42.9253C4.71895 45.4414 -1.96021 56.2 0.555918 66.9553L45.5619 259.335C48.078 270.091 58.8367 276.77 69.592 274.254L250.702 231.884C261.457 229.368 268.136 218.609 265.62 207.854L250.015 141.151C254.72 141.776 259.944 142.569 265.759 143.452L265.76 143.453L266.639 143.586C267.061 143.65 267.486 143.715 267.914 143.78C268.257 143.832 268.602 143.884 268.949 143.936C261.788 142.852 255.479 141.871 249.944 140.845L220.614 15.4742ZM217.343 82.3256C211.16 126.53 215.939 134.541 249.944 140.845L250.015 141.151C230.992 138.622 220.454 138.843 213.622 146.992C209.674 140.07 205.239 133.536 200.372 127.425C201.41 126.975 202.368 126.436 203.257 125.8C210.935 120.307 213.432 107.573 217.301 82.3196L217.343 82.3256ZM217.347 82.2964L217.343 82.3256C221.322 82.9129 225.548 83.5524 230.039 84.2321C225.548 83.5524 221.322 82.9128 217.347 82.2964ZM217.306 82.29L217.301 82.3196C186.826 77.823 170.854 76.4019 161.359 83.5659C159.258 85.1515 157.474 87.1576 155.92 89.6441C152.55 87.7585 149.106 86.0015 145.596 84.3772C145.027 83.1231 144.356 81.9592 143.575 80.8746C135.715 69.9579 116.692 67.079 77.7732 61.1894C116.692 67.079 135.715 69.9579 146.453 61.8556C156.037 54.6247 159.021 38.6477 163.657 8.25889L163.663 8.25758C159.1 38.6589 157.223 54.804 164.237 64.5469C171.187 74.1995 186.865 77.568 217.306 82.29ZM146.168 123.196C118.021 104.889 82.3156 98.3741 46.2417 108.08L43.1316 93.0097C41.1425 83.372 47.9436 73.6366 57.6217 72.1587C88.7506 67.4171 119.081 72.1092 145.596 84.3772C149.292 92.5229 148.701 104.473 146.168 123.196ZM146.168 123.196C146.227 123.235 146.287 123.273 146.346 123.312C145.328 129.4 144.293 136.238 143.133 143.9C144.298 136.201 145.337 129.335 146.168 123.196ZM146.346 123.312C172.748 140.551 192.472 168.18 199.562 202.532L214.42 198.532C223.923 195.973 229.572 185.529 226.539 176.22C223.159 165.858 218.811 156.089 213.622 146.992C207.469 154.332 204.324 168.104 200.694 192.092C205.245 162.018 207.456 147.409 201.228 139.207C195.345 131.46 181.933 129.43 155.85 125.483C179.002 128.987 192.171 130.98 200.372 127.425C188.032 111.932 172.916 99.1538 155.92 89.6441C151.553 96.6316 149.006 107.412 146.346 123.312ZM217.306 82.29L217.347 82.2964C217.667 80.0049 218.018 77.6162 218.394 75.1255C218.017 77.6187 217.656 80.0055 217.306 82.29ZM69.4629 220.596L66.1465 204.526C83.6499 199.813 100.806 210.382 104.47 228.134L88.6246 232.4C79.8753 234.768 71.2973 229.484 69.4629 220.596ZM59.5133 172.384L52.8801 140.243C105.399 126.091 156.881 157.806 167.863 211.078L136.173 219.61C128.855 184.151 94.4615 162.963 59.5133 172.384Z"
          fill="#D0BCFF"/>
  </svg>
);

const AuthCardContent = ({ title, subtitle, children }) => (
  <Box sx={{ width: '100%' }}>
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      marginBottom: 4 
    }}>
      <Logo />
      <Typography variant="h4" component="h1" sx={{ mt: 2, fontWeight: 'bold' }}>
        <span style={{ color: '#D0BCFF' }}>K</span>-CONNECT
      </Typography>
      {title && (
        <Typography variant="h5" component="h2" sx={{ mt: 3, textAlign: 'center' }}>
          {title}
        </Typography>
      )}
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {children}
  </Box>
);

const AuthCard = ({ title, subtitle, children }) => {
  return (
    <Container maxWidth="sm" sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      py: 4
    }}>
      <StyledCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AuthCardContent title={title} subtitle={subtitle}>
          {children}
        </AuthCardContent>
      </StyledCard>
    </Container>
  );
};

export default AuthCard; 