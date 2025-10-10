import React, {useEffect, useState} from 'react';
import {
  Button,
  Card,
  CardBody,
  Typography,
  Alert
} from "@material-tailwind/react";
import {Assignment as CourseTask} from "../../../store/hooks/useStudentClass";
import {StudentCourseService} from "../../../utils/services/studentCourseService";
import {CourseTaskService} from "../../../utils/services/courseTaskService";
import AnalysisResultDisplay from "../../../components/AnalyticDetail/AnalysisResultDisplay";
import {StudentCourseTaskService} from "../../../utils/services/studentCourseTaskService";
import * as XLSX from "xlsx";

interface Student {
  name: string;
  student_id: string;
}

interface StudentSubmission {
  id?: number;
  student: Student;
  task_file?: string;
  task_link?: string;
  created_at?: string;
  course_task?: number;
}

interface AnalysticComponentProps {
  open: boolean;
  onClose: () => void;
  courseTask: CourseTask | null;
  assignmentName: string;
}

const AnalysticComponent: React.FC<AnalysticComponentProps> = ({
                                                                 open,
                                                                 onClose,
                                                                 courseTask,
                                                                 assignmentName
                                                               }) => {
  const [allAssistiveToolAnalysis, setAllAssistiveToolAnalysis] = useState<any>([]);
  const [allKeywordAnalysis, setAllKeywordAnalysis] = useState<any>([]);
  const [allPromptAnalysis, setAllPromptAnalysis] = useState<any>([]);

  const fetchAnalysisData = async (reanalysis: boolean = false) => {
    await CourseTaskService.getCourseTaskById(courseTask.taskId).then(fetchAnalysisData => {
      if (fetchAnalysisData.all_prompt_analysis === null || reanalysis) {
        StudentCourseService.analyzeAllStudentCourseTasks(courseTask.taskId).then(resultData => {
          setAllKeywordAnalysis({'top_keywords': resultData.all_keyword_analysis})
          setAllPromptAnalysis({'prompts': resultData.all_prompt_analysis})
          setAllAssistiveToolAnalysis(resultData.all_assistive_tool_analysis)
        });
      } else {
        console.log(fetchAnalysisData)
        setAllKeywordAnalysis({'top_keywords': fetchAnalysisData.all_keyword_analysis})
        setAllPromptAnalysis({'prompts': fetchAnalysisData.all_prompt_analysis})
        setAllAssistiveToolAnalysis(fetchAnalysisData.all_assistive_tool_analysis)
      }
    })
  }

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


  const handleDownloadData = () => {
    const fileName = `${assignmentName}_分析報告`;
    const workbookNames = ["工具使用分析", "關鍵詞分析", "提示詞分析"];
    let assistiveToolData = [];
    if (allAssistiveToolAnalysis && typeof allAssistiveToolAnalysis === 'object') {
      assistiveToolData = Object.entries(allAssistiveToolAnalysis).map(([tool, count]) => ({
        "工具名稱": tool,
        "使用次數": count
      }));
    }
    let keywordData = [];
    if (allKeywordAnalysis && typeof allKeywordAnalysis.top_keywords === 'object') {
      // 檢查是否已經是數組格式
      if (Array.isArray(allKeywordAnalysis.top_keywords)) {
        keywordData = allKeywordAnalysis.top_keywords;
      } else {
        // 將對象轉換為數組格式
        keywordData = Object.entries(allKeywordAnalysis.top_keywords).map(([keyword, count]) => ({
          "關鍵詞": keyword,
          "出現次數": count
        }));
      }
    }

    let promptData = [];
    if (allPromptAnalysis && Array.isArray(allPromptAnalysis.prompts)) {
      promptData = allPromptAnalysis.prompts.map(item => ({
        "提示詞": item.keyword,
        "出現次數": item.times
      }));
    }

    convertToXlsxFile(fileName, workbookNames, [assistiveToolData, keywordData, promptData]);
  }

  useEffect(() => {
    if (open) fetchAnalysisData(false)
  }, [open]);
  // 如果不是開啟狀態，不渲染任何內容
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-auto">
      <Card className="w-full min-w-xl max-h-[90%] mx-4 shadow-xl overflow-auto" placeholder={undefined}>
        <CardBody placeholder={undefined}>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h5" placeholder={undefined}>
              單元分析 - {assignmentName}
            </Typography>
            <Button
              variant="text"
              color="gray"
              onClick={onClose}
              className="p-2"
              placeholder={undefined}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                   stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </Button>
          </div>
          <div className="flex mb-4 gap-x-2">
            <Button
              variant="gradient"
              color="blue"
              onClick={() => fetchAnalysisData(true)}
              placeholder={undefined}
            >
              重新分析
            </Button>
            <Button
              variant="gradient"
              color="blue"
              onClick={handleDownloadData}
              placeholder={undefined}
            >
              下載數據
            </Button>
          </div>

          <AnalysisResultDisplay
            assistiveToolAnalysis={allAssistiveToolAnalysis}
            keywordAnalysis={allKeywordAnalysis}
            promptAnalysis={allPromptAnalysis}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default AnalysticComponent;
