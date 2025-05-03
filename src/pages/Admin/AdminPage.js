import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Tab,
  Tabs,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Alert,
  Snackbar,
  TablePagination,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  FormControlLabel,
  Checkbox,
  Switch,
  Pagination
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import PostAddIcon from '@mui/icons-material/PostAdd';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import SecurityIcon from '@mui/icons-material/Security';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CommentIcon from '@mui/icons-material/Comment';
import PhotoIcon from '@mui/icons-material/Photo';
import BugReportIcon from '@mui/icons-material/BugReport';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import KeyIcon from '@mui/icons-material/Key';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import axios from 'axios';


const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2, 0),
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  gap: theme.spacing(2),
}));

const AdminPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userTracks, setUserTracks] = useState([]);
  
  
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [deletePostDialogOpen, setDeletePostDialogOpen] = useState(false);
  const [deleteTrackDialogOpen, setDeleteTrackDialogOpen] = useState(false);
  const [viewUserDialogOpen, setViewUserDialogOpen] = useState(false);
  const [moderatorDialogOpen, setModeratorDialogOpen] = useState(false);
  
  
  const [verificationLevel, setVerificationLevel] = useState(1);
  const [selectedBadge, setSelectedBadge] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [banReason, setBanReason] = useState('');
  
  
  const [selectedPermissions, setSelectedPermissions] = useState({
    delete_music: false,
    delete_posts: false,
    delete_avatar: false,
    delete_comments: false,
    change_user_name: false,
    change_username: false,
    manage_bug_reports: false,
    delete_bug_reports: false
  });
  const [moderators, setModerators] = useState([]);
  const [bugReports, setBugReports] = useState([]);
  
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  
  const [openKeyGenerationDialog, setOpenKeyGenerationDialog] = useState(false);
  const [generatedKeys, setGeneratedKeys] = useState([]);
  const [keyGenerationParams, setKeyGenerationParams] = useState({
    key_type: 'points',
    points_value: 100,
    subscription_type: 'basic',
    max_uses: 1,
    count: 1,
    description: '',
    expires_days: 30
  });
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
  const [redemptionKeys, setRedemptionKeys] = useState([]);
  const [keysLoading, setKeysLoading] = useState(false);
  const [keysPagination, setKeysPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0
  });
  
  
  if (!user || user.id !== 3) {
    return <Navigate to="/" />;
  }
  
  useEffect(() => {
    fetchUsers();
    fetchAllAchievements();
    fetchModerators();
    fetchBugReports();
  }, []);
  
  useEffect(() => {
    
    if (tabValue === 1) {
      fetchAllPosts();
    } else if (tabValue === 2) {
      fetchAllTracks();
    } else if (tabValue === 6) { 
      fetchRedemptionKeys();
    }
  }, [tabValue]);
  
  
  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get('/api/posts/feed?limit=50');
      if (response.data && response.data.posts) {
        setUserPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Error fetching all posts:', error);
      showNotification('error', 'Не удалось загрузить посты');
    } finally {
      setLoading(false);
    }
  };
  
  
  const fetchAllTracks = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get('/api/music');
      if (response.data && response.data.tracks) {
        setUserTracks(response.data.tracks);
      }
    } catch (error) {
      console.error('Error fetching all tracks:', error);
      showNotification('error', 'Не удалось загрузить треки');
    } finally {
      setLoading(false);
    }
  };
  
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      let url = '/api/admin/users';
      if (searchQuery) {
        url += `?search=${searchQuery}`;
      }
      
      const response = await axios.get(url);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('error', 'Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };
  
  
  const fetchAllAchievements = async () => {
    try {
      const response = await axios.get('/api/admin/badge-types');
      setAchievements(response.data.badge_types || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
      showNotification('error', 'Не удалось загрузить доступные значки');
    }
  };
  
  
  const fetchUserPosts = async (userId) => {
    try {
      const response = await axios.get(`/api/admin/users/${userId}/posts`);
      setUserPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      showNotification('error', 'Не удалось загрузить посты пользователя');
    }
  };
  
  
  const fetchUserTracks = async (userId) => {
    try {
      const response = await axios.get(`/api/admin/users/${userId}/tracks`);
      setUserTracks(response.data.tracks || []);
    } catch (error) {
      console.error('Error fetching user tracks:', error);
      showNotification('error', 'Не удалось загрузить треки пользователя');
    }
  };
  
  
  const fetchModerators = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/moderators');
      setModerators(response.data.moderators || []);
    } catch (error) {
      console.error('Error fetching moderators:', error);
      showNotification('error', 'Не удалось загрузить модераторов');
    } finally {
      setLoading(false);
    }
  };
  
  
  const fetchBugReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/bug-reports');
      setBugReports(response.data.bug_reports || []);
    } catch (error) {
      console.error('Error fetching bug reports:', error);
      showNotification('error', 'Не удалось загрузить баг-репорты');
    } finally {
      setLoading(false);
    }
  };
  
  
  const showNotification = (severity, message) => {
    setNotification({
      open: true,
      message,
      severity: severity
    });
  };
  
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  
  const handleSearch = () => {
    fetchUsers();
  };
  
  
  const handleVerifyUser = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/admin/users/${selectedUser.id}/verify`, {
        verification_level: verificationLevel
      });
      
      if (response.data.success) {
        showNotification('success', 'Статус верификации пользователя обновлен');
        
        setUsers(users.map(u => 
          u.id === selectedUser.id 
            ? { ...u, verification_status: response.data.verification_status, verification_level: verificationLevel } 
            : u
        ));
      } else {
        throw new Error(response.data.error || 'Failed to verify user');
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      showNotification('error', 'Не удалось обновить статус верификации');
    } finally {
      setLoading(false);
      setVerifyDialogOpen(false);
    }
  };
  
  
  const handleGiveBadge = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/admin/users/${selectedUser.id}/give-achievement`, {
        badge_type_id: selectedBadge
      });
      
      if (response.data.success) {
        showNotification('success', 'Достижение успешно выдано пользователю');
        
        fetchUsers();
      } else {
        throw new Error(response.data.error || 'Failed to give achievement');
      }
    } catch (error) {
      console.error('Error giving badge:', error);
      showNotification('error', 'Не удалось выдать достижение');
    } finally {
      setLoading(false);
      setBadgeDialogOpen(false);
    }
  };
  
  
  const handleBanUser = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/admin/users/${selectedUser.id}/ban`, {
        reason: banReason,
        is_banned: !selectedUser.is_banned 
      });
      
      if (response.data.success) {
        showNotification('success', selectedUser.is_banned ? 'Пользователь разблокирован' : 'Пользователь заблокирован');
        
        setUsers(users.map(u => 
          u.id === selectedUser.id 
            ? { ...u, is_banned: !u.is_banned } 
            : u
        ));
      } else {
        throw new Error(response.data.error || 'Failed to update ban status');
      }
    } catch (error) {
      console.error('Error banning user:', error);
      showNotification('error', 'Не удалось изменить статус блокировки');
    } finally {
      setLoading(false);
      setBanDialogOpen(false);
    }
  };
  
  
  const handleDeletePost = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/admin/posts/${selectedPost.id}`);
      
      if (response.data.success) {
        showNotification('success', 'Пост успешно удален');
        
        setUserPosts(userPosts.filter(p => p.id !== selectedPost.id));
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
  
  const handleViewUser = (user) => {
    setSelectedUser(user);
    fetchUserPosts(user.id);
    fetchUserTracks(user.id);
    setViewUserDialogOpen(true);
  };
  
  
  const openVerifyDialog = (user) => {
    setSelectedUser(user);
    setVerificationLevel(user.verification_level || 1);
    setVerifyDialogOpen(true);
  };
  
  
  const openBadgeDialog = (user) => {
    setSelectedUser(user);
    setSelectedBadge('');
    setBadgeDialogOpen(true);
  };
  
  
  const openBanDialog = (user) => {
    setSelectedUser(user);
    setBanReason('');
    setBanDialogOpen(true);
  };
  
  
  const openDeletePostDialog = (post) => {
    setSelectedPost(post);
    setDeletePostDialogOpen(true);
  };
  
  
  const handleDeleteTrack = async (trackId) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/admin/tracks/${trackId}`);
      
      if (response.data.success) {
        showNotification('success', 'Трек успешно удален');
        
        setUserTracks(userTracks.filter(track => track.id !== trackId));
      } else {
        throw new Error(response.data.error || 'Не удалось удалить трек');
      }
    } catch (error) {
      console.error('Error deleting track:', error);
      showNotification('error', 'Не удалось удалить трек');
    } finally {
      setLoading(false);
    }
  };
  
  
  const openDeleteTrackDialog = (track) => {
    setSelectedTrack(track);
    setDeleteTrackDialogOpen(true);
  };
  
  
  const confirmDeleteTrack = () => {
    if (selectedTrack) {
      handleDeleteTrack(selectedTrack.id);
      setDeleteTrackDialogOpen(false);
    }
  };
  
  
  const handleToggleModeratorStatus = async () => {
    try {
      setLoading(true);
      const isCurrentlyModerator = isModerator(selectedUser.id);
      
      let response;
      if (isCurrentlyModerator) {
        
        response = await axios.delete(`/api/admin/moderators/${selectedUser.id}`);
        if (response.data.success) {
          showNotification('success', 'Модераторские права отозваны');
          setModerators(moderators.filter(mod => mod.user_id !== selectedUser.id));
        }
      } else {
        
        response = await axios.post('/api/admin/moderators', {
          user_id: selectedUser.id,
          permissions: selectedPermissions
        });
        
        if (response.data.success) {
          showNotification('success', 'Пользователь назначен модератором');
          
          setModerators([...moderators, {
            user_id: selectedUser.id,
            user_name: selectedUser.name,
            user_username: selectedUser.username,
            permissions: selectedPermissions
          }]);
        }
      }
    } catch (error) {
      console.error('Error updating moderator status:', error);
      showNotification('error', 'Не удалось обновить статус модератора');
    } finally {
      setLoading(false);
      setModeratorDialogOpen(false);
    }
  };
  
  
  const handleUpdateModeratorPermissions = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/admin/moderators/${selectedUser.id}`, {
        permissions: selectedPermissions
      });
      
      if (response.data.success) {
        showNotification('success', 'Права модератора обновлены');
        
        setModerators(moderators.map(mod => 
          mod.user_id === selectedUser.id 
            ? { ...mod, permissions: selectedPermissions } 
            : mod
        ));
      }
    } catch (error) {
      console.error('Error updating moderator permissions:', error);
      showNotification('error', 'Не удалось обновить права модератора');
    } finally {
      setLoading(false);
      setModeratorDialogOpen(false);
    }
  };
  
  
  const openModeratorDialog = (user) => {
    setSelectedUser(user);
    
    
    const existingModerator = moderators.find(mod => mod.user_id === user.id);
    
    if (existingModerator) {
      
      setSelectedPermissions(existingModerator.permissions);
    } else {
      
      setSelectedPermissions({
        delete_music: false,
        delete_posts: false,
        delete_avatar: false,
        delete_comments: false,
        change_user_name: false,
        change_username: false,
        manage_bug_reports: false,
        delete_bug_reports: false
      });
    }
    
    setModeratorDialogOpen(true);
  };
  
  
  const isModerator = (userId) => {
    return moderators.some(mod => mod.user_id === userId);
  };
  
  
  const handleUpdateBugReportStatus = async (reportId, status) => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/admin/bug-reports/${reportId}`, {
        status
      });
      
      if (response.data.success) {
        showNotification('success', 'Статус баг-репорта обновлен');
        
        setBugReports(bugReports.map(report => 
          report.id === reportId 
            ? { ...report, status } 
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
    }
  };
  
  
  const handleDeleteBugReport = async (reportId) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/admin/bug-reports/${reportId}`);
      
      if (response.data.success) {
        showNotification('success', 'Баг-репорт успешно удален');
        
        setBugReports(bugReports.filter(report => report.id !== reportId));
      } else {
        throw new Error(response.data.error || 'Failed to delete bug report');
      }
    } catch (error) {
      console.error('Error deleting bug report:', error);
      showNotification('error', 'Не удалось удалить баг-репорт');
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleAddModerator = async () => {
    setLoading(true);
    
    try {
      
      const response = await fetch('/api/admin/moderators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: selectedUser.id,
          permissions: {
            delete_posts: selectedPermissions.delete_posts,
            delete_music: selectedPermissions.delete_music,
            delete_comments: selectedPermissions.delete_comments,
            delete_avatar: selectedPermissions.delete_avatar,
            change_user_name: selectedPermissions.change_user_name,
            change_username: selectedPermissions.change_username,
            manage_bug_reports: selectedPermissions.manage_bug_reports,
            delete_bug_reports: selectedPermissions.delete_bug_reports,
          },
          update_status: selectedPermissions.update_status,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Ошибка при добавлении модератора:', data);
        
        
        let errorMessage = data.error || 'Неизвестная ошибка';
        
        
        if (data.debug_info) {
          errorMessage += '\n\nДетали ошибки:\n';
          Object.entries(data.debug_info).forEach(([key, value]) => {
            if (value) errorMessage += `${key}: ${value}\n`;
          });
        }
        
        showNotification('error', errorMessage);
        setLoading(false);
        return;
      }

      
      showNotification('success', data.message || 'Модератор успешно добавлен');
      
      
      fetchModerators();
      
      
      handleCloseModeratorDialog();
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
      showNotification('error', `Произошла ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  
  const renderUsersTable = () => {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Пользователь</TableCell>
              <TableCell>Email / Telegram ID</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      src={user.photo ? (user.photo.startsWith('/') ? user.photo : `/static/uploads/avatar/${user.id}/${user.photo}`) : undefined} 
                      sx={{ mr: 1 }}
                      onError={(e) => {
                        console.error(`Failed to load avatar for ${user.username}`);
                        e.target.onerror = null; 
                        e.target.src = `/static/uploads/avatar/system/avatar.png`;
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                        {user.name}
                        {user.verification_status === 'verified' && (
                          <CheckCircleIcon 
                            sx={{ 
                              fontSize: 16, 
                              ml: 0.5, 
                              color: user.verification_level === 1 ? '#9e9e9e' : 
                                     user.verification_level === 2 ? '#d67270' : 
                                     user.verification_level === 3 ? '#b39ddb' : 
                                     user.verification_level === 4 ? '#ff9800' : 
                                     user.verification_level === 5 ? '#4caf50' :
                                     '#D0BCFF'
                            }} 
                          />
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">@{user.username}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    {user.email ? (
                      <Typography variant="body2">{user.email}</Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">Нет email</Typography>
                    )}
                    {user.telegram_id && (
                      <Typography variant="caption" color="text.secondary">
                        Telegram ID: {user.telegram_id}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {user.is_banned ? (
                    <Chip size="small" label="Заблокирован" color="error" variant="outlined" />
                  ) : (
                    <Chip size="small" label="Активен" color="success" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary" onClick={() => handleViewUser(user)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary" onClick={() => openVerifyDialog(user)}>
                      <VerifiedUserIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="secondary" onClick={() => openBadgeDialog(user)}>
                      <EmojiEventsIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color={user.is_banned ? "success" : "error"} onClick={() => openBanDialog(user)}>
                      <BlockIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      color={isModerator(user.id) ? "success" : "default"} 
                      onClick={() => openModeratorDialog(user)}
                    >
                      <SecurityIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    );
  };
  
  
  const renderModeratorsTable = () => {
  return (
      <ContentPaper>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <SecurityIcon sx={{ mr: 1 }} />
          Управление модераторами
        </Typography>
        
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Имя</TableCell>
                <TableCell>Пользователь</TableCell>
                <TableCell>Права</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {moderators.map((moderator) => (
                <TableRow key={moderator.user_id}>
                  <TableCell>{moderator.user_id}</TableCell>
                  <TableCell>{moderator.user_name}</TableCell>
                  <TableCell>@{moderator.user_username}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {moderator.permissions.delete_music && (
                        <Chip label="Удаление музыки" size="small" color="info" />
                      )}
                      {moderator.permissions.delete_posts && (
                        <Chip label="Удаление постов" size="small" color="info" />
                      )}
                      {moderator.permissions.delete_avatar && (
                        <Chip label="Удаление аватаров" size="small" color="info" />
                      )}
                      {moderator.permissions.delete_comments && (
                        <Chip label="Удаление комментариев" size="small" color="info" />
                      )}
                      {moderator.permissions.change_user_name && (
                        <Chip label="Изменение имени" size="small" color="info" />
                      )}
                      {moderator.permissions.change_username && (
                        <Chip label="Изменение username" size="small" color="info" />
                      )}
                      {moderator.permissions.manage_bug_reports && (
                        <Chip label="Управление баг-репортами" size="small" color="info" />
                      )}
                      {moderator.permissions.delete_bug_reports && (
                        <Chip label="Удаление баг-репортов" size="small" color="info" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <IconButton 
                        color="primary" 
                        onClick={() => {
                          const user = users.find(u => u.id === moderator.user_id) || {
                            id: moderator.user_id,
                            name: moderator.user_name,
                            username: moderator.user_username
                          };
                          openModeratorDialog(user);
                        }}
                      >
                        <ModeEditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => {
                          const user = users.find(u => u.id === moderator.user_id) || {
                            id: moderator.user_id,
                            name: moderator.user_name,
                            username: moderator.user_username
                          };
                          setSelectedUser(user);
                          handleToggleModeratorStatus();
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {moderators.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Нет модераторов
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          Для назначения пользователя модератором, найдите его в списке пользователей и нажмите иконку <SecurityIcon fontSize="small" sx={{ verticalAlign: 'middle' }} />
        </Typography>
      </ContentPaper>
    );
  };
  
  
  const renderBugReportsTable = () => {
    return (
      <ContentPaper>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <BugReportIcon sx={{ mr: 1 }} />
          Управление баг-репортами
        </Typography>
        
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Пользователь</TableCell>
                <TableCell>Заголовок</TableCell>
                <TableCell>Описание</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bugReports.map((report) => (
                <TableRow key={report.id}>
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
                      label={
                        report.status === 'new' ? 'Новый' :
                        report.status === 'in_progress' ? 'В работе' :
                        report.status === 'fixed' ? 'Исправлен' :
                        report.status === 'wont_fix' ? 'Не будет исправлен' :
                        'Неизвестно'
                      }
                      color={
                        report.status === 'new' ? 'info' :
                        report.status === 'in_progress' ? 'warning' :
                        report.status === 'fixed' ? 'success' :
                        report.status === 'wont_fix' ? 'error' :
                        'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(report.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <FormControl variant="standard" sx={{ minWidth: 120, mr: 1 }}>
                        <Select
                          value={report.status}
                          onChange={(e) => handleUpdateBugReportStatus(report.id, e.target.value)}
                          size="small"
                        >
                          <MenuItem value="new">Новый</MenuItem>
                          <MenuItem value="in_progress">В работе</MenuItem>
                          <MenuItem value="fixed">Исправлен</MenuItem>
                          <MenuItem value="wont_fix">Не будет исправлен</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteBugReport(report.id)}
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
      </ContentPaper>
    );
  };
  
  
  const handleGenerateKeys = async () => {
    try {
      setIsGeneratingKeys(true);
      
      
      if (keyGenerationParams.points_value <= 0 || keyGenerationParams.max_uses <= 0 || keyGenerationParams.count <= 0) {
        showNotification('error', 'Все числовые значения должны быть больше нуля');
        return;
      }
      
      const response = await axios.post(`/api/admin/users/${user.id}/generate-keys`, keyGenerationParams);
      
      if (response.data.success) {
        setGeneratedKeys(response.data.keys);
        showNotification('success', `Успешно сгенерировано ${response.data.keys.length} ключей`);
        fetchRedemptionKeys(); 
      } else {
        showNotification('error', response.data.error || 'Ошибка при генерации ключей');
      }
    } catch (error) {
      console.error('Error generating keys:', error);
      showNotification('error', error.response?.data?.error || 'Произошла ошибка при генерации ключей');
    } finally {
      setIsGeneratingKeys(false);
    }
  };
  
  
  const copyKeysToClipboard = () => {
    if (generatedKeys.length > 0) {
      const keyText = generatedKeys.join('\n');
      navigator.clipboard.writeText(keyText)
        .then(() => {
          showNotification('success', 'Ключи скопированы в буфер обмена');
        })
        .catch(err => {
          console.error('Failed to copy keys:', err);
          showNotification('error', 'Не удалось скопировать ключи');
        });
    }
  };
  
  
  const fetchRedemptionKeys = async (page = 1) => {
    try {
      setKeysLoading(true);
      
      const response = await axios.get(`/api/admin/users/${user.id}/keys?page=${page}&per_page=10&_nocache=${Date.now()}`);
      
      setRedemptionKeys(response.data.keys || []);
      setKeysPagination({
        page: response.data.page,
        per_page: response.data.per_page,
        total: response.data.total,
        pages: response.data.pages
      });
    } catch (error) {
      console.error('Error fetching redemption keys:', error);
      showNotification('error', 'Не удалось загрузить ключи активации');
    } finally {
      setKeysLoading(false);
    }
  };
  
  
  const renderKeysTab = () => {
  return (
      <Box sx={{ mt: 2 }}>
        <Paper sx={{ mb: 3, p: 0, overflow: 'hidden' }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Typography variant="h6" component="h2">
              Управление ключами активации
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<MonetizationOnIcon />}
                component="a"
                href="https://www.donationalerts.com/r/qsoul"
                target="_blank"
                rel="noopener noreferrer"
              >
                Открыть Donation Alerts
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<VpnKeyIcon />}
                onClick={() => setOpenKeyGenerationDialog(true)}
              >
                Создать ключи
              </Button>
            </Box>
          </Box>
          
          {keysLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ключ</TableCell>
                      <TableCell>Тип</TableCell>
                      <TableCell>Баллы/Подписка</TableCell>
                      <TableCell>Использования</TableCell>
                      <TableCell>Создан</TableCell>
                      <TableCell>Истекает</TableCell>
                      <TableCell>Статус</TableCell>
                      <TableCell>Описание</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {redemptionKeys.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Typography variant="body2" color="textSecondary">
                            Ключи не найдены
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      redemptionKeys.map((key) => (
                        <TableRow key={key.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <KeyIcon sx={{ mr: 1, color: 'primary.main', fontSize: 16 }} />
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                {key.key}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={key.key_type === 'points' ? 'Баллы' : 'Подписка'}
                              color={key.key_type === 'points' ? 'primary' : 'secondary'}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {key.key_type === 'points' ? (
                              `${key.points_value} баллов`
                            ) : (
                              <Chip
                                size="small"
                                label={key.subscription_type === 'basic' ? 'Базовая' : 
                                       key.subscription_type === 'premium' ? 'Премиум' : 
                                       key.subscription_type === 'ultimate' ? 'Ультимейт' : 
                                       key.subscription_type}
                                color="success"
                              />
                            )}
                          </TableCell>
                          <TableCell>{key.current_uses} / {key.max_uses}</TableCell>
                          <TableCell>{new Date(key.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {key.expires_at ? new Date(key.expires_at).toLocaleDateString() : 'Бессрочно'}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              size="small" 
                              label={key.is_valid ? 'Активен' : 'Недействителен'} 
                              color={key.is_valid ? 'success' : 'error'} 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{key.description || '-'}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {keysPagination.pages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <Pagination
                    count={keysPagination.pages}
                    page={keysPagination.page}
                    onChange={(e, page) => fetchRedemptionKeys(page)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Paper>
      </Box>
    );
  };
  
  
  const keyGenerationDialog = (
    <Dialog
      open={openKeyGenerationDialog}
      onClose={() => !isGeneratingKeys && setOpenKeyGenerationDialog(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Генерация ключей активации
        {!isGeneratingKeys && (
          <IconButton
            aria-label="close"
            onClick={() => setOpenKeyGenerationDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {generatedKeys.length > 0 ? (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 1
              }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Сгенерированные ключи:
                </Typography>
                <Button
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={copyKeysToClipboard}
                >
                  Копировать все
                </Button>
              </Box>
              
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  maxHeight: 200, 
                  overflow: 'auto',
                  bgcolor: 'rgba(0, 0, 0, 0.03)'
                }}
              >
                {generatedKeys.map((key, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    fontFamily="monospace"
                    sx={{ mb: 0.5 }}
                  >
                    {key}
                  </Typography>
                ))}
              </Paper>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setGeneratedKeys([]);
                  }}
                >
                  Сгенерировать еще
                </Button>
              </Box>
            </Box>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Тип ключа</InputLabel>
                  <Select
                    value={keyGenerationParams.key_type}
                    label="Тип ключа"
                    onChange={(e) => setKeyGenerationParams({
                      ...keyGenerationParams,
                      key_type: e.target.value
                    })}
                  >
                    <MenuItem value="points">Баллы</MenuItem>
                    <MenuItem value="subscription">Подписка</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {keyGenerationParams.key_type === 'points' ? (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Количество баллов"
                    type="number"
                    fullWidth
                    value={keyGenerationParams.points_value}
                    onChange={(e) => setKeyGenerationParams({
                      ...keyGenerationParams,
                      points_value: parseInt(e.target.value) || 0
                    })}
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
              ) : (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Тип подписки</InputLabel>
                    <Select
                      value={keyGenerationParams.subscription_type}
                      label="Тип подписки"
                      onChange={(e) => setKeyGenerationParams({
                        ...keyGenerationParams,
                        subscription_type: e.target.value
                      })}
                    >
                      <MenuItem value="basic">Базовая</MenuItem>
                      <MenuItem value="premium">Премиум</MenuItem>
                      <MenuItem value="ultimate">Ультимейт</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Макс. число использований"
                  type="number"
                  fullWidth
                  value={keyGenerationParams.max_uses}
                  onChange={(e) => setKeyGenerationParams({
                    ...keyGenerationParams,
                    max_uses: parseInt(e.target.value) || 1
                  })}
                  InputProps={{ inputProps: { min: 1 } }}
                  helperText="Сколько раз можно использовать каждый ключ"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Количество ключей"
                  type="number"
                  fullWidth
                  value={keyGenerationParams.count}
                  onChange={(e) => setKeyGenerationParams({
                    ...keyGenerationParams,
                    count: parseInt(e.target.value) || 1
                  })}
                  InputProps={{ inputProps: { min: 1, max: 100 } }}
                  helperText="От 1 до 100 ключей"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Срок действия (дней)"
                  type="number"
                  fullWidth
                  value={keyGenerationParams.expires_days}
                  onChange={(e) => setKeyGenerationParams({
                    ...keyGenerationParams,
                    expires_days: parseInt(e.target.value) || 0
                  })}
                  InputProps={{ inputProps: { min: 0 } }}
                  helperText="0 = бессрочно"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Описание"
                  fullWidth
                  multiline
                  rows={2}
                  value={keyGenerationParams.description}
                  onChange={(e) => setKeyGenerationParams({
                    ...keyGenerationParams,
                    description: e.target.value
                  })}
                  helperText="Необязательное описание для администраторов"
                />
              </Grid>
            </Grid>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        {generatedKeys.length === 0 && (
          <>
            <Button 
              onClick={() => setOpenKeyGenerationDialog(false)} 
              disabled={isGeneratingKeys}
            >
              Отмена
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateKeys}
              disabled={isGeneratingKeys}
              startIcon={isGeneratingKeys ? <CircularProgress size={20} /> : null}
            >
              {isGeneratingKeys ? 'Генерация...' : 'Сгенерировать'}
            </Button>
          </>
        )}
        
        {generatedKeys.length > 0 && (
          <Button
            onClick={() => {
              setOpenKeyGenerationDialog(false);
              setGeneratedKeys([]);
            }}
          >
            Закрыть
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader>
        <AdminPanelSettingsIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Панель администратора
        </Typography>
      </PageHeader>
      
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab icon={<PeopleIcon />} label="Пользователи" id="tab-0" aria-controls="tabpanel-0" />
          <Tab icon={<PostAddIcon />} label="Посты" id="tab-1" aria-controls="tabpanel-1" />
          <Tab icon={<MusicNoteIcon />} label="Музыка" id="tab-2" aria-controls="tabpanel-2" />
          <Tab icon={<SecurityIcon />} label="Модераторы" id="tab-3" aria-controls="tabpanel-3" />
          <Tab icon={<BugReportIcon />} label="Баг-репорты" id="tab-4" aria-controls="tabpanel-4" />
          <Tab icon={<AccountCircleIcon />} label="Аккаунты" id="tab-5" aria-controls="tabpanel-5" disabled />
          <Tab icon={<KeyIcon />} label="Ключи" id="tab-6" aria-controls="tabpanel-6" />
        </Tabs>
      </Box>
        
      
        {tabValue === 0 && (
          <>
          <ContentPaper>
            <SearchContainer>
              <TextField
                label="Поиск пользователя"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                size="small"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  endAdornment: (
                    <IconButton size="small" onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            </SearchContainer>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              renderUsersTable()
            )}
          </ContentPaper>
          </>
        )}
        
      
        {tabValue === 1 && (
        <ContentPaper>
            {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Последние посты</Typography>
              {userPosts.length > 0 ? (
                userPosts.map(post => (
                  <Paper key={post.id} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar src={post.author_avatar ? (post.author_avatar.startsWith('/') ? post.author_avatar : `/static/uploads/avatar/${post.author_id}/${post.author_avatar}`) : undefined} sx={{ mr: 1 }} />
                        <Box>
                          <Typography variant="subtitle2">{post.author_name}</Typography>
                          <Typography variant="caption" color="text.secondary">@{post.author_username}</Typography>
                        </Box>
                      </Box>
                      <IconButton color="error" onClick={() => openDeletePostDialog(post)}>
                          <DeleteIcon />
                        </IconButton>
                          </Box>
                    
                    <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                      {post.content}
                    </Typography>
                    
                    {post.image && (
                      <Box sx={{ mb: 2, maxWidth: '100%', maxHeight: 300, overflow: 'hidden' }}>
                        <img 
                          src={post.image.startsWith('/') ? post.image : `/static/uploads/posts/${post.id}/${post.image}`} 
                          alt="Post attachment" 
                          style={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
                        />
                      </Box>
                    )}
                    
                    <Typography variant="caption" color="text.secondary">
                      {new Date(post.created_at).toLocaleString()} • {post.comments_count} комментариев • {post.likes_count} лайков
                    </Typography>
                  </Paper>
                ))
              ) : (
                <Typography>Нет постов для отображения</Typography>
            )}
          </Box>
          )}
        </ContentPaper>
        )}
        
      
        {tabValue === 2 && (
        <ContentPaper>
            {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Музыкальные треки</Typography>
              {userTracks.length > 0 ? (
                userTracks.map(track => (
                  <Paper key={track.id} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar src={track.cover ? `/static/uploads/tracks/${track.id}/${track.cover}` : undefined} sx={{ mr: 1, width: 50, height: 50 }} />
                        <Box>
                          <Typography variant="subtitle1">{track.title}</Typography>
                          <Typography variant="subtitle2">{track.artist}</Typography>
                          <Typography variant="caption" color="text.secondary">{track.album || 'Без альбома'}</Typography>
                        </Box>
                      </Box>
                      <IconButton color="error" onClick={() => openDeleteTrackDialog(track)}>
                          <DeleteIcon />
                        </IconButton>
                          </Box>
                    
                    <Typography variant="caption" color="text.secondary">
                      Загружен: {new Date(track.created_at).toLocaleString()} • {track.duration ? `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, '0')}` : 'Неизвестно'} • {track.play_count || 0} прослушиваний
                    </Typography>
                  </Paper>
                ))
              ) : (
                <Typography>Нет треков для отображения</Typography>
            )}
          </Box>
        )}
      </ContentPaper>
      )}
      
      
      {tabValue === 3 && renderModeratorsTable()}
      
      
      {tabValue === 4 && renderBugReportsTable()}
      
      
      {tabValue === 5 && (
        <ContentPaper>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <AccountCircleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Управление аккаунтами в разработке
            </Typography>
          </Box>
        </ContentPaper>
      )}
    
      
      {tabValue === 6 && renderKeysTab()}
      
      
      <Dialog open={verifyDialogOpen} onClose={() => setVerifyDialogOpen(false)}>
        <DialogTitle>Верификация пользователя</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="verification-level-label">Уровень верификации</InputLabel>
              <Select
                labelId="verification-level-label"
                id="verification-level"
                value={verificationLevel}
                onChange={(e) => setVerificationLevel(e.target.value)}
                label="Уровень верификации"
              >
                <MenuItem value={0}>
                  <em>Нет верификации</em>
                </MenuItem>
                <MenuItem value={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon sx={{ color: '#9e9e9e', mr: 1 }} />
                    Верифицирован
                  </Box>
                </MenuItem>
                <MenuItem value={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon sx={{ color: '#d67270', mr: 1 }} />
                    Официальный аккаунт
                  </Box>
                </MenuItem>
                <MenuItem value={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon sx={{ color: '#b39ddb', mr: 1 }} />
                    VIP аккаунт
                  </Box>
                </MenuItem>
                <MenuItem value={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon sx={{ color: '#ff9800', mr: 1 }} />
                    Модератор
                  </Box>
                </MenuItem>
                <MenuItem value={5}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon sx={{ color: '#4caf50', mr: 1 }} />
                    Поддержка
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            <Typography variant="caption" color="text.secondary">
              Верификация подтверждает, что данный аккаунт является официальным или имеет особый статус
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyDialogOpen(false)} color="inherit">Отмена</Button>
          <Button onClick={handleVerifyUser} color="primary" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>
      
      
      <Dialog open={badgeDialogOpen} onClose={() => setBadgeDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Выдать значок достижения</DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Пользователь: {selectedUser?.name} (@{selectedUser?.username})
            </Typography>
            
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Выберите значок</InputLabel>
              <Select
                value={selectedBadge}
                onChange={(e) => setSelectedBadge(e.target.value)}
                label="Выберите значок"
              >
                {achievements.map((badge) => (
                  <MenuItem key={badge.id} value={badge.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        component="img" 
                        src={badge.image_path} 
                        alt={badge.name}
                        sx={{ width: 30, height: 30, mr: 2, borderRadius: '50%' }}
                        onError={(e) => {
                          e.target.src = '/static/img/default-badge.png';
                        }}
                      />
                      <Typography>{badge.display_name}</Typography>
                      {badge.users_count > 0 && (
                        <Chip 
                          size="small" 
                          label={`${badge.users_count} пользователей`} 
                          color="primary" 
                          variant="outlined" 
                          sx={{ ml: 2 }} 
                        />
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBadgeDialogOpen(false)} color="inherit">Отмена</Button>
          <Button 
            onClick={handleGiveBadge} 
            color="primary" 
            variant="contained" 
            disabled={loading || !selectedBadge}
          >
            {loading ? <CircularProgress size={24} /> : 'Выдать значок'}
          </Button>
        </DialogActions>
      </Dialog>
      
      
      <Dialog open={banDialogOpen} onClose={() => setBanDialogOpen(false)}>
        <DialogTitle>
          {selectedUser?.is_banned ? 'Разблокировать пользователя' : 'Заблокировать пользователя'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Пользователь: {selectedUser?.name} ({selectedUser?.username})
            </Typography>
            
            {!selectedUser?.is_banned && (
              <TextField
                fullWidth
                label="Причина блокировки"
                multiline
                rows={4}
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                variant="outlined"
                sx={{ mt: 2 }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBanDialogOpen(false)} color="inherit">Отмена</Button>
          <Button 
            onClick={handleBanUser} 
            color={selectedUser?.is_banned ? "success" : "error"} 
            variant="contained" 
            disabled={loading || (!selectedUser?.is_banned && !banReason)}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : selectedUser?.is_banned ? (
              'Разблокировать'
            ) : (
              'Заблокировать'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      
      
      <Dialog open={deletePostDialogOpen} onClose={() => setDeletePostDialogOpen(false)}>
        <DialogTitle>Удалить пост</DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1">
              Вы действительно хотите удалить этот пост?
            </Typography>
            {selectedPost && (
              <Paper sx={{ p: 2, mt: 2, bgcolor: 'background.default' }}>
                <Typography variant="body2">{selectedPost.content}</Typography>
              </Paper>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletePostDialogOpen(false)} color="inherit">Отмена</Button>
          <Button onClick={handleDeletePost} color="error" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>
      
      
      <Dialog open={viewUserDialogOpen} onClose={() => setViewUserDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src={selectedUser?.photo ? `/static/uploads/avatar/${selectedUser?.id}/${selectedUser?.photo}` : undefined} 
              sx={{ mr: 2 }}
            />
            <Box>
              <Typography variant="h6">
                {selectedUser?.name}
                {selectedUser?.verification_status === 'verified' && (
                  <CheckCircleIcon 
                    sx={{ 
                      fontSize: 16, 
                      ml: 0.5, 
                      color: selectedUser?.verification_level === 1 ? '#9e9e9e' : 
                             selectedUser?.verification_level === 2 ? '#d67270' : 
                             selectedUser?.verification_level === 3 ? '#b39ddb' : 
                             selectedUser?.verification_level === 4 ? '#ff9800' : 
                             selectedUser?.verification_level === 5 ? '#4caf50' :
                             '#D0BCFF'
                    }} 
                  />
                )}
              </Typography>
              <Typography variant="caption" color="text.secondary">@{selectedUser?.username}</Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
            <Tab label="Посты" />
            <Tab label="Треки" />
            <Tab label="Общая информация" />
          </Tabs>
          
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Посты пользователя</Typography>
              {userPosts.length === 0 ? (
                <Typography variant="body1">У пользователя нет постов</Typography>
              ) : (
                <List>
                  {userPosts.map((post) => (
                    <React.Fragment key={post.id}>
                      <ListItem
                        secondaryAction={
                          <IconButton edge="end" onClick={() => openDeletePostDialog(post)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={post.content}
                          secondary={new Date(post.created_at).toLocaleString()}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          )}
          
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Загруженные треки</Typography>
              {userTracks.length === 0 ? (
                <Typography variant="body1">У пользователя нет загруженных треков</Typography>
              ) : (
                <List>
                  {userTracks.map((track) => (
                    <React.Fragment key={track.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <MusicNoteIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={track.title}
                          secondary={`Артист: ${track.artist} | Альбом: ${track.album}`}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Box>
          )}
          
          {tabValue === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Основная информация" />
                  <CardContent>
                    <Typography><strong>ID:</strong> {selectedUser?.id}</Typography>
                    <Typography><strong>Email:</strong> {selectedUser?.email || 'Не указан'}</Typography>
                    {selectedUser?.telegram_id && (
                      <Typography><strong>Telegram ID:</strong> {selectedUser?.telegram_id}</Typography>
                    )}
                    <Typography><strong>Дата регистрации:</strong> {new Date(selectedUser?.created_at).toLocaleString()}</Typography>
                    <Typography>
                      <strong>Статус:</strong> {' '}
                      {selectedUser?.is_banned ? (
                        <Chip size="small" label="Заблокирован" color="error" />
                      ) : (
                        <Chip size="small" label="Активен" color="success" />
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Статистика" />
                  <CardContent>
                    <Typography><strong>Подписчиков:</strong> {selectedUser?.followers_count || 0}</Typography>
                    <Typography><strong>Подписок:</strong> {selectedUser?.following_count || 0}</Typography>
                    <Typography><strong>Постов:</strong> {userPosts.length}</Typography>
                    <Typography><strong>Треков:</strong> {userTracks.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewUserDialogOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
      
      
      <Dialog open={deleteTrackDialogOpen} onClose={() => setDeleteTrackDialogOpen(false)}>
        <DialogTitle>Удалить трек</DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1">
              Вы действительно хотите удалить этот трек?
            </Typography>
            {selectedTrack && (
              <Paper sx={{ p: 2, mt: 2, bgcolor: 'background.default' }}>
                <Typography variant="body1" fontWeight="bold">{selectedTrack.title}</Typography>
                <Typography variant="body2">Артист: {selectedTrack.artist}</Typography>
                <Typography variant="body2">Альбом: {selectedTrack.album || 'Нет данных'}</Typography>
              </Paper>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTrackDialogOpen(false)} color="inherit">Отмена</Button>
          <Button onClick={confirmDeleteTrack} color="error" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>
      
      
      <Dialog open={moderatorDialogOpen} onClose={() => setModeratorDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {isModerator(selectedUser?.id) 
            ? 'Редактирование прав модератора' 
            : 'Назначить модератором'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Пользователь: {selectedUser?.name} (@{selectedUser?.username})
            </Typography>
            
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              <ListAltIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Выберите права доступа
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset">
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Управление контентом
                  </Typography>
                  
                  <FormControlLabel 
                    control={
                      <Checkbox
                        checked={selectedPermissions.delete_posts}
                        onChange={(e) => setSelectedPermissions({
                          ...selectedPermissions,
                          delete_posts: e.target.checked
                        })}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography>Удаление постов</Typography>
                      </Box>
                    }
                  />
                  
                  <FormControlLabel 
                    control={
                      <Checkbox
                        checked={selectedPermissions.delete_music}
                        onChange={(e) => setSelectedPermissions({
                          ...selectedPermissions,
                          delete_music: e.target.checked
                        })}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MusicNoteIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography>Удаление музыки</Typography>
                      </Box>
                    }
                  />
                  
                  <FormControlLabel 
                    control={
                      <Checkbox
                        checked={selectedPermissions.delete_comments}
                        onChange={(e) => setSelectedPermissions({
                          ...selectedPermissions,
                          delete_comments: e.target.checked
                        })}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CommentIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography>Удаление комментариев</Typography>
                      </Box>
                    }
                  />
                  
                  <FormControlLabel 
                    control={
                      <Checkbox
                        checked={selectedPermissions.delete_avatar}
                        onChange={(e) => setSelectedPermissions({
                          ...selectedPermissions,
                          delete_avatar: e.target.checked
                        })}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhotoIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography>Удаление аватаров</Typography>
                      </Box>
                    }
                  />
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset">
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Управление пользователями и баг-репортами
                  </Typography>
                  
                  <FormControlLabel 
                    control={
                      <Checkbox
                        checked={selectedPermissions.change_user_name}
                        onChange={(e) => setSelectedPermissions({
                          ...selectedPermissions,
                          change_user_name: e.target.checked
                        })}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BadgeIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography>Изменение имени пользователя</Typography>
                      </Box>
                    }
                  />
                  
                  <FormControlLabel 
                    control={
                      <Checkbox
                        checked={selectedPermissions.change_username}
                        onChange={(e) => setSelectedPermissions({
                          ...selectedPermissions,
                          change_username: e.target.checked
                        })}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccountCircleIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography>Изменение username</Typography>
                      </Box>
                    }
                  />
                  
                  <FormControlLabel 
                    control={
                      <Checkbox
                        checked={selectedPermissions.manage_bug_reports}
                        onChange={(e) => setSelectedPermissions({
                          ...selectedPermissions,
                          manage_bug_reports: e.target.checked
                        })}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DoneIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography>Изменение статуса баг-репорта</Typography>
                      </Box>
                    }
                  />
                  
                  <FormControlLabel 
                    control={
                      <Checkbox
                        checked={selectedPermissions.delete_bug_reports}
                        onChange={(e) => setSelectedPermissions({
                          ...selectedPermissions,
                          delete_bug_reports: e.target.checked
                        })}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ErrorIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography>Удаление баг-репортов</Typography>
                      </Box>
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModeratorDialogOpen(false)} color="inherit">Отмена</Button>
          {isModerator(selectedUser?.id) ? (
            <>
              <Button 
                onClick={handleUpdateModeratorPermissions} 
                color="primary" 
                variant="contained" 
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Обновить права'}
              </Button>
              <Button 
                onClick={handleToggleModeratorStatus} 
                color="error" 
                variant="outlined" 
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Снять модератора'}
              </Button>
            </>
          ) : (
            <Button 
              onClick={handleToggleModeratorStatus} 
              color="primary" 
              variant="contained" 
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Назначить модератором'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification(prev => ({ ...prev, open: false }))} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    
    
    {keyGenerationDialog}
    </Container>
  );
};

export default AdminPage; 