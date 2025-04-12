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
  Switch
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
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
import axios from 'axios';

// Styled components
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
  
  // Dialog states
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [deletePostDialogOpen, setDeletePostDialogOpen] = useState(false);
  const [deleteTrackDialogOpen, setDeleteTrackDialogOpen] = useState(false);
  const [viewUserDialogOpen, setViewUserDialogOpen] = useState(false);
  const [moderatorDialogOpen, setModeratorDialogOpen] = useState(false);
  
  // Form states
  const [verificationLevel, setVerificationLevel] = useState(1);
  const [selectedBadge, setSelectedBadge] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [banReason, setBanReason] = useState('');
  
  // Moderator permissions states
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
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Notification
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Authorization check
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
    // Загружаем данные в зависимости от выбранной вкладки
    if (tabValue === 1) {
      fetchAllPosts();
    } else if (tabValue === 2) {
      fetchAllTracks();
    }
  }, [tabValue]);
  
  // Загрузка всех постов
  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      // Получаем последние 50 постов со всего сайта
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
  
  // Загрузка всех треков
  const fetchAllTracks = async () => {
    try {
      setLoading(true);
      // Получаем все треки
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
  
  // Load users based on search query or get all users
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
  
  // Load all achievements from database
  const fetchAllAchievements = async () => {
    try {
      const response = await axios.get('/api/admin/badge-types');
      setAchievements(response.data.badge_types || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
      showNotification('error', 'Не удалось загрузить доступные значки');
    }
  };
  
  // Load user posts for selected user
  const fetchUserPosts = async (userId) => {
    try {
      const response = await axios.get(`/api/admin/users/${userId}/posts`);
      setUserPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      showNotification('error', 'Не удалось загрузить посты пользователя');
    }
  };
  
  // Load user tracks for selected user
  const fetchUserTracks = async (userId) => {
    try {
      const response = await axios.get(`/api/admin/users/${userId}/tracks`);
      setUserTracks(response.data.tracks || []);
    } catch (error) {
      console.error('Error fetching user tracks:', error);
      showNotification('error', 'Не удалось загрузить треки пользователя');
    }
  };
  
  // Fetch all moderators
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
  
  // Fetch bug reports
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
  
  // Show notification
  const showNotification = (severity, message) => {
    setNotification({
      open: true,
      message,
      severity: severity
    });
  };
  
  // Tab handling
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle search
  const handleSearch = () => {
    fetchUsers();
  };
  
  // Verify user
  const handleVerifyUser = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/admin/users/${selectedUser.id}/verify`, {
        verification_level: verificationLevel
      });
      
      if (response.data.success) {
        showNotification('success', 'Статус верификации пользователя обновлен');
        // Update user in list
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
  
  // Give badge to user
  const handleGiveBadge = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/admin/users/${selectedUser.id}/give-achievement`, {
        badge_type_id: selectedBadge
      });
      
      if (response.data.success) {
        showNotification('success', 'Достижение успешно выдано пользователю');
        // Update user in list if needed
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
  
  // Ban user
  const handleBanUser = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/admin/users/${selectedUser.id}/ban`, {
        reason: banReason,
        is_banned: !selectedUser.is_banned // Toggle ban status
      });
      
      if (response.data.success) {
        showNotification('success', selectedUser.is_banned ? 'Пользователь разблокирован' : 'Пользователь заблокирован');
        // Update user in list
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
  
  // Delete post
  const handleDeletePost = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/admin/posts/${selectedPost.id}`);
      
      if (response.data.success) {
        showNotification('success', 'Пост успешно удален');
        // Update posts list
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
  
  // Open verify dialog
  const openVerifyDialog = (user) => {
    setSelectedUser(user);
    setVerificationLevel(user.verification_level || 1);
    setVerifyDialogOpen(true);
  };
  
  // Open badge dialog
  const openBadgeDialog = (user) => {
    setSelectedUser(user);
    setSelectedBadge('');
    setBadgeDialogOpen(true);
  };
  
  // Open ban dialog
  const openBanDialog = (user) => {
    setSelectedUser(user);
    setBanReason('');
    setBanDialogOpen(true);
  };
  
  // Open delete post dialog
  const openDeletePostDialog = (post) => {
    setSelectedPost(post);
    setDeletePostDialogOpen(true);
  };
  
  // Удаление трека
  const handleDeleteTrack = async (trackId) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/admin/tracks/${trackId}`);
      
      if (response.data.success) {
        showNotification('success', 'Трек успешно удален');
        // Обновляем список треков
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
  
  // Диалог подтверждения удаления трека
  const openDeleteTrackDialog = (track) => {
    setSelectedTrack(track);
    setDeleteTrackDialogOpen(true);
  };
  
  // Подтверждение удаления трека
  const confirmDeleteTrack = () => {
    if (selectedTrack) {
      handleDeleteTrack(selectedTrack.id);
      setDeleteTrackDialogOpen(false);
    }
  };
  
  // Toggle moderator status
  const handleToggleModeratorStatus = async () => {
    try {
      setLoading(true);
      const isCurrentlyModerator = isModerator(selectedUser.id);
      
      let response;
      if (isCurrentlyModerator) {
        // Remove moderator status
        response = await axios.delete(`/api/admin/moderators/${selectedUser.id}`);
        if (response.data.success) {
          showNotification('success', 'Модераторские права отозваны');
          setModerators(moderators.filter(mod => mod.user_id !== selectedUser.id));
        }
      } else {
        // Add moderator with selected permissions
        response = await axios.post('/api/admin/moderators', {
          user_id: selectedUser.id,
          permissions: selectedPermissions
        });
        
        if (response.data.success) {
          showNotification('success', 'Пользователь назначен модератором');
          // Add new moderator to the list
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
  
  // Update moderator permissions
  const handleUpdateModeratorPermissions = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/admin/moderators/${selectedUser.id}`, {
        permissions: selectedPermissions
      });
      
      if (response.data.success) {
        showNotification('success', 'Права модератора обновлены');
        // Update moderator in the list
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
  
  // Open moderator dialog
  const openModeratorDialog = (user) => {
    setSelectedUser(user);
    
    // Check if user is already a moderator
    const existingModerator = moderators.find(mod => mod.user_id === user.id);
    
    if (existingModerator) {
      // Set permissions from existing moderator
      setSelectedPermissions(existingModerator.permissions);
    } else {
      // Set default permissions (all false)
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
  
  // Check if user is moderator
  const isModerator = (userId) => {
    return moderators.some(mod => mod.user_id === userId);
  };
  
  // Update bug report status
  const handleUpdateBugReportStatus = async (reportId, status) => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/admin/bug-reports/${reportId}`, {
        status
      });
      
      if (response.data.success) {
        showNotification('success', 'Статус баг-репорта обновлен');
        // Update bug report in list
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
  
  // Delete bug report
  const handleDeleteBugReport = async (reportId) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/admin/bug-reports/${reportId}`);
      
      if (response.data.success) {
        showNotification('success', 'Баг-репорт успешно удален');
        // Remove bug report from list
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
  
  // Функция для добавления модератора
  const handleAddModerator = async () => {
    setLoading(true);
    
    try {
      // Используем оригинальный URL, который поддерживается сервером
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
        
        // Формируем подробное сообщение об ошибке
        let errorMessage = data.error || 'Неизвестная ошибка';
        
        // Если есть дополнительная отладочная информация, отображаем её
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

      // Модератор успешно добавлен/обновлен
      showNotification('success', data.message || 'Модератор успешно добавлен');
      
      // Обновляем список модераторов
      fetchModerators();
      
      // Закрываем диалог
      handleCloseModeratorDialog();
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
      showNotification('error', `Произошла ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Render users table
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
                        e.target.onerror = null; // Prevent infinite recursion
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
  
  // Render moderators table
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
  
  // Render bug reports table
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
  
  return (
    <Container maxWidth="xl">
      <PageHeader>
        <AdminPanelSettingsIcon sx={{ fontSize: 40, mr: 2 }} />
        <Typography variant="h4" component="h1">
          Панель администратора
        </Typography>
      </PageHeader>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<PeopleIcon />} label="Пользователи" />
          <Tab icon={<PostAddIcon />} label="Посты" />
          <Tab icon={<MusicNoteIcon />} label="Треки" />
          <Tab icon={<SecurityIcon />} label="Модераторы" />
          <Tab icon={<BugReportIcon />} label="Баг-репорты" />
        </Tabs>
      </Paper>
        
      {/* Users Tab */}
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
        
      {/* Posts Tab */}
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
        
      {/* Tracks Tab */}
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
      
      {/* Moderators Tab */}
      {tabValue === 3 && renderModeratorsTable()}
      
      {/* Bug Reports Tab */}
      {tabValue === 4 && renderBugReportsTable()}
      
      {/* Verify User Dialog */}
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
      
      {/* Give Badge Dialog */}
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
      
      {/* Ban User Dialog */}
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
      
      {/* Delete Post Dialog */}
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
      
      {/* View User Dialog */}
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
      
      {/* Delete Track Dialog */}
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
      
      {/* Moderator Dialog */}
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
      
      {/* Snackbar for notifications */}
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
    </Container>
  );
};

export default AdminPage; 