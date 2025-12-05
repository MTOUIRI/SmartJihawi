import { useEffect } from 'react';

const useDocumentTitle = (title, keepSuffix = true) => {
  useEffect(() => {
    if (keepSuffix) {
      document.title = title ? `${title} - SmartBac Platform` : 'SmartBac Platform';
    } else {
      document.title = title || 'SmartBac Platform';
    }
  }, [title, keepSuffix]);
};

export default useDocumentTitle;