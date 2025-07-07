import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Paper, 
  Avatar, 
  Container, 
  Button, 
  Divider,
  Grid,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Switch,
  Tooltip,
  Badge,
  CardMedia,
  CardActions,
  Fade,
  Zoom,
  Stack,
  DialogContentText,
  styled,
  Checkbox
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoIcon from '@mui/icons-material/Photo';
import CommentIcon from '@mui/icons-material/Comment';
import BugReportIcon from '@mui/icons-material/BugReport';
import PersonIcon from '@mui/icons-material/Person';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaidIcon from '@mui/icons-material/Paid';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SaveIcon from '@mui/icons-material/Save';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Link } from 'react-router-dom';
import WarningIcon from '@mui/icons-material/Warning';
import BlockIcon from '@mui/icons-material/Block';
import HistoryIcon from '@mui/icons-material/History';
import LinkIcon from '@mui/icons-material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import AddIcon from '@mui/icons-material/Add';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import CloseIcon from '@mui/icons-material/Close';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import StarsIcon from '@mui/icons-material/Stars';
import DecorationMenu from '../../UIKIT/DecorationMenu';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckIcon from '@mui/icons-material/Check';


const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-container": {
    zIndex: 999999999999
  },
  "& .MuiDialog-paper": {
    borderRadius: 12,
    background: 'rgba(18, 18, 18, 0.8)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: '100%',
      margin: 0,
      borderRadius: 0,
    }
  },
  "& .MuiDialogTitle-root": {
    fontSize: '1.2rem',
    fontWeight: 500
  },
  "& .MuiDialogContentText-root": {
    fontSize: '0.95rem',
    lineHeight: 1.5,
    overflowWrap: 'break-word',
    wordBreak: 'break-word'
  },
  "& .MuiDialogContent-root": {
    padding: '16px 24px',
    '@media (max-width: 600px)': {
      padding: '12px 16px',
      fontSize: '0.9rem'
    }
  }
}));


const snackbarStyle = {
  zIndex: 9999999
};

const ModeratorPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moderatorData, setModeratorData] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [error, setError] = useState(null);
  const [lastModeratorCheck, setLastModeratorCheck] = useState(0);
  
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  
  const [posts, setPosts] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [bugReports, setBugReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [badges, setBadges] = useState([]);
  const [artists, setArtists] = useState([]);
  
  
  const [deletePostDialogOpen, setDeletePostDialogOpen] = useState(false);
  const [deleteTrackDialogOpen, setDeleteTrackDialogOpen] = useState(false);
  const [deleteCommentDialogOpen, setDeleteCommentDialogOpen] = useState(false);
  const [deleteAvatarDialogOpen, setDeleteAvatarDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [bugReportStatusDialogOpen, setBugReportStatusDialogOpen] = useState(false);
  const [editBadgeDialogOpen, setEditBadgeDialogOpen] = useState(false);
  const [deleteBadgeDialogOpen, setDeleteBadgeDialogOpen] = useState(false);
  const [deleteArtistDialogOpen, setDeleteArtistDialogOpen] = useState(false);
  const [editArtistDialogOpen, setEditArtistDialogOpen] = useState(false);
  const [manageArtistTracksDialogOpen, setManageArtistTracksDialogOpen] = useState(false);
  const [artistTracks, setArtistTracks] = useState([]);
  const [searchableTracksList, setSearchableTracksList] = useState([]);
  const [trackSearch, setTrackSearch] = useState('');
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [searchMode, setSearchMode] = useState('artist');
  const [selectedTracks, setSelectedTracks] = useState([]);
  
  
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBugReport, setSelectedBugReport] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  
  
  const [editUserName, setEditUserName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [bugReportStatus, setBugReportStatus] = useState('');
  const [editBadgeName, setEditBadgeName] = useState('');
  const [editBadgeDescription, setEditBadgeDescription] = useState('');
  const [editBadgePrice, setEditBadgePrice] = useState('');
  const [editBadgeActive, setEditBadgeActive] = useState(true);
  const [editBadgeImage, setEditBadgeImage] = useState(null);
  const [editBadgeImagePreview, setEditBadgeImagePreview] = useState('');
  const [editArtistName, setEditArtistName] = useState('');
  const [editArtistBio, setEditArtistBio] = useState('');
  const [editArtistAvatar, setEditArtistAvatar] = useState(null);
  const [editArtistAvatarPreview, setEditArtistAvatarPreview] = useState('');
  const [editArtistVerified, setEditArtistVerified] = useState(false);
  const [editArtistInfo, setEditArtistInfo] = useState('');
  
  
  const [page, setPage] = useState(1); 
  
  
  const [pageStates, setPageStates] = useState({
    posts: 1,
    tracks: 1,
    comments: 1,
    users: 1,
    bugReports: 1,
    badges: 1,
    artists: 1
  });
  
  const [hasMore, setHasMore] = useState({
    posts: true,
    tracks: true,
    comments: true,
    users: true,
    bugReports: true,
    badges: true,
    artists: true
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);

  
  const postsObserver = useRef();
  const tracksObserver = useRef();
  const commentsObserver = useRef();
  const usersObserver = useRef();
  const bugReportsObserver = useRef();
  const badgesObserver = useRef();
  const artistsObserver = useRef();

  
  const [search, setSearch] = useState({
    posts: '',
    tracks: '',
    comments: '',
    users: '',
    bugReports: '',
    badges: '',
    artists: ''
  });
  
  
  const searchTimeout = useRef(null);

  
  const [warningUser, setWarningUser] = useState(null);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [warningData, setWarningData] = useState({
    reason: '',
    details: ''
  });
  
  const [banUser, setBanUser] = useState(null);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [banData, setBanData] = useState({
    reason: '',
    details: '',
    duration_days: 30
  });
  
  const [userWarningsDialogOpen, setUserWarningsDialogOpen] = useState(false);
  const [userBansDialogOpen, setUserBansDialogOpen] = useState(false);
  const [selectedUserHistory, setSelectedUserHistory] = useState(null);
  const [userWarnings, setUserWarnings] = useState([]);
  const [userBans, setUserBans] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  
  const [moderatorStats, setModeratorStats] = useState({
    deleted_posts: 0,
    deleted_tracks: 0,
    deleted_comments: 0,
    deleted_avatars: 0,
    updated_users: 0,
    warnings_issued: 0,
    bans_issued: 0,
    total_actions: 0,
    loading: true
  });
  
  const [issueMedalDialogOpen, setIssueMedalDialogOpen] = useState(false);
  const [medalUser, setMedalUser] = useState(null);
  const [availableMedals, setAvailableMedals] = useState([]);
  const [loadingMedals, setLoadingMedals] = useState(false);
  const [selectedMedal, setSelectedMedal] = useState('');
  const [medalDescription, setMedalDescription] = useState('');
  
  // --- СТЕЙТЫ ДЛЯ КЛЮЧЕЙ ---
  const [modKeys, setModKeys] = useState([]);
  const [modKeysLoading, setModKeysLoading] = useState(false);
  const [modKeysLoadingMore, setModKeysLoadingMore] = useState(false);
  const [modKeysError, setModKeysError] = useState(null);
  const [modKeysPage, setModKeysPage] = useState(1);
  const [modKeysTotal, setModKeysTotal] = useState(0);
  const [modKeysHasNext, setModKeysHasNext] = useState(false);
  const [modKeysDialogOpen, setModKeysDialogOpen] = useState(false);
  const [modKeysCreateLoading, setModKeysCreateLoading] = useState(false);
  const [modKeysCreateError, setModKeysCreateError] = useState(null);
  const [modKeysCreateSuccess, setModKeysCreateSuccess] = useState(null);
  const [modKeysForm, setModKeysForm] = useState({
    type: 'points',
    points: 1000,
    subscription_type: 'basic',
    subscription_duration_days: 30,
    max_uses: 1,
    count: 1,
    expires_days: 30,
    description: ''
  });
  const [modKeysDeleting, setModKeysDeleting] = useState({});
  const modKeysLoaderRef = useRef(null);
  const [generatedKeys, setGeneratedKeys] = useState([]);
  
  const [decorationMenuOpen, setDecorationMenuOpen] = useState(false);
  const [selectedUserForDecorations, setSelectedUserForDecorations] = useState(null);
  
  // --- ЗАГРУЗКА КЛЮЧЕЙ ---
  const fetchModKeys = useCallback(async (page = 1, append = false) => {
    if (page === 1) setModKeysLoading(true);
    else setModKeysLoadingMore(true);
    setModKeysError(null);
    try {
      const res = await axios.get(`/api/moderator/keys?page=${page}&per_page=20`);
      if (res.data && res.data.success) {
        setModKeysTotal(res.data.total);
        setModKeysPage(res.data.page);
        setModKeysHasNext(res.data.has_next);
        setModKeys((prev) => {
          const newKeys = res.data.keys || [];
          let merged;
          if (append) {
            // Исключаем дубли по id
            const ids = new Set(prev.map(k => k.id));
            merged = [...prev, ...newKeys.filter(k => !ids.has(k.id))];
          } else {
            merged = newKeys;
          }
          // Сортировка по created_at (сначала новые)
          return merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        });
      } else {
        setModKeysError('Ошибка загрузки ключей');
      }
    } catch (e) {
      setModKeysError('Ошибка загрузки ключей');
    } finally {
      setModKeysLoading(false);
      setModKeysLoadingMore(false);
    }
  }, []);
  
  useEffect(() => {
    fetchModKeys(1, false);
  }, [fetchModKeys]);
  
  // --- INFINITE SCROLL ---
  useEffect(() => {
    if (!modKeysHasNext || modKeysLoading || modKeysLoadingMore) return;
    const observer = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchModKeys(modKeysPage + 1, true);
      }
    }, { threshold: 1 });
    if (modKeysLoaderRef.current) {
      observer.observe(modKeysLoaderRef.current);
    }
    return () => {
      if (modKeysLoaderRef.current) observer.unobserve(modKeysLoaderRef.current);
    };
  // eslint-disable-next-line
  }, [modKeysHasNext, modKeysLoading, modKeysLoadingMore, modKeysPage, fetchModKeys]);
  
  // --- СОЗДАНИЕ КЛЮЧА ---
  const handleOpenCreateKeyDialog = () => {
    setModKeysForm({
      type: 'points',
      points: 1000,
      subscription_type: 'basic',
      subscription_duration_days: 30,
      max_uses: 1,
      count: 1,
      expires_days: 30,
      description: ''
    });
    setGeneratedKeys([]);
    setModKeysCreateError(null);
    setModKeysCreateSuccess(null);
    setModKeysDialogOpen(true);
  };
  const handleCloseCreateKeyDialog = () => {
    setModKeysDialogOpen(false);
  };
  const handleModKeysFormChange = (e) => {
    const { name, value } = e.target;
    setModKeysForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleCreateKey = async () => {
    setModKeysCreateLoading(true);
    setModKeysCreateError(null);
    setModKeysCreateSuccess(null);
    try {
      const payload = {
        key_type: modKeysForm.type,
        points_value: modKeysForm.type === 'points' ? Number(modKeysForm.points) : undefined,
        subscription_type: modKeysForm.type === 'subscription' ? modKeysForm.subscription_type : undefined,
        subscription_duration_days: modKeysForm.type === 'subscription' ? Number(modKeysForm.subscription_duration_days) : undefined,
        max_uses: Number(modKeysForm.max_uses),
        count: Number(modKeysForm.count),
        expires_days: Number(modKeysForm.expires_days),
        description: modKeysForm.description
      };
      // Удаляем undefined поля
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);
      const res = await axios.post('/api/moderator/keys/generate', payload);
      if (res.data && res.data.success) {
        // Если вернулся массив ключей (keys), показываем их все
        if (Array.isArray(res.data.keys)) {
          setGeneratedKeys(res.data.keys.map(k => k.key || k));
        } else if (res.data.key && res.data.key.key) {
          setGeneratedKeys([res.data.key.key]);
        }
        setModKeysCreateSuccess('Ключ(и) успешно созданы!');
        setModKeysCreateError(null);
        fetchModKeys();
      } else {
        setModKeysCreateError(res.data?.error || 'Ошибка создания ключа');
      }
    } catch (e) {
      setModKeysCreateError(e.response?.data?.error || 'Ошибка создания ключа');
    } finally {
      setModKeysCreateLoading(false);
    }
  };
  
  // --- УДАЛЕНИЕ КЛЮЧА ---
  const handleDeleteKey = async (keyId) => {
    setModKeysDeleting((prev) => ({ ...prev, [keyId]: true }));
    try {
      await axios.delete(`/api/moderator/keys/${keyId}`);
      fetchModKeys();
      showNotification('success', 'Ключ удалён');
    } catch (e) {
      showNotification('error', e.response?.data?.error || 'Ошибка удаления ключа');
    } finally {
      setModKeysDeleting((prev) => ({ ...prev, [keyId]: false }));
    }
  };
  
  // --- КОПИРОВАНИЕ КЛЮЧА ---
  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key.key).then(() => {
      showNotification('success', 'Ключ скопирован');
    });
  };
  
  // --- UI СЕКЦИЯ КЛЮЧЕЙ ---
  const renderModKeysSection = () => (
    <Box sx={{ mt: 4 }}>
      
      
      <Button
        variant="outlined"
        onClick={handleOpenCreateKeyDialog}
        sx={{ 
          mb: 3, 
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          color: 'rgba(255, 255, 255, 0.87)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }
        }}
        fullWidth={true}
      >
        Создать ключ
      </Button>
      
      {modKeysLoading && modKeys.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={28} />
        </Box>
      ) : modKeysError ? (
        <Alert severity="error">{modKeysError}</Alert>
      ) : (
        <Box>
          {modKeys.length === 0 ? (
            <Box sx={{ 
              p: 3, 
              textAlign: 'center',
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                Нет созданных ключей
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {modKeys.map((key, idx) => (
                <Grid item xs={12} sm={6} md={4} key={key.id}>
                  <Box sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 1.5 
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500, 
                          color: 'rgba(255, 255, 255, 0.87)', 
                          wordBreak: 'break-all',
                          fontFamily: 'monospace',
                          fontSize: '0.75rem'
                        }}
                      >
                        {key.key}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleCopyKey(key)}
                        sx={{
                          borderRadius: 1,
                          background: 'rgba(255, 255, 255, 0.05)',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.1)',
                          }
                        }}
                      >
                        <ContentCopyIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
                        Тип: {key.key_type === 'points' ? 'Баллы' : 'Подписка'}
                      </Typography>
                      
                      {key.key_type === 'points' && (
                        <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
                          Баллы: {key.points_value}
                        </Typography>
                      )}
                      
                      {key.key_type === 'subscription' && (
                        <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
                          Подписка: {key.subscription_type}
                        </Typography>
                      )}
                      
                      <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
                        Использовано: {key.current_uses}/{key.max_uses}
                      </Typography>
                      
                      <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
                        Создан: {key.created_at ? new Date(key.created_at).toLocaleDateString() : '-'}
                      </Typography>
                      
                      <Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
                        Действителен до: {key.expires_at ? new Date(key.expires_at).toLocaleDateString() : '-'}
                      </Typography>
                    </Box>
                    
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleDeleteKey(key.id)}
                      disabled={modKeysDeleting[key.id]}
                      sx={{
                        mt: 1,
                        borderRadius: 1,
                        background: 'rgba(244, 67, 54, 0.05)',
                        border: '1px solid rgba(244, 67, 54, 0.2)',
                        color: 'rgba(244, 67, 54, 0.8)',
                        '&:hover': {
                          background: 'rgba(244, 67, 54, 0.1)',
                          border: '1px solid rgba(244, 67, 54, 0.3)',
                        }
                      }}
                      fullWidth
                    >
                      {modKeysDeleting[key.id] ? <CircularProgress size={16} /> : 'Удалить'}
                    </Button>
                  </Box>
                  
                  {idx === modKeys.length - 1 && modKeysHasNext && (
                    <div ref={modKeysLoaderRef} style={{ height: 1 }} />
                  )}
                </Grid>
              ))}
              
              {modKeysLoadingMore && (
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );

  useEffect(() => {
    checkModeratorStatus();
    
    
    fetchModeratorStats();
  }, []);

  
  useEffect(() => {
    if (moderatorData) {
      
      resetTabData();
      loadTabData(tabValue);
    }
  }, [tabValue]);
  
  
  const resetTabData = () => {
    
    setPage(1);
    
    
    setPageStates({
      posts: 1,
      tracks: 1,
      comments: 1,
      users: 1,
      bugReports: 1,
      badges: 1,
      artists: 1
    });
    
    
    setHasMore({
      posts: true,
      tracks: true,
      comments: true,
      users: true,
      bugReports: true,
      badges: true,
      artists: true
    });
  };

  
  const checkModeratorStatus = async () => {
    try {
      
      if (window._moderatorCheckInProgress) {
        console.log('ModeratorPage: Moderator check already in progress, waiting...');
        
        await new Promise(resolve => {
          const checkInterval = setInterval(() => {
            if (!window._moderatorCheckInProgress) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 100);
        });
        return;
      }
      
      
      const now = Date.now();
      if (now - lastModeratorCheck < 15 * 60 * 1000 && moderatorData) {
        console.log('ModeratorPage: Using cached moderator data');
        return;
      }
      
      
      window._moderatorCheckInProgress = true;
      const quickCheckResponse = await axios.get('/api/moderator/quick-status');
      
      if (!quickCheckResponse.data.is_moderator) {
        
        setLoading(false);
        showNotification('error', 'У вас нет прав модератора');
        navigate('/'); 
        window._moderatorCheckInProgress = false;
        return;
      }
      
      
      setLoading(true);
      const response = await axios.get('/api/moderator/status');
      
      if (response.data.is_moderator) {
        setModeratorData(response.data);
        setPermissions(response.data.permissions);
        
        setLastModeratorCheck(now);
      } else {
        
        showNotification('error', 'У вас нет прав модератора');
        navigate('/'); 
      }
    } catch (error) {
      console.error('Error checking moderator status:', error);
      showNotification('error', 'Не удалось проверить права модератора');
      navigate('/'); 
    } finally {
      setLoading(false);
      
      window._moderatorCheckInProgress = false;
    }
  };

  
  const fetchModeratorStats = async () => {
    try {
      setModeratorStats(prev => ({ ...prev, loading: true }));
      
      
      const response = await axios.get('/api/moderator/actions');
      
      if (response.data && response.data.success) {
        const stats = response.data.stats || {};
        
        
        setModeratorStats({
          deleted_posts: stats.deleted_posts || 0,
          deleted_tracks: stats.deleted_tracks || 0,
          deleted_comments: stats.deleted_comments || 0,
          deleted_avatars: stats.deleted_avatars || 0,
          updated_users: stats.updated_users || 0,
          warnings_issued: stats.warnings_issued || 0,
          bans_issued: stats.bans_issued || 0,
          total_actions: stats.total_actions || 0,
          loading: false
        });
      } else {
        console.error('Ошибка при получении статистики модератора:', response.data?.error || 'Неизвестная ошибка');
      }
    } catch (error) {
      console.error('Ошибка при получении статистики:', error);
    } finally {
      setModeratorStats(prev => ({ ...prev, loading: false }));
    }
  };

  
  const showNotification = (severity, message) => {
    setSnackbar({
      open: true,
      severity,
      message
    });
  };

  
  const loadTabData = (tabIndex) => {
    
    setPage(1);
    setHasMore(prev => ({...prev}));

    switch (tabIndex) {
      case 0: 
        
        break;
      case 1: 
        if (permissions.delete_posts) {
          setPosts([]);
          fetchPosts();
        }
        break;
      case 2: 
        if (permissions.delete_music) {
          setTracks([]);
          fetchTracks();
        }
        break;
      case 3: 
        if (permissions.delete_comments) {
          setComments([]);
          fetchComments();
        }
        break;
      case 4: 
        if (permissions.change_user_name || permissions.change_username || permissions.delete_avatar) {
          setUsers([]);
          fetchUsers();
        }
        break;
      case 5: 
        if (permissions.manage_bug_reports || permissions.delete_bug_reports) {
          setBugReports([]);
          fetchBugReports();
        }
        break;
      case 6: 
        if (permissions.edit_badges || permissions.delete_badges) {
          setBadges([]);
          fetchBadges();
        }
        break;
      case 7:
        if (permissions.manage_artists || permissions.delete_artists) {
          setArtists([]);
          fetchArtists();
        }
        break;
      default:
        break;
    }
  };
  
  
  const handleSearchChange = (tab, value) => {
    setSearch(prev => ({...prev, [tab]: value}));
    
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    
    searchTimeout.current = setTimeout(() => {
      
      setPageStates(prev => ({
        ...prev,
        [tab]: 1
      }));
      
      
      switch (tab) {
        case 'posts':
          setPosts([]);
          fetchPosts(false, value);
          break;
        case 'tracks':
          setTracks([]);
          fetchTracks(false, value);
          break;
        case 'comments':
          setComments([]);
          fetchComments(false, value);
          break;
        case 'users':
          setUsers([]);
          fetchUsers(false, value);
          break;
        case 'bugReports':
          setBugReports([]);
          fetchBugReports(false, value);
          break;
        case 'badges':
          setBadges([]);
          fetchBadges(false, value);
          break;
        case 'artists':
          setArtists([]);
          fetchArtists(false, value);
          break;
        default:
          break;
      }
    }, 500);
  };

  
  const clearSearch = (tab) => {
    setSearch(prev => ({...prev, [tab]: ''}));
    
    
    setPageStates(prev => ({
      ...prev,
      [tab]: 1
    }));
    
    
    switch (tab) {
      case 'posts':
        setPosts([]);
        fetchPosts(false, '');
        break;
      case 'tracks':
        setTracks([]);
        fetchTracks(false, '');
        break;
      case 'comments':
        setComments([]);
        fetchComments(false, '');
        break;
      case 'users':
        setUsers([]);
        fetchUsers(false, '');
        break;
      case 'bugReports':
        setBugReports([]);
        fetchBugReports(false, '');
        break;
      case 'badges':
        setBadges([]);
        fetchBadges(false, '');
        break;
      case 'artists':
        setArtists([]);
        fetchArtists(false, '');
        break;
      default:
        break;
    }
  };

  
  const fetchPosts = async (loadMore = false, searchQuery = search.posts) => {
    try {
      if (!hasMore.posts && loadMore) return;
      
      loadMore ? setLoadingMore(true) : setLoading(true);
      const currentPage = loadMore ? pageStates.posts + 1 : 1;
      
      const response = await axios.get(`/api/moderator/posts?page=${currentPage}&per_page=${rowsPerPage}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
      
      if (response.data && response.data.posts) {
        const newPosts = response.data.posts;
        if (loadMore) {
          setPosts(prevPosts => [...prevPosts, ...newPosts]);
        } else {
          setPosts(newPosts);
        }
        
        
        setHasMore(prev => ({
          ...prev,
          posts: newPosts.length === rowsPerPage
        }));
        
        if (loadMore) {
          setPageStates(prev => ({
            ...prev,
            posts: prev.posts + 1
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      showNotification('error', 'Не удалось загрузить посты');
    } finally {
      loadMore ? setLoadingMore(false) : setLoading(false);
    }
  };

  const fetchTracks = async (loadMore = false, searchQuery = search.tracks) => {
    try {
      if (!hasMore.tracks && loadMore) return;
      
      loadMore ? setLoadingMore(true) : setLoading(true);
      const currentPage = loadMore ? pageStates.tracks + 1 : 1;
      
      const response = await axios.get(`/api/moderator/tracks?page=${currentPage}&per_page=${rowsPerPage}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
      
      if (response.data && response.data.tracks) {
        const newTracks = response.data.tracks;
        if (loadMore) {
          setTracks(prevTracks => [...prevTracks, ...newTracks]);
        } else {
          setTracks(newTracks);
        }
        
        
        setHasMore(prev => ({
          ...prev,
          tracks: newTracks.length === rowsPerPage
        }));
        
        if (loadMore) {
          setPageStates(prev => ({
            ...prev,
            tracks: prev.tracks + 1
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
      showNotification('error', 'Не удалось загрузить треки');
    } finally {
      loadMore ? setLoadingMore(false) : setLoading(false);
    }
  };

  const fetchComments = async (loadMore = false, searchQuery = search.comments) => {
    try {
      if (!hasMore.comments && loadMore) return;
      
      loadMore ? setLoadingMore(true) : setLoading(true);
      const currentPage = loadMore ? pageStates.comments + 1 : 1;
      
      const response = await axios.get(`/api/moderator/comments?page=${currentPage}&per_page=${rowsPerPage}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
      
      if (response.data && response.data.comments) {
        const newComments = response.data.comments;
        if (loadMore) {
          setComments(prevComments => [...prevComments, ...newComments]);
        } else {
          setComments(newComments);
        }
        
        
        setHasMore(prev => ({
          ...prev,
          comments: newComments.length === rowsPerPage
        }));
        
        if (loadMore) {
          setPageStates(prev => ({
            ...prev,
            comments: prev.comments + 1
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      showNotification('error', 'Не удалось загрузить комментарии');
    } finally {
      loadMore ? setLoadingMore(false) : setLoading(false);
    }
  };

  const fetchUsers = async (loadMore = false, searchQuery = search.users) => {
    try {
      if (!hasMore.users && loadMore) return;
      
      loadMore ? setLoadingMore(true) : setLoading(true);
      const currentPage = loadMore ? pageStates.users + 1 : 1;
      
      const response = await axios.get(`/api/moderator/users?page=${currentPage}&per_page=${rowsPerPage}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
      
      if (response.data && response.data.users) {
        const newUsers = response.data.users;
        if (loadMore) {
          setUsers(prevUsers => [...prevUsers, ...newUsers]);
        } else {
          setUsers(newUsers);
        }
        
        
        setHasMore(prev => ({
          ...prev,
          users: newUsers.length === rowsPerPage
        }));
        
        if (loadMore) {
          setPageStates(prev => ({
            ...prev,
            users: prev.users + 1
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('error', 'Не удалось загрузить пользователей');
    } finally {
      loadMore ? setLoadingMore(false) : setLoading(false);
    }
  };

  const BUG_STATUSES = ['Открыт', 'В обработке', 'Решено'];

  const fetchBugReports = async (loadMore = false, searchQuery = search.bugReports) => {
    try {
      if (!permissions.manage_bug_reports && !permissions.delete_bug_reports) {
        showNotification('error', 'У вас нет прав на просмотр баг-репортов');
        return;
      }
      if (!hasMore.bugReports && loadMore) return;
      if (loadingMore) return;
      loadMore ? setLoadingMore(true) : setLoading(true);
      const currentPage = loadMore ? pageStates.bugReports + 1 : 1;
      const response = await axios.get(`/api/moderator/bug-reports?page=${currentPage}&per_page=${rowsPerPage}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
      if (response.data && response.data.bug_reports) {
        const newReports = response.data.bug_reports;
        if (loadMore) {
          setBugReports(prevReports => [...prevReports, ...newReports]);
          setPageStates(prev => ({ ...prev, bugReports: currentPage }));
        } else {
          setBugReports(newReports);
          setPageStates(prev => ({ ...prev, bugReports: 1 }));
        }
        setHasMore(prev => ({
          ...prev,
          bugReports: newReports.length === rowsPerPage
        }));
      } else {
        showNotification('error', 'Неверный формат ответа от сервера');
      }
    } catch (error) {
      showNotification('error', error.response?.data?.error || 'Не удалось загрузить баг-репорты');
    } finally {
      loadMore ? setLoadingMore(false) : setLoading(false);
    }
  };

  const fetchBadges = async (loadMore = false, searchQuery = search.badges) => {
    try {
      if (!permissions.edit_badges && !permissions.delete_badges) {
        showNotification('error', 'У вас нет прав на просмотр бейджиков');
        return;
      }
      if (!hasMore.badges && loadMore) return;
      if (loadingMore) return;
      loadMore ? setLoadingMore(true) : setLoading(true);
      const currentPage = loadMore ? pageStates.badges + 1 : 1;
      const response = await axios.get(`/api/moderator/badges?page=${currentPage}&per_page=${rowsPerPage}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
      if (response.data && response.data.badges) {
        const newBadges = response.data.badges;
        if (loadMore) {
          setBadges(prevBadges => [...prevBadges, ...newBadges]);
          setPageStates(prev => ({ ...prev, badges: currentPage }));
        } else {
          setBadges(newBadges);
          setPageStates(prev => ({ ...prev, badges: 1 }));
        }
        setHasMore(prev => ({
          ...prev,
          badges: newBadges.length === rowsPerPage
        }));
      } else {
        showNotification('error', 'Неверный формат ответа от сервера при загрузке бейджиков');
      }
    } catch (error) {
      showNotification('error', error.response?.data?.error || 'Не удалось загрузить бейджики');
    } finally {
      loadMore ? setLoadingMore(false) : setLoading(false);
    }
  };

  const fetchArtists = async (loadMore = false, searchQuery = search.artists) => {
    try {
      if (!hasMore.artists && loadMore) return;
      if (loadingMore) return;
      loadMore ? setLoadingMore(true) : setLoading(true);
      const currentPage = loadMore ? pageStates.artists + 1 : 1;
      const response = await axios.get(`/api/moderator/artists?page=${currentPage}&per_page=${rowsPerPage}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
      if (response.data && response.data.artists) {
        const newArtists = response.data.artists;
        if (loadMore) {
          setArtists(prevArtists => [...prevArtists, ...newArtists]);
          setPageStates(prev => ({ ...prev, artists: currentPage }));
        } else {
          setArtists(newArtists);
          setPageStates(prev => ({ ...prev, artists: 1 }));
        }
        setHasMore(prev => ({
          ...prev,
          artists: newArtists.length === rowsPerPage
        }));
      }
    } catch (error) {
      showNotification('error', 'Не удалось загрузить артистов');
    } finally {
      loadMore ? setLoadingMore(false) : setLoading(false);
    }
  };

  
  const lastPostElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (postsObserver.current) postsObserver.current.disconnect();
    
    postsObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore.posts) {
        fetchPosts(true);
      }
    });
    
    if (node) postsObserver.current.observe(node);
  }, [loading, loadingMore, hasMore.posts]);

  const lastTrackElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (tracksObserver.current) tracksObserver.current.disconnect();
    
    tracksObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore.tracks) {
        fetchTracks(true);
      }
    });
    
    if (node) tracksObserver.current.observe(node);
  }, [loading, loadingMore, hasMore.tracks]);

  const lastCommentElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (commentsObserver.current) commentsObserver.current.disconnect();
    
    commentsObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore.comments) {
        fetchComments(true);
      }
    });
    
    if (node) commentsObserver.current.observe(node);
  }, [loading, loadingMore, hasMore.comments]);

  const lastUserElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (usersObserver.current) usersObserver.current.disconnect();
    
    usersObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore.users) {
        fetchUsers(true);
      }
    });
    
    if (node) usersObserver.current.observe(node);
  }, [loading, loadingMore, hasMore.users]);

  const lastBugReportElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (bugReportsObserver.current) bugReportsObserver.current.disconnect();
    
    bugReportsObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore.bugReports) {
        fetchBugReports(true);
      }
    });
    
    if (node) bugReportsObserver.current.observe(node);
  }, [loading, loadingMore, hasMore.bugReports]);

  const lastBadgeElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (badgesObserver.current) badgesObserver.current.disconnect();
    
    badgesObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore.badges) {
        fetchBadges(true);
      }
    });
    
    if (node) badgesObserver.current.observe(node);
  }, [loading, loadingMore, hasMore.badges]);

  const lastArtistElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (artistsObserver.current) artistsObserver.current.disconnect();
    
    artistsObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore.artists) {
        fetchArtists(true);
      }
    });
    
    if (node) artistsObserver.current.observe(node);
  }, [loading, loadingMore, hasMore.artists]);

  
  const handleDeletePost = async () => {
    if (!selectedPost) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(`/api/moderator/posts/${selectedPost.id}`);
      
      if (response.data.success) {
        showNotification('success', 'Пост успешно удален');
        setPosts(posts.filter(post => post.id !== selectedPost.id));
      } else {
        throw new Error(response.data.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      showNotification('error', 'Не удалось удалить пост');
    } finally {
      setLoading(false);
      setDeletePostDialogOpen(false);
    }
  };

  const handleDeleteTrack = async () => {
    if (!selectedTrack) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(`/api/moderator/tracks/${selectedTrack.id}`);
      
      if (response.data.success) {
        showNotification('success', 'Трек успешно удален');
        setTracks(tracks.filter(track => track.id !== selectedTrack.id));
      } else {
        throw new Error(response.data.error || 'Failed to delete track');
      }
    } catch (error) {
      console.error('Error deleting track:', error);
      showNotification('error', 'Не удалось удалить трек');
    } finally {
      setLoading(false);
      setDeleteTrackDialogOpen(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!selectedComment) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(`/api/moderator/comments/${selectedComment.id}`);
      
      if (response.data.success) {
        showNotification('success', 'Комментарий успешно удален');
        setComments(comments.filter(comment => comment.id !== selectedComment.id));
      } else {
        throw new Error(response.data.error || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      showNotification('error', 'Не удалось удалить комментарий');
    } finally {
      setLoading(false);
      setDeleteCommentDialogOpen(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(`/api/moderator/users/${selectedUser.id}/avatar`);
      
      if (response.data.success) {
        showNotification('success', 'Аватар пользователя успешно удален');
        
        setUsers(users.map(user => 
          user.id === selectedUser.id 
            ? { ...user, photo: null } 
            : user
        ));
      } else {
        throw new Error(response.data.error || 'Failed to delete avatar');
      }
    } catch (error) {
      console.error('Error deleting avatar:', error);
      showNotification('error', 'Не удалось удалить аватар');
    } finally {
      setLoading(false);
      setDeleteAvatarDialogOpen(false);
    }
  };

  const handleUpdateUserInfo = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      const payload = {};
      
      if (permissions.change_user_name && editUserName) {
        payload.name = editUserName;
      }
      
      if (permissions.change_username && editUsername) {
        payload.username = editUsername;
      }
      
      const response = await axios.put(`/api/moderator/users/${selectedUser.id}`, payload);
      
      if (response.data.success) {
        showNotification('success', 'Информация о пользователе обновлена');
        
        setUsers(users.map(user => 
          user.id === selectedUser.id 
            ? { 
                ...user, 
                name: payload.name || user.name, 
                username: payload.username || user.username 
              } 
            : user
        ));
      } else {
        throw new Error(response.data.error || 'Failed to update user info');
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      showNotification('error', 'Не удалось обновить информацию о пользователе');
    } finally {
      setLoading(false);
      setEditUserDialogOpen(false);
    }
  };

  const handleUpdateBugReportStatus = async () => {
    if (!selectedBugReport || !bugReportStatus) return;
    
    try {
      setLoading(true);
      const response = await axios.put(`/api/moderator/bug-reports/${selectedBugReport.id}`, {
        status: bugReportStatus
      });
      
      if (response.data.success) {
        showNotification('success', 'Статус баг-репорта обновлен');
        
        setBugReports(bugReports.map(report => 
          report.id === selectedBugReport.id 
            ? { ...report, status: bugReportStatus } 
            : report
        ));
      } else {
        throw new Error(response.data.error || 'Failed to update bug report status');
      }
    } catch (error) {
      console.error('Error updating bug report status:', error);
      showNotification('error', 'Не удалось обновить статус баг-репорта');
    } finally {
      setLoading(false);
      setBugReportStatusDialogOpen(false);
    }
  };

  const handleDeleteBugReport = async (reportId) => {
    try {
      
      if (!permissions.delete_bug_reports) {
        showNotification('error', 'У вас нет прав на удаление баг-репортов');
        return;
      }
      
      
      if (!window.confirm('Вы уверены, что хотите удалить этот баг-репорт?')) {
        return;
      }
      
      setLoading(true);
      const response = await axios.delete(`/api/moderator/bug-reports/${reportId}`);
      
      if (response.data && response.data.success) {
        
        setBugReports(prevReports => prevReports.filter(report => report.id !== reportId));
        showNotification('success', 'Баг-репорт успешно удален');
      }
    } catch (error) {
      console.error('Error deleting bug report:', error);
      showNotification('error', error.response?.data?.error || 'Ошибка при удалении баг-репорта');
    } finally {
      setLoading(false);
    }
  };

  
  const openDeletePostDialog = (post) => {
    setSelectedPost(post);
    setDeletePostDialogOpen(true);
  };

  const openDeleteTrackDialog = (track) => {
    setSelectedTrack(track);
    setDeleteTrackDialogOpen(true);
  };

  const openDeleteCommentDialog = (comment) => {
    setSelectedComment(comment);
    setDeleteCommentDialogOpen(true);
  };

  const openDeleteAvatarDialog = (user) => {
    setSelectedUser(user);
    setDeleteAvatarDialogOpen(true);
  };

  const openEditUserDialog = (user) => {
    setSelectedUser(user);
    setEditUserName(user.name || '');
    setEditUsername(user.username || '');
    setEditUserDialogOpen(true);
  };

  const openBugReportStatusDialog = (report) => {
    setSelectedBugReport(report);
    setBugReportStatus(report.status || 'Открыт');
    setBugReportStatusDialogOpen(true);
  };

  
  const debugBugReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/moderator/debug/bug-reports');
      console.log('[DEBUG] Bug reports debug info:', response.data);
      
      const { total_bug_reports, sample_reports, user_permissions } = response.data;
      
      let message = `Всего баг-репортов в базе: ${total_bug_reports}\n`;
      message += `Права: manage=${user_permissions.manage_bug_reports}, delete=${user_permissions.delete_bug_reports}\n\n`;
      
      if (sample_reports.length > 0) {
        message += 'Примеры баг-репортов:\n';
        sample_reports.forEach(report => {
          message += `- ID ${report.id}: ${report.subject} (${report.status || 'Нет статуса'})\n`;
        });
      } else {
        message += 'В базе данных нет баг-репортов.';
      }
      
      alert(message);
    } catch (error) {
      console.error('Error in debug function:', error);
      alert(`Ошибка при отладке: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  
  const deepDebugBugReports = async () => {
    setLoading(true);
    console.log('Performing deep debug of bug reports...');
    
    try {
      
      const adminCheckResponse = await axios.get('/api/admin/debug/bug-report-table');
      console.log('Admin DB check response:', adminCheckResponse.data);
      
      const tableInfo = adminCheckResponse.data.table_info || {};
      const sampleData = adminCheckResponse.data.sample_data || [];
      const permissionsInfo = adminCheckResponse.data.permissions_info || {};
      
      
      let alertMessage = `🔍 Database Direct Check:\n`;
      alertMessage += `Table columns: ${Object.keys(tableInfo).join(', ')}\n\n`;
      alertMessage += `Found ${sampleData.length} bug reports in DB directly.\n`;
      alertMessage += `Moderator permissions: ${JSON.stringify(permissionsInfo)}\n\n`;
      
      if (sampleData.length > 0) {
        alertMessage += `Sample data (first report):\n`;
        alertMessage += JSON.stringify(sampleData[0], null, 2);
      }
      
      alert(alertMessage);
      
      
      try {
        const regularResponse = await axios.get('/api/moderator/bug-reports');
        console.log('Regular API response:', regularResponse.data);
        
        
        const paginationResponse = await axios.get('/api/moderator/bug-reports?page=1&per_page=10');
        console.log('Pagination check response:', paginationResponse.data);
        
        const regularData = regularResponse.data.bug_reports || [];
        const paginationData = paginationResponse.data.bug_reports || [];
        
        let compareMessage = `📊 API Comparison:\n`;
        compareMessage += `Regular API found: ${regularData.length} reports\n`;
        compareMessage += `Pagination API found: ${paginationData.length} reports\n`;
        compareMessage += `Database direct found: ${sampleData.length} reports\n\n`;
        
        if (regularData.length === 0 && sampleData.length > 0) {
          compareMessage += `⚠️ ISSUE DETECTED: Data exists in DB but not in API response!\n`;
          compareMessage += `Possible causes:\n`;
          compareMessage += `- Permission filtering might be incorrect\n`;
          compareMessage += `- API response format mismatch\n`;
          compareMessage += `- Field name differences\n`;
        }
        
        alert(compareMessage);
        
      } catch (regularError) {
        console.error('Error fetching regular bug reports for comparison:', regularError);
        alert(`Failed to fetch regular bug reports: ${regularError.message}`);
      }
      
    } catch (adminError) {
      console.error('Admin debug check failed:', adminError);
      alert(`Admin debug check failed: ${adminError.message}. Trying regular debug...`);
      
      
      try {
        const debugResponse = await axios.get('/api/moderator/debug/bug-reports');
        console.log('Regular debug response:', debugResponse.data);
        
        const totalReports = debugResponse.data.total_reports || 0;
        const sampleReports = debugResponse.data.sample_reports || [];
        const permissions = debugResponse.data.permissions || {};
        
        let fallbackMessage = `🔍 Debug Check Results:\n`;
        fallbackMessage += `Total bug reports: ${totalReports}\n`;
        fallbackMessage += `User permissions: ${JSON.stringify(permissions)}\n\n`;
        
        if (sampleReports.length > 0) {
          fallbackMessage += `Sample reports:\n`;
          fallbackMessage += JSON.stringify(sampleReports[0], null, 2);
        } else {
          fallbackMessage += `No sample reports found.`;
        }
        
        alert(fallbackMessage);
        
      } catch (debugError) {
        console.error('Regular debug also failed:', debugError);
        alert(`All debug attempts failed. Please check server logs.`);
      }
    } finally {
      setLoading(false);
    }
  };

  
  if (!user) {
    return <Navigate to="/login" />;
  }

  
  if (loading && !moderatorData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Проверка прав доступа...
          </Typography>
        </Box>
      </Container>
    );
  }

  
  if (!loading && !moderatorData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <SecurityIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2 }}>
            Доступ запрещен
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            У вас нет прав модератора. Обратитесь к администратору для получения доступа.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Вернуться на главную
          </Button>
        </Paper>
      </Container>
    );
  }

  
  const renderPosts = () => {
    return (
      <>
        <Box sx={{ mb: 3 }}>
          <TextField 
            fullWidth
            placeholder="Поиск по постам..."
            value={search.posts}
            onChange={(e) => handleSearchChange('posts', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search.posts ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => clearSearch('posts')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                },
                '&.Mui-focused': {
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }
              },
              '& .MuiInputBase-input': {
                color: 'rgba(255, 255, 255, 0.87)',
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.5)',
                  opacity: 1,
                }
              }
            }}
          />
        </Box>
        
        <Box sx={{ width: '100%' }}>
          {posts.map((post, index) => (
            <Paper 
              key={post.id}
              ref={index === posts.length - 1 ? lastPostElementRef : null}
              sx={{ 
                p: { xs: 1.5, sm: 2 }, 
                mb: 2, 
                position: 'relative',
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, sm: 0 }, width: { xs: 'calc(100% - 48px)', sm: 'auto' } }}>
                  <Avatar 
                    src={post.author_avatar ? 
                      (post.author_avatar.startsWith('/') ? post.author_avatar : `/static/uploads/avatar/${post.author_id}/${post.author_avatar}`) : 
                      undefined}
                    sx={{ mr: 1, width: 40, height: 40 }} 
                    onClick={() => navigate(`/profile/${post.author_username}`)}
                    style={{ cursor: 'pointer' }}
                  />
                  <Box>
                    <Typography 
                      variant="subtitle1" 
                      onClick={() => navigate(`/profile/${post.author_username}`)}
                      sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {post.author_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      @{post.author_username}
                    </Typography>
                  </Box>
                </Box>
                
                <Box display="flex" alignItems="center">
                  <Button 
                    variant="outlined" 
                    size="small" 
                    sx={{ 
                      mr: 1, 
                      height: 36,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: 'rgba(255, 255, 255, 0.87)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-1px)',
                      }
                    }}
                    onClick={() => navigate(`/post/${post.id}`)}
                  >
                    Открыть пост
                  </Button>
                  <IconButton 
                    color="error" 
                    onClick={() => openDeletePostDialog(post)}
                    sx={{
                      borderRadius: 2,
                      background: 'rgba(244, 67, 54, 0.1)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(244, 67, 54, 0.2)',
                      '&:hover': {
                        background: 'rgba(244, 67, 54, 0.2)',
                        border: '1px solid rgba(244, 67, 54, 0.3)',
                        transform: 'translateY(-1px)',
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              
              <Typography 
                variant="body1" 
                sx={{ mb: 2, whiteSpace: 'pre-wrap', wordBreak: 'break-word', cursor: 'pointer' }}
                onClick={() => navigate(`/post/${post.id}`)}
              >
                {post.content}
              </Typography>
              
              {post.image && (
                <Box 
                  sx={{ mb: 2, maxWidth: '100%', maxHeight: 300, overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  <img 
                    src={post.image.startsWith('/') ? post.image : `/static/uploads/post/${post.id}/${post.image}`} 
                    alt="Post attachment" 
                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
                  />
                </Box>
              )}
              
              <Typography variant="caption" color="text.secondary">
                {new Date(post.created_at).toLocaleString()} • {post.comments_count || 0} комментариев • {post.likes_count || 0} лайков
              </Typography>
            </Paper>
          ))}
        </Box>
        
        {loadingMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={30} />
          </Box>
        )}
        
        {!hasMore.posts && posts.length > 0 && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
            Больше постов нет
          </Typography>
        )}
      </>
    );
  };

  
  const copyTrackLink = (track) => {
    const trackLink = `${window.location.origin}/music/track/${track.id}`;
    navigator.clipboard.writeText(trackLink)
      .then(() => {
        showNotification('success', 'Ссылка на трек скопирована в буфер обмена');
      })
      .catch(err => {
        console.error('Не удалось скопировать ссылку:', err);
        showNotification('error', 'Не удалось скопировать ссылку');
      });
  };

  
  const openTrack = (track) => {
    navigate(`/music/track/${track.id}`);
  };

  
  const renderTracks = () => {
    return (
      <>
        <Box sx={{ mb: 3 }}>
          <TextField 
            fullWidth
            placeholder="Поиск по трекам..."
            value={search.tracks}
            onChange={(e) => handleSearchChange('tracks', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search.tracks ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => clearSearch('tracks')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
            variant="outlined"
            size="small"
          />
        </Box>

        <TableContainer 
          sx={{ 
            overflowX: 'auto',
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ 
                '& .MuiTableCell-head': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'rgba(255, 255, 255, 0.87)',
                  fontWeight: 600,
                }
              }}>
                <TableCell>Обложка</TableCell>
                <TableCell>Название</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Артист</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Альбом</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Загружено</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tracks.map((track, index) => (
                <TableRow 
                  key={track.id}
                  ref={index === tracks.length - 1 ? lastTrackElementRef : null}
                  sx={{
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                    },
                    '& .MuiTableCell-body': {
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      color: 'rgba(255, 255, 255, 0.87)',
                    }
                  }}
                >
                  <TableCell>
                    <Avatar 
                      src={track.cover ? `/static/music/${track.user_id}/${track.id}/${track.cover}` : "/static/uploads/system/album_placeholder.jpg"}
                      variant="rounded"
                      sx={{ width: 50, height: 50, cursor: 'pointer' }}
                      onClick={() => openTrack(track)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography 
                      noWrap 
                      sx={{ 
                        maxWidth: { xs: 100, sm: 150, md: 'none' },
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => openTrack(track)}
                    >
                      {track.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' } }}>
                      {track.artist}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{track.artist}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{track.album || 'Нет данных'}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{new Date(track.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Box display="flex">
                      <IconButton 
                        color="primary" 
                        onClick={() => copyTrackLink(track)}
                        title="Копировать ссылку на трек"
                        size="small"
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="primary" 
                        onClick={() => openTrack(track)}
                        title="Открыть трек"
                        size="small"
                      >
                        <PlayArrowIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => openDeleteTrackDialog(track)}
                        title="Удалить трек"
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  
  const renderUsers = () => {
    return (
      <>
        <Box sx={{ mb: 3 }}>
          <TextField 
            fullWidth
            placeholder="Поиск по пользователям..."
            value={search.users}
            onChange={(e) => handleSearchChange('users', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search.users ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => clearSearch('users')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
            variant="outlined"
            size="small"
          />
        </Box>

        <TableContainer 
          sx={{ 
            overflowX: 'auto',
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ 
                '& .MuiTableCell-head': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'rgba(255, 255, 255, 0.87)',
                  fontWeight: 600,
                }
              }}>
                <TableCell>Аватар</TableCell>
                <TableCell>Имя</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Username</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Дата регистрации</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow 
                  key={user.id}
                  ref={index === users.length - 1 ? lastUserElementRef : null}
                  sx={{
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.05)',
                    },
                    '& .MuiTableCell-body': {
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      color: 'rgba(255, 255, 255, 0.87)',
                    }
                  }}
                >
                  <TableCell>
                    <Avatar 
                      src={user.photo ? (user.photo.startsWith('/') ? user.photo : `/static/uploads/avatar/${user.id}/${user.photo}`) : undefined}
                      sx={{ width: 40, height: 40, cursor: 'pointer' }}
                      onClick={() => navigate(`/profile/${user.username}`)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography 
                      noWrap 
                      sx={{ 
                        maxWidth: { xs: 120, sm: 'none' }, 
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => navigate(`/profile/${user.username}`)}
                    >
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'block', sm: 'none' } }}>
                      @{user.username}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Typography 
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => navigate(`/profile/${user.username}`)}
                    >
                      @{user.username}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <IconButton 
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/profile/${user.username}`)}
                        title="Профиль пользователя"
                      >
                        <PersonIcon fontSize="small" />
                      </IconButton>
                      
                      {(permissions.change_user_name || permissions.change_username) && (
                        <IconButton 
                          color="primary" 
                          onClick={() => openEditUserDialog(user)}
                          title="Изменить данные"
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      
                      {permissions.delete_avatar && user.photo && (
                        <IconButton 
                          color="warning" 
                          onClick={() => openDeleteAvatarDialog(user)}
                          title="Удалить аватар"
                          size="small"
                        >
                          <PhotoIcon fontSize="small" />
                        </IconButton>
                      )}
                      
                      
                      <Tooltip title="Предупреждения">
                        <IconButton 
                          color="warning" 
                          onClick={() => openUserWarningsDialog(user)}
                          size="small"
                        >
                          <HistoryIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Выдать предупреждение">
                        <IconButton 
                          color="warning" 
                          onClick={() => openWarningDialog(user)}
                          size="small"
                        >
                          <WarningIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Баны">
                        <IconButton 
                          color="error" 
                          onClick={() => openUserBansDialog(user)}
                          size="small"
                        >
                          <HistoryIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Забанить пользователя">
                        <IconButton 
                          color="error" 
                          onClick={() => openBanDialog(user)}
                          size="small"
                        >
                          <BlockIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      {permissions.manage_bug_reports && (
                        <Tooltip title="Выдать медаль">
                          <IconButton 
                            color="primary" 
                            onClick={() => openIssueMedalDialog(user)}
                            size="small"
                          >
                            <EmojiEventsOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Управление декорациями">
                        <IconButton
                          size="small"
                          onClick={() => openDecorationMenu(user)}
                        >
                          <StarsIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        
        <StyledDialog open={warningDialogOpen} onClose={() => setWarningDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Выдать предупреждение пользователю {warningUser?.name} (@{warningUser?.username})
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Причина предупреждения"
              value={warningData.reason}
              onChange={(e) => setWarningData({...warningData, reason: e.target.value})}
              margin="normal"
              variant="outlined"
              required
              helperText="Укажите причину, по которой выдается предупреждение"
            />
            <TextField
              fullWidth
              label="Дополнительная информация"
              value={warningData.details}
              onChange={(e) => setWarningData({...warningData, details: e.target.value})}
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
              helperText="При необходимости укажите дополнительную информацию"
            />
            <Alert severity="warning" sx={{ mt: 2 }}>
              При получении 3 предупреждений пользователь будет автоматически заблокирован на 30 дней!
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setWarningDialogOpen(false)}>Отмена</Button>
            <Button 
              onClick={handleIssueWarning} 
              color="warning" 
              variant="contained"
              disabled={!warningData.reason.trim()}
            >
              Выдать предупреждение
            </Button>
          </DialogActions>
        </StyledDialog>
        
        
        <StyledDialog open={banDialogOpen} onClose={() => setBanDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Заблокировать пользователя {banUser?.name} (@{banUser?.username})
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Причина блокировки"
              value={banData.reason}
              onChange={(e) => setBanData({...banData, reason: e.target.value})}
              margin="normal"
              variant="outlined"
              required
              helperText="Укажите причину, по которой блокируется пользователь"
            />
            <TextField
              fullWidth
              label="Дополнительная информация"
              value={banData.details}
              onChange={(e) => setBanData({...banData, details: e.target.value})}
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
              helperText="При необходимости укажите дополнительную информацию"
            />
            <TextField
              fullWidth
              label="Срок блокировки (дней)"
              type="number"
              value={banData.duration_days}
              onChange={(e) => setBanData({...banData, duration_days: parseInt(e.target.value) || 1})}
              margin="normal"
              variant="outlined"
              required
              inputProps={{ min: 1, max: 365 }}
              helperText="Укажите срок блокировки в днях (от 1 до 365)"
            />
            <Alert severity="error" sx={{ mt: 2 }}>
              Во время блокировки пользователь не сможет авторизоваться в аккаунте!
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBanDialogOpen(false)}>Отмена</Button>
            <Button 
              onClick={handleBanUser} 
              color="error" 
              variant="contained"
              disabled={!banData.reason.trim() || banData.duration_days < 1}
            >
              Заблокировать
            </Button>
          </DialogActions>
        </StyledDialog>
        
        
        <StyledDialog open={userWarningsDialogOpen} onClose={() => setUserWarningsDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Предупреждения пользователя {selectedUserHistory?.name} (@{selectedUserHistory?.username})
          </DialogTitle>
          <DialogContent>
            {loadingHistory ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <CircularProgress />
              </Box>
            ) : userWarnings.length > 0 ? (
              <List>
                {userWarnings.map((warning) => (
                  <Paper key={warning.id} sx={{ mb: 2, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                          <WarningIcon color="warning" sx={{ mr: 1 }} />
                          {warning.reason}
                          {warning.is_active ? (
                            <Chip 
                              label="Активно" 
                              color="warning" 
                              size="small" 
                              sx={{ ml: 1 }} 
                            />
                          ) : (
                            <Chip 
                              label="Снято" 
                              color="default" 
                              size="small" 
                              sx={{ ml: 1 }} 
                            />
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Выдано: {new Date(warning.created_at).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Модератор: {warning.admin_name} {warning.admin_username ? `(@${warning.admin_username})` : ''}
                        </Typography>
                        {warning.details && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {warning.details}
                          </Typography>
                        )}
                      </Box>
                      {warning.is_active && (
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          size="small"
                          onClick={() => handleRemoveWarning(warning.id)}
                        >
                          Снять предупреждение
                        </Button>
                      )}
                    </Box>
                  </Paper>
                ))}
              </List>
            ) : (
              <Alert severity="info">У пользователя нет предупреждений</Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUserWarningsDialogOpen(false)}>Закрыть</Button>
            <Button 
              color="warning" 
              variant="contained" 
              onClick={() => {
                setUserWarningsDialogOpen(false);
                openWarningDialog(selectedUserHistory);
              }}
            >
              Выдать предупреждение
            </Button>
          </DialogActions>
        </StyledDialog>
        
        
        <StyledDialog open={userBansDialogOpen} onClose={() => setUserBansDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Блокировки пользователя {selectedUserHistory?.name} (@{selectedUserHistory?.username})
          </DialogTitle>
          <DialogContent>
            {loadingHistory ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <CircularProgress />
              </Box>
            ) : userBans.length > 0 ? (
              <List>
                {userBans.map((ban) => (
                  <Paper key={ban.id} sx={{ mb: 2, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                          <BlockIcon color="error" sx={{ mr: 1 }} />
                          {ban.reason}
                          {ban.is_active && !ban.is_expired ? (
                            <Chip 
                              label="Активно" 
                              color="error" 
                              size="small" 
                              sx={{ ml: 1 }} 
                            />
                          ) : (
                            <Chip 
                              label={ban.is_active ? "Истекло" : "Снято"} 
                              color="default" 
                              size="small" 
                              sx={{ ml: 1 }} 
                            />
                          )}
                          {ban.is_auto_ban && (
                            <Chip 
                              label="Авто" 
                              color="primary" 
                              size="small" 
                              sx={{ ml: 1 }} 
                            />
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Начало: {new Date(ban.start_date).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Окончание: {ban.formatted_end_date}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Модератор: {ban.admin_name} {ban.admin_username ? `(@${ban.admin_username})` : ''}
                        </Typography>
                        {ban.is_active && !ban.is_expired && (
                          <Typography variant="body2" color="error">
                            Осталось дней: {ban.remaining_days}
                          </Typography>
                        )}
                        {ban.details && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {ban.details}
                          </Typography>
                        )}
                      </Box>
                      {ban.is_active && !ban.is_expired && (
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          size="small"
                          onClick={() => handleRemoveBan(ban.id)}
                        >
                          Снять блокировку
                        </Button>
                      )}
                    </Box>
                  </Paper>
                ))}
              </List>
            ) : (
              <Alert severity="info">У пользователя нет блокировок</Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUserBansDialogOpen(false)}>Закрыть</Button>
            <Button 
              color="error" 
              variant="contained" 
              onClick={() => {
                setUserBansDialogOpen(false);
                openBanDialog(selectedUserHistory);
              }}
            >
              Заблокировать
            </Button>
          </DialogActions>
        </StyledDialog>
      </>
    );
  };

  
  const renderComments = () => {
    return (
      <>
        <Box sx={{ mb: 3 }}>
          <TextField 
            fullWidth
            placeholder="Поиск по комментариям..."
            value={search.comments}
            onChange={(e) => handleSearchChange('comments', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search.comments ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => clearSearch('comments')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
            variant="outlined"
            size="small"
          />
        </Box>

        <List sx={{ width: '100%' }}>
          {comments.map((comment, index) => (
            <React.Fragment key={comment.id}>
              <Paper 
                sx={{ p: { xs: 1.5, sm: 2 }, mb: 2, bgcolor: 'background.default' }}
                ref={index === comments.length - 1 ? lastCommentElementRef : null}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, sm: 0 }, width: { xs: 'calc(100% - 48px)', sm: 'auto' } }}>
                    <Avatar 
                      src={comment.author_avatar ? 
                        (comment.author_avatar.startsWith('/') ? comment.author_avatar : `/static/uploads/avatar/${comment.author_id}/${comment.author_avatar}`) : 
                        undefined}
                      sx={{ mr: 1, width: 32, height: 32, cursor: 'pointer' }} 
                      onClick={() => navigate(`/profile/${comment.author_username}`)}
                    />
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        noWrap 
                        sx={{ 
                          maxWidth: { xs: 150, sm: 'none' },
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                        onClick={() => navigate(`/profile/${comment.author_username}`)}
                      >
                        {comment.author_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(comment.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex">
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ mr: 1, height: 30 }}
                      onClick={() => navigate(`/post/${comment.post_id}`)}
                    >
                      К посту
                    </Button>
                    <IconButton color="error" onClick={() => openDeleteCommentDialog(comment)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mt: 1, mb: 1, 
                    wordBreak: 'break-word',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/post/${comment.post_id}`)}
                >
                  {comment.content}
                </Typography>
                
                <Typography variant="caption" color="text.secondary">
                  К посту: <span 
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => navigate(`/post/${comment.post_id}`)}
                  >
                    #{comment.post_id}
                  </span>
                </Typography>
              </Paper>
            </React.Fragment>
          ))}
        </List>
      </>
    );
  };

  
  const renderBugReports = () => {
    
    if (!permissions.manage_bug_reports && !permissions.delete_bug_reports) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <BugReportIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            У вас нет прав на управление баг-репортами
          </Typography>
        </Box>
      );
    }

    return (
      <>
        <Box sx={{ display: 'flex', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6">Управление баг-репортами</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <TextField
            placeholder="Поиск баг-репортов"
            size="small"
            value={search.bugReports}
            onChange={(e) => handleSearchChange('bugReports', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search.bugReports ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => clearSearch('bugReports')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
            variant="outlined"
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Пользователь</TableCell>
                <TableCell>Заголовок</TableCell>
                <TableCell>Описание</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Дата</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bugReports.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2">
                        Нет баг-репортов для отображения
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          color="primary" 
                          onClick={debugBugReports}
                          startIcon={<BugReportIcon />}
                        >
                          Проверить данные
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          color="warning" 
                          onClick={deepDebugBugReports}
                          startIcon={<BugReportIcon />}
                        >
                          Глубокая проверка БД
                        </Button>
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              
              {loading && !loadingMore && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={32} sx={{ my: 2 }} />
                  </TableCell>
                </TableRow>
              )}
              
              {bugReports.map((report, index) => (
                <TableRow 
                  key={report.id}
                  ref={index === bugReports.length - 1 ? lastBugReportElementRef : null}
                >
                  <TableCell>{report.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={report.user_photo ? 
                          (report.user_photo.startsWith('/') ? report.user_photo : `/static/uploads/avatar/${report.user_id}/${report.user_photo}`) 
                          : undefined} 
                        sx={{ mr: 1, width: 24, height: 24 }}
                      />
                      <Typography variant="body2">{report.user_name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{report.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        maxWidth: 200, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}
                    >
                      {report.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={report.status || 'Открыт'}
                      color={
                        report.status === 'Открыт' ? 'error' :
                        report.status === 'В обработке' ? 'warning' :
                        report.status === 'Решено' ? 'success' :
                        'default'
                      }
                      size="small"
                      sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      {permissions.manage_bug_reports && (
                        <IconButton 
                          size="small" 
                          onClick={() => openBugReportStatusDialog(report)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      {permissions.delete_bug_reports && (
                        <IconButton 
                          color="error" 
                          size="small" 
                          onClick={() => handleDeleteBugReport(report.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              
              {loadingMore && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={24} sx={{ my: 1 }} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  
  const openEditBadgeDialog = (badge) => {
    setSelectedBadge(badge);
    setEditBadgeName(badge.name);
    setEditBadgeDescription(badge.description || '');
    setEditBadgePrice(badge.price.toString());
    setEditBadgeActive(badge.is_active);
    setEditBadgeImage(null);
    setEditBadgeImagePreview(`/static/images/bages/shop/${badge.image_path}`);
    setEditBadgeDialogOpen(true);
  };

  
  const openDeleteBadgeDialog = (badge) => {
    setSelectedBadge(badge);
    setDeleteBadgeDialogOpen(true);
  };

  
  const handleUpdateBadge = async () => {
    try {
      if (!selectedBadge) return;

      
      if (!editBadgeName) {
        showNotification('error', 'Название бейджика не может быть пустым');
        return;
      }

      
      const price = parseInt(editBadgePrice);
      if (isNaN(price) || price <= 0) {
        showNotification('error', 'Цена должна быть положительным числом');
        return;
      }

      setLoading(true);
      
      let response;
      
      
      if (editBadgeImage) {
        const formData = new FormData();
        formData.append('name', editBadgeName);
        formData.append('description', editBadgeDescription || '');
        formData.append('price', price);
        formData.append('is_active', editBadgeActive);
        formData.append('image', editBadgeImage);
        
        console.log('[DEBUG] Updating badge with image:', {
          id: selectedBadge.id,
          name: editBadgeName,
          description: editBadgeDescription,
          price: price,
          is_active: editBadgeActive
        });
        
        response = await axios.put(`/api/moderator/badges/${selectedBadge.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        
        const data = {
          name: editBadgeName,
          description: editBadgeDescription || '',
          price: price,
          is_active: editBadgeActive
        };
        
        console.log('[DEBUG] Updating badge without image:', {
          id: selectedBadge.id,
          ...data
        });
        
        response = await axios.put(`/api/moderator/badges/${selectedBadge.id}`, data);
      }
      
      console.log('[DEBUG] Badge update response:', response.data);
      
      if (response.data.success) {
        showNotification('success', 'Бейджик успешно обновлен');
        
        
        setBadges(prev => 
          prev.map(badge => 
            badge.id === selectedBadge.id 
              ? { 
                  ...badge, 
                  name: editBadgeName, 
                  description: editBadgeDescription || '',
                  price: price,
                  is_active: editBadgeActive,
                  image_path: response.data.badge.image_path || badge.image_path
                }
              : badge
          )
        );
        
        setEditBadgeDialogOpen(false);
      } else {
        console.error('[DEBUG] Badge update error:', response.data);
        showNotification('error', response.data.error || 'Не удалось обновить бейджик');
      }
    } catch (error) {
      console.error('Ошибка при обновлении бейджика:', error);
      console.error('Детали ошибки:', error.response?.data);
      showNotification('error', error.response?.data?.error || 'Не удалось обновить бейджик');
    } finally {
      setLoading(false);
    }
  };

  
  const handleDeleteBadge = async () => {
    try {
      if (!selectedBadge) return;
      
      setLoading(true);
      
      console.log(`[DEBUG] Deleting badge: ${selectedBadge.id} (${selectedBadge.name})`);
      
      const response = await axios.delete(`/api/moderator/badges/${selectedBadge.id}`);
      
      console.log('[DEBUG] Badge delete response:', response.data);
      
      if (response.data.success) {
        showNotification('success', 'Бейджик успешно удален');
        
        
        setBadges(prev => prev.filter(badge => badge.id !== selectedBadge.id));
        
        setDeleteBadgeDialogOpen(false);
      } else {
        console.error('[DEBUG] Badge delete error:', response.data);
        showNotification('error', response.data.error || 'Не удалось удалить бейджик');
      }
    } catch (error) {
      console.error('Ошибка при удалении бейджика:', error);
      console.error('Детали ошибки:', error.response?.data);
      showNotification('error', error.response?.data?.error || 'Не удалось удалить бейджик');
    } finally {
      setLoading(false);
    }
  };

  
  const handleBadgeImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      
      if (file.type !== 'image/svg+xml' && file.type !== 'image/gif') {
        showNotification('error', 'Разрешены только SVG и GIF файлы');
        return;
      }

      setEditBadgeImage(file);
      
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditBadgeImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  
  const renderBadges = () => {
    
    if (!permissions.edit_badges && !permissions.delete_badges) {
      return (
        <Alert severity="warning" sx={{ mt: 2 }}>
          У вас нет прав на управление бейджиками
        </Alert>
      );
    }
    
    
    if (loading && badges.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    
    if (!loading && badges.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          Бейджики не найдены
        </Alert>
      );
    }
    
    
    try {
      return (
        <>
          
          <Box sx={{ mb: 3, mt: 2, display: 'flex', alignItems: 'center' }}>
            <TextField
              placeholder="Поиск бейджиков..."
              variant="outlined"
              size="small"
              fullWidth
              value={search.badges}
              onChange={(e) => handleSearchChange('badges', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: search.badges && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => clearSearch('badges')}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
          
          
          <Grid container spacing={3}>
            {badges.map((badge, index) => {
              
              if (!badge || typeof badge !== 'object') {
                console.error('[DEBUG] Invalid badge object:', badge);
                return null;
              }
              
              
              const isLastElement = index === badges.length - 1;
              
              return (
                <Zoom in key={badge.id} style={{ transitionDelay: `${index * 50}ms` }}>
                  <Grid 
                    item 
                    xs={12} sm={6} md={4} lg={3} 
                    ref={isLastElement ? lastBadgeElementRef : null}
                  >
                    <Card 
                      elevation={0}
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          transform: 'translateY(-5px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                        }
                      }}
                    >
                      <CardHeader
                        avatar={
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              <Tooltip title={badge.is_active ? 'Активен' : 'Неактивен'}>
                                <Avatar 
                                  sx={{ 
                                    width: 15, 
                                    height: 15, 
                                    bgcolor: badge.is_active ? 'success.main' : 'text.disabled' 
                                  }}
                                >
                                  {badge.is_active ? <CheckCircleIcon sx={{ width: 10, height: 10 }} /> : <VisibilityOffIcon sx={{ width: 10, height: 10 }} />}
                                </Avatar>
                              </Tooltip>
                            }
                          >
                            <Avatar 
                              src={badge.creator_avatar ? `/avatar/${badge.creator_id}/${badge.creator_avatar}` : undefined}
                              alt={badge.creator_name || 'Creator'} 
                              sx={{ bgcolor: 'primary.main' }}
                            >
                              {badge.creator_name?.charAt(0) || 'U'}
                            </Avatar>
                          </Badge>
                        }
                        title={
                          <Tooltip title={`Создатель: ${badge.creator_name || 'Неизвестно'}`}>
                            <Typography variant="subtitle1" noWrap>
                              {badge.name ? (badge.name.length > 7 ? badge.name.slice(0, 7) + '...' : badge.name) : 'Бейджик'}
                            </Typography>
                          </Tooltip>
                        }
                        subheader={
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {badge.description ? (badge.description.length > 7 ? badge.description.slice(0, 7) + '...' : badge.description) : 'Нет'}
                          </Typography>
                        }
                        action={
                          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            {permissions.edit_badges && (
                              <IconButton 
                                onClick={() => openEditBadgeDialog(badge)}
                                aria-label="Редактировать бейджик"
                                color="primary"
                              >
                                <EditIcon />
                              </IconButton>
                            )}
                            {permissions.delete_badges && (
                              <IconButton 
                                onClick={() => openDeleteBadgeDialog(badge)}
                                aria-label="Удалить бейджик"
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Box>
                        }
                      />
                      <CardMedia
                        component="img"
                        sx={{
                          objectFit: 'contain',
                          p: 2,
                          height: 140,
                          filter: badge.is_active ? 'none' : 'grayscale(100%)'
                        }}
                        image={badge.image_path ? `/static/images/bages/shop/${badge.image_path}` : '/static/images/bages/default.svg'}
                        alt={badge.name || 'Бейджик'}
                        onError={(e) => {
                          console.error(`[DEBUG] Error loading badge image: ${badge.image_path}`);
                          e.target.src = '/static/images/bages/default.svg';
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Chip 
                            icon={<PaidIcon />} 
                            label={`${badge.price || 0} баллов`} 
                            color="primary" 
                            variant="outlined"
                            size="small"
                            sx={{ borderRadius: 1 }}
                          />
                          <Chip 
                            icon={<CreditCardIcon />} 
                            label={`${badge.copies_sold || 0} продано`} 
                            color="secondary" 
                            variant="outlined"
                            size="small" 
                            sx={{ borderRadius: 1 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Zoom>
              );
            })}
          </Grid>
          
          
          {loadingMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress size={30} />
            </Box>
          )}
          
          
          {hasMore.badges && badges.length > 0 && (
            <div ref={lastBadgeElementRef} style={{ height: '20px' }}></div>
          )}
        </>
      );
    } catch (error) {
      console.error('[DEBUG] Error rendering badges:', error);
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          Ошибка при отображении бейджиков: {error.message}
        </Alert>
      );
    }
  };

  
  const renderProfile = () => {
    
    if (loading && !moderatorData) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    
    if (!moderatorData) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          Не удалось загрузить данные модератора
        </Alert>
      );
    }
    
    
    const assignedDate = moderatorData.assigned_info?.assigned_at 
      ? new Date(moderatorData.assigned_info.assigned_at) 
      : null;
    
    
    const daysSinceAssigned = assignedDate 
      ? Math.floor((new Date() - assignedDate) / (1000 * 60 * 60 * 24)) 
      : null;
      
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            p: 3,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}>
            <Avatar 
              src={user?.photo ? `/avatar/${user.id}/${user.photo}` : null}
              sx={{ 
                width: 64, 
                height: 64,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                mr: 3
              }}
            >
              {user?.name?.charAt(0) || 'M'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={500} sx={{ mb: 0.5 }}>
                {user?.name || 'Модератор'}
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.6)" sx={{ mb: 1 }}>
                @{user?.username || 'username'}
              </Typography>
              <Chip 
                icon={moderatorData.moderator_level >= 3 ? <VerifiedUserIcon /> : <SecurityIcon />}
                label={moderatorData.moderator_level >= 3 ? 'Администратор' : 'Модератор'} 
                size="small"
                sx={{ 
                  borderRadius: 1,
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.87)',
                  fontSize: '0.75rem',
                  height: 24
                }}
              />
            </Box>
          </Box>
        </Box>

        
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            p: 3,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}>
            {assignedDate && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon sx={{ mr: 2, fontSize: 20, color: 'rgba(255,255,255,0.6)' }} />
                <Box>
                  <Typography variant="body2" color="rgba(255,255,255,0.6)">
                    Назначен модератором
                  </Typography>
                  <Typography variant="body1">
                    {assignedDate.toLocaleDateString()} 
                    <Typography component="span" variant="body2" color="rgba(255,255,255,0.6)" sx={{ ml: 1 }}>
                      ({daysSinceAssigned} {daysSinceAssigned === 1 ? 'день' : daysSinceAssigned < 5 ? 'дня' : 'дней'})
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            )}
            
            {moderatorData.assigned_info?.assigned_by?.name && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 2, fontSize: 20, color: 'rgba(255,255,255,0.6)' }} />
                <Box>
                  <Typography variant="body2" color="rgba(255,255,255,0.6)">
                    Назначен администратором
                  </Typography>
                  <Typography variant="body1">
                    {moderatorData.assigned_info.assigned_by.name}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <PermissionItem 
              title="Удаление постов" 
              enabled={permissions.delete_posts}
              icon={<PostAddIcon />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <PermissionItem 
              title="Удаление музыки" 
              enabled={permissions.delete_music}
              icon={<MusicNoteIcon />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <PermissionItem 
              title="Удаление комментариев" 
              enabled={permissions.delete_comments}
              icon={<CommentIcon />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <PermissionItem 
              title="Удаление аватаров" 
              enabled={permissions.delete_avatar}
              icon={<PhotoIcon />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <PermissionItem 
              title="Изменение имён" 
              enabled={permissions.change_user_name}
              icon={<PersonIcon />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <PermissionItem 
              title="Изменение username" 
              enabled={permissions.change_username}
              icon={<PersonIcon />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <PermissionItem 
              title="Управление баг-репортами" 
              enabled={permissions.manage_bug_reports}
              icon={<BugReportIcon />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <PermissionItem 
              title="Удаление баг-репортов" 
              enabled={permissions.delete_bug_reports}
              icon={<BugReportIcon />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <PermissionItem 
              title="Редактирование бейджиков" 
              enabled={permissions.edit_badges}
              icon={<EmojiEventsIcon />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <PermissionItem 
              title="Удаление бейджиков" 
              enabled={permissions.delete_badges}
              icon={<EmojiEventsIcon />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <PermissionItem 
              title="Управление артистами" 
              enabled={permissions.manage_artists}
              icon={<PersonAddIcon />}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <PermissionItem 
              title="Удаление артистов" 
              enabled={permissions.delete_artists}
              icon={<PersonAddIcon />}
            />
          </Grid>
        </Grid>

        
        {renderModKeysSection()}
      </Box>
    );
  };
  
  
  const PermissionItem = ({ title, enabled, icon }) => {
    return (
      <Box 
        sx={{
          p: 2,
          borderRadius: 1,
          background: enabled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
          border: `1px solid ${enabled ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: enabled ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            sx={{ 
              width: 28, 
              height: 28, 
              borderRadius: 1,
              background: enabled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}
          >
            {React.cloneElement(icon, { 
              fontSize: 'small', 
              sx: { 
                color: enabled ? 'rgba(255, 255, 255, 0.87)' : 'rgba(255, 255, 255, 0.4)',
                fontSize: 16
              }
            })}
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: enabled ? 'rgba(255, 255, 255, 0.87)' : 'rgba(255, 255, 255, 0.5)',
              fontWeight: enabled ? 500 : 400
            }}
          >
            {title}
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            width: 16, 
            height: 16, 
            borderRadius: '50%',
            background: enabled ? 'rgba(76, 175, 80, 0.8)' : 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {enabled ? (
            <CheckIcon sx={{ fontSize: 12, color: 'white' }} />
          ) : (
            <CloseIcon sx={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.5)' }} />
          )}
        </Box>
      </Box>
    );
  };

  
  const openWarningDialog = (user) => {
    setWarningUser(user);
    setWarningData({
      reason: '',
      details: ''
    });
    setWarningDialogOpen(true);
  };
  
  
  const openBanDialog = (user) => {
    setBanUser(user);
    setBanData({
      reason: '',
      details: '',
      duration_days: 30
    });
    setBanDialogOpen(true);
  };
  
  
  const openUserWarningsDialog = async (user) => {
    setSelectedUserHistory(user);
    setLoadingHistory(true);
    setUserWarningsDialogOpen(true);
    
    try {
      const response = await axios.get(`/api/user/${user.id}/warnings`);
      if (response.data.success) {
        setUserWarnings(response.data.warnings);
      } else {
        showNotification('error', 'Не удалось загрузить историю предупреждений');
      }
    } catch (error) {
      console.error('Ошибка при загрузке предупреждений:', error);
      showNotification('error', 'Ошибка при загрузке предупреждений');
    } finally {
      setLoadingHistory(false);
    }
  };
  
  
  const openUserBansDialog = async (user) => {
    setSelectedUserHistory(user);
    setLoadingHistory(true);
    setUserBansDialogOpen(true);
    
    try {
      const response = await axios.get(`/api/user/${user.id}/bans`);
      if (response.data.success) {
        setUserBans(response.data.bans);
      } else {
        showNotification('error', 'Не удалось загрузить историю банов');
      }
    } catch (error) {
      console.error('Ошибка при загрузке банов:', error);
      showNotification('error', 'Ошибка при загрузке банов');
    } finally {
      setLoadingHistory(false);
    }
  };
  
  
  const handleIssueWarning = async () => {
    if (!warningUser) return;
    
    if (!warningData.reason.trim()) {
      showNotification('error', 'Укажите причину предупреждения');
      return;
    }
    
    try {
      const response = await axios.post('/api/moderator/warnings', {
        user_id: warningUser.id,
        reason: warningData.reason,
        details: warningData.details
      });
      
      if (response.data.success) {
        showNotification('success', 'Предупреждение успешно выдано');
        
        
        if (response.data.auto_ban) {
          showNotification('info', `Пользователь автоматически заблокирован за 3 предупреждения до ${response.data.ban_info.formatted_end_date}`);
        }
        
        setWarningDialogOpen(false);
      } else {
        showNotification('error', response.data.message || 'Ошибка при выдаче предупреждения');
      }
    } catch (error) {
      console.error('Ошибка при выдаче предупреждения:', error);
      showNotification('error', 'Ошибка при выдаче предупреждения');
    }
  };
  
  
  const handleBanUser = async () => {
    if (!banUser) return;
    
    if (!banData.reason.trim()) {
      showNotification('error', 'Укажите причину бана');
      return;
    }
    
    try {
      const response = await axios.post('/api/moderator/bans', {
        user_id: banUser.id,
        reason: banData.reason,
        details: banData.details,
        duration_days: banData.duration_days
      });
      
      if (response.data.success) {
        showNotification('success', `Пользователь заблокирован до ${response.data.formatted_end_date}`);
        setBanDialogOpen(false);
      } else {
        showNotification('error', response.data.message || 'Ошибка при бане пользователя');
      }
    } catch (error) {
      console.error('Ошибка при бане пользователя:', error);
      showNotification('error', 'Ошибка при бане пользователя');
    }
  };
  
  
  const handleRemoveWarning = async (warningId) => {
    try {
      const response = await axios.delete(`/api/moderator/warnings/${warningId}`);
      
      if (response.data.success) {
        showNotification('success', 'Предупреждение успешно снято');
        
        setUserWarnings(userWarnings.map(warning => 
          warning.id === warningId ? { ...warning, is_active: false } : warning
        ));
      } else {
        showNotification('error', response.data.message || 'Ошибка при снятии предупреждения');
      }
    } catch (error) {
      console.error('Ошибка при снятии предупреждения:', error);
      showNotification('error', 'Ошибка при снятии предупреждения');
    }
  };
  
  
  const handleRemoveBan = async (banId) => {
    try {
      const response = await axios.delete(`/api/moderator/bans/${banId}`);
      
      if (response.data.success) {
        showNotification('success', 'Бан успешно снят');
        
        setUserBans(userBans.map(ban => 
          ban.id === banId ? { ...ban, is_active: false } : ban
        ));
      } else {
        showNotification('error', response.data.message || 'Ошибка при снятии бана');
      }
    } catch (error) {
      console.error('Ошибка при снятии бана:', error);
      showNotification('error', 'Ошибка при снятии бана');
    }
  };

  const handleDeleteArtist = async () => {
    if (!selectedArtist) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(`/api/moderator/artists/${selectedArtist.id}`);
      
      if (response.data.success) {
        showNotification('success', 'Артист успешно удален');
        setArtists(artists.filter(artist => artist.id !== selectedArtist.id));
      } else {
        throw new Error(response.data.error || 'Failed to delete artist');
      }
    } catch (error) {
      console.error('Error deleting artist:', error);
      showNotification('error', 'Не удалось удалить артиста');
    } finally {
      setLoading(false);
      setDeleteArtistDialogOpen(false);
    }
  };
  
  const handleArtistImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showNotification('error', 'Разрешены только изображения');
        return;
      }
      
      setEditArtistAvatar(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditArtistAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUpdateArtist = async () => {
    try {
      setLoading(true);
      
      let response;
      

      if (!selectedArtist) {

        const formData = new FormData();
        formData.append('name', editArtistName);
        formData.append('bio', editArtistBio || '');
        formData.append('verified', editArtistVerified);
        
        if (editArtistAvatar) {
          formData.append('avatar_file', editArtistAvatar);
        }
        
        response = await axios.post('/api/moderator/artists', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data.success) {
          showNotification('success', 'Артист успешно создан');

          setArtists(prev => [{
            id: response.data.artist_id,
            name: editArtistName,
            bio: editArtistBio || '',
            is_verified: editArtistVerified,
            avatar: response.data.artist.avatar_url ? response.data.artist.avatar_url.split('/').pop() : '',
            created_at: new Date().toISOString(),
            tracks_count: 0
          }, ...prev]);
          
          setEditArtistDialogOpen(false);
        } else {
          showNotification('error', response.data.error || 'Не удалось создать артиста');
        }
      } else {

        if (editArtistAvatar) {

          const formData = new FormData();
          formData.append('name', editArtistName);
          formData.append('bio', editArtistBio || '');
          formData.append('verified', editArtistVerified);
          formData.append('avatar_file', editArtistAvatar);
          
          response = await axios.put(`/api/moderator/artists/${selectedArtist.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {

          const data = {
            name: editArtistName,
            bio: editArtistBio || '',
            verified: editArtistVerified
          };
          
          response = await axios.put(`/api/moderator/artists/${selectedArtist.id}`, data);
        }
        
        if (response.data.success) {
          showNotification('success', 'Данные артиста успешно обновлены');
          
          setArtists(prev => 
            prev.map(artist => 
              artist.id === selectedArtist.id 
                ? { 
                    ...artist, 
                    name: editArtistName, 
                    bio: editArtistBio || '',
                    is_verified: editArtistVerified,
                    avatar: response.data.artist.avatar_url ? response.data.artist.avatar_url.split('/').pop() : artist.avatar
                  }
                : artist
            )
          );
          
          setEditArtistDialogOpen(false);
        } else {
          showNotification('error', response.data.error || 'Не удалось обновить данные артиста');
        }
      }
    } catch (error) {
      console.error('Ошибка при обновлении/создании артиста:', error);
      showNotification('error', error.response?.data?.error || 'Не удалось выполнить операцию');
    } finally {
      setLoading(false);
    }
  };
  
  const openDeleteArtistDialog = (artist) => {
    setSelectedArtist(artist);
    setDeleteArtistDialogOpen(true);
  };

  const openEditArtistDialog = (artist) => {
    setSelectedArtist(artist);
    setEditArtistName(artist.name);
    setEditArtistBio(artist.bio || '');
    setEditArtistAvatar(null);
    setEditArtistAvatarPreview(artist.avatar_url || '');
    setEditArtistVerified(artist.verified || false);
    setEditArtistDialogOpen(true);
  };

  const openCreateArtistDialog = () => {
    setSelectedArtist(null);
    setEditArtistName('');
    setEditArtistBio('');
    setEditArtistAvatar(null);
    setEditArtistAvatarPreview('');
    setEditArtistVerified(false);
    setEditArtistDialogOpen(true);
  };

  const renderArtists = () => {
    if (!permissions.manage_artists && !permissions.delete_artists) {
      return (
        <Alert severity="warning" sx={{ mt: 2 }}>
          У вас нет прав на управление артистами
        </Alert>
      );
    }
    
    return (
      <>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField 
            sx={{ flexGrow: 1, mr: 2 }}
            placeholder="Поиск по артистам..."
            value={search.artists}
            onChange={(e) => handleSearchChange('artists', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search.artists ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => clearSearch('artists')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
            variant="outlined"
            size="small"
          />
          
          {permissions.manage_artists && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={openCreateArtistDialog}
              sx={{
                borderRadius: 2,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(25, 118, 210, 0.3)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                  transform: 'translateY(-1px)',
                }
              }}
            >
              Добавить артиста
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          {artists.map((artist, index) => (
            <Grid 
              item 
              xs={12} sm={6} md={4} lg={3} 
              key={artist.id}
              ref={index === artists.length - 1 ? lastArtistElementRef : null}
            >
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                <CardHeader
                  avatar={
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        artist.verified ? (
                          <Tooltip title="Верифицированный артист">
                            <Avatar 
                              sx={{ 
                                width: 15, 
                                height: 15, 
                                bgcolor: 'primary.main' 
                              }}
                            >
                              <CheckCircleIcon sx={{ width: 10, height: 10 }} />
                            </Avatar>
                          </Tooltip>
                        ) : null
                      }
                    >
                      <Avatar 
                        src={artist.avatar_url}
                        alt={artist.name} 
                        sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}
                      >
                        {artist.name?.charAt(0) || 'A'}
                      </Avatar>
                    </Badge>
                  }
                  title={
                    <Tooltip title={artist.name}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 'medium',
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          lineHeight: 1.4
                        }}
                      >
                        {artist.name}
                      </Typography>
                    </Tooltip>
                  }
                  subheader={
                    <Typography variant="caption" color="text.secondary">
                      {artist.tracks_count || "0"} треков
                    </Typography>
                  }
                  sx={{ 
                    pb: 0,
                    '& .MuiCardHeader-content': {
                      overflow: 'hidden'
                    }
                  }}
                />
                <CardContent sx={{ flexGrow: 1, pt: 1, pb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    display: '-webkit-box', 
                    WebkitLineClamp: 3, 
                    WebkitBoxOrient: 'vertical',
                    height: '4.5rem',
                    mb: 1
                  }}>
                    {artist.bio || 'Нет информации об артисте'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', flexWrap: 'wrap', px: 2, pb: 2, pt: 0 }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => window.open(`/artist/${artist.id}`, '_blank')}
                      title="Открыть страницу артиста"
                      sx={{
                        borderRadius: 2,
                        background: 'rgba(25, 118, 210, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(25, 118, 210, 0.2)',
                        '&:hover': {
                          background: 'rgba(25, 118, 210, 0.2)',
                          border: '1px solid rgba(25, 118, 210, 0.3)',
                          transform: 'translateY(-1px)',
                        }
                      }}
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                    {permissions.manage_artists && (
                      <IconButton 
                        onClick={() => openEditArtistDialog(artist)}
                        aria-label="Редактировать артиста"
                        color="primary"
                        size="small"
                        sx={{
                          borderRadius: 2,
                          background: 'rgba(25, 118, 210, 0.1)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(25, 118, 210, 0.2)',
                          '&:hover': {
                            background: 'rgba(25, 118, 210, 0.2)',
                            border: '1px solid rgba(25, 118, 210, 0.3)',
                            transform: 'translateY(-1px)',
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    {permissions.manage_artists && (
                      <IconButton 
                        onClick={() => openManageArtistTracksDialog(artist)}
                        aria-label="Управление треками артиста"
                        color="primary"
                        size="small"
                        sx={{
                          borderRadius: 2,
                          background: 'rgba(25, 118, 210, 0.1)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(25, 118, 210, 0.2)',
                          '&:hover': {
                            background: 'rgba(25, 118, 210, 0.2)',
                            border: '1px solid rgba(25, 118, 210, 0.3)',
                            transform: 'translateY(-1px)',
                          }
                        }}
                      >
                        <QueueMusicIcon fontSize="small" />
                      </IconButton>
                    )}
                    {permissions.delete_artists && (
                      <IconButton 
                        onClick={() => openDeleteArtistDialog(artist)}
                        aria-label="Удалить артиста"
                        color="error"
                        size="small"
                        sx={{
                          borderRadius: 2,
                          background: 'rgba(244, 67, 54, 0.1)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(244, 67, 54, 0.2)',
                          '&:hover': {
                            background: 'rgba(244, 67, 54, 0.2)',
                            border: '1px solid rgba(244, 67, 54, 0.3)',
                            transform: 'translateY(-1px)',
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                  <Chip 
                    icon={<AccessTimeIcon fontSize="small" />} 
                    label={new Date(artist.created_at).toLocaleDateString()} 
                    variant="outlined"
                    size="small"
                    sx={{ height: 24, '& .MuiChip-label': { px: 1, fontSize: '0.7rem' } }}
                  />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {artists.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <PersonAddIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Артисты не найдены
            </Typography>
          </Box>
        )}
        
        {loadingMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress size={30} />
          </Box>
        )}
      </>
    );
  };

  const openManageArtistTracksDialog = async (artist) => {
    setSelectedArtist(artist);
    setManageArtistTracksDialogOpen(true);
    setLoadingTracks(true);
    setArtistTracks([]);
    setSearchableTracksList([]);
    setTrackSearch('');
    setSearchMode('artist');
    setSelectedTracks([]);
    
    try {

      const response = await axios.get(`/api/moderator/artists/${artist.id}/tracks`);
      
      if (response.data.success) {
        setArtistTracks(response.data.tracks || []);
      } else {
        showNotification('error', response.data.error || 'Не удалось загрузить треки артиста');
      }
    } catch (error) {
      console.error('Error loading artist tracks:', error);
      showNotification('error', error.response?.data?.error || 'Не удалось загрузить треки артиста');
    } finally {
      setLoadingTracks(false);
    }
  };
  
  const searchUnassignedTracks = async () => {
    if (!trackSearch || trackSearch.trim().length < 2) return;
    
    setLoadingTracks(true);
    try {
      let response;
      
      if (searchMode === 'artist') {

        response = await axios.post('/api/moderator/artists/search-tracks', {
          artist_name: trackSearch.trim(),
          exact_match: false,
          limit: 50
        });
      } else {

        response = await axios.get(`/api/moderator/tracks?search=${encodeURIComponent(trackSearch.trim())}&per_page=50`);
      }
      
      if (response.data.success) {
        let tracks = [];
        
        if (searchMode === 'artist') {
          tracks = response.data.tracks || [];
        } else {
          tracks = response.data.tracks || [];
        }
        

        const artistTrackIds = new Set(artistTracks.map(track => track.id));
        const unassignedTracks = tracks.filter(track => !artistTrackIds.has(track.id));
        
        setSearchableTracksList(unassignedTracks);
      } else {
        showNotification('error', response.data.error || 'Не удалось найти треки');
      }
    } catch (error) {
      console.error('Error searching for unassigned tracks:', error);
      showNotification('error', error.response?.data?.error || 'Не удалось выполнить поиск треков');
    } finally {
      setLoadingTracks(false);
    }
  };

  const handleAssignTrackToArtist = async (trackId) => {
    if (!selectedArtist) return;
    
    setLoadingTracks(true);
    try {
      const response = await axios.post(`/api/moderator/artists/${selectedArtist.id}/assign-track`, {
        track_id: trackId
      });
      
      if (response.data.success) {
        showNotification('success', 'Трек успешно привязан к артисту');
        

        const assignedTrack = searchableTracksList.find(track => track.id === trackId);
        if (assignedTrack) {
          setArtistTracks(prev => [...prev, assignedTrack]);
          setSearchableTracksList(prev => prev.filter(track => track.id !== trackId));
          

          setSelectedArtist(prev => ({
            ...prev,
            tracks_count: (parseInt(prev.tracks_count || 0) + 1).toString()
          }));
          

          setArtists(prevArtists => prevArtists.map(artist => 
            artist.id === selectedArtist.id 
              ? { ...artist, tracks_count: (parseInt(artist.tracks_count || 0) + 1).toString() } 
              : artist
          ));
        }
        

        if (selectedTracks.includes(trackId)) {
          setSelectedTracks(prev => prev.filter(id => id !== trackId));
        }
      } else {
        showNotification('error', response.data.error || 'Не удалось привязать трек к артисту');
      }
    } catch (error) {
      console.error('Error assigning track to artist:', error);
      showNotification('error', error.response?.data?.error || 'Не удалось привязать трек к артисту');
    } finally {
      setLoadingTracks(false);
    }
  };
  
  const handleAssignSelectedTracks = async () => {
    if (!selectedArtist || selectedTracks.length === 0) return;
    
    setLoadingTracks(true);
    try {
      const response = await axios.post('/api/moderator/tracks/verify-batch', {
        track_ids: selectedTracks,
        artist_id: selectedArtist.id
      });
      
      if (response.data.success) {
        showNotification('success', `${selectedTracks.length} треков успешно привязано к артисту`);
        

        const assignedTracks = searchableTracksList.filter(track => selectedTracks.includes(track.id));
        if (assignedTracks.length > 0) {
          setArtistTracks(prev => [...prev, ...assignedTracks]);
          setSearchableTracksList(prev => prev.filter(track => !selectedTracks.includes(track.id)));
          

          setSelectedArtist(prev => ({
            ...prev,
            tracks_count: (parseInt(prev.tracks_count || 0) + assignedTracks.length).toString()
          }));
          

          setArtists(prevArtists => prevArtists.map(artist => 
            artist.id === selectedArtist.id 
              ? { ...artist, tracks_count: (parseInt(artist.tracks_count || 0) + assignedTracks.length).toString() } 
              : artist
          ));
        }
        

        setSelectedTracks([]);
      } else {
        showNotification('error', response.data.error || 'Не удалось привязать треки к артисту');
      }
    } catch (error) {
      console.error('Error assigning multiple tracks to artist:', error);
      showNotification('error', error.response?.data?.error || 'Не удалось привязать треки к артисту');
    } finally {
      setLoadingTracks(false);
    }
  };
  
  const handleRemoveTrackFromArtist = async (trackId) => {
    if (!selectedArtist) return;
    
    setLoadingTracks(true);
    try {
      const response = await axios.post(`/api/moderator/artists/${selectedArtist.id}/remove-track`, {
        track_id: trackId
      });
      
      if (response.data.success) {
        showNotification('success', 'Трек успешно отвязан от артиста');
        

        setArtistTracks(prev => prev.filter(track => track.id !== trackId));
        

        setSelectedArtist(prev => ({
          ...prev,
          tracks_count: Math.max(0, parseInt(prev.tracks_count || 0) - 1).toString()
        }));
        

        setArtists(prevArtists => prevArtists.map(artist => 
          artist.id === selectedArtist.id 
            ? { ...artist, tracks_count: Math.max(0, parseInt(artist.tracks_count || 0) - 1).toString() } 
            : artist
        ));
      } else {
        showNotification('error', response.data.error || 'Не удалось отвязать трек от артиста');
      }
    } catch (error) {
      console.error('Error removing track from artist:', error);
      showNotification('error', error.response?.data?.error || 'Не удалось отвязать трек от артиста');
    } finally {
      setLoadingTracks(false);
    }
  };
  
  const handleToggleTrackSelection = (trackId) => {
    setSelectedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId) 
        : [...prev, trackId]
    );
  };
  
  const handleSelectAllSearchedTracks = () => {
    if (searchableTracksList.length === 0) return;
    
    if (selectedTracks.length === searchableTracksList.length) {

      setSelectedTracks([]);
    } else {

      setSelectedTracks(searchableTracksList.map(track => track.id));
    }
  };

  const fetchAvailableMedals = async () => {
    try {
      setLoadingMedals(true);
      console.log('Fetching available medals...');
      const response = await axios.get('/api/moderator/medals/available');
      console.log('Medals response:', response.data);
      
      if (response.data.success) {
        setAvailableMedals(response.data.medals);
        console.log('Set available medals:', response.data.medals);
      } else {
        throw new Error(response.data.error || 'Failed to fetch available medals');
      }
    } catch (error) {
      console.error('Error fetching available medals:', error);
      showNotification('error', 'Не удалось загрузить список доступных медалей');
    } finally {
      setLoadingMedals(false);
    }
  };

  const openIssueMedalDialog = (user) => {
    console.log('Opening medal dialog for user:', user);
    setMedalUser(user);
    setSelectedMedal('');
    setMedalDescription('');
    setIssueMedalDialogOpen(true);
    fetchAvailableMedals();
  };

  const handleIssueMedal = async () => {
    if (!medalUser || !selectedMedal) return;
    
    try {
      setLoading(true);
      
      const response = await axios.post('/api/moderator/medals/issue', {
        user_id: medalUser.id,
        medal_name: selectedMedal,
        description: medalDescription
      });
      
      if (response.data.success) {
        showNotification('success', `Медаль "${selectedMedal}" успешно выдана пользователю ${medalUser.username}`);
        setIssueMedalDialogOpen(false);
      } else {
        throw new Error(response.data.error || 'Failed to issue medal');
      }
    } catch (error) {
      console.error('Error issuing medal:', error);
      showNotification('error', error.response?.data?.error || 'Не удалось выдать медаль');
    } finally {
      setLoading(false);
    }
  };

  const openDecorationMenu = (user) => {
    setSelectedUserForDecorations(user);
    setDecorationMenuOpen(true);
  };

  const handleCloseDecorationMenu = () => {
    setDecorationMenuOpen(false);
    setSelectedUserForDecorations(null);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center',
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <SecurityIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Box>
          <Typography variant="h5" component="h1" gutterBottom>
            Панель модератора
          </Typography>
          {moderatorData && (
            <Typography variant="body2" color="text.secondary">
              {moderatorData.moderator_level >= 3 ? 'Администратор' : 'Модератор'} • {new Date().toLocaleDateString()}
            </Typography>
          )}
        </Box>
      </Paper>
      
      
      <Paper 
        sx={{ 
          p: 3,
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'rgba(255, 255, 255, 0.12)', 
            mb: 2,
            '& .MuiTab-root': {
              borderRadius: '12px 12px 0 0',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderBottom: 'none',
              marginRight: 1,
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'rgba(255, 255, 255, 0.87)',
              },
              '&.Mui-selected': {
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'rgba(255, 255, 255, 0.87)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }
            }
          }}
        >
          <Tab icon={<DashboardIcon />} label="Профиль" />
          <Tab icon={<PostAddIcon />} label="Посты" disabled={!permissions.delete_posts} />
          <Tab icon={<MusicNoteIcon />} label="Треки" disabled={!permissions.delete_music} />
          <Tab icon={<CommentIcon />} label="Комментарии" disabled={!permissions.delete_comments} />
          <Tab icon={<PersonIcon />} label="Пользователи" disabled={!permissions.change_user_name && !permissions.change_username && !permissions.delete_avatar} />
          <Tab icon={<BugReportIcon />} label="Баг-репорты" disabled={!permissions.manage_bug_reports && !permissions.delete_bug_reports} />
          <Tab icon={<EmojiEventsIcon />} label="Бейджики" disabled={!permissions.edit_badges && !permissions.delete_badges} />
          <Tab icon={<PersonAddIcon />} label="Артисты" disabled={!permissions.manage_artists && !permissions.delete_artists} />
        </Tabs>
        
        
        <Box sx={{ mt: 2 }}>
          {tabValue === 0 && renderProfile()}
          {tabValue === 1 && renderPosts()}
          {tabValue === 2 && renderTracks()}
          {tabValue === 3 && renderComments()}
          {tabValue === 4 && renderUsers()}
          {tabValue === 5 && renderBugReports()}
          {tabValue === 6 && renderBadges()}
          {tabValue === 7 && renderArtists()}
        </Box>
      </Paper>
      
      
      <StyledDialog open={deletePostDialogOpen} onClose={() => setDeletePostDialogOpen(false)} fullWidth maxWidth="sm">
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(244, 67, 54, 0.15)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(244,67,54,0.2) 0%, rgba(244,67,54,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <DeleteIcon color="error" sx={{ mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" color="error.light">
              Удаление поста
            </Typography>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 2.5, bgcolor: 'transparent' }}>
          <Box 
            sx={{ 
              position: 'relative',
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'rgba(244, 67, 54, 0.05)',
              border: '1px solid rgba(244, 67, 54, 0.2)',
              mb: 1
            }}
          >
            <Typography variant="subtitle1" color="rgba(255,255,255,0.87)" gutterBottom>
              Вы действительно хотите удалить этот пост?
            </Typography>
            
            {selectedPost && (
              <Box sx={{ mt: 2, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.3)', p: 2 }}>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">{selectedPost.content}</Typography>
                {selectedPost.image && (
                  <Box sx={{ mt: 1, maxWidth: '100%', maxHeight: 200, overflow: 'hidden', borderRadius: 1 }}>
                    <img 
                      src={selectedPost.image.startsWith('/') ? selectedPost.image : `/static/uploads/post/${selectedPost.id}/${selectedPost.image}`}
                      alt="Post attachment" 
                      style={{ width: '100%', height: 'auto', borderRadius: '4px' }} 
                    />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setDeletePostDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 8,
              px: 3,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleDeletePost} 
            color="error" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            sx={{ 
              borderRadius: 8,
              px: 4,
              py: 0.75,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(45deg, #f44336 30%, #ff7961 90%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </StyledDialog>
      
      
      <StyledDialog open={deleteTrackDialogOpen} onClose={() => setDeleteTrackDialogOpen(false)} fullWidth maxWidth="sm">
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(244, 67, 54, 0.15)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(244,67,54,0.2) 0%, rgba(244,67,54,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <DeleteIcon color="error" sx={{ mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" color="error.light">
              Удаление трека
            </Typography>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 2.5, bgcolor: 'transparent' }}>
          <Box 
            sx={{ 
              position: 'relative',
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'rgba(244, 67, 54, 0.05)',
              border: '1px solid rgba(244, 67, 54, 0.2)',
              mb: 1
            }}
          >
            <Typography variant="subtitle1" color="rgba(255,255,255,0.87)" gutterBottom>
              Вы действительно хотите удалить этот трек?
            </Typography>
            
            {selectedTrack && (
              <Box sx={{ mt: 2, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.3)', p: 2 }}>
                <Typography variant="body1" fontWeight="bold" color="rgba(255,255,255,0.9)">{selectedTrack.title}</Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">Артист: {selectedTrack.artist}</Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">Альбом: {selectedTrack.album || 'Нет данных'}</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setDeleteTrackDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 8,
              px: 3,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleDeleteTrack} 
            color="error" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            sx={{ 
              borderRadius: 8,
              px: 4,
              py: 0.75,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(45deg, #f44336 30%, #ff7961 90%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </StyledDialog>
      
      
      <StyledDialog open={deleteCommentDialogOpen} onClose={() => setDeleteCommentDialogOpen(false)} fullWidth maxWidth="sm">
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(244, 67, 54, 0.15)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(244,67,54,0.2) 0%, rgba(244,67,54,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <DeleteIcon color="error" sx={{ mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" color="error.light">
              Удаление комментария
            </Typography>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 2.5, bgcolor: 'transparent' }}>
          <Box 
            sx={{ 
              position: 'relative',
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'rgba(244, 67, 54, 0.05)',
              border: '1px solid rgba(244, 67, 54, 0.2)',
              mb: 1
            }}
          >
            <Typography variant="subtitle1" color="rgba(255,255,255,0.87)" gutterBottom>
              Вы действительно хотите удалить этот комментарий?
            </Typography>
            
            {selectedComment && (
              <Box sx={{ mt: 2, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.3)', p: 2 }}>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">{selectedComment.content}</Typography>
                {selectedComment.image && (
                  <Box sx={{ mt: 1, maxWidth: '100%', maxHeight: 200, overflow: 'hidden', borderRadius: 1 }}>
                    <img 
                      src={selectedComment.image} 
                      alt="Comment attachment" 
                      style={{ width: '100%', height: 'auto', borderRadius: '4px' }} 
                    />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setDeleteCommentDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 8,
              px: 3,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleDeleteComment} 
            color="error" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            sx={{ 
              borderRadius: 8,
              px: 4,
              py: 0.75,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(45deg, #f44336 30%, #ff7961 90%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </StyledDialog>
      
      
      <StyledDialog open={deleteAvatarDialogOpen} onClose={() => setDeleteAvatarDialogOpen(false)} fullWidth maxWidth="sm">
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(244, 67, 54, 0.15)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(244,67,54,0.2) 0%, rgba(244,67,54,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <DeleteIcon color="error" sx={{ mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" color="error.light">
              Удаление аватара пользователя
            </Typography>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 2.5, bgcolor: 'transparent' }}>
          <Box 
            sx={{ 
              position: 'relative',
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'rgba(244, 67, 54, 0.05)',
              border: '1px solid rgba(244, 67, 54, 0.2)',
              mb: 1
            }}
          >
            <Typography variant="subtitle1" color="rgba(255,255,255,0.87)" gutterBottom>
              Вы действительно хотите удалить аватар пользователя <Box component="span" fontWeight="bold" color="error.light">{selectedUser?.name}</Box>?
            </Typography>
            
            {selectedUser && selectedUser.photo && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Avatar 
                  src={`/static/uploads/avatar/${selectedUser.id}/${selectedUser.photo}`}
                  alt={selectedUser.name}
                  sx={{ width: 150, height: 150, border: '3px solid rgba(244, 67, 54, 0.3)' }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setDeleteAvatarDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 8,
              px: 3,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleDeleteAvatar} 
            color="error" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            sx={{ 
              borderRadius: 8,
              px: 4,
              py: 0.75,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(45deg, #f44336 30%, #ff7961 90%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </StyledDialog>
      
      
      <StyledDialog open={editUserDialogOpen} onClose={() => setEditUserDialogOpen(false)} fullWidth maxWidth="sm">
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'linear-gradient(90deg, rgba(25,118,210,0.2) 0%, rgba(0,0,0,0) 100%)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(25,118,210,0.2) 0%, rgba(25,118,210,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <EditIcon color="primary" sx={{ mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" color="primary.light">
              Редактирование пользователя
            </Typography>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 2.5, bgcolor: 'transparent' }}>
          <Box 
            sx={{ 
              position: 'relative',
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'rgba(25,118,210,0.05)',
              border: '1px solid rgba(25,118,210,0.2)',
              mb: 2
            }}
          >
            {selectedUser && (
              <Grid container spacing={2}>
                <Grid item xs={12} display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar 
                    src={selectedUser.photo ? `/static/uploads/avatar/${selectedUser.id}/${selectedUser.photo}` : undefined}
                    alt={selectedUser.name}
                    sx={{ width: 60, height: 60, border: '2px solid rgba(25,118,210,0.3)' }}
                  />
                  <Box>
                    <Typography variant="subtitle1" color="rgba(255,255,255,0.87)" fontWeight="bold">
                      {selectedUser.name}
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.6)">
                      ID: {selectedUser.id}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    label="Имя пользователя"
                    type="text"
                    fullWidth
                    value={editUserName}
                    onChange={(e) => setEditUserName(e.target.value)}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.87)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'rgba(25,118,210,0.15)',
                          boxShadow: '0 0 0 2px rgba(25,118,210,0.3)'
                        }
                      }
                    }}
                    InputLabelProps={{
                      sx: { color: 'rgba(255,255,255,0.7)' }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.2)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.3)'
                      },
                      '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main'
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Юзернейм"
                    type="text"
                    fullWidth
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    variant="outlined"
                    size="small"
                    helperText="Допускаются только латинские буквы, цифры и символы: . _ -"
                    FormHelperTextProps={{
                      sx: { color: 'rgba(255,255,255,0.5)' }
                    }}
                    InputProps={{
                      sx: {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.87)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'rgba(25,118,210,0.15)',
                          boxShadow: '0 0 0 2px rgba(25,118,210,0.3)'
                        }
                      }
                    }}
                    InputLabelProps={{
                      sx: { color: 'rgba(255,255,255,0.7)' }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.2)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.3)'
                      },
                      '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setEditUserDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 8,
              px: 3,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleUpdateUserInfo} 
            color="primary" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{ 
              borderRadius: 8,
              px: 4,
              py: 0.75,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </StyledDialog>
      
      
      <StyledDialog open={bugReportStatusDialogOpen} onClose={() => setBugReportStatusDialogOpen(false)} fullWidth maxWidth="sm">
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'linear-gradient(90deg, rgba(156,39,176,0.2) 0%, rgba(0,0,0,0) 100%)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(156,39,176,0.2) 0%, rgba(156,39,176,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <BugReportIcon sx={{ mr: 1.5, fontSize: 24, color: '#9c27b0' }} />
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#ba68c8' }}>
              Изменение статуса баг-репорта
            </Typography>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 2.5, bgcolor: 'transparent' }}>
          <Box 
            sx={{ 
              position: 'relative',
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'rgba(156,39,176,0.05)',
              border: '1px solid rgba(156,39,176,0.2)',
              mb: 2
            }}
          >
            {selectedBugReport && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" color="rgba(255,255,255,0.87)" gutterBottom fontWeight="bold">
                    {selectedBugReport.subject}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.6)" sx={{ mb: 2 }}>
                    ID: {selectedBugReport.id} | Дата: {new Date(selectedBugReport.date).toLocaleString()}
                  </Typography>
                  <Divider sx={{ my: 2, bgcolor: 'rgba(156,39,176,0.2)' }} />
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel id="bug-status-label" sx={{ color: 'rgba(255,255,255,0.7)' }}>Статус</InputLabel>
                    <Select
                      labelId="bug-status-label"
                      value={bugReportStatus}
                      onChange={(e) => setBugReportStatus(e.target.value)}
                      sx={{
                        borderRadius: 2,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.87)',
                        '.MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.2)'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.3)'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#9c27b0'
                        }
                      }}
                    >
                      <MenuItem value="Открыт">Открыт</MenuItem>
                      <MenuItem value="В работе">В работе</MenuItem>
                      <MenuItem value="Исправлен">Исправлен</MenuItem>
                      <MenuItem value="Закрыт">Закрыт</MenuItem>
                      <MenuItem value="Отклонён">Отклонён</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setBugReportStatusDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 8,
              px: 3,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleUpdateBugReportStatus} 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{ 
              borderRadius: 8,
              px: 4,
              py: 0.75,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(45deg, #9c27b0 30%, #ba68c8 90%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </StyledDialog>
      
      
      <StyledDialog open={editBadgeDialogOpen} onClose={() => setEditBadgeDialogOpen(false)} fullWidth maxWidth="sm">
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'linear-gradient(90deg, rgba(63,81,181,0.2) 0%, rgba(0,0,0,0) 100%)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(63,81,181,0.2) 0%, rgba(63,81,181,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h5" fontWeight="bold" color="primary.light">
              Редактирование бейджика
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.6)">
              Измените параметры бейджика и сохраните изменения
            </Typography>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 3, bgcolor: 'transparent' }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                label="Название бейджика"
                type="text"
                fullWidth
                value={editBadgeName}
                onChange={(e) => setEditBadgeName(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.87)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(63,81,181,0.15)',
                      boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.3)'
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { color: 'rgba(255,255,255,0.7)' }
                }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.2)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.3)'
                  },
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Описание"
                type="text"
                fullWidth
                multiline
                rows={2}
                value={editBadgeDescription}
                onChange={(e) => setEditBadgeDescription(e.target.value)}
                variant="outlined"
                size="small"
                helperText="Кратко опишите бейджик"
                FormHelperTextProps={{
                  sx: { color: 'rgba(255,255,255,0.5)' }
                }}
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.87)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(63,81,181,0.15)',
                      boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.3)'
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { color: 'rgba(255,255,255,0.7)' }
                }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.2)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.3)'
                  },
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Цена (баллы)"
                type="number"
                fullWidth
                value={editBadgePrice}
                onChange={(e) => setEditBadgePrice(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PaidIcon color="primary" /></InputAdornment>,
                  sx: {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.87)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(63,81,181,0.15)',
                      boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.3)'
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { color: 'rgba(255,255,255,0.7)' }
                }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.2)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.3)'
                  },
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 1.5, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  height: '100%'
                }}
              >
                <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.87)">Активен</Typography>
                <Switch 
                  checked={editBadgeActive}
                  onChange={(e) => setEditBadgeActive(e.target.checked)}
                  color="primary"
                  sx={{ 
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#4caf50',
                      '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.08)',
                      },
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#4caf50',
                    },
                  }}
                />
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  p: 3,
                  borderRadius: 2,
                  border: '1px dashed rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1, width: '100%', textAlign: 'center' }}>
                  {editBadgeImagePreview ? (
                    <>
                      <Box sx={{ mb: 2, position: 'relative', display: 'inline-block' }}>
                        <img 
                          src={editBadgeImagePreview} 
                          alt="Предпросмотр"
                          style={{ 
                            maxWidth: '100%', 
                            maxHeight: 150, 
                            borderRadius: 8,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                          }}
                        />
                        <Fade in timeout={500}>
                          <Box 
                            sx={{ 
                              position: 'absolute', 
                              top: -8, 
                              right: -8, 
                              background: 'rgba(0,0,0,0.5)',
                              borderRadius: '50%',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                            }}
                          >
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => {
                                setEditBadgeImage(null);
                                setEditBadgeImagePreview('');
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Fade>
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body2" color="rgba(255,255,255,0.6)" align="center" sx={{ mb: 2 }}>
                      Загрузите новое SVG или GIF изображение бейджика
                    </Typography>
                  )}
                  
                  <Button 
                    component="label" 
                    variant="outlined" 
                    startIcon={<FileUploadIcon />}
                    sx={{ 
                      borderRadius: 8,
                      py: 0.5,
                      px: 2,
                      background: 'rgba(63,81,181,0.1)',
                      borderColor: 'rgba(63, 81, 181, 0.5)',
                      color: 'rgba(255,255,255,0.87)',
                      '&:hover': {
                        background: 'rgba(63,81,181,0.2)',
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    Загрузить SVG/GIF
                    <input
                      type="file"
                      accept=".svg,.gif"
                      hidden
                      onChange={handleBadgeImageChange}
                    />
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setEditBadgeDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 8,
              px: 3,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleUpdateBadge} 
            color="primary" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{ 
              borderRadius: 8,
              px: 4,
              py: 0.75,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </StyledDialog>
      
      
      <StyledDialog open={deleteBadgeDialogOpen} onClose={() => setDeleteBadgeDialogOpen(false)} fullWidth maxWidth="sm">
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(244, 67, 54, 0.15)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(244,67,54,0.2) 0%, rgba(244,67,54,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <DeleteIcon color="error" sx={{ mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" color="error.light">
              Удаление бейджика
            </Typography>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 2.5, bgcolor: 'transparent' }}>
          <Box 
            sx={{ 
              position: 'relative',
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'rgba(244, 67, 54, 0.05)',
              border: '1px solid rgba(244, 67, 54, 0.2)',
              mb: 1
            }}
          >
            <Typography variant="subtitle1" color="rgba(255,255,255,0.87)" gutterBottom>
              Вы действительно хотите удалить бейджик <Box component="span" fontWeight="bold" color="error.light">"{selectedBadge?.name}"</Box>?
            </Typography>
            
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              Это действие <Box component="span" fontWeight="bold" color="error.light">нельзя отменить</Box>. 
              При удалении бейджика будут также удалены:
            </Typography>
            
            <Box component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
              <Typography component="li" variant="body2" color="rgba(255,255,255,0.6)">
                Все достижения пользователей, связанные с этим бейджиком
              </Typography>
              <Typography component="li" variant="body2" color="rgba(255,255,255,0.6)">
                Все записи о покупках этого бейджика
              </Typography>
              <Typography component="li" variant="body2" color="rgba(255,255,255,0.6)">
                SVG-файл изображения бейджика
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setDeleteBadgeDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 8,
              px: 3,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleDeleteBadge} 
            color="error" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            sx={{ 
              borderRadius: 8,
              px: 4,
              py: 0.75,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(45deg, #f44336 30%, #ff7961 90%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </StyledDialog>
      
      
      <StyledDialog open={deleteArtistDialogOpen} onClose={() => setDeleteArtistDialogOpen(false)} fullWidth maxWidth="sm">
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(244, 67, 54, 0.15)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(244,67,54,0.2) 0%, rgba(244,67,54,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <DeleteIcon color="error" sx={{ mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" color="error.light">
              Удаление артиста
            </Typography>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 2.5, bgcolor: 'transparent' }}>
          <Box 
            sx={{ 
              position: 'relative',
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'rgba(244, 67, 54, 0.05)',
              border: '1px solid rgba(244, 67, 54, 0.2)',
              mb: 1
            }}
          >
            <Typography variant="subtitle1" color="rgba(255,255,255,0.87)" gutterBottom>
              Вы действительно хотите удалить артиста <Box component="span" fontWeight="bold" color="error.light">"{selectedArtist?.name}"</Box>?
            </Typography>
            
            <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mb: 2 }}>
              Это действие удалит всю информацию об артисте из системы. 
              Треки, связанные с этим артистом, станут недоступны для прослушивания.
            </Typography>
            
            {selectedArtist && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Avatar 
                  src={selectedArtist.avatar ? `/static/uploads/artists/${selectedArtist.id}/${selectedArtist.avatar}` : undefined}
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1" color="rgba(255,255,255,0.9)">
                    {selectedArtist.name}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.6)">
                    {selectedArtist.tracks_count || 0} треков • {selectedArtist.is_verified ? 'Верифицирован' : 'Не верифицирован'}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setDeleteArtistDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 8,
              px: 3,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleDeleteArtist} 
            color="error" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            sx={{ 
              borderRadius: 8,
              px: 4,
              py: 0.75,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(45deg, #f44336 30%, #ff7961 90%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </StyledDialog>
      
      
      <StyledDialog open={editArtistDialogOpen} onClose={() => setEditArtistDialogOpen(false)} fullWidth maxWidth="sm">
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'linear-gradient(90deg, rgba(63,81,181,0.2) 0%, rgba(0,0,0,0) 100%)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(63,81,181,0.2) 0%, rgba(63,81,181,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h5" fontWeight="bold" color="primary.light">
              {selectedArtist ? 'Редактирование артиста' : 'Создание нового артиста'}
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.6)">
              {selectedArtist ? 'Измените данные артиста и сохраните изменения' : 'Заполните данные нового артиста'}
            </Typography>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 3, bgcolor: 'transparent' }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                label="Имя артиста"
                type="text"
                fullWidth
                value={editArtistName}
                onChange={(e) => setEditArtistName(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.87)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(63,81,181,0.15)',
                      boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.3)'
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { color: 'rgba(255,255,255,0.7)' }
                }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.2)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.3)'
                  },
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Биография"
                type="text"
                fullWidth
                multiline
                rows={4}
                value={editArtistBio}
                onChange={(e) => setEditArtistBio(e.target.value)}
                variant="outlined"
                size="small"
                helperText="Краткая информация об артисте"
                FormHelperTextProps={{
                  sx: { color: 'rgba(255,255,255,0.5)' }
                }}
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.87)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(63,81,181,0.15)',
                      boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.3)'
                    }
                  }
                }}
                InputLabelProps={{
                  sx: { color: 'rgba(255,255,255,0.7)' }
                }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.2)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.3)'
                  },
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 1.5, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <VerifiedUserIcon 
                    color={editArtistVerified ? "primary" : "disabled"} 
                    sx={{ mr: 1.5 }} 
                  />
                  <Typography variant="subtitle1" color="rgba(255, 255, 255, 0.87)">
                    Верифицированный артист
                  </Typography>
                </Box>
                <Switch 
                  checked={editArtistVerified}
                  onChange={(e) => setEditArtistVerified(e.target.checked)}
                  color="primary"
                  sx={{ 
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#3f51b5',
                      '&:hover': {
                        backgroundColor: 'rgba(63, 81, 181, 0.08)',
                      },
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#3f51b5',
                    },
                  }}
                />
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  p: 3,
                  borderRadius: 2,
                  border: '1px dashed rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1, width: '100%', textAlign: 'center' }}>
                  {editArtistAvatarPreview ? (
                    <>
                      <Box sx={{ mb: 2, position: 'relative', display: 'inline-block' }}>
                        <Avatar 
                          src={editArtistAvatarPreview} 
                          alt="Предпросмотр"
                          sx={{ 
                            width: 150, 
                            height: 150, 
                            borderRadius: '50%',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                          }}
                        />
                        <Fade in timeout={500}>
                          <Box 
                            sx={{ 
                              position: 'absolute', 
                              top: -8, 
                              right: -8, 
                              background: 'rgba(0,0,0,0.5)',
                              borderRadius: '50%',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                            }}
                          >
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={() => {
                                setEditArtistAvatar(null);
                                setEditArtistAvatarPreview('');
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Fade>
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body2" color="rgba(255,255,255,0.6)" align="center" sx={{ mb: 2 }}>
                      Загрузите новое изображение артиста
                    </Typography>
                  )}
                  
                  <Button 
                    component="label" 
                    variant="outlined" 
                    startIcon={<FileUploadIcon />}
                    sx={{ 
                      borderRadius: 8,
                      py: 0.5,
                      px: 2,
                      background: 'rgba(63,81,181,0.1)',
                      borderColor: 'rgba(63, 81, 181, 0.5)',
                      color: 'rgba(255,255,255,0.87)',
                      '&:hover': {
                        background: 'rgba(63,81,181,0.2)',
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    Загрузить изображение
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleArtistImageChange}
                    />
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setEditArtistDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 8,
              px: 3,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleUpdateArtist} 
            color="primary" 
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{ 
              borderRadius: 8,
              px: 4,
              py: 0.75,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            {selectedArtist ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </StyledDialog>
      
      
      <StyledDialog open={manageArtistTracksDialogOpen} onClose={() => setManageArtistTracksDialogOpen(false)} fullWidth maxWidth="md">
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'linear-gradient(90deg, rgba(63,81,181,0.2) 0%, rgba(0,0,0,0) 100%)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(63,81,181,0.2) 0%, rgba(63,81,181,0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <LibraryMusicIcon sx={{ mr: 1.5, fontSize: 28, color: 'primary.light' }} />
            <Box>
              <Typography variant="h6" fontWeight="bold" color="primary.light">
                Управление треками артиста
              </Typography>
              {selectedArtist && (
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  {selectedArtist.name} ({artistTracks.length} треков)
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '60vh' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="subtitle1" gutterBottom>
              Треки артиста
            </Typography>
            
            {artistTracks.length > 0 ? (
              <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'rgba(0,0,0,0.2)', maxHeight: 250, overflow: 'auto' }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Название</TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Альбом</TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Длительность</TableCell>
                      <TableCell align="right">Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {artistTracks.map(track => (
                      <TableRow key={track.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              variant="rounded"
                              src={track.cover_path}
                              sx={{ width: 32, height: 32, mr: 1 }}
                            >
                              <AudiotrackIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {track.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {track.artist}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{track.album || '—'}</TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                          {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            color="error" 
                            size="small" 
                            onClick={() => handleRemoveTrackFromArtist(track.id)}
                            disabled={loadingTracks}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                py: 3,
                bgcolor: 'rgba(0,0,0,0.2)',
                borderRadius: 1
              }}>
                <AudiotrackIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography color="text.secondary">
                  У артиста еще нет привязанных треков
                </Typography>
              </Box>
            )}
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ p: 2, flexGrow: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Добавление треков
            </Typography>
            
            <Box sx={{ display: 'flex', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="search-mode-label">Искать по</InputLabel>
                <Select
                  labelId="search-mode-label"
                  value={searchMode}
                  onChange={(e) => setSearchMode(e.target.value)}
                  size="small"
                  sx={{ minWidth: 130 }}
                >
                  <MenuItem value="artist">Имени артиста</MenuItem>
                  <MenuItem value="title">Названию трека</MenuItem>
                </Select>
              </FormControl>
              
              <TextField 
                size="small"
                placeholder="Поиск треков..."
                value={trackSearch}
                onChange={(e) => setTrackSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                sx={{ flexGrow: 1 }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    searchUnassignedTracks();
                  }
                }}
              />
              <Button 
                variant="contained" 
                onClick={searchUnassignedTracks}
                disabled={loadingTracks || !trackSearch || trackSearch.trim().length < 2}
                size="small"
              >
                {loadingTracks ? <CircularProgress size={24} /> : 'Поиск'}
              </Button>
            </Box>
            
            {searchableTracksList.length > 0 ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Найдено треков: {searchableTracksList.length}
                  </Typography>
                  
                  <Box>
                    <Button 
                      size="small"
                      variant="outlined"
                      onClick={handleSelectAllSearchedTracks}
                      disabled={searchableTracksList.length === 0}
                    >
                      {selectedTracks.length === searchableTracksList.length ? 'Снять выделение' : 'Выбрать все'}
                    </Button>
                    <Button 
                      size="small"
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAssignSelectedTracks}
                      disabled={selectedTracks.length === 0}
                      color="success"
                      sx={{ ml: 1 }}
                    >
                      Добавить выбранные ({selectedTracks.length})
                    </Button>
                  </Box>
                </Box>
                
                <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'rgba(0,0,0,0.2)', maxHeight: 300, overflow: 'auto' }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox 
                            checked={selectedTracks.length === searchableTracksList.length && searchableTracksList.length > 0}
                            indeterminate={selectedTracks.length > 0 && selectedTracks.length < searchableTracksList.length}
                            onChange={handleSelectAllSearchedTracks}
                          />
                        </TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Альбом</TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Длительность</TableCell>
                        <TableCell align="right">Добавить</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchableTracksList.map(track => (
                        <TableRow key={track.id}>
                          <TableCell padding="checkbox">
                            <Checkbox 
                              checked={selectedTracks.includes(track.id)}
                              onChange={() => handleToggleTrackSelection(track.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                variant="rounded"
                                src={track.cover_path}
                                sx={{ width: 32, height: 32, mr: 1 }}
                              >
                                <AudiotrackIcon />
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  {track.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {track.artist}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{track.album || '—'}</TableCell>
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                            {track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : '—'}
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleAssignTrackToArtist(track.id)}
                              disabled={loadingTracks}
                              startIcon={<AddIcon />}
                            >
                              Добавить
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : searchableTracksList.length === 0 && trackSearch && !loadingTracks ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                py: 3,
                bgcolor: 'rgba(0,0,0,0.2)',
                borderRadius: 1
              }}>
                <SearchIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography color="text.secondary">
                  Не найдено треков для привязки
                </Typography>
              </Box>
            ) : null}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setManageArtistTracksDialogOpen(false)}
            variant="contained"
          >
            Закрыть
          </Button>
        </DialogActions>
      </StyledDialog>
      
      {/* Medal issuing dialog */}
      <StyledDialog 
        open={issueMedalDialogOpen} 
        onClose={() => setIssueMedalDialogOpen(false)} 
        maxWidth="md"
        fullWidth
      >
        <Box 
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(25, 118, 210, 0.15)'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(25, 118, 210, 0.2) 0%, rgba(25, 118, 210, 0) 70%)',
              zIndex: 0
            }} 
          />
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
            <EmojiEventsOutlinedIcon color="primary" sx={{ mr: 1.5, fontSize: 24 }} />
            <Typography variant="h6" fontWeight="bold" color="primary.light">
              Выдача медали
            </Typography>
          </Box>
        </Box>
        
        <DialogContent sx={{ p: 3, pt: 2.5, bgcolor: 'transparent' }}>
          <Box 
            sx={{ 
              position: 'relative',
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'rgba(25,118,210,0.05)',
              border: '1px solid rgba(25,118,210,0.2)',
              mb: 2
            }}
          >
            {medalUser && (
              <Grid container spacing={2}>
                <Grid item xs={12} display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar 
                    src={medalUser.photo ? `/static/uploads/avatar/${medalUser.id}/${medalUser.photo}` : undefined}
                    alt={medalUser.name}
                    sx={{ width: 60, height: 60, border: '2px solid rgba(25,118,210,0.3)' }}
                  />
                  <Box>
                    <Typography variant="subtitle1" color="rgba(255,255,255,0.87)" fontWeight="bold">
                      {medalUser.name}
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.6)">
                      @{medalUser.username}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Выберите медаль
            </Typography>
            
            {loadingMedals ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <CircularProgress />
              </Box>
            ) : availableMedals.length > 0 ? (
              <Grid container spacing={2}>
                {availableMedals.map((medal) => (
                  <Grid item xs={6} sm={4} md={3} key={medal.name}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        transform: selectedMedal === medal.name ? 'scale(1.05)' : 'scale(1)',
                        border: selectedMedal === medal.name ? '2px solid #1976d2' : 'none',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                        }
                      }}
                      onClick={() => {
                        console.log('Selected medal:', medal);
                        setSelectedMedal(medal.name);
                        setMedalDescription(medal.description || '');
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="120"
                        image={medal.image_path}
                        alt={medal.name}
                        sx={{ objectFit: 'contain', p: 1 }}
                      />
                      <CardContent sx={{ textAlign: 'center', p: 1 }}>
                        <Typography variant="body2" noWrap>
                          {medal.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {medal.achievement}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                py: 3,
                bgcolor: 'rgba(0,0,0,0.2)',
                borderRadius: 1
              }}>
                <EmojiEventsOutlinedIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography color="text.secondary">
                  Нет доступных медалей
                </Typography>
              </Box>
            )}
            
            <TextField
              fullWidth
              label="Описание медали"
              value={medalDescription}
              onChange={(e) => setMedalDescription(e.target.value)}
              margin="normal"
              variant="outlined"
              multiline
              rows={2}
              disabled={!selectedMedal}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, px: 3, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <Button 
            onClick={() => setIssueMedalDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            sx={{ 
              borderRadius: 8,
              px: 3,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleIssueMedal} 
            color="primary" 
            variant="contained"
            disabled={loading || !selectedMedal}
            startIcon={loading ? <CircularProgress size={20} /> : <EmojiEventsOutlinedIcon />}
            sx={{ 
              borderRadius: 8,
              px: 4,
              py: 0.75,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              }
            }}
          >
            Выдать медаль
          </Button>
        </DialogActions>
      </StyledDialog>
      
      <DecorationMenu
        open={decorationMenuOpen}
        onClose={handleCloseDecorationMenu}
        userId={selectedUserForDecorations?.id}
        username={selectedUserForDecorations?.username}
      />
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        sx={snackbarStyle}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ModeratorPage;