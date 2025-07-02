import React from 'react';

export const WallPostsTab = ({ userId, WallFeed }) => {
  return (
    <WallFeed userId={userId} />
  );
};

export const PostsTab = ({ userId, statusColor, PostsFeed }) => {
  return (
    <PostsFeed userId={userId} statusColor={statusColor} />
  );
}; 