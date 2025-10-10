import React, {useEffect, useState} from 'react';
import {
  Button,
  Typography,
  Spinner,
  Alert
} from "@material-tailwind/react";
import AnalysisResultDisplay from './AnalysisResultDisplay';
import {StudentCourseTaskService} from "../../utils/services/studentCourseTaskService";

interface AnalyticDetailProps {
  taskId: number;
  taskFile?: string;
  isAnalyzed?: boolean; // 新增 isAnalyzed 屬性
}

const AnalyticDetailComponent: React.FC<AnalyticDetailProps> = ({taskFile, taskId, isAnalyzed = false}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [hasAnalysisResults, setHasAnalysisResults] = useState<boolean>(isAnalyzed); // 使用 isAnalyzed 初始化
  const [assistiveToolAnalysis, setAssistiveToolAnalysis] = useState<any>(null);
  const [keywordAnalysis, setKeywordAnalysis] = useState<any>(null);
  const [promptAnalysis, setPromptAnalysis] = useState<any>(null);

  // 執行 AI 辨識
  const handleAnalyze = async () => {
    // 檢查是否有提交的檔案
    if (!taskFile) {
      setAnalysisError("無法進行 AI 辨識，沒有提交檔案！");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response: any = await StudentCourseTaskService.analyzeStudentCourseTask(taskId);
      if (response) {
        setAssistiveToolAnalysis(response.assistive_tool_analysis);
        setKeywordAnalysis(response.keyword_analysis);
        setPromptAnalysis(response.prompt_analysis);
        setHasAnalysisResults(true)
      }
    } catch (error) {
      setAnalysisError('辨識過程發生錯誤，請重試');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearResults = async () => {
    const result = await StudentCourseTaskService.clearAnalysisResults(taskId)
    if (!result.is_analyzed) {
      setAssistiveToolAnalysis(null);
      setKeywordAnalysis(null);
      setPromptAnalysis(null);
      setHasAnalysisResults(false);
      setAnalysisError(null);
    }
  }

  useEffect(() => {
    // 只有當 isAnalyzed 為 true 或已經有分析結果時才獲取數據
    const fetchData = async () => {
      if (isAnalyzed) {
        const response: any = await StudentCourseTaskService.getStudentCourseTaskById(taskId);
        if (response) {
          setAssistiveToolAnalysis(response.assistive_tool_analysis);
          setKeywordAnalysis(response.keyword_analysis);
          setPromptAnalysis(response.prompt_analysis);
          setHasAnalysisResults(true);
        }
      }
    }
    fetchData();
  }, [isAnalyzed, taskId]);

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <Typography variant="h6" placeholder={undefined}>AI 辨識結果</Typography>
        <div className='flex'>
          <Button
            onClick={handleClearResults}
            color='red'
            size='sm'
            className='flex items-center mr-2'
            placeholder={undefined}
          >
            清除當前結果
          </Button>
          <Button
            onClick={handleAnalyze}
            color="purple"
            size="sm"
            disabled={isAnalyzing || !taskFile || (isAnalyzed && hasAnalysisResults)} // 如果已分析過且有結果則禁用按鈕
            className="flex items-center"
            placeholder={undefined}
          >
            {isAnalyzing ? (
              <>
                <Spinner className="h-4 w-4 mr-2"/>
                辨識中...
              </>
            ) : isAnalyzed && hasAnalysisResults ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M5 13l4 4L19 7"/>
                </svg>
                已完成分析
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                開始 AI 辨識
              </>
            )}
          </Button>
        </div>
      </div>

      {analysisError && (
        <Alert color="red" className="mb-3">
          {analysisError}
        </Alert>
      )}

      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-6">
          <Spinner className="h-8 w-8 mb-4"/>
          <Typography placeholder={undefined}>正在分析提交內容，請稍候...</Typography>
        </div>
      )}

      {hasAnalysisResults && (
        <AnalysisResultDisplay
          assistiveToolAnalysis={assistiveToolAnalysis}
          keywordAnalysis={keywordAnalysis}
          promptAnalysis={promptAnalysis}
        />
      )}

      {!isAnalyzing && !hasAnalysisResults && (
        <div className="text-center py-4 bg-gray-100 rounded-lg">
          <Typography variant="paragraph" className="text-gray-500" placeholder={undefined}>
            {taskFile ?
              "點擊「開始 AI 辨識」按鈕分析提交內容" :
              "學生尚未提交檔案，無法進行 AI 辨識"}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default AnalyticDetailComponent;
