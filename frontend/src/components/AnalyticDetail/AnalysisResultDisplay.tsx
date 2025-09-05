import React from 'react';
import {Typography} from "@material-tailwind/react";
import {Bar, Doughnut} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import WordCloudComponent from "./WordCloud";

// 註冊 ChartJS 組件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalysisResultDisplayProps {
  keywordAnalysis: any;
  promptAnalysis: any;
  assistiveToolAnalysis: any;
}

// Jambot 工具列表
const jambotTools = [
  'quick_question',
  'rabbit_hole',
  'rewrite_this',
  'turn_this_into_a',
  'Ideate',
  'teach_me_about_this',
  'give_me',
  'similar_stuff',
  'summarize',
  'code_this_up',
  'custom'
];

const AnalysisResultDisplay = (props: AnalysisResultDisplayProps) => {
  const {keywordAnalysis, promptAnalysis, assistiveToolAnalysis} = props;

  // 檢查是否有有效的關鍵詞分析數據
  const hasKeywordData = keywordAnalysis && keywordAnalysis.top_keywords;

  // 將關鍵詞數據轉換為圖表格式
  const keywordChartData = React.useMemo(() => {
    if (!hasKeywordData) return { labels: [], datasets: [{ label: '文字使用次數', data: [], backgroundColor: 'rgba(75, 192, 192, 0.6)' }] };

    // 獲取前 10 個關鍵詞
    const entries = Object.entries(keywordAnalysis.top_keywords).slice(0, 10);
    const labels = entries.map(([word]) => word);
    const data = entries.map(([, count]) => count);

    return {
      labels,
      datasets: [
        {
          label: '文字使用次數',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }
      ],
    };
  }, [keywordAnalysis]);

  // 將關鍵詞數據轉換為文字雲格式
  const wordcloudData = React.useMemo(() => {
    if (!hasKeywordData) return [];

    return Object.entries(keywordAnalysis.top_keywords).map(([text, value]) => ({
      text,
      value: Number(value)
    }));
  }, [keywordAnalysis]);

  // 檢查是否有有效的輔助工具分析數據
  const hasToolData = assistiveToolAnalysis && Object.keys(assistiveToolAnalysis).length > 0;

  // 將輔助工具數據轉換為圖表格式
  const jambotUsageData = React.useMemo(() => {
    if (!hasToolData) {
      return {
        labels: jambotTools,
        datasets: [{
          label: '使用次數',
          data: Array(jambotTools.length).fill(0),
          backgroundColor: Array(jambotTools.length).fill('rgba(200, 200, 200, 0.6)'),
          borderColor: Array(jambotTools.length).fill('rgba(200, 200, 200, 1)'),
          borderWidth: 1
        }]
      };
    }

    const data = jambotTools.map(tool => assistiveToolAnalysis[tool] || 0);

    // 顏色陣列
    const backgroundColors = [
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(199, 199, 199, 0.6)',
      'rgba(83, 102, 255, 0.6)',
      'rgba(78, 205, 196, 0.6)',
      'rgba(255, 99, 71, 0.6)',
      'rgba(255, 127, 80, 0.6)',
    ];

    const borderColors = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(199, 199, 199, 1)',
      'rgba(83, 102, 255, 1)',
      'rgba(78, 205, 196, 1)',
      'rgba(255, 99, 71, 1)',
      'rgba(255, 127, 80, 1)',
    ];

    return {
      labels: jambotTools,
      datasets: [
        {
          label: '使用次數',
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    };
  }, [assistiveToolAnalysis]);

  // 檢查是否有有效的提示詞分析數據
  const hasPromptData = promptAnalysis && promptAnalysis.prompts && promptAnalysis.prompts.length > 0;

  // 將提示詞數據轉換為文字雲格式，並按出現次數從大到小排序
  const promptWordcloudData = React.useMemo(() => {
    if (!hasPromptData) return [];

    // 複製數組並按照 times 從大到小排序
    return [...promptAnalysis.prompts]
      .sort((a, b) => b.times - a.times)
      .map((item: any) => ({
        text: item.keyword,
        value: item.times
      }));
  }, [promptAnalysis]);

  // 將提示詞數據轉換為圖表格式，並按出現次數從大到小排序
  const promptFrequencyData = React.useMemo(() => {
    if (!hasPromptData) {
      return {
        labels: [],
        datasets: [{ label: 'Prompt 常用字詞', data: [], backgroundColor: 'rgba(153, 102, 255, 0.6)' }]
      };
    }

    // 複製數組並按照 times 從大到小排序
    const sortedPrompts = [...promptAnalysis.prompts].sort((a, b) => b.times - a.times);

    // 獲取前 10 個提示詞
    const topPrompts = sortedPrompts.slice(0, 10);
    const labels = topPrompts.map((item: any) => item.keyword);
    const data = topPrompts.map((item: any) => item.times);

    return {
      labels,
      datasets: [
        {
          label: 'Prompt 常用字詞',
          data,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        }
      ],
    };
  }, [promptAnalysis]);

  // 獲取討論主題
  const discussionTopic = React.useMemo(() => {
    if (!promptAnalysis || !promptAnalysis.discussion_topics) return null;
    return promptAnalysis.discussion_topics;
  }, [promptAnalysis]);

  return (
    <div className="analysis-result">
      {/* 討論主題區域 */}
      {discussionTopic && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <Typography variant="h6" className="mb-2" placeholder={undefined}>討論主題分析</Typography>
          <Typography variant="paragraph" placeholder={undefined}>
            <strong>主題：</strong> {discussionTopic.topic}
          </Typography>
          <Typography variant="paragraph" placeholder={undefined}>
            <strong>描述：</strong> {discussionTopic.description}
          </Typography>
        </div>
      )}

      {/* 圖表區域 */}
      <div className="charts-container space-y-8">
        {/* 關鍵詞分析區域 */}
        {hasKeywordData && (
          <div className="chart-section">
            <Typography variant="h6" className="mb-2" placeholder={undefined}>文字使用頻率分析</Typography>
            <div className="h-[24rem] bg-gray-50 rounded-lg p-2">
              <WordCloudComponent words={wordcloudData}/>
            </div>
            <div className="h-48 mt-4">
              <Bar
                data={keywordChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: '文字使用次數統計'
                    }
                  }
                }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p>總詞數: {keywordAnalysis.total_words || 0}</p>
              <p>不重複詞數: {keywordAnalysis.unique_words || 0}</p>
            </div>
          </div>
        )}

        {/* 提示詞分析區域 */}
        {hasPromptData && (
          <div className="chart-section">
            <Typography variant="h6" className="mb-2" placeholder={undefined}>Prompt 常用字詞分析</Typography>
            <div className="h-[24rem] bg-gray-50 rounded-lg p-2">
              <WordCloudComponent words={promptWordcloudData}/>
            </div>
            <div className="h-48 mt-4">
              <Bar
                data={promptFrequencyData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Prompt 常用字詞統計'
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* 輔助工具使用分析區域 */}
        {hasToolData && (
          <div className="chart-section">
            <Typography variant="h6" className="mb-2" placeholder={undefined}>Jambot 工具使用分布</Typography>
            <div className="h-64">
              <Doughnut
                data={jambotUsageData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    title: {
                      display: true,
                      text: 'Jambot 工具使用次數分布'
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* 如果沒有任何數據，顯示提示信息 */}
        {!hasKeywordData && !hasPromptData && !hasToolData && (
          <div className="p-6 text-center bg-gray-100 rounded-lg">
            <Typography variant="paragraph" className="text-gray-600" placeholder={undefined}>
              未能獲取有效的分析數據，請重新嘗試分析。
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResultDisplay;
