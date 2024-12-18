import React from 'react';
import { MapPin } from 'lucide-react';
import { useChatSettings } from '@/contexts/ChatSettingsContext';
import { DocumentReference } from '../chat/DocumentReference';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  onDocumentSearch?: (document: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  content, 
  isUser,
  onDocumentSearch = () => {} 
}) => {
  const { settings } = useChatSettings();

  const renderContent = (text: string) => {
    // First, handle document references with regex
    const documentRegex = /(رخصة|بطاقة|جواز|عقد|شهادة)\s([^\n.,!?]*)/g;
    const parts = text.split(documentRegex);

    return parts.map((part, index) => {
      // If this part matches our document types (index % 3 === 1), render it as a document reference
      if (index % 3 === 1 && parts[index + 1]) {
        const fullDocument = `${part}${parts[index + 1]}`;
        return (
          <DocumentReference
            key={index}
            documentName={fullDocument}
            onSearch={onDocumentSearch}
          />
        );
      } else if (index % 3 === 0) {
        // For non-document parts, handle icons
        const iconRegex = /{{([\w-]+)}}/g;
        const textParts = part.split(iconRegex);

        return textParts.map((textPart, textIndex) => {
          if (textIndex % 2 === 1) {
            // Apply the icon color from settings
            const iconProps = {
              className: "inline-block h-4 w-4 mx-1",
              color: settings.iconColor
            };

            // Handle map-pin icon
            if (textPart === 'map-pin') {
              return <MapPin key={`${index}-${textIndex}`} {...iconProps} />;
            }
            return null;
          }
          return textPart;
        });
      }
      return null;
    });
  };

  return (
    <div
      className={`max-w-[80%] p-4 rounded-lg ${
        isUser
          ? 'bg-moroccan-blue text-white ml-4'
          : 'bg-moroccan-sand/20 text-moroccan-charcoal mr-4'
      }`}
      dir="rtl"
    >
      <div className={`whitespace-pre-wrap font-['Noto_Naskh_Arabic'] ${settings.fontSize} ${settings.fontWeight}`}>
        {renderContent(content)}
      </div>
    </div>
  );
};