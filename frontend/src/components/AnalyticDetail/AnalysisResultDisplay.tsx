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
  keywordAnalysis: {text: string, value:number}[];
  promptAnalysis: any;
  assistiveToolAnalysis: number[];
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

const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = () => {
  // 模擬文字使用次數數據
  const wordFrequencyData = {
    labels: ['學習', '研究', '分析', '設計', '開發', '測試', '報告'],
    datasets: [
      {
        label: '文字使用次數',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ],
  };

  // 模擬 Jambot 工具使用次數數據
  const jambotUsageData = {
    labels: jambotTools,
    datasets: [
      {
        label: '使用次數',
        data: [12, 19, 3, 5, 2, 3, 9, 7, 15, 8, 4],
        backgroundColor: [
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
        ],
        borderColor: [
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
        ],
        borderWidth: 1,
      },
    ],
  };

  // 模擬文字雲數據
  const wordcloudData = [
    {text: '學習', value: 65},
    {text: '研究', value: 59},
    {text: '分析', value: 80},
    {text: '設計', value: 81},
    {text: '開發', value: 56},
    {text: '測試', value: 55},
    {text: '報告', value: 40},
    {text: '創新', value: 30},
    {text: '思考', value: 45},
    {text: '協作', value: 25},
    {text: '專案', value: 60},
    {text: '技能', value: 35},
    {text: '知識', value: 50},
    {text: '實踐', value: 42},
  ];

  // 模擬 prompt 常用字詞數據
  const promptWordcloudData = [
    {text: '請幫我', value: 85},
    {text: '如何', value: 72},
    {text: '解釋', value: 65},
    {text: '分析', value: 58},
    {text: '建議', value: 52},
    {text: '範例', value: 48},
    {text: '比較', value: 45},
    {text: '優化', value: 42},
    {text: '改進', value: 38},
    {text: '創意', value: 35},
    {text: '問題', value: 32},
    {text: '方案', value: 30},
    {text: '程式碼', value: 28},
    {text: '專業', value: 25},
    {text: '簡單', value: 22},
  ];

  // 模擬 prompt 常用字詞長條圖數據
  const promptFrequencyData = {
    labels: ['請幫我', '如何', '解釋', '分析', '建議', '範例', '比較'],
    datasets: [
      {
        label: 'Prompt 常用字詞',
        data: [85, 72, 65, 58, 52, 48, 45],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      }
    ],
  };

  return (
    <div className="analysis-result">
      {/* 圖表區域 */}
      <div className="charts-container space-y-8">
        <div className="chart-section">
          <Typography variant="h6" className="mb-2" placeholder={undefined}>文字使用頻率分析</Typography>
          <div className="h-[24rem] bg-gray-50 rounded-lg p-2">
            <WordCloudComponent words={wordcloudData}/>
          </div>
          <div className="h-48">
            <Bar
              data={wordFrequencyData}
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
        </div>

        <div className="chart-section">
          <Typography variant="h6" className="mb-2" placeholder={undefined}>Prompt 常用字詞分析</Typography>
          <div className="h-[24rem] bg-gray-50 rounded-lg p-2">
            <WordCloudComponent words={promptWordcloudData}/>
          </div>
          <div className="h-48">
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
      </div>
    </div>
  );
};

export default AnalysisResultDisplay;
