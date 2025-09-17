import React, {useState, useRef,} from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Radio,
} from "@material-tailwind/react";

import UnitCard from "./SemesterUnits_UnitCard";

import {CourseService} from "../../../utils/services/courseService";
import {CourseTaskService} from "../../../utils/services/courseTaskService";
import {Material, Assignment, Unit} from "../../../store/hooks/useStudentClass";

interface SemesterUnitsProps {
  units: Unit[];
  currentClassId?: number | null;
  onDataChange?: () => void;
}

const SemesterUnitsComponent = (props: SemesterUnitsProps) => {
  const {units, currentClassId, onDataChange} = props;

  // 狀態管理
  const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // 新增對話框狀態
  const [openAddUnitDialog, setOpenAddUnitDialog] = useState(false);
  const [openAddContentDialog, setOpenAddContentDialog] = useState(false);

  const [newUnitName, setNewUnitName] = useState("");
  const [newTaskName, setNewTaskName] = useState("");
  const [newContentUrl, setNewContentUrl] = useState("");
  const [newContent, setNewContent] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [useUrl, setUseUrl] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);

  // 處理查看教材
  const handleViewMaterial = (material: Material) => {
    if (material.content_url) {
      window.open(material.content_url, '_blank');
      return;
    } else if (material.content_file) {
      window.open(import.meta.env.VITE_APP_BASENAME + '/files/' + material.content_file.split("/files/")[1] , '_blank');
      return;
    } else {
      alert("此教材沒有可用的連結或檔案");
    }
  };

  // 處理查看作業
  const handleViewAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setOpenAssignmentDialog(true);
  };

  // 處理新增單元
  const handleAddUnit = () => {
    setNewUnitName("");
    setOpenAddUnitDialog(true);
  };

  // 處理新增內容 (教材或作業)
  const handleAddContent = (courseId: number) => {
    setSelectedCourseId(courseId);
    setNewTaskName("");
    setNewContentUrl("");
    setNewContent("");
    setUseUrl(true);
    setSelectedFile(null);
    setIsEditMode(false);
    setEditTaskId(null);
    setOpenAddContentDialog(true);
  };

  // 處理文件選擇
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 處理文件上傳按鈕點擊
  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const submitAddUnit = async () => {
    if (!newUnitName.trim() || !currentClassId) {
      alert("請輸入單元名稱");
      return;
    }

    try {
      setIsSubmitting(true);

      await CourseService.createCourse({name: newUnitName, student_class: currentClassId});

      // 關閉對話框並清空輸入
      setOpenAddUnitDialog(false);
      setNewUnitName("");

      // 通知父組件數據已變更
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error("新增單元失敗:", error);
      alert("新增單元失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitAddContent = async () => {
    if (!newTaskName.trim() || !selectedCourseId || !currentClassId) {
      alert("請輸入名稱");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('name', newTaskName);
      formData.append('course', selectedCourseId.toString());
      formData.append('student_class', currentClassId.toString());

      if (useUrl) {
        if (newContentUrl) {
          formData.append('content_url', newContentUrl);
        }
      } else {
        if (selectedFile) {
          formData.append('content_file', selectedFile);
        }
      }
      if (newContent) {
        formData.append('contents', JSON.stringify({content: newContent}));
      }

      if (isEditMode && editTaskId) {
        // 更新現有任務
        await CourseTaskService.updateCourseTask(editTaskId, formData);
      } else {
        // 創建新任務
        await CourseTaskService.createCourseTask(formData);
      }
      setOpenAddContentDialog(false);
      setNewTaskName("");
      setNewContentUrl("");
      setNewContent("");
      setSelectedFile(null);
      setIsEditMode(false);
      setEditTaskId(null);

      // 通知父組件數據已變更
      if (onDataChange) onDataChange();

    } catch (error) {
      console.error(isEditMode ? "更新內容失敗:" : "新增內容失敗:", error);
      alert(isEditMode ? "更新內容失敗，請稍後再試" : "新增內容失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTask = (courseId: number, taskId: number, taskName: string, contentUrl: string, content: string) => {
    // 設置編輯狀態
    setSelectedCourseId(courseId);
    setNewTaskName(taskName);
    setNewContentUrl(contentUrl || "");
    setNewContent(content ? content || "" : "");
    setUseUrl(!!contentUrl);
    setSelectedFile(null);
    setIsEditMode(true);
    setEditTaskId(taskId);
    setOpenAddContentDialog(true);
  };

// 處理刪除任務
  const handleDeleteTask = async (taskName: string, taskId: number | string) => {
    if (window.confirm(`確定要刪除 "${taskName}" 嗎？`)) {
      try {
        await CourseTaskService.deleteCourseTask(taskId);
        // 通知父組件數據已變更
        if (onDataChange) {
          onDataChange();
        }
      } catch (error) {
        console.error("刪除失敗:", error);
        alert("刪除失敗，請稍後再試");
      }
    }
  };

  return (
    <>
      <div className="space-y-4 animate-fadeIn">
        {units.map((unit, index) => (
          <UnitCard
            key={index}
            unit={unit}
            onViewMaterial={handleViewMaterial}
            onViewAssignment={handleViewAssignment}
            onAddContent={handleAddContent}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        ))}

        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
              placeholder={undefined}>
          <CardBody className="text-center py-8" placeholder={undefined} onClick={handleAddUnit}>
            <Button
              variant="text"
              className="text-blue-500"
              placeholder={undefined}
            >
              + 新增單元
            </Button>
          </CardBody>
        </Card>
      </div>

      <Dialog
        open={openAssignmentDialog}
        handler={() => setOpenAssignmentDialog(!openAssignmentDialog)}
        placeholder={undefined}
      >
        <DialogHeader placeholder={undefined}>
          作業詳情
        </DialogHeader>
        <DialogBody placeholder={undefined}>
          {selectedAssignment ? (
            <div className="space-y-4">
              <div>
                <Typography variant="h6" placeholder={undefined}>名稱</Typography>
                <Typography variant="paragraph" placeholder={undefined}>{selectedAssignment.name}</Typography>
              </div>

              {selectedAssignment.contents ? (
                <div>
                  <Typography variant="h6" placeholder={undefined}>作業內容</Typography>
                  <div className="p-4 bg-gray-100 rounded">
                    <pre className="whitespace-pre-wrap">
                        {selectedAssignment.contents.content}
                    </pre>
                  </div>
                </div>
              ) : (
                <Typography variant="paragraph" color="red" placeholder={undefined}>
                  此作業沒有可用的內容
                </Typography>
              )}
            </div>
          ) : (
            <Typography variant="paragraph" placeholder={undefined}>
              無法載入作業詳情
            </Typography>
          )}
        </DialogBody>
        <DialogFooter placeholder={undefined}>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenAssignmentDialog(false)}
            className="mr-1"
            placeholder={undefined}
          >
            關閉
          </Button>
        </DialogFooter>
      </Dialog>

      {/* 新增單元對話框 */}
      <Dialog
        open={openAddUnitDialog}
        handler={() => setOpenAddUnitDialog(!openAddUnitDialog)}
        placeholder={undefined}
      >
        <DialogHeader placeholder={undefined}>
          新增單元
        </DialogHeader>
        <DialogBody placeholder={undefined}>
          <div className="space-y-4">
            <Typography variant="paragraph" placeholder={undefined}>
              請輸入新單元名稱：
            </Typography>
            <Input
              type="text"
              label="單元名稱"
              value={newUnitName}
              onChange={(e) => setNewUnitName(e.target.value)}
              crossOrigin={undefined}
            />
          </div>
        </DialogBody>
        <DialogFooter placeholder={undefined}>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenAddUnitDialog(false)}
            className="mr-1"
            disabled={isSubmitting}
            placeholder={undefined}
          >
            取消
          </Button>
          <Button
            variant="filled"
            color="green"
            onClick={submitAddUnit}
            disabled={isSubmitting}
            placeholder={undefined}
          >
            {isSubmitting ? "處理中..." : "確認新增"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* 統一的新增內容對話框 */}
      <Dialog
        open={openAddContentDialog}
        handler={() => setOpenAddContentDialog(!openAddContentDialog)}
        placeholder={undefined}
        size="lg"
      >
        <DialogHeader placeholder={undefined}>
          {isEditMode ? "編輯教材與作業" : "新增教材與作業"}
        </DialogHeader>
        <DialogBody placeholder={undefined}>
          <div className="space-y-6">
            {/* 名稱輸入 */}
            <div>
              <Typography variant="h6" className="mb-2" placeholder={undefined}>
                名稱
              </Typography>
              <Input
                type="text"
                label="請輸入名稱"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                crossOrigin={undefined}
              />
            </div>
            <div>
              <Typography variant="h6" className="mb-2" placeholder={undefined}>
                教材內容
              </Typography>
              <div className="flex items-center space-x-4 mb-3">
                <Radio
                  name="material-type"
                  label="使用連結"
                  checked={useUrl}
                  onChange={() => setUseUrl(true)}
                  crossOrigin={undefined}
                />
                <Radio
                  name="material-type"
                  label="上傳檔案"
                  checked={!useUrl}
                  onChange={() => setUseUrl(false)}
                  crossOrigin={undefined}
                />
              </div>

              {useUrl ? (
                <Input
                  type="text"
                  label="教材連結"
                  value={newContentUrl}
                  onChange={(e) => setNewContentUrl(e.target.value)}
                  crossOrigin={undefined}
                />
              ) : (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outlined"
                      size="sm"
                      onClick={handleFileButtonClick}
                      placeholder={undefined}
                    >
                      選擇檔案
                    </Button>
                    <span className="text-sm">
                        {selectedFile ? selectedFile.name : "尚未選擇檔案"}
                      </span>
                  </div>
                </div>
              )}
            </div>
            <div>
              <Typography variant="h6" className="mb-2" placeholder={undefined}>
                作業內容
              </Typography>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 min-h-[150px]"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="請輸入作業內容..."
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter placeholder={undefined}>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenAddContentDialog(false)}
            className="mr-1"
            disabled={isSubmitting}
            placeholder={undefined}
          >
            取消
          </Button>
          <Button
            variant="filled"
            color="green"
            onClick={submitAddContent}
            disabled={isSubmitting}
            placeholder={undefined}
          >
            {isSubmitting ? "處理中..." : isEditMode ? "確認更新" : "確認新增"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default SemesterUnitsComponent;
