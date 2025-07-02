import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, Button, Slide, useMediaQuery, Link } from '@mui/material';
import CookieIcon from '@mui/icons-material/Cookie';
import { useNavigate } from 'react-router-dom';

const COOKIE_KEY = 'kconnect_cookie_agreed';

const CookieBanner = React.memo(() => {
  const [open, setOpen] = useState(false);
  const agreedRef = useRef(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) {
      setOpen(true);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem(COOKIE_KEY, 'true');
    agreedRef.current = true;
    setOpen(false);
  };

  const handleCookiesClick = (e) => {
    e.preventDefault();
    navigate('/cookies');
  };

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          left: 0,
          width: '100%',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={8}
          sx={{
            px: 2,
            py: 1,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            maxWidth: 780,
            minHeight: 0,
            bgcolor: 'rgba(0,0,0,0.8)',
            boxShadow: '0 8px 32px rgba(157, 111, 250, 0.07)',
            width: '100%',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <CookieIcon color="warning" sx={{ fontSize: 28, minWidth: 28 }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: 'space-between',
              width: '100%',
              gap: isMobile ? 0.5 : 2,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.3, color: '#fff' }}>
              Мы используем <Link href="/cookies" onClick={handleCookiesClick} sx={{ color: '#D0BCFF', textDecoration: 'underline' }}>куки</Link> 🍪 <span style={{ color: '#b39ddb' }}><i>Без куки — как без музыки!</i></span>
              {!isMobile && (
                <><br/><span style={{ color: '#b39ddb' }}>С куки К-Коннект работает быстрее, веселее и вообще — как надо!</span></>
              )}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAgree}
              sx={{ borderRadius: 2, fontWeight: 600, ml: isMobile ? 0 : 2, mt: isMobile ? 1 : 0, whiteSpace: 'nowrap', minHeight: 32, minWidth: 0, px: 2, py: 0.5 }}
            >
              Съесть куки
            </Button>
          </Box>
        </Paper>
      </Box>
    </Slide>
  );
});

export default CookieBanner; 