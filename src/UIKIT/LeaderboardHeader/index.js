import React from 'react';
import { Box } from '@mui/material';
import InfoBlock from '../InfoBlock';
import StyledTabs from '../StyledTabs';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DateRangeIcon from '@mui/icons-material/DateRange';

const LeaderboardHeader = ({
  title = "Рейтинг ТОП лидеров",
  description = "20 пользователей, получивших наибольшее количество очков сообщества K-Коннект за совокупность активности: созданных постов и историй, полученных лайков, комментариев, ответов, репостов, просмотров и реакций на истории.",
  tabs = [],
  selectedTab,
  onTabChange,
}) => {
  return (
    <Box>
      <InfoBlock
        title={title}
        description={description}
        icon={EmojiEventsIcon}
      />
      {tabs.length > 0 && (
        <StyledTabs
          value={selectedTab}
          onChange={onTabChange}
          tabs={tabs}
          variant="fullWidth"
        />
      )}
    </Box>
  );
};

export default LeaderboardHeader; 