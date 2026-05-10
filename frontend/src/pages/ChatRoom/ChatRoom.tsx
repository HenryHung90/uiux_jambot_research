import {useEffect, useState, useRef} from "react";
import {useParams, useNavigate} from "react-router-dom";
// Service imports
import {StudentCourseChatService} from "../../utils/services/studentCourseChatService";

// Interface imports
import {ICourseTeacher, IStudentCourseChat} from "../../utils/API/interface";

// Redux imports
import {useUserInfo} from "../../store/hooks/useUserInfo";
import ChatMessageList from "./components/ChatMessageList";
import ChatInputBox from "./components/ChatInputBox";
import {CourseService} from "../../utils/services/courseService";

const ChatRoom = () => {
  const {courseId} = useParams<{courseId: string}>();
  const {studentId} = useUserInfo();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [course, setCourse] = useState<ICourseTeacher | null>(null);
  const [messages, setMessages] = useState<IStudentCourseChat[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const pageSize = 10;
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
  
  // 用来标记是否需要滚动到底部（只在新消息发送时）
  const shouldScrollToBottomRef = useRef(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        if (!courseId) return;
        const chatData = await StudentCourseChatService.getStudentCourseChatsByPagination(courseId, page, pageSize)
        const courseData = await CourseService.getCourseById(courseId);

        chatData.reverse()

        setPage(prev => prev + 1);
        setCourse(courseData)
        setMessages(chatData)

        // 检查是否还有更多消息
        if (chatData.length < pageSize) {
          setHasMoreMessages(false);
        }

      } catch (error) {
        console.error("獲取課程信息失敗:", error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, studentId, navigate]);

  const handleLoadMoreMessages = async () => {
    if (isLoadingMore || !hasMoreMessages || !courseId) return;

    try {
      setIsLoadingMore(true);
      const olderMessages = await StudentCourseChatService.getStudentCourseChatsByPagination(courseId, page, pageSize);

      if (olderMessages.length === 0) {
        setHasMoreMessages(false);
        return;
      }

      olderMessages.reverse();
      setMessages(prev => [...olderMessages, ...prev]);
      setPage(prev => prev + 1);

      // 如果获取的消息数少于 pageSize，说明已经没有更多消息了
      if (olderMessages.length < pageSize) {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error("載入更多消息失敗:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isSending) return;

    try {
      setIsSending(true);
      setInputValue('');
      // 设置标志，表示这是用户新发送的消息
      shouldScrollToBottomRef.current = true;

      const tempId = Date.now();
      const tempMessage: IStudentCourseChat = {
        id: tempId, // 使用時間戳作為臨時 ID
        chat_content: content,
        ai_response: 'AI 生成中...',
        created_at: new Date().toISOString()
      }
       setMessages(prev => [...prev, tempMessage]);

      const finalMessage = await StudentCourseChatService.sendMessage(courseId, content);

      setMessages(prev =>
        prev.map(msg => (msg.id === tempId ? finalMessage : msg))
      );

    } catch (error) {
      console.error("發送消息失敗:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">加載中...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">課程信息加載失敗</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 頂部課程信息 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {course.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {course.course_type === 'chat' ? '聊天課程' : '一般課程'}
            </p>
          </div>
          <button
            onClick={handleBack}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md transition-colors"
          >
            返回
          </button>
        </div>
      </div>

      {/* 聊天區域 */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <ChatMessageList
          messages={messages}
          onLoadMore={handleLoadMoreMessages}
          isLoading={isLoadingMore}
          shouldScrollToBottom={shouldScrollToBottomRef.current}
          onScrollCompleted={() => {
            shouldScrollToBottomRef.current = false;
          }}
        />
        <ChatInputBox
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          isLoading={isSending}
        />
      </div>
    </div>
  );
};

export default ChatRoom;
