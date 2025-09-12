import ReactWordcloud from 'react-wordcloud';
import React, {useState, useMemo, memo, createContext, useContext} from "react";
// style
import {ListOrdered, Settings, Download} from 'lucide-react'
// API
import * as XLSX from 'xlsx'

// components
const WordCloudContext = createContext<WordCloudState | undefined>(undefined);
const useWordCloudContext = () => {
  const context = useContext(WordCloudContext);
  if (context === undefined) {
    throw new Error('useWordCloudContext must be used within a WordCloudProvider');
  }
  return context;
};

// interface
interface WordCloudState {
  words: Array<{ text: string, value: number }>
  filteredWords: Array<{ text: string, value: number }>
  hideCode: boolean
  setHideCode: React.Dispatch<React.SetStateAction<boolean>>
  scale: 'linear' | 'log' | 'sqrt'
  setScale: React.Dispatch<React.SetStateAction<'linear' | 'log' | 'sqrt'>>
  spiral: 'archimedean' | 'rectangular'
  setSpiral: React.Dispatch<React.SetStateAction<'archimedean' | 'rectangular'>>
}

interface WorldCloudProps {
  words: Array<{ text: string, value: number }>
}

interface WordCloudRendererProps {
  words: Array<{ text: string, value: number }>
  options: any
  maxWords: number
}

interface ControlPanelProps {
  showControls: boolean;
}

interface WordLeaderBoardProps {
  showTopWords: boolean;
  topWords: Array<{ text: string, value: number }>;
}

const WordCloudRenderer = memo((props: WordCloudRendererProps) => {
  const {words, options, maxWords} = props;
  return (
    <ReactWordcloud
      words={words}
      options={options}
      maxWords={maxWords}
    />
  );
});

const ControlPanel = memo((props: ControlPanelProps) => {
  const {showControls} = props;
  const {
    words,
    filteredWords,
    scale,
    setScale,
    hideCode,
    setHideCode,
    spiral,
    setSpiral
  } = useWordCloudContext()

  function convertToXlsxFile(sheetName: string, workbookNames: Array<string>, data: Array<Array<JSON>>) {
  // 創建工作簿並添加工作表
  const workbook = XLSX.utils.book_new();
  const sheetNameWithFileType = sheetName + '.xlsx'

  for (let i = 0; i < workbookNames.length; i++) {
    // Convert each dataset to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data[i]);
    // Append the worksheet to the workbook with the corresponding name
    XLSX.utils.book_append_sheet(workbook, worksheet, workbookNames[i]);
  }


  // 將工作簿轉換為二進制數據
  const workbookBinary = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});

  // 創建 Blob 對象
  const blob = new Blob([workbookBinary], {type: 'application/octet-stream'});

  // 創建下載鏈接並觸發下載
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = sheetNameWithFileType;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


  // 處理下載Excel檔案
  const handleDownloadExcel = (words: Array<{ text: string, value: number }>, filteredWords: Array<{
    text: string,
    value: number
  }>) => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const fileName = `wordcloud_data_${timestamp}`;
    const workbookNames = ['全部詞彙', '已過濾詞彙'];
    const allWordsData = words.map((word, index) => ({
      '序號': index + 1,
      '詞彙': word.text,
      '頻率': word.value
    })) as any[];

    const filteredWordsData = filteredWords.map((word, index) => ({
      '序號': index + 1,
      '詞彙': word.text,
      '頻率': word.value
    })) as any[];

    // 調用轉換函數
    convertToXlsxFile(fileName, workbookNames, [allWordsData, filteredWordsData]);
  };

  return (
    <div
      className={`absolute z-10 w-60 p-4 bg-white/85 backdrop-blur-sm rounded-l-lg shadow-md transition-all duration-300 ${
        showControls ? 'right-0' : '-right-64'
      }`}>
      <h3 className="text-lg font-bold mb-4">文字雲設置</h3>

      {/* 隱藏程式碼 */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <input
            id="hideCode"
            type="checkbox"
            checked={hideCode}
            onChange={(e) => setHideCode(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="hideCode" className="text-sm">
            隱藏程式碼（英文結果）
          </label>
        </div>
      </div>

      {/* Scale 模式 */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-sm" htmlFor="scale">
          Scale 模式:
        </label>
        <select
          id="scale"
          value={scale}
          onChange={(e) => setScale(e.target.value as 'linear' | 'log' | 'sqrt')}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option value="linear">Linear</option>
          <option value="log">Log</option>
          <option value="sqrt">Sqrt</option>
        </select>
      </div>

      {/* Spiral 模式 */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-sm" htmlFor="spiral">
          Spiral 模式:
        </label>
        <select
          id="spiral"
          value={spiral}
          onChange={(e) => setSpiral(e.target.value as 'archimedean' | 'rectangular')}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option value="archimedean">Archimedean</option>
          <option value="rectangular">Rectangular</option>
        </select>
      </div>
      <button
        onClick={() => handleDownloadExcel(words, filteredWords)}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
      >
        <Download size={16}/>
        <span>下載詞彙數據</span>
      </button>
    </div>
  );
});

const WordCloudComponent = (props: WorldCloudProps) => {
  const {words} = props;

  // 狀態管理
  const [hideCode, setHideCode] = useState<boolean>(false);
  const [scale, setScale] = useState<'linear' | 'log' | 'sqrt'>('log');
  const [spiral, setSpiral] = useState<'archimedean' | 'rectangular'>('archimedean');
  const [showControls, setShowControls] = useState<boolean>(true);

  // 過濾英文代碼
  const filteredWords = useMemo(() => {
    return hideCode
      ? words.filter(word => {
        // 過濾純英文單詞
        const isEnglishCode = /^[a-zA-Z0-9_]+$/.test(word.text);
        return !isEnglishCode;
      })
      : words;
  }, [words, hideCode]);

  // 創建Context值
  const contextValue = useMemo(() => ({
    words,
    filteredWords,
    hideCode,
    setHideCode,
    scale,
    setScale,
    spiral,
    setSpiral
  }), [hideCode, scale, spiral]);

  // 文字雲選項
  const options = useMemo(() => ({
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
    enableTooltip: true,
    fontFamily: 'impact',
    fontSizes: [14, 50] as [number, number],
    padding: 5,
    rotations: 100,
    rotationAngles: [-45, 45] as [number, number],
    scale: scale,
    spiral: spiral,
    deterministic: false,
  }), [scale, spiral]);

  return (
    <WordCloudContext.Provider value={contextValue}>
      <div className="w-full h-full relative">
        {/* 切換控制欄按鈕 */}
        <button
          className={`absolute z-10 px-3 py-2 bg-black/70 text-white rounded-md transition-all duration-300 ${
            showControls ? 'right-64' : 'right-0'
          } top-2`}
          onClick={() => setShowControls(!showControls)}
        >
          <Settings/>
        </button>
        <ControlPanel showControls={showControls}/>

        {/* 文字雲 - 使用記憶化組件 */}
        <div className="w-full h-full">
          <WordCloudRenderer
            words={filteredWords}
            options={options}
            maxWords={100}
          />
        </div>
      </div>
    </WordCloudContext.Provider>
  );
};

export default WordCloudComponent;
