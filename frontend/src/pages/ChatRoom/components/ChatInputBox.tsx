import React, {useState} from 'react';

interface ChatInputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (content: string) => void;
  isLoading: boolean;
}

const ChatInputBox: React.FC<ChatInputBoxProps> = ({
  value,
  onChange,
  onSend,
  isLoading
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSend(value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSend(value);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-t border-gray-200 p-4">
      <div className="flex gap-3">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="輸入你的問題... (Shift+Enter 換行)"
          disabled={isLoading}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-24 disabled:bg-gray-100"
          rows={3}
        />
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⌛</span>
              <span>發送中</span>
            </>
          ) : (
            <>
              <span>發送</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatInputBox;

