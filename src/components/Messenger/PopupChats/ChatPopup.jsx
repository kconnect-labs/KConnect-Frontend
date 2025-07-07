import { useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import { useChatPopups } from '../../../contexts/ChatPopupContext';
import ChatWindow from '../ChatWindow';
import { useMessenger } from '../../../contexts/MessengerContext';

const PopupWidth = 300;
const PopupHeight = 380;

const ChatPopup = ({ chatId, minimized, index }) => {
  const { closePopup, toggleMinimize } = useChatPopups();
  const { chats, setActiveChat } = useMessenger();

  const chat = chats.find(c => c.id === chatId);

  const handleHeaderClick = () => {
    if (minimized) toggleMinimize(chatId);
  };

  useEffect(() => {
    if (!minimized) {
      setActiveChat(chatId);
    }
  }, [minimized, chatId, setActiveChat]);

  return (
    <Box
      sx={{
        width: PopupWidth,
        height: minimized ? 40 : PopupHeight,
        position: 'fixed',
        bottom: 16,
        right: 16 + index * (PopupWidth + 8),
        bgcolor: 'background.paper',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
        zIndex: 1400
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1,
          cursor: minimized ? 'pointer' : 'default',
          background: 'rgba(255,255,255,0.05)'
        }}
        onDoubleClick={handleHeaderClick}
      >
        <Typography variant="subtitle2" noWrap>{chat?.title || 'Чат'}</Typography>
        <Box>
          <IconButton size="small" onClick={() => toggleMinimize(chatId)}>
            <RemoveIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => closePopup(chatId)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      {!minimized && (
        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <ChatWindow popupChatId={chatId} />
        </Box>
      )}
    </Box>
  );
};

export default ChatPopup; 