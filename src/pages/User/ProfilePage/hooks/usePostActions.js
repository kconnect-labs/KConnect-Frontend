export const usePostActions = () => {
  const handlePostCreated = (newPost) => {
    window.dispatchEvent(new CustomEvent('showError', {
      detail: {
        message: 'Пост успешно создан',
        severity: 'success'
      }
    }));
  };

  return {
    handlePostCreated
  };
}; 