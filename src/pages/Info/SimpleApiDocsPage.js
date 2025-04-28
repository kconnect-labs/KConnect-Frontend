import React from 'react';
import {
  Box,
  Container,
  Typography,
  Divider,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ApiIcon from '@mui/icons-material/Api';
import HttpIcon from '@mui/icons-material/Http';
import CodeIcon from '@mui/icons-material/Code';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import StorefrontIcon from '@mui/icons-material/Storefront';
const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
}));
const ApiTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  padding: theme.spacing(1, 0),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  }
}));
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  }
}));
const ApiCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(2),
  overflow: 'visible',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
  }
}));
const MethodChip = styled(Chip)(({ theme, method }) => {
  const colors = {
    GET: {
      bg: '#e3f2fd',
      color: '#1565c0'
    },
    POST: {
      bg: '#e8f5e9',
      color: '#2e7d32'
    },
    PUT: {
      bg: '#fff8e1',
      color: '#f57f17'
    },
    DELETE: {
      bg: '#ffebee',
      color: '#c62828'
    },
    PATCH: {
      bg: '#e0f7fa',
      color: '#00838f'
    }
  };
  const defaultColor = {
    bg: alpha(theme.palette.text.primary, 0.1),
    color: theme.palette.text.primary
  };
  const color = colors[method] || defaultColor;
  return {
    backgroundColor: theme.palette.mode === 'dark' ? alpha(color.color, 0.2) : color.bg,
    color: color.color,
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 24,
  };
});
const EndpointPath = styled(Typography)(({ theme }) => ({
  fontFamily: 'monospace',
  padding: theme.spacing(0.5, 1),
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  borderRadius: theme.spacing(0.5),
  fontSize: '0.9rem',
  fontWeight: 500,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1)
}));
const CodeBlock = styled(Box)(({ theme }) => ({
  fontFamily: 'monospace',
  fontSize: '0.9rem',
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.default, 0.4) : alpha(theme.palette.background.default, 0.7),
  borderRadius: theme.spacing(1),
  overflowX: 'auto',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  '&::-webkit-scrollbar': {
    height: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    borderRadius: '2px',
  }
}));
const ApiEndpoint = ({ method, path, description, authRequired, request, response }) => {
  const theme = useTheme();
  return (
    <ApiCard elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <MethodChip 
            label={method} 
            method={method}
            size="small"
            sx={{ mr: 2 }}
          />
          <EndpointPath>
          </EndpointPath>
          {authRequired && (
            <Chip 
              icon={<LockIcon fontSize="small" />}
              label="Требуется авторизация"
              size="small"
              sx={{ ml: 2, fontSize: '0.7rem' }}
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
          <HttpIcon fontSize="small" sx={{ mr: 1 }} />
          Пример запроса:
        </Typography>
        <CodeBlock>
        </CodeBlock>
        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center' }}>
          <CodeIcon fontSize="small" sx={{ mr: 1 }} />
          Пример ответа:
        </Typography>
        <CodeBlock>
        </CodeBlock>
      </CardContent>
    </ApiCard>
  );
};
const SimpleApiDocsPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = React.useState(0);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  return (
    <PageContainer maxWidth="lg">
      <ApiTitle variant="h4">
        <ApiIcon fontSize="large" />
        Документация API К-Коннект
      </ApiTitle>
      <Typography variant="body1" paragraph>
        Здесь вы найдете документацию по API К-Коннект с примерами запросов и ответов.
        API позволяет взаимодействовать с системой программно для разработки собственных интеграций.
      </Typography>
      <Paper sx={{ borderRadius: theme.spacing(2), mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2 }}
        >
          <Tab label="Авторизация" sx={{ textTransform: 'none', fontWeight: 500 }} />
          <Tab label="Профиль" sx={{ textTransform: 'none', fontWeight: 500 }} />
          <Tab label="Посты" sx={{ textTransform: 'none', fontWeight: 500 }} />
          <Tab label="Комментарии" sx={{ textTransform: 'none', fontWeight: 500 }} />
          <Tab label="Уведомления" sx={{ textTransform: 'none', fontWeight: 500 }} />
          <Tab label="Лидерборд" sx={{ textTransform: 'none', fontWeight: 500 }} />
          <Tab label="Поиск" sx={{ textTransform: 'none', fontWeight: 500 }} />
          <Tab label="Музыка" sx={{ textTransform: 'none', fontWeight: 500 }} />
          <Tab label="Магазин бейджиков" sx={{ textTransform: 'none', fontWeight: 500 }} />
        </Tabs>
      </Paper>
      {activeTab === 0 && (
        <>
          <Box sx={{ 
            mb: 4, 
            p: 3, 
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.primary.main, 0.03),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6">Общая информация об авторизации</Typography>
            </Box>
            <Typography variant="body2" paragraph>
              В К-Коннект используется авторизация через cookie-сессии. После успешного входа, сервер устанавливает HTTP-only cookie с JWT-токеном, который автоматически отправляется с каждым последующим запросом. Безопасность обеспечивается использованием HTTP-only cookies, проверкой источника запроса и другими механизмами защиты.
            </Typography>
            <SectionTitle variant="subtitle2">Авторизация и сессии</SectionTitle>
            <ul>
              <li>Для авторизации используется JWT-токен, который хранится в HTTP-only cookie</li>
              <li>После успешного входа в систему, токен будет автоматически включаться с каждым последующим запросом</li>
              <li>Безопасность обеспечивается через использование HTTP-only cookies и проверку источника запроса</li>
            </ul>
            <SectionTitle variant="subtitle2">Процесс авторизации:</SectionTitle>
            <ol>
              <li>Выполните запрос на <code>/api/auth/login</code> с указанием логина и пароля</li>
              <li>При успешной авторизации сервер вернет токен в HTTP-only cookie</li>
              <li>Для запросов, требующих авторизации, токен будет автоматически включаться в запрос</li>
            </ol>
          </Box>
          <ApiEndpoint 
            method="POST"
            path="/api/auth/login"
            description="Авторизация пользователя в системе. Успешный вход устанавливает cookie для сессии."
            authRequired={false}
            request={
`POST /api/auth/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password"
}`
            }
            response={
`{
  "success": true,
  "user": {
    "id": 123,
    "username": "username",
    "name": "Имя Пользователя",
    "photo": "/static/uploads/avatar/123/photo.jpg",
    "is_admin": false
  }
}`
            }
          />
          <ApiEndpoint 
            method="POST"
            path="/api/auth/logout"
            description="Выход из системы и удаление сессии."
            authRequired={true}
            request={
`POST /api/auth/logout`
            }
            response={
`{
  "success": true,
  "message": "Logged out successfully"
}`
            }
          />
          <ApiEndpoint 
            method="POST"
            path="/api/auth/register"
            description="Регистрация нового пользователя."
            authRequired={false}
            request={
`POST /api/auth/register
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password",
  "name": "Имя Пользователя",
  "username": "username"
}`
            }
            response={
`{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": 123,
    "username": "username",
    "email": "user@example.com"
  }
}`
            }
          />
          <ApiEndpoint 
            method="GET"
            path="/api/auth/check"
            description="Проверка текущего статуса авторизации."
            authRequired={false}
            request={
`GET /api/auth/check`
            }
            response={
`{
  "authenticated": true,
  "user": {
    "id": 123,
    "username": "username",
    "name": "Имя Пользователя",
    "photo": "/static/uploads/avatar/123/photo.jpg"
  }
}`
            }
          />
        </>
      )}
      {activeTab === 1 && (
        <>
          <SectionTitle variant="h5">
            <ApiIcon fontSize="medium" sx={{ mr: 1 }} />
            API профиля пользователя
          </SectionTitle>
          <ApiEndpoint 
            method="GET"
            path="/api/profile/:username"
            description="Получение информации о профиле пользователя по username."
            authRequired={false}
            request={
`GET /api/profile/username`
            }
            response={
`{
  "user": {
    "id": 123,
    "username": "username",
    "name": "Имя Пользователя",
    "photo": "/static/uploads/avatar/123/photo.jpg",
    "about": "Информация о пользователе",
    "created_at": "2023-05-20T12:00:00Z",
    "followers_count": 42,
    "following_count": 21,
    "posts_count": 15,
    "verified": true,
    "is_followed": false
  }
}`
            }
          />
          <ApiEndpoint 
            method="PUT"
            path="/api/profile/edit"
            description="Обновление информации о своем профиле."
            authRequired={true}
            request={
`PUT /api/profile/edit
Content-Type: application/json
{
  "name": "Новое имя",
  "about": "Новая информация о себе",
  "status": "Новый статус"
}`
            }
            response={
`{
  "success": true,
  "user": {
    "id": 123,
    "username": "username",
    "name": "Новое имя",
    "about": "Новая информация о себе",
    "status": "Новый статус"
  }
}`
            }
          />
          <ApiEndpoint 
            method="POST"
            path="/api/profile/:username/follow"
            description="Подписка на пользователя."
            authRequired={true}
            request={
`POST /api/profile/username/follow`
            }
            response={
`{
  "success": true,
  "message": "Вы подписались на пользователя",
  "is_followed": true,
  "followers_count": 43
}`
            }
          />
          <ApiEndpoint 
            method="POST"
            path="/api/profile/:username/unfollow"
            description="Отписка от пользователя."
            authRequired={true}
            request={
`POST /api/profile/username/unfollow`
            }
            response={
`{
  "success": true,
  "message": "Вы отписались от пользователя",
  "is_followed": false,
  "followers_count": 42
}`
            }
          />
          <ApiEndpoint 
            method="GET"
            path="/api/profile/:username/followers"
            description="Получение списка подписчиков пользователя."
            authRequired={false}
            request={
`GET /api/profile/username/followers?page=1&per_page=20`
            }
            response={
`{
  "followers": [
    {
      "id": 124,
      "username": "follower1",
      "name": "Подписчик 1",
      "photo": "/static/uploads/avatar/124/photo.jpg",
      "is_followed": true
    },
  ],
  "total": 42,
  "page": 1,
  "pages": 3
}`
            }
          />
          <ApiEndpoint 
            method="GET"
            path="/api/profile/:username/following"
            description="Получение списка подписок пользователя."
            authRequired={false}
            request={
`GET /api/profile/username/following?page=1&per_page=20`
            }
            response={
`{
  "following": [
    {
      "id": 126,
      "username": "following1",
      "name": "Подписка 1",
      "photo": "/static/uploads/avatar/126/photo.jpg",
      "is_followed": true
    },
  ],
  "total": 21,
  "page": 1,
  "pages": 2
}`
            }
          />
        </>
      )}
      {activeTab === 2 && (
        <>
          <SectionTitle variant="h5">
            <ApiIcon fontSize="medium" sx={{ mr: 1 }} />
            API постов
          </SectionTitle>
          <ApiEndpoint 
            method="GET"
            path="/api/posts"
            description="Получение списка постов. По умолчанию возвращает глобальную ленту."
            authRequired={false}
            request={
`GET /api/posts?page=1&per_page=20`
            }
            response={
`{
  "posts": [
    {
      "id": 456,
      "text": "Пример текста поста",
      "author": {
        "id": 123,
        "username": "author",
        "name": "Автор поста",
        "photo": "/static/uploads/avatar/123/photo.jpg"
      },
      "created_at": "2023-05-20T12:00:00Z",
      "likes_count": 10,
      "comments_count": 5,
      "is_liked": false,
      "media": ["/static/uploads/post/456/image.jpg"]
    }
  ],
  "total": 50,
  "page": 1,
  "pages": 3
}`
            }
          />
          <ApiEndpoint 
            method="GET"
            path="/api/posts/feed"
            description="Получение персонализированной ленты постов (от тех, на кого подписан пользователь)."
            authRequired={true}
            request={
`GET /api/posts/feed?page=1&per_page=20`
            }
            response={
`{
  "posts": [
    {
      "id": 457,
      "text": "Пост из ленты подписок",
      "author": {
        "id": 124,
        "username": "followed",
        "name": "Пользователь из подписок",
        "photo": "/static/uploads/avatar/124/photo.jpg"
      },
      "created_at": "2023-05-20T13:00:00Z",
      "likes_count": 15,
      "comments_count": 3,
      "is_liked": true,
      "media": []
    }
  ],
  "total": 30,
  "page": 1,
  "pages": 2
}`
            }
          />
          <ApiEndpoint 
            method="GET"
            path="/api/posts/:post_id"
            description="Получение детальной информации о конкретном посте."
            authRequired={false}
            request={
`GET /api/posts/456`
            }
            response={
`{
  "post": {
    "id": 456,
    "text": "Пример текста поста",
    "author": {
      "id": 123,
      "username": "author",
      "name": "Автор поста",
      "photo": "/static/uploads/avatar/123/photo.jpg"
    },
    "created_at": "2023-05-20T12:00:00Z",
    "likes_count": 10,
    "comments_count": 5,
    "is_liked": false,
    "media": ["/static/uploads/post/456/image.jpg"],
    "comments": [
      {
        "id": 789,
        "text": "Комментарий к посту",
        "author": {
          "id": 125,
          "username": "commenter",
          "name": "Комментатор",
          "photo": "/static/uploads/avatar/125/photo.jpg"
        },
        "created_at": "2023-05-20T12:30:00Z",
        "likes_count": 2,
        "is_liked": false
      }
    ]
  }
}`
            }
          />
          <ApiEndpoint 
            method="POST"
            path="/api/posts"
            description="Создание нового поста."
            authRequired={true}
            request={
`POST /api/posts
Content-Type: application/json
{
  "text": "Текст нового поста",
  "media": ["/static/uploads/post/temp/image.jpg"]
}`
            }
            response={
`{
  "success": true,
  "post": {
    "id": 458,
    "text": "Текст нового поста",
    "author": {
      "id": 123,
      "username": "author",
      "name": "Автор поста",
      "photo": "/static/uploads/avatar/123/photo.jpg"
    },
    "created_at": "2023-05-20T14:00:00Z",
    "likes_count": 0,
    "comments_count": 0,
    "is_liked": false,
    "media": ["/static/uploads/post/458/image.jpg"]
  }
}`
            }
          />
          <ApiEndpoint 
            method="DELETE"
            path="/api/posts/:post_id"
            description="Удаление поста. Доступно только автору поста или администратору."
            authRequired={true}
            request={
`DELETE /api/posts/458`
            }
            response={
`{
  "success": true,
  "message": "Пост успешно удален"
}`
            }
          />
          <ApiEndpoint 
            method="POST"
            path="/api/posts/:post_id/like"
            description="Лайк поста."
            authRequired={true}
            request={
`POST /api/posts/456/like`
            }
            response={
`{
  "success": true,
  "is_liked": true,
  "likes_count": 11
}`
            }
          />
          <ApiEndpoint 
            method="POST"
            path="/api/posts/:post_id/unlike"
            description="Удаление лайка с поста."
            authRequired={true}
            request={
`POST /api/posts/456/unlike`
            }
            response={
`{
  "success": true,
  "is_liked": false,
  "likes_count": 10
}`
            }
          />
        </>
      )}
      {activeTab === 3 && (
        <>
          <SectionTitle variant="h5">
            <ApiIcon fontSize="medium" sx={{ mr: 1 }} />
            API комментариев
          </SectionTitle>
          <ApiEndpoint 
            method="GET"
            path="/api/posts/:post_id/comments"
            description="Получение списка комментариев к посту."
            authRequired={false}
            request={
`GET /api/posts/456/comments?page=1&per_page=20`
            }
            response={
`{
  "comments": [
    {
      "id": 789,
      "text": "Комментарий к посту",
      "author": {
        "id": 125,
        "username": "commenter",
        "name": "Комментатор",
        "photo": "/static/uploads/avatar/125/photo.jpg"
      },
      "created_at": "2023-05-20T12:30:00Z",
      "likes_count": 2,
      "is_liked": false
    }
  ],
  "total": 5,
  "page": 1,
  "pages": 1
}`
            }
          />
          <ApiEndpoint 
            method="POST"
            path="/api/posts/:post_id/comments"
            description="Добавление комментария к посту."
            authRequired={true}
            request={
`POST /api/posts/456/comments
Content-Type: application/json
{
  "text": "Текст нового комментария"
}`
            }
            response={
`{
  "success": true,
  "comment": {
    "id": 790,
    "text": "Текст нового комментария",
    "author": {
      "id": 123,
      "username": "author",
      "name": "Автор комментария",
      "photo": "/static/uploads/avatar/123/photo.jpg"
    },
    "created_at": "2023-05-20T14:30:00Z",
    "likes_count": 0,
    "is_liked": false
  }
}`
            }
          />
          <ApiEndpoint 
            method="DELETE"
            path="/api/comments/:comment_id"
            description="Удаление комментария. Доступно только автору комментария или администратору."
            authRequired={true}
            request={
`DELETE /api/comments/790`
            }
            response={
`{
  "success": true,
  "message": "Комментарий успешно удален"
}`
            }
          />
          <ApiEndpoint 
            method="POST"
            path="/api/comments/:comment_id/like"
            description="Лайк комментария."
            authRequired={true}
            request={
`POST /api/comments/789/like`
            }
            response={
`{
  "success": true,
  "is_liked": true,
  "likes_count": 3
}`
            }
          />
          <ApiEndpoint 
            method="POST"
            path="/api/comments/:comment_id/unlike"
            description="Удаление лайка с комментария."
            authRequired={true}
            request={
`POST /api/comments/789/unlike`
            }
            response={
`{
  "success": true,
  "is_liked": false,
  "likes_count": 2
}`
            }
          />
        </>
      )}
      {activeTab === 4 && (
        <>
          <SectionTitle variant="h5">
            <ApiIcon fontSize="medium" sx={{ mr: 1 }} />
            API уведомлений
          </SectionTitle>
          <ApiEndpoint 
            method="GET"
            path="/api/notifications"
            description="Получение списка уведомлений текущего пользователя."
            authRequired={true}
            request={
`GET /api/notifications?page=1&per_page=20`
            }
            response={
`{
  "notifications": [
    {
      "id": 321,
      "type": "like",
      "text": "Пользователь лайкнул ваш пост",
      "is_read": false,
      "created_at": "2023-05-20T12:00:00Z",
      "link": "/post/456",
      "from_user": {
        "id": 125,
        "username": "liker",
        "name": "Пользователь",
        "photo": "/static/uploads/avatar/125/photo.jpg"
      }
    },
    {
      "id": 322,
      "type": "comment",
      "text": "Пользователь прокомментировал ваш пост",
      "is_read": true,
      "created_at": "2023-05-20T11:30:00Z",
      "link": "/post/456",
      "from_user": {
        "id": 126,
        "username": "commenter",
        "name": "Комментатор",
        "photo": "/static/uploads/avatar/126/photo.jpg"
      }
    }
  ],
  "unread_count": 1,
  "total": 10,
  "page": 1,
  "pages": 1
}`
            }
          />
          <ApiEndpoint 
            method="POST"
            path="/api/notifications/read-all"
            description="Пометить все уведомления как прочитанные."
            authRequired={true}
            request={
`POST /api/notifications/read-all`
            }
            response={
`{
  "success": true,
  "message": "Все уведомления помечены как прочитанные",
  "unread_count": 0
}`
            }
          />
          <ApiEndpoint 
            method="POST"
            path="/api/notifications/:notification_id/read"
            description="Пометить конкретное уведомление как прочитанное."
            authRequired={true}
            request={
`POST /api/notifications/321/read`
            }
            response={
`{
  "success": true,
  "message": "Уведомление помечено как прочитанное",
  "unread_count": 0
}`
            }
          />
          <ApiEndpoint 
            method="POST"
            path="/api/push/subscribe"
            description="Подписка на push-уведомления."
            authRequired={true}
            request={
`POST /api/push/subscribe
Content-Type: application/json
{
  "subscription": {
    "endpoint": "https:
    "keys": {
      "p256dh": "...",
      "auth": "..."
    }
  }
}`
            }
            response={
`{
  "success": true,
  "message": "Подписка на push-уведомления успешно создана"
}`
            }
          />
          <ApiEndpoint 
            method="DELETE"
            path="/api/push/unsubscribe"
            description="Отписка от push-уведомлений."
            authRequired={true}
            request={
`DELETE /api/push/unsubscribe
Content-Type: application/json
{
  "endpoint": "https:
}`
            }
            response={
`{
  "success": true,
  "message": "Подписка на push-уведомления успешно удалена"
}`
            }
          />
          <ApiEndpoint
            method="POST"
            path="/api/notifications/test"
            description="Отправка тестового push-уведомления текущему пользователю."
            authRequired={true}
            request={`POST /api/notifications/test
Content-Type: application/json
{
  "title": "Тестовое уведомление",
  "body": "Это тестовое push-уведомление",
  "url": "/notifications"
}`}
            response={`{
  "success": true,
  "message": "Тестовое уведомление отправлено"
}`}
          />
        </>
      )}
      {activeTab === 5 && (
        <>
          <ApiTitle>
            <PeopleIcon fontSize="large" />
            Лидерборд
          </ApiTitle>
          <SectionTitle>Лидерборд пользователей и расчет очков</SectionTitle>
          <ApiEndpoint
            method="GET"
            path="/api/leaderboard"
            description="Получение рейтинга пользователей по их активности за определенный период."
            authRequired={false}
            request={`GET /api/leaderboard?period=week`}
            response={`{
  "leaderboard": [
    {
      "user_id": 123,
      "name": "Пользователь",
      "username": "username",
      "avatar_url": "/static/uploads/avatar/123/photo.jpg",
      "score": 250,
      "verification": {
        "status": 1
      },
      "achievement": {
        "bage": "Название достижения",
        "image_path": "badge.svg"
      }
    },
  ],
  "period": "week",
  "total": 25,
  "page": 1,
  "pages": 3
}`}
          />
          <ApiEndpoint
            method="GET"
            path="/api/leaderboard/user/:user_id"
            description="Получение статистики конкретного пользователя в лидерборде."
            authRequired={false}
            request={`GET /api/leaderboard/user/123`}
            response={`{
  "user_id": 123,
  "name": "Пользователь",
  "username": "username",
  "avatar_url": "/static/uploads/avatar/123/photo.jpg",
  "rank": {
    "week": 5,
    "month": 7,
    "all_time": 15
  },
  "score": {
    "week": 120,
    "month": 350,
    "all_time": 1200
  },
  "stats": {
    "posts_count": 15,
    "likes_received": 73,
    "comments_count": 42,
    "comment_likes": 25,
    "replies_count": 18,
    "reply_likes": 11,
    "reposts_count": 7
  }
}`}
          />
        </>
      )}
      {activeTab === 6 && (
        <>
          <ApiTitle>
            <SearchIcon fontSize="large" />
            Поиск
          </ApiTitle>
          <ApiEndpoint
            method="GET"
            path="/api/search"
            description="Поиск пользователей и постов по запросу."
            authRequired={false}
            request={`GET /api/search?q=запрос&type=all&page=1&per_page=10`}
            response={`{
  "users": [
  ],
  "posts": [
    {
      "id": 456,
      "content": "Текст поста, содержащий запрос",
      "timestamp": "2023-06-15T14:30:45",
      "image": "/static/uploads/post/456/image.jpg",
      "video": null,
      "user": {
        "id": 123,
        "name": "Пользователь",
        "username": "username",
        "photo": "/static/uploads/avatar/123/avatar.png"
      }
    }
  ]
}`}
          />
          <ApiEndpoint
            method="GET"
            path="/api/search"
            description="Поиск только пользователей."
            authRequired={false}
            request={`GET /api/search?q=запрос&type=users&page=1&per_page=20`}
            response={`{
  "users": [
  ],
  "has_next": true,
  "total": 35,
  "page": 1,
  "pages": 2
}`}
          />
          <ApiEndpoint
            method="GET"
            path="/api/search"
            description="Поиск только постов."
            authRequired={false}
            request={`GET /api/search?q=запрос&type=posts&page=1&per_page=20`}
            response={`{
  "posts": [
    {
      "id": 456,
      "content": "Текст поста, содержащий запрос",
      "timestamp": "2023-06-15T14:30:45",
      "image": "/static/uploads/post/456/image.jpg",
      "video": null,
      "user": {
        "id": 123,
        "name": "Пользователь",
        "username": "username",
        "photo": "/static/uploads/avatar/123/avatar.png"
      }
    }
  ],
  "has_next": true,
  "total": 42,
  "page": 1,
  "pages": 3
}`}
          />
        </>
      )}
      {activeTab === 7 && (
        <>
          <ApiTitle>
            <QueueMusicIcon fontSize="large" />
            Музыка
          </ApiTitle>
          <ApiEndpoint
            method="GET"
            path="/api/music"
            description="Получение списка всей музыки с пагинацией."
            authRequired={false}
            request={`GET /api/music?page=1&per_page=20`}
            response={`{
  "success": true,
  "tracks": [
  ],
  "total": 100,
  "pages": 5,
  "current_page": 1
}`}
          />
          <ApiEndpoint
            method="GET"
            path="/api/music/user/:user_id"
            description="Получение музыки конкретного пользователя."
            authRequired={false}
            request={`GET /api/music/user/456`}
            response={`{
  "success": true,
  "tracks": [
  ],
  "total": 5,
  "pages": 1,
  "current_page": 1,
  "user": {
    "id": 456,
    "name": "Загрузивший пользователь",
    "username": "username",
    "avatar_url": "/static/uploads/avatar/456/avatar.png"
  }
}`}
          />
          <ApiEndpoint
            method="GET"
            path="/api/music/:track_id"
            description="Получение информации о конкретном треке."
            authRequired={false}
            request={`GET /api/music/123`}
            response={`{
  "success": true,
  "track": {
    "id": 123,
    "title": "Название трека",
    "artist": "Исполнитель",
    "album": "Альбом",
    "duration": 180,
    "file_path": "/static/music/456/123/track.mp3",
    "cover_path": "/static/music/456/123/cover.jpg",
    "user_id": 456,
    "user_name": "Загрузивший пользователь",
    "user_username": "username",
    "genre": "Жанр",
    "description": "Описание трека",
    "plays_count": 42,
    "likes_count": 15,
    "created_at": "2023-06-15T14:30:45",
    "is_liked": false
  }
}`}
          />
          <ApiEndpoint
            method="POST"
            path="/api/music/:track_id/like"
            description="Лайк трека."
            authRequired={true}
            request={`POST /api/music/123/like`}
            response={`{
  "success": true,
  "is_liked": true,
  "likes_count": 16
}`}
          />
          <ApiEndpoint
            method="POST"
            path="/api/music/:track_id/play"
            description="Увеличение счетчика проигрываний трека."
            authRequired={false}
            request={`POST /api/music/123/play`}
            response={`{
  "success": true,
  "plays_count": 43
}`}
          />
          <ApiEndpoint
            method="GET"
            path="/api/music/popular"
            description="Получение популярных треков."
            authRequired={false}
            request={`GET /api/music/popular?limit=10`}
            response={`{
  "success": true,
  "tracks": [
  ]
}`}
          />
          <ApiEndpoint
            method="GET"
            path="/api/music/search"
            description="Поиск треков по названию, исполнителю или альбому."
            authRequired={false}
            request={`GET /api/music/search?q=запрос&page=1&per_page=20`}
            response={`{
  "success": true,
  "tracks": [
  ],
  "total": 3,
  "pages": 1,
  "current_page": 1
}`}
          />
        </>
      )}
      {activeTab === 8 && (
        <>
          <ApiTitle>
            <StorefrontIcon fontSize="large" />
            Магазин бейджиков
          </ApiTitle>
          <ApiEndpoint
            method="GET"
            path="/api/badges/shop"
            description="Получение списка всех доступных бейджиков в магазине."
            authRequired={true}
            request={`GET /api/badges/shop`}
            response={`{
  "badges": [
    {
      "id": 123,
      "name": "Название бейджика",
      "description": "Описание бейджика",
      "image_path": "f8a72b3e-5c21-4a9b-b77d-1234567890ab.svg",
      "price": 100,
      "creator_id": 456,
      "creator": {
        "id": 456,
        "username": "username",
        "name": "Создатель",
        "avatar_url": "/static/uploads/avatar/456/avatar.png"
      },
      "copies_sold": 5,
      "max_copies": 10,
      "is_sold_out": false,
      "purchases": [
        {
          "buyer_id": 789,
          "buyer": {
            "id": 789,
            "username": "buyer",
            "name": "Покупатель",
            "avatar_url": "/static/uploads/avatar/789/avatar.png"
          },
          "purchase_date": "2023-06-15T14:30:45"
        }
      ]
    }
  ]
}`}
          />
          <ApiEndpoint
            method="POST"
            path="/api/badges/purchase/:badge_id"
            description="Покупка бейджика из магазина."
            authRequired={true}
            request={`POST /api/badges/purchase/123`}
            response={`{
  "success": true,
  "message": "Бейджик успешно приобретен",
  "badge": {
    "id": 123,
    "name": "Название бейджика",
    "image_path": "shop/f8a72b3e-5c21-4a9b-b77d-1234567890ab.svg",
    "points_spent": 100,
    "points_remaining": 250
  }
}`}
          />
          <ApiEndpoint
            method="GET"
            path="/api/user/points"
            description="Получение баланса баллов пользователя."
            authRequired={true}
            request={`GET /api/user/points`}
            response={`{
  "points": 350,
  "user_id": 789
}`}
          />
          <ApiEndpoint
            method="GET"
            path="/api/badges/purchases"
            description="Получение списка приобретенных пользователем бейджиков."
            authRequired={true}
            request={`GET /api/badges/purchases`}
            response={`{
  "purchases": [
    {
      "id": 1,
      "badge_id": 123,
      "badge": {
        "id": 123,
        "name": "Название бейджика",
        "description": "Описание бейджика",
        "image_path": "f8a72b3e-5c21-4a9b-b77d-1234567890ab.svg",
        "price": 100,
        "creator_id": 456
      },
      "price_paid": 100,
      "purchase_date": "2023-06-15T14:30:45",
      "achievement_id": 5
    }
  ]
}`}
          />
          <ApiEndpoint
            method="POST"
            path="/api/badges/create"
            description="Создание нового бейджика в магазине. Требует 300 баллов."
            authRequired={true}
            request={`POST /api/badges/create
Content-Type: multipart/form-data
{
  "name": "Название бейджика",
  "description": "Описание бейджика",
  "price": 100,
  "max_copies": 10,
  "image": [файл SVG]
}`}
            response={`{
  "message": "Бейджик успешно создан",
  "badge_id": 123
}`}
          />
        </>
      )}
    </PageContainer>
  );
};
export default SimpleApiDocsPage; 