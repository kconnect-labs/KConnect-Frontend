/**
 * PDF utility functions
 */
/**
 * Open a PDF receipt in a new tab or download on mobile
 * @param {string} dataUrl - PDF data URL or file path
 * @param {string} transactionId - ID of the transaction (not used for opening)
 * @param {string} filePath - Optional direct path to the file
 */
export const downloadPdfReceipt = (dataUrl, transactionId, filePath = null) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const url = filePath || dataUrl;
  if (isMobile) {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      window.location.href = url;
      return;
    }
    try {
      const newWindow = window.open(url, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        const link = document.createElement('a');
        link.href = url;
        link.download = `receipt_${transactionId}.pdf`;
        link.target = '_blank';
        link.click();
      }
    } catch (error) {
      console.error('Error opening PDF:', error);
      window.location.href = url;
    }
  } else {
    const link = document.createElement('a');
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  }
}; 