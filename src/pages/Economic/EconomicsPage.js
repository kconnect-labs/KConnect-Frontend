import React, { useState, useEffect, useContext } from 'react';
import { Container, Box, Typography, Paper, Grid, CircularProgress, Button, Tabs, Tab, Card, CardContent, Alert, ButtonGroup } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpeedIcon from '@mui/icons-material/Speed';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { AuthContext } from '../../context/AuthContext';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);


const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(8),
  maxWidth: '92%',
  [theme.breakpoints.up('lg')]: {
    maxWidth: '1280px',
  },
}));

const PageHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4, 3),
  marginBottom: theme.spacing(5),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, rgba(25, 25, 25, 0.8), rgba(35, 35, 35, 0.9))'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(245, 245, 245, 0.95))',
  color: theme.palette.text.primary,
  borderRadius: 20,
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
  backdropFilter: 'blur(20px)',
  border: theme.palette.mode === 'dark' 
    ? '1px solid rgba(255, 255, 255, 0.08)'
    : '1px solid rgba(0, 0, 0, 0.05)',
}));

const StatsCard = styled(Card)(({ theme, statcolor }) => ({
  height: '100%',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  borderRadius: 16,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 26px rgba(0, 0, 0, 0.15)',
  },
  position: 'relative',
  overflow: 'hidden',
  background: theme.palette.mode === 'dark'
    ? 'rgba(35, 35, 35, 0.8)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(12px)',
  border: theme.palette.mode === 'dark' 
    ? '1px solid rgba(255, 255, 255, 0.07)'
    : '1px solid rgba(0, 0, 0, 0.05)',
}));

const StatsValue = styled(Typography)(({ theme, trending }) => ({
  fontWeight: 700,
  fontSize: '2rem',
  marginBottom: theme.spacing(1),
  color: trending === 'up' ? theme.palette.success.main : 
         trending === 'down' ? theme.palette.error.main : 
         'inherit',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
  letterSpacing: '-0.5px',
}));

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  borderRadius: 16,
  background: theme.palette.mode === 'dark'
    ? 'rgba(35, 35, 35, 0.8)'
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(12px)',
  border: theme.palette.mode === 'dark' 
    ? '1px solid rgba(255, 255, 255, 0.07)'
    : '1px solid rgba(0, 0, 0, 0.05)',
}));

const IconWrapper = styled(Box)(({ theme, color }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 56,
  height: 56,
  borderRadius: 16,
  backgroundColor: alpha(color || theme.palette.primary.main, 0.12),
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    fontSize: 24,
    color: color || theme.palette.primary.main,
  },
}));

const DataSourceBadge = styled(Box)(({ theme, isreal }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.7rem',
  background: isreal ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.warning.main, 0.1),
  color: isreal ? theme.palette.success.main : theme.palette.warning.main,
  borderRadius: 12,
  padding: '2px 8px',
  marginLeft: 'auto',
  marginTop: -4,
  '& .MuiSvgIcon-root': {
    fontSize: '0.85rem',
    marginRight: 4,
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  fontWeight: 500,
  fontSize: '0.95rem',
  letterSpacing: '-0.3px',
  padding: theme.spacing(1.2, 2),
  color: theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.25rem',
  },
}));

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`economics-tabpanel-${index}`}
      aria-labelledby={`economics-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const EconomicsPage = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [marketIndices, setMarketIndices] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState(30);


  const chartColors = {
    moneySupply: 'rgba(88, 86, 214, 1)',
    inflationRate: 'rgba(255, 59, 48, 1)',
    velocity: 'rgba(0, 122, 255, 1)',
    auctionPrice: 'rgba(255, 204, 0, 1)',
    transactionVolume: 'rgba(175, 82, 222, 1)',
    kconnectIndex: 'rgba(255, 149, 0, 1)',
    economicActivity: 'rgba(52, 199, 89, 1)',
    auctionPriceIndex: 'rgba(255, 85, 85, 1)',
    badgePrice: 'rgba(88, 86, 214, 0.7)',
    moneyPerUser: 'rgba(90, 200, 250, 1)',
  };


  const axiosInstance = axios.create();
  axiosInstance.defaults.transformRequest = [
    (data, headers) => {
      return data;
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {


        let overviewRes, historicalRes, indicesRes;
        
        try {
          overviewRes = await axiosInstance.get('/api/economics/overview');
          if (!overviewRes.data.success) {
            throw new Error(overviewRes.data.message || 'Failed to load overview data');
          }
        } catch (err) {
          console.error('Error fetching overview data:', err);
          throw new Error('Failed to load economics overview');
        }
        
        try {
          historicalRes = await axiosInstance.get(`/api/economics/historical-data?days=${timeRange}`);
          if (!historicalRes.data.success) {
            throw new Error(historicalRes.data.message || 'Failed to load historical data');
          }
        } catch (err) {
          console.error('Error fetching historical data:', err);
          throw new Error('Failed to load historical economic data');
        }
        
        try {
          indicesRes = await axiosInstance.get(`/api/economics/market-indices?days=${timeRange}`);
          if (!indicesRes.data.success) {
            throw new Error(indicesRes.data.message || 'Failed to load market indices');
          }
        } catch (err) {
          console.error('Error fetching market indices:', err);
          throw new Error('Failed to load market indices data');
        }
        

        const overviewData = overviewRes.data.data;
        const latestData = overviewData.latest_data;
        const latestIndices = overviewData.latest_indices;
        const trends = overviewData.trends;


        setOverview({
          economy: {
            total_money_supply: latestData.total_money_supply || 0,
            users_with_points: latestData.users_with_points || 0,
            avg_points_per_user: latestData.avg_points_per_user || 0,
            inflation_rate: latestData.inflation_rate || 0,
            velocity_of_money: latestData.velocity_of_money || 0,
            daily_transaction_volume: latestData.daily_transaction_volume || 0,
            username_transaction_volume: latestData.username_transaction_volume || 0,
            bid_transaction_volume: latestData.bid_transaction_volume || 0,
            badge_transaction_volume: latestData.badge_transaction_volume || 0,
            based_on_actual_data: latestData.based_on_actual_data || {
              auction: false,
              badge: false,
              transaction: false
            }
          },
          indices: latestIndices ? {
            kconnect_index: latestIndices.kconnect_index || 0,
            auction_price_index: latestIndices.auction_price_index || 0,
            economic_activity_index: latestIndices.economic_activity_index || 0
          } : null,
          trends: trends || {}
        });
        

        setHistoricalData(historicalRes.data.data.historical_data || []);
        

        setMarketIndices(indicesRes.data.data.market_indices || []);
      } catch (err) {
        console.error('Error fetching economics data:', err);
        setError(err.message || 'Не удалось загрузить экономические данные. Возможно, сервис временно недоступен.');
        

        setOverview({ 
          economy: {
            total_money_supply: 0,
            users_with_points: 0,
            avg_points_per_user: 0,
            inflation_rate: 0,
            velocity_of_money: 0,
            daily_transaction_volume: 0,
            username_transaction_volume: 0,
            bid_transaction_volume: 0,
            badge_transaction_volume: 0,
            based_on_actual_data: {
              auction: false,
              badge: false,
              transaction: false
            }
          }
        });
        setHistoricalData([]);
        setMarketIndices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };


  const handleTimeRangeChange = (days) => {
    setTimeRange(days);
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru', { 
      day: 'numeric', 
      month: 'short' 
    }).format(date);
  };


  const createChartOptions = (title = '', yAxisLabel = '') => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              size: 12,
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(24, 24, 24, 0.8)',
          titleFont: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            size: 13
          },
          padding: 12,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          displayColors: true,
          callbacks: {
            title: function(tooltipItems) {
              return formatDate(tooltipItems[0].label);
            }
          }
        },
        title: {
          display: !!title,
          text: title,
          font: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            size: 16,
            weight: '500'
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            font: {
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              size: 12
            }
          }
        },
        y: {
          grid: {
            color: alpha('#9e9e9e', 0.06),
            drawBorder: false,
          },
          ticks: {
            font: {
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              size: 12
            }
          },
          title: {
            display: !!yAxisLabel,
            text: yAxisLabel,
            font: {
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              size: 13
            }
          }
        },
      },
      elements: {
        line: {
          tension: 0.4
        },
        point: {
          radius: 3,
          hoverRadius: 5
        }
      }
    };
  };


  const moneySupplyChartData = {
    labels: historicalData.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Денежная масса',
        data: historicalData.map(item => item.total_money_supply),
        borderColor: chartColors.moneySupply,
        backgroundColor: alpha(chartColors.moneySupply, 0.1),
        fill: true,
        pointBackgroundColor: chartColors.moneySupply,
      }
    ]
  };


  const inflationChartData = {
    labels: historicalData.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Уровень инфляции (%)',
        data: historicalData.map(item => item.inflation_rate),
        borderColor: chartColors.inflationRate,
        backgroundColor: alpha(chartColors.inflationRate, 0.1),
        fill: true,
        pointBackgroundColor: chartColors.inflationRate,
      }
    ]
  };


  const velocityChartData = {
    labels: historicalData.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Скорость обращения валюты',
        data: historicalData.map(item => item.velocity_of_money),
        borderColor: chartColors.velocity,
        backgroundColor: alpha(chartColors.velocity, 0.1),
        fill: true,
        pointBackgroundColor: chartColors.velocity,
      }
    ]
  };


  const marketIndicesChartData = {
    labels: marketIndices.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'KConnect Индекс',
        data: marketIndices.map(item => item.kconnect_index),
        borderColor: chartColors.kconnectIndex,
        backgroundColor: 'transparent',
        borderWidth: 3,
        pointBackgroundColor: chartColors.kconnectIndex,
        yAxisID: 'y',
      },
      {
        label: 'Индекс цен аукционов',
        data: marketIndices.map(item => item.auction_price_index),
        borderColor: chartColors.auctionPriceIndex,
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        pointBackgroundColor: chartColors.auctionPriceIndex,
        yAxisID: 'y1',
      },
      {
        label: 'Индекс экономической активности',
        data: marketIndices.map(item => item.economic_activity_index),
        borderColor: chartColors.economicActivity,
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        pointBackgroundColor: chartColors.economicActivity,
        yAxisID: 'y1',
      }
    ]
  };


  const dualAxisChartOptions = {
    ...createChartOptions(),
    scales: {
      ...createChartOptions().scales,
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: alpha('#9e9e9e', 0.06),
          drawBorder: false,
        },
        title: {
          display: true,
          text: 'KConnect Индекс',
          font: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            size: 13
          }
        },
        ticks: {
          font: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            size: 12
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
          drawBorder: false,
        },
        title: {
          display: true,
          text: 'Другие индексы',
          font: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            size: 13
          }
        },
        ticks: {
          font: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            size: 12
          }
        }
      },
    },
  };


  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh',
        flexDirection: 'column'
      }}>
        <CircularProgress 
          size={50} 
          thickness={4} 
          sx={{ color: chartColors.kconnectIndex }}
        />
        <Typography 
          variant="body1" 
          color="textSecondary" 
          sx={{ mt: 2, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
        >
          Загрузка экономических данных...
        </Typography>
      </Box>
    );
  }


  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh', 
        flexDirection: 'column' 
      }}>
        <Typography 
          variant="h5" 
          color="error" 
          gutterBottom
          sx={{ 
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            fontWeight: 500
          }}
        >
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ 
            mt: 2,
            borderRadius: '12px',
            padding: '10px 20px',
            fontSize: '0.95rem',
            fontWeight: 500,
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          Попробовать снова
        </Button>
      </Box>
    );
  }

  return (
    <StyledContainer maxWidth="lg">
      <PageHeader elevation={0}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            fontWeight: 600, 
            letterSpacing: '-0.5px',
            fontSize: { xs: '1.8rem', sm: '2.1rem' },
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
          }}
        >
          Экономика K-Connect
        </Typography>
        <Typography 
          variant="subtitle1" 
          align="center" 
          gutterBottom
          sx={{ 
            color: 'text.secondary',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            mb: 3 
          }}
        >
          Экономическая аналитика на основе реальных данных
        </Typography>
        
        {/* Time Range Selector */}
        <Box sx={{ mt: 2 }}>
          <Typography 
            variant="body2" 
            align="center" 
            gutterBottom
            sx={{ 
              color: 'text.secondary',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              mb: 1.5 
            }}
          >
            Период анализа:
          </Typography>
          <ButtonGroup 
            variant="outlined" 
            size="small"
            sx={{ 
              '& .MuiButton-root': {
                borderRadius: '10px !important',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                px: 2,
                mx: 0.5,
                fontSize: '0.85rem',
                fontWeight: 500,
                textTransform: 'none',
                borderColor: 'divider',
                boxShadow: 'none',
                '&.Mui-selected': {
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }
              }
            }}
          >
            <Button 
              onClick={() => handleTimeRangeChange(7)} 
              variant={timeRange === 7 ? "contained" : "outlined"}
              sx={{ borderRadius: '10px' }}
            >
              7 дней
            </Button>
            <Button 
              onClick={() => handleTimeRangeChange(30)} 
              variant={timeRange === 30 ? "contained" : "outlined"}
              sx={{ borderRadius: '10px' }}
            >
              30 дней
            </Button>
            <Button 
              onClick={() => handleTimeRangeChange(90)} 
              variant={timeRange === 90 ? "contained" : "outlined"}
              sx={{ borderRadius: '10px' }}
            >
              90 дней
            </Button>
            <Button 
              onClick={() => handleTimeRangeChange(180)} 
              variant={timeRange === 180 ? "contained" : "outlined"}
              sx={{ borderRadius: '10px' }}
            >
              180 дней
            </Button>
          </ButtonGroup>
        </Box>
      </PageHeader>

      {error ? (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          {/* Notification about data sources */}
          <Alert 
            severity="info" 
            icon={<InfoOutlinedIcon />}
            sx={{ 
              mb: 4, 
              borderRadius: 3,
              '& .MuiAlert-message': {
                fontSize: '0.925rem',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
              }
            }}
          >
            <Typography 
              variant="subtitle1" 
              fontWeight="600" 
              sx={{ 
                fontSize: '1.05rem', 
                mb: 0.5,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
              }}
            >
              Данные в реальном времени
            </Typography>
            <Typography 
              variant="body2"
              sx={{ 
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                fontSize: '0.9rem',
                lineHeight: 1.4
              }}
            >
              Вся экономическая статистика отображает реальные данные из базы данных: фактические транзакции, цены аукционов и стоимость бейджиков. Информация обновляется ежедневно и показывает точное состояние экономики K-Connect.
            </Typography>
          </Alert>

          {/* Summary Cards */}
          {overview && (
            <Grid container spacing={3} sx={{ mb: 5 }}>
              <Grid item xs={12} sm={6} md={4}>
                <StatsCard statcolor={chartColors.moneySupply}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    {overview.economy.based_on_actual_data?.transaction && (
                      <DataSourceBadge isreal={true}>
                        <CheckCircleOutlineIcon /> Реальные данные
                      </DataSourceBadge>
                    )}
                    <IconWrapper color={chartColors.moneySupply}>
                      <MonetizationOnIcon />
                    </IconWrapper>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, mb: 1.5, fontSize: '1.05rem' }}>
                      Общая денежная масса
                    </Typography>
                    <StatsValue trending={overview.trends.money_supply === 'up' ? 'up' : overview.trends.money_supply === 'down' ? 'down' : null}>
                      {overview.economy.total_money_supply.toLocaleString()} баллов
                    </StatsValue>
                    <Typography variant="body2" color="textSecondary" sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
                      Всего баллов в обращении
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <StatsCard statcolor={chartColors.inflationRate}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    {overview.economy.based_on_actual_data?.auction && (
                      <DataSourceBadge isreal={true}>
                        <CheckCircleOutlineIcon /> Реальные данные
                      </DataSourceBadge>
                    )}
                    <IconWrapper color={chartColors.inflationRate}>
                      <SpeedIcon />
                    </IconWrapper>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, mb: 1.5, fontSize: '1.05rem' }}>
                      Инфляция
                    </Typography>
                    <StatsValue trending={overview.trends.inflation === 'up' ? 'up' : overview.trends.inflation === 'down' ? 'down' : null}>
                      {overview.economy.inflation_rate.toFixed(2)}%
                    </StatsValue>
                    <Typography variant="body2" color="textSecondary" sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
                      Изменение цен на аукционах и бейджиках
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <StatsCard statcolor={chartColors.kconnectIndex}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    {overview.economy.based_on_actual_data?.user && (
                      <DataSourceBadge isreal={true}>
                        <CheckCircleOutlineIcon /> Реальные данные
                      </DataSourceBadge>
                    )}
                    <IconWrapper color={chartColors.kconnectIndex}>
                      <PeopleIcon />
                    </IconWrapper>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, mb: 1.5, fontSize: '1.05rem' }}>
                      Кол-во пользователей
                    </Typography>
                    <StatsValue trending={overview.trends.users === 'up' ? 'up' : overview.trends.users === 'down' ? 'down' : null}>
                      {overview.economy.users_with_points.toLocaleString()}
                    </StatsValue>
                    <Typography variant="body2" color="textSecondary" sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
                      Участников экономики
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Grid>
            </Grid>
          )}

            {/* Tabs for different charts */}
            <Box sx={{ 
              mb: 3,
              borderRadius: 3,
              backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(35, 35, 35, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
              backdropFilter: 'blur(12px)',
              border: theme => theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid rgba(0, 0, 0, 0.05)',
            }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                centered
                variant="fullWidth"
                aria-label="economic charts tabs"
                sx={{
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                  }
                }}
              >
                <StyledTab label="Общая статистика" icon={<ShowChartIcon />} iconPosition="start" />
                <StyledTab label="Динамика рынка" icon={<TrendingUpIcon />} iconPosition="start" />
                <StyledTab label="Финансовые индексы" icon={<AccountBalanceIcon />} iconPosition="start" />
                <StyledTab label="Инфляция" icon={<TrendingUpIcon />} iconPosition="start" />
              </Tabs>
            </Box>

            {/* Tab Panels */}
            <TabPanel value={tabValue} index={0}>
              {/* Chart content for General Metrics */}
              <Typography variant="h6" gutterBottom>
                Состояние экономики K-Connect
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Общий обзор основных экономических показателей за выбранный период
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ height: 300, mb: 4 }}>
                    <Line data={moneySupplyChartData} options={dualAxisChartOptions} />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ height: 300, mb: 4 }}>
                    <Line data={inflationChartData} options={dualAxisChartOptions} />
                  </Box>
                </Grid>
              </Grid>
              
              {overview?.indices && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Индексы экономики
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle1" gutterBottom>
                          KConnect Индекс
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {overview.indices.kconnect_index}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Комплексный индикатор здоровья экономики
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Индекс цен аукционов
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {overview.indices.auction_price_index}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Изменение цен относительно базового периода
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Индекс экономической активности
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {overview.indices.economic_activity_index}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Уровень активности участников
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {/* Chart content for Market Dynamics */}
              <Typography variant="h6" gutterBottom>
                Динамика денежной массы
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Общее количество баллов в экономике K-Connect
              </Typography>
              <Box sx={{ height: 400 }}>
                <Line data={moneySupplyChartData} options={dualAxisChartOptions} />
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Объем транзакций по категориям
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Распределение объема транзакций по типам
                </Typography>
                <Box sx={{ height: 400 }}>
                  {/* Transaction volume by category chart */}
                  <Bar 
                    data={{
                      labels: historicalData.map(item => formatDate(item.date)),
                      datasets: [
                        {
                          label: 'Покупка имен',
                          data: historicalData.map(item => item.username_transaction_volume || 0),
                          backgroundColor: 'rgba(75, 192, 192, 0.6)',
                          stack: 'Stack 0',
                        },
                        {
                          label: 'Ставки/Аукционы',
                          data: historicalData.map(item => item.bid_transaction_volume || 0),
                          backgroundColor: 'rgba(255, 99, 132, 0.6)',
                          stack: 'Stack 0',
                        },
                        {
                          label: 'Покупка бейджиков',
                          data: historicalData.map(item => item.badge_transaction_volume || 0),
                          backgroundColor: 'rgba(54, 162, 235, 0.6)',
                          stack: 'Stack 0',
                        }
                      ]
                    }}
                    options={{
                      ...dualAxisChartOptions,
                      scales: {
                        x: {
                          stacked: true,
                          grid: {
                            display: false
                          }
                        },
                        y: {
                          stacked: true,
                          grid: {
                            color: alpha('#9e9e9e', 0.1)
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Box>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              {/* Chart content for Financial Indices */}
              <Typography variant="h6" gutterBottom>
                Финансовые индексы экономики
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Динамика основных финансовых индексов K-Connect
              </Typography>
              <Box sx={{ height: 400 }}>
                <Line 
                  data={{
                    labels: marketIndices.map(item => formatDate(item.date)),
                    datasets: [
                      {
                        label: 'KConnect Индекс',
                        data: marketIndices.map(item => item.kconnect_index),
                        borderColor: chartColors.kconnectIndex,
                        backgroundColor: 'transparent',
                        tension: 0.3,
                        borderWidth: 2,
                      },
                      {
                        label: 'Индекс цен аукционов',
                        data: marketIndices.map(item => item.auction_price_index),
                        borderColor: chartColors.auctionPriceIndex,
                        backgroundColor: 'transparent',
                        tension: 0.3,
                        borderWidth: 2,
                        borderDash: [5, 5],
                      },
                      {
                        label: 'Индекс экономической активности',
                        data: marketIndices.map(item => item.economic_activity_index),
                        borderColor: chartColors.economicActivity,
                        backgroundColor: 'transparent',
                        tension: 0.3,
                        borderWidth: 2,
                        borderDash: [2, 2],
                      }
                    ]
                  }}
                  options={dualAxisChartOptions}
                />
              </Box>
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Компоненты KConnect Индекса
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Факторы, влияющие на основной индекс экономики
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Скорость обращения валюты (30%)
                      </Typography>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        Скорость, с которой баллы переходят между пользователями
                      </Typography>
                      <Box sx={{ height: 250 }}>
                        <Line 
                          data={{
                            labels: marketIndices.map(item => formatDate(item.date)),
                            datasets: [{
                              label: 'Скорость обращения',
                              data: marketIndices.map(item => item.avg_velocity || 0),
                              borderColor: chartColors.velocity,
                              backgroundColor: alpha(chartColors.velocity, 0.1),
                              fill: true,
                              tension: 0.3
                            }]
                          }}
                          options={dualAxisChartOptions}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Уровень участия пользователей (35%)
                      </Typography>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        Доля пользователей, активно участвующих в экономике
                      </Typography>
                      <Box sx={{ height: 250 }}>
                        <Line 
                          data={{
                            labels: marketIndices.map(item => formatDate(item.date)),
                            datasets: [{
                              label: 'Доля активных пользователей',
                              data: marketIndices.map(item => (item.avg_participation || 0) * 100),
                              borderColor: chartColors.moneySupply,
                              backgroundColor: alpha(chartColors.moneySupply, 0.1),
                              fill: true,
                              tension: 0.3
                            }]
                          }}
                          options={{
                            ...dualAxisChartOptions,
                            scales: {
                              ...dualAxisChartOptions.scales,
                              y: {
                                ...dualAxisChartOptions.scales.y,
                                max: 100,
                                ticks: {
                                  callback: function(value) {
                                    return value + '%';
                                  }
                                }
                              }
                            }
                          }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Рост объема транзакций (35%)
                      </Typography>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        Динамика роста объема транзакций в экономике
                      </Typography>
                      <Box sx={{ height: 250 }}>
                        <Line 
                          data={{
                            labels: marketIndices.map(item => formatDate(item.date)),
                            datasets: [{
                              label: 'Рост объема транзакций',
                              data: marketIndices.map(item => (item.volume_growth || 0) * 100),
                              borderColor: chartColors.transactionVolume,
                              backgroundColor: alpha(chartColors.transactionVolume, 0.1),
                              fill: true,
                              tension: 0.3
                            }]
                          }}
                          options={{
                            ...dualAxisChartOptions,
                            scales: {
                              ...dualAxisChartOptions.scales,
                              y: {
                                ...dualAxisChartOptions.scales.y,
                                ticks: {
                                  callback: function(value) {
                                    return value + '%';
                                  }
                                }
                              }
                            }
                          }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              {/* New tab content for Inflation Details */}
              <Typography variant="h6" gutterBottom>
                Подробный анализ инфляции
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Детальная информация об инфляционных процессах в экономике K-Connect
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Что такое инфляция в K-Connect?
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Инфляция в K-Connect измеряется как комплексный показатель, учитывающий изменение цен на аукционах, стоимость бейджиков и среднее количество баллов у пользователей. Это показывает, как меняется покупательная способность баллов с течением времени.
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                          Компоненты инфляции
                        </Typography>
                        <Typography variant="body2" paragraph>
                          <strong>Аукционы (40%):</strong> Изменение средних цен на аукционах имен
                        </Typography>
                        <Typography variant="body2" paragraph>
                          <strong>Бейджики (30%):</strong> Изменение средних цен на бейджики
                        </Typography>
                        <Typography variant="body2" paragraph>
                          <strong>Денежная масса (30%):</strong> Изменение среднего количества баллов у пользователей
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                          Как рассчитывается?
                        </Typography>
                        <Typography variant="body2" paragraph>
                          <strong>Формула:</strong> Взвешенное среднее изменений всех трех компонентов
                        </Typography>
                        <Typography variant="body2" paragraph>
                          Система сравнивает текущие значения с предыдущими и вычисляет процентное изменение для каждого компонента, затем объединяет их с учетом весов.
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                          На что влияет?
                        </Typography>
                        <Typography variant="body2" paragraph>
                          • <strong>Положительная инфляция</strong> (рост цен) - снижает покупательную способность баллов
                        </Typography>
                        <Typography variant="body2" paragraph>
                          • <strong>Отрицательная инфляция</strong> (дефляция) - увеличивает покупательную способность баллов
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                
                {/* Общая инфляция */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Общий показатель инфляции
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Совокупное изменение покупательной способности баллов
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <Line 
                        data={{
                          labels: historicalData.map(item => formatDate(item.date)),
                          datasets: [{
                            label: 'Инфляция (%)',
                            data: historicalData.map(item => item.inflation_rate),
                            borderColor: chartColors.inflationRate,
                            backgroundColor: alpha(chartColors.inflationRate, 0.1),
                            fill: true,
                            tension: 0.3
                          }]
                        }}
                        options={{
                          ...dualAxisChartOptions,
                          scales: {
                            ...dualAxisChartOptions.scales,
                            y: {
                              ...dualAxisChartOptions.scales.y,
                              ticks: {
                                callback: function(value) {
                                  return value + '%';
                                }
                              }
                            }
                          }
                        }}
                      />
                    </Box>
                  </Paper>
                </Grid>
                
                {/* Компоненты инфляции */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Компоненты инфляции
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Вклад каждого фактора в общий показатель инфляции
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <Bar 
                        data={{
                          labels: historicalData.slice(-10).map(item => formatDate(item.date)),
                          datasets: [
                            {
                              label: 'Аукционы',
                              data: historicalData.slice(-10).map(item => 
                                item.inflation_components ? item.inflation_components.auction_inflation : 0
                              ),
                              backgroundColor: 'rgba(255, 99, 132, 0.6)',
                              stack: 'Stack 0',
                            },
                            {
                              label: 'Бейджики',
                              data: historicalData.slice(-10).map(item => 
                                item.inflation_components ? item.inflation_components.badge_inflation : 0
                              ),
                              backgroundColor: 'rgba(54, 162, 235, 0.6)',
                              stack: 'Stack 0',
                            },
                            {
                              label: 'Денежная масса',
                              data: historicalData.slice(-10).map(item => 
                                item.inflation_components ? item.inflation_components.money_supply_inflation : 0
                              ),
                              backgroundColor: 'rgba(75, 192, 192, 0.6)',
                              stack: 'Stack 0',
                            }
                          ]
                        }}
                        options={{
                          ...dualAxisChartOptions,
                          scales: {
                            x: {
                              stacked: true,
                              grid: {
                                display: false
                              }
                            },
                            y: {
                              stacked: true,
                              grid: {
                                color: alpha('#9e9e9e', 0.1)
                              },
                              ticks: {
                                callback: function(value) {
                                  return value + '%';
                                }
                              }
                            }
                          }
                        }}
                      />
                    </Box>
                  </Paper>
                </Grid>
                
                {/* Цены на аукционах */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      Цены на аукционах

                    </Typography>
                    <Typography variant="body2" paragraph>
                      Изменение средних цен на аукционах имен (40% веса в инфляции)
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <Line 
                        data={{
                          labels: historicalData.map(item => formatDate(item.date)),
                          datasets: [{
                            label: 'Средняя цена аукциона',
                            data: historicalData.map(item => item.avg_auction_price),
                            borderColor: chartColors.auctionPrice,
                            backgroundColor: alpha(chartColors.auctionPrice, 0.1),
                            fill: true,
                            tension: 0.3
                          }]
                        }}
                        options={dualAxisChartOptions}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                      Примечание: Для дат без аукционов показаны прогнозируемые значения
                    </Typography>
                  </Paper>
                </Grid>
                
                {/* Цены на бейджики */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      Цены на бейджики
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Изменение средних цен на бейджики (30% веса в инфляции)
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <Line 
                        data={{
                          labels: historicalData.map(item => formatDate(item.date)),
                          datasets: [{
                            label: 'Средняя цена бейджика',
                            data: historicalData.map(item => item.avg_badge_price || 0),
                            borderColor: '#9c27b0',
                            backgroundColor: alpha('#9c27b0', 0.1),
                            fill: true,
                            tension: 0.3
                          }]
                        }}
                        options={dualAxisChartOptions}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                      Примечание: Для дат без покупок бейджиков показаны прогнозируемые значения
                    </Typography>
                  </Paper>
                </Grid>
                
                {/* Средние баллы у пользователей */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Средние баллы у пользователей
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Изменение среднего количества баллов на одного пользователя (30% веса в инфляции)
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <Line 
                        data={{
                          labels: historicalData.map(item => formatDate(item.date)),
                          datasets: [{
                            label: 'Среднее количество баллов',
                            data: historicalData.map(item => item.avg_points_per_user),
                            borderColor: '#4caf50',
                            backgroundColor: alpha('#4caf50', 0.1),
                            fill: true,
                            tension: 0.3
                          }]
                        }}
                        options={dualAxisChartOptions}
                      />
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Влияние транзакций на инфляцию
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Изменение объемов транзакций может влиять на инфляционные процессы. Ниже показана взаимосвязь между объемом транзакций и уровнем инфляции.
                    </Typography>
                    <Box sx={{ height: 400 }}>
                      <Line 
                        data={{
                          labels: historicalData.map(item => formatDate(item.date)),
                          datasets: [
                            {
                              label: 'Инфляция (%)',
                              data: historicalData.map(item => item.inflation_rate),
                              borderColor: chartColors.inflationRate,
                              backgroundColor: 'transparent',
                              tension: 0.3,
                              yAxisID: 'y',
                              borderWidth: 2
                            },
                            {
                              label: 'Общий объем транзакций',
                              data: historicalData.map(item => item.daily_transaction_volume),
                              borderColor: chartColors.transactionVolume,
                              backgroundColor: 'transparent',
                              tension: 0.3,
                              yAxisID: 'y1',
                              borderWidth: 2,
                              borderDash: [5, 5]
                            }
                          ]
                        }}
                        options={{
                          ...dualAxisChartOptions,
                          scales: {
                            x: {
                              grid: { display: false }
                            },
                            y: {
                              type: 'linear',
                              display: true,
                              position: 'left',
                              title: { display: true, text: 'Инфляция (%)' },
                              ticks: { callback: (value) => `${value}%` }
                            },
                            y1: {
                              type: 'linear',
                              display: true,
                              position: 'right',
                              grid: { drawOnChartArea: false },
                              title: { display: true, text: 'Объем транзакций' }
                            }
                          }
                        }}
                      />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
          </>
        )}
    </StyledContainer>
  );
};

export default EconomicsPage; 