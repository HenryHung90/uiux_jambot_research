import React, { useState } from 'react';
import {
  Button,
  Typography,
  Spinner,
  Alert
} from "@material-tailwind/react";
import AnalysisResultDisplay from './AnalysisResultDisplay';

interface AnalyticDetailProps {
  taskId: number;
  taskFile?: string;
}

const AnalyticDetailComponent: React.FC<AnalyticDetailProps> = ({taskFile}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [assistiveToolAnalysis, setAssistiveToolAnalysis] = useState<number[]>();
  const [keywordAnalysis, setKeywordAnalysis] = useState<{text: string, value:number}[]>();
  const [promptAnalysis, setPromptAnalysis] = useState<any>();

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
      // 這裡應該添加實際的 AI 辨識邏輯
      // 例如調用 API 進行圖像分析

      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 模擬分析結果
      const result = `
        分析結果：
        - 圖片內容符合作業要求
        - 辨識到的主要元素：圖表、文字說明
        - 完成度評估：95%
        - 建議：圖表標題可以更加明確
      `;

      setAnalysisResult(result);
    } catch (error) {
      console.error('AI 辨識失敗:', error);
      setAnalysisError('辨識過程發生錯誤，請重試');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <Typography variant="h6" placeholder={undefined}>AI 辨識結果</Typography>
        <Button
          onClick={handleAnalyze}
          color="purple"
          size="sm"
          disabled={isAnalyzing || !taskFile}
          className="flex items-center"
          placeholder={undefined}
        >
          {isAnalyzing ? (
            <>
              <Spinner className="h-4 w-4 mr-2" />
              辨識中...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              開始 AI 辨識
            </>
          )}
        </Button>
      </div>
      {analysisError && (
        <Alert color="red" className="mb-3">
          {analysisError}
        </Alert>
      )}

      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center py-6">
          <Spinner className="h-8 w-8 mb-4" />
          <Typography placeholder={undefined}>正在分析提交內容，請稍候...</Typography>
        </div>
      ) : analysisResult ? (
        <AnalysisResultDisplay  assistiveToolAnalysis={assistiveToolAnalysis} keywordAnalysis={keywordAnalysis} promptAnalysis={promptAnalysis}/>
      ) : (
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
