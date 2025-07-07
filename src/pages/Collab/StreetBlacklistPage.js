import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Helmet } from 'react-helmet-async';

/**
 * StreetBlacklistPage – public teaser page for the upcoming "K-Connect × Street Blacklist" collaboration
 * Path: /street/blacklist (added in App.js)
 */
const StreetBlacklistPage = () => {
  return (
    <>
      <Helmet>
        <title>К-Коннект × Street Blacklist</title>
        {/* Граффити-шрифт Rock Salt для Street Blacklist */}
        <meta name="description" content="Скоро: секретные уличные гонки с дрифтерами CarX Street. Следите за новостями!" />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Rock+Salt&display=swap');
          .graffiti-font {
            font-family: 'Rock Salt', cursive !important;
            font-weight: normal !important;
          }
        `}</style>
      </Helmet>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 2,
          backgroundColor: '#131313',
          color: '#D0BCFF',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Фоновые размазанные шарики */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '-120px', md: '-160px' },
            left: { xs: '-80px', md: '-120px' },
            width: { xs: 250, md: 350 },
            height: { xs: 250, md: 350 },
            background: '#006b37',
            opacity: 0.55,
            borderRadius: '50%',
            filter: 'blur(120px)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: '-100px', md: '-140px' },
            right: { xs: '-60px', md: '-100px' },
            width: { xs: 260, md: 380 },
            height: { xs: 260, md: 380 },
            background: '#cfbcfb',
            opacity: 0.5,
            borderRadius: '50%',
            filter: 'blur(130px)',
            zIndex: 0,
          }}
        />

        <Typography
          variant="h1"
          className="graffiti-font"
          sx={{
            fontSize: { xs: '2.5rem', md: '4rem' },
            fontWeight: 900,
            color: '#ff4444',
            textShadow: '0 0 20px rgba(255, 68, 68, 0.8)',
            mb: 1,
            zIndex: 2,
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          Street Blacklist
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#8aff8a',
            mb: 4,
            zIndex: 2,
          }}
        >
          <span style={{ color: '#cfbcfb' }}>К-Коннект</span> × <span className="graffiti-font">Street Blacklist</span>
        </Typography>
        <Typography
          variant="h6"
          sx={{
            maxWidth: 680,
            mb: 3,
            color: '#8aff8a',
            zIndex: 2,
          }}
        >
          Скоро стартуют нелегальные гонки в CarX Street. Гонщики на своих лучших авто будут разогревать улицы ревом моторов и вниманием зевак.
          Ходят слухи, что они хотят присоединиться к нам, и чтобы встретить их достойно, мы подготовим для них Blacklist.
        </Typography>
        <Typography variant="body1" sx={{ color: '#ffffffb0', maxWidth: 720, mb: 6, zIndex: 2 }}>
          Держи двигатель горячим: улицы проснутся внезапно. Самые быстрые и отчаянные заберут место в Blacklist.
        </Typography>
        <Button
          href="/"
          variant="contained"
          sx={{
            backgroundColor: '#8aff8a',
            color: '#000',
            '&:hover': { backgroundColor: '#6be96b' },
            fontWeight: 700,
            px: 4,
            boxShadow: '0 0 10px rgba(138,255,138,0.6)',
            zIndex: 2,
          }}
        >
          Вернуться в К-Коннект
        </Button>
      </Box>
    </>
  );
};

export default StreetBlacklistPage; 