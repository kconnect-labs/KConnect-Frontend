import { useChatPopups } from '../../../contexts/ChatPopupContext';
import ChatPopup from './ChatPopup';
import PopupDock from './PopupDock';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const PopupsContainer = () => {
  const { popups } = useChatPopups();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  if (!isDesktop) return null;

  return (
    <>
      <PopupDock />
      {popups.map((p, idx) => (
        <ChatPopup key={p.chatId} chatId={p.chatId} minimized={p.minimized} index={idx} />
      ))}
    </>
  );
};

export default PopupsContainer; 