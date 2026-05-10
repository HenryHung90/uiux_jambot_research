import React, {useEffect, useRef} from 'react';

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark-reasonable.css';

import {IStudentCourseChat} from "../../../utils/API/interface";

interface ChatMessageListProps {
  messages: IStudentCourseChat[];
  onLoadMore?: () => void;
  isLoading?: boolean;
  shouldScrollToBottom?: boolean;
  onScrollCompleted?: () => void;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  onLoadMore,
  isLoading = false,
  shouldScrollToBottom = false,
  onScrollCompleted
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggeredRef = useRef(false);

  useEffect(() => {
    // 只在 shouldScrollToBottom 为 true 时才滚动到底部
    if (shouldScrollToBottom) {
      messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
      // 滚动完成后回调
      onScrollCompleted?.();
    }
  }, [shouldScrollToBottom, onScrollCompleted]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // 当加载完成时，重置触发标志，允许下次加载
    if (!isLoading) {
      loadMoreTriggeredRef.current = false;
    }
  }, [isLoading]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      // 如果滚动到顶部附近（小于 100px）且未在加载且还未触发本次加载
      if (scrollTop < 100 && !isLoading && !loadMoreTriggeredRef.current && onLoadMore) {
        loadMoreTriggeredRef.current = true;
        onLoadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isLoading, onLoadMore]);

  return (
    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
      {isLoading && (
        <div className="flex justify-center py-4">
          <p className="text-gray-400 text-sm">載入中...</p>
        </div>
      )}
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-center">
          <div>
            <p className="text-gray-500 text-lg">開始一段對話</p>
            <p className="text-gray-400 text-sm mt-2">有任何問題，請在下方輸入框提問</p>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <React.Fragment key={message.id}>
            {/* 使用者訊息 */}
            {message.chat_content && (
              <div className="flex justify-end">
                <div className="max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg bg-blue-500 text-white rounded-br-none">
                  <p className="text-sm leading-relaxed">{message.chat_content}</p>
                  <span className="text-xs mt-1 inline-block text-blue-100">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )}
            {/* AI 回應 */}
            {message.ai_response && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none">
                  <p className="text-sm leading-relaxed">
                    <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {message.ai_response}
                  </ReactMarkdown>
                    </p>
                  <span className="text-xs mt-1 inline-block text-gray-500">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )}
          </React.Fragment>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
