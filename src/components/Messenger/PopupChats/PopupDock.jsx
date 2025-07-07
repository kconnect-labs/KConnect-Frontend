import { Box, Avatar, Badge, Tooltip } from '@mui/material';
import { useChatPopups } from '../../../contexts/ChatPopupContext';
import { useMessenger } from '../../../contexts/MessengerContext';
import { styled } from '@mui/material/styles';

const SmallBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -2,
    top: 2,
    padding: '0 4px',
    fontSize: 10,
  },
}));

const PopupDock = () => {
  const { popups, openPopup, toggleMinimize } = useChatPopups();
  const { chats, unreadCounts } = useMessenger();

  // Show avatars for chats that are open or have unread
  const items = chats.filter(c => popups.some(p=>p.chatId===c.id) || (unreadCounts[c.id] || 0) > 0).slice(0,6);

  if (items.length === 0) return null;

  return (
    <Box sx={{ position:'fixed', bottom:16, right:16, display:'flex', flexDirection:'column', gap:1, zIndex:1390 }}>
      {items.map(chat => {
        const popup = popups.find(p=>p.chatId===chat.id);
        const minimized = popup?.minimized;
        const unread = unreadCounts[chat.id] || 0;
        const handleClick = () => {
          if (popup) {
            toggleMinimize(chat.id);
          } else {
            openPopup(chat.id);
          }
        };
        const avatarUrl = chat.avatar || '/icon-512.png';
        return (
          <Tooltip title={chat.title || 'Чат'} placement="left" key={chat.id}>
            <SmallBadge color="primary" badgeContent={unread>0?unread:null} overlap="circular">
              <Avatar src={avatarUrl} sx={{ width:40, height:40, cursor:'pointer' }} onClick={handleClick} />
            </SmallBadge>
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default PopupDock; 