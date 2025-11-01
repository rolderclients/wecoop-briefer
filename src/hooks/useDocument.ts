import type { TextUIPart } from 'ai';
import { useEffect, useState } from 'react';
import { parsePart } from '@/utils';

export const useDocument = (part: TextUIPart) => {
  const [parsedDocument, setParsedDocument] = useState('');

  useEffect(() => {
    parsePart(part).then((i) => setParsedDocument(i.document));
  }, [part]);

  return parsedDocument;
};
