import React, {useEffect, useState, useRef} from 'react';

import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Alert,
} from "@material-tailwind/react";

import {MagnifyingGlassIcon, DocumentArrowDownIcon} from "@heroicons/react/24/outline";
import {StudentService} from "../../../utils/services/studentService";

import {IStudent, Req_adminChangePassword, Req_createStudent, Req_updateStudent} from "../../../utils/API/interface";

interface BulkImportResult {
  message: string;
  details?: {
    success: number;
    failed: number;
    errors?: Array<{
      row: number;
      student_id: string;
      error: string;
    }>;
  };
}

interface StudentListProps {
  currentClassId: number;
  currentClassName: string;
}

// 定義對話框類型
type DialogType = 'add' | 'changePassword' | 'changeName' | 'bulkImport' | null;

const StudentListComponent = (props: StudentListProps) => {
  const {currentClassId, currentClassName} = props;

  const [students, setStudents] = useState<Array<IStudent>>([]);
  const [openDialog, setOpenDialog] = useState<DialogType>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);
  const [importResult, setImportResult] = useState<BulkImportResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newStudent, setNewStudent] = useState<Req_createStudent>({
    student_id: '',
    name: '',
    password: '',
    student_class: currentClassId,
    is_active: true
  });

  const [passwordForm, setPasswordForm] = useState<Req_adminChangePassword>({
    new_password: ''
  });

  const [nameForm, setNameForm] = useState<Req_updateStudent>({
    name: '',
    student_class: currentClassId
  });

  const resetForm = () => {
    setNewStudent({
      student_id: '',
      name: '',
      password: '',
      student_class: currentClassId,
      is_active: true
    });
    setPasswordForm({
      new_password: ''
    });
    setNameForm({
      name: '',
      student_class: currentClassId
    });
    setSelectedFile(null);
    setImportResult(null);
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setNewStudent({
      ...newStudent,
      [name]: value
    });
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };

  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setNameForm({
      ...nameForm,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const openDialogHandler = (type: DialogType, student?: IStudent) => {
    resetForm();
    if (student) {
      setSelectedStudent(student);
      if (type === 'changeName') {
        setNameForm({
          name: student.name,
          student_class: student.student_class
        });
      }
    }
    setOpenDialog(type);
  };

  const closeDialogHandler = () => {
    setOpenDialog(null);
    setSelectedStudent(null);
    setImportResult(null);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      switch (openDialog) {
        case 'add':
          if (!newStudent.student_id || !newStudent.name || !newStudent.password) {
            setError('請填寫所有必填欄位');
            setIsSubmitting(false);
            return;
          }

          const studentData = {
            ...newStudent,
            student_class: currentClassId
          };

          await StudentService.createStudent(studentData);
          closeDialogHandler();
          fetchStudentData();
          break;

        case 'changePassword':
          if (!passwordForm.new_password) {
            setError('請填寫新密碼');
            setIsSubmitting(false);
            return;
          }

          if (!selectedStudent) {
            setError('未選擇學生');
            setIsSubmitting(false);
            return;
          }

          await StudentService.adminChangeStudentPassword(selectedStudent.student_id, passwordForm);
          closeDialogHandler();
          alert('密碼修改成功');
          break;

        case 'changeName':
          if (!nameForm.name) {
            setError('請填寫姓名');
            setIsSubmitting(false);
            return;
          }

          if (!selectedStudent) {
            setError('未選擇學生');
            setIsSubmitting(false);
            return;
          }

          const updateData: Req_updateStudent = {
            name: nameForm.name,
            student_class: nameForm.student_class || selectedStudent.student_class
          };

          await StudentService.updateStudent(selectedStudent.student_id, updateData);
          closeDialogHandler();
          fetchStudentData();
          break;

        case 'bulkImport':
          if (!selectedFile) {
            setError('請選擇Excel文件');
            setIsSubmitting(false);
            return;
          }

          const result = await StudentService.uploadStudents(selectedFile);
          setImportResult(result);
          fetchStudentData();
          break;
      }
    } catch (err) {
      console.error(`操作失敗:`, err);
      setError('操作失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (student: IStudent) => {
    try {
      await StudentService.toggleStudentActive(student.student_id);
      fetchStudentData();
    } catch (err) {
      console.error('切換啟用狀態失敗:', err);
      alert('切換啟用狀態失敗，請稍後再試');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDownloadTemplate = () => {
    StudentService.downloadStudentTemplate();
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchStudentData = async () => {
    const studentData = await StudentService.getStudentsByClass(currentClassId);
    setStudents(studentData)
  }

  useEffect(() => {
    fetchStudentData()
  }, [currentClassId])

  useEffect(() => {
    setNewStudent(prev => ({
      ...prev,
      student_class: currentClassId
    }));

    setNameForm(prev => ({
      ...prev,
      student_class: currentClassId
    }));
  }, [currentClassId]);

  // 根據對話框類型獲取標題
  const getDialogTitle = () => {
    switch (openDialog) {
      case 'add':
        return '新增學生';
      case 'changePassword':
        return `修改密碼 - ${selectedStudent?.name} (${selectedStudent?.student_id})`;
      case 'changeName':
        return `修改姓名 - ${selectedStudent?.student_id}`;
      case 'bulkImport':
        return '批量導入學生';
      default:
        return '';
    }
  };

  // 渲染對話框內容
  const renderDialogContent = () => {
    switch (openDialog) {
      case 'add':
        return (
          <div className="space-y-4">
            <Input
              label="學號"
              name="student_id"
              value={newStudent.student_id}
              onChange={handleInputChange}
              required
              crossOrigin={undefined}
            />
            <Input
              label="姓名"
              name="name"
              value={newStudent.name}
              onChange={handleInputChange}
              required
              crossOrigin={undefined}
            />
            <Input
              label="密碼"
              name="password"
              type="password"
              value={newStudent.password}
              onChange={handleInputChange}
              required
              crossOrigin={undefined}
            />
          </div>
        );
      case 'changePassword':
        return (
          <div className="space-y-4">
            <Input
              label="新密碼"
              name="new_password"
              type="password"
              value={passwordForm.new_password}
              onChange={handlePasswordInputChange}
              required
              crossOrigin={undefined}
            />
          </div>
        );
      case 'changeName':
        return (
          <div className="space-y-4">
            <Input
              label="姓名"
              name="name"
              value={nameForm.name}
              onChange={handleNameInputChange}
              required
              crossOrigin={undefined}
            />
          </div>
        );
      case 'bulkImport':
        return (
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  color="blue"
                  placeholder={undefined}
                >
                  選擇Excel文件
                </Button>
                <span className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : '未選擇文件'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outlined"
                  color="blue"
                  className="flex items-center gap-2"
                  onClick={handleDownloadTemplate}
                  placeholder={undefined}
                >
                  <DocumentArrowDownIcon className="h-4 w-4"/>
                  下載範本
                </Button>
                <Typography variant="small" color="gray" placeholder={undefined}>
                  請先下載範本，填寫後再上傳
                </Typography>
              </div>
            </div>

            {importResult && (
              <div className="mt-4">
                <Alert color={importResult.details?.failed && importResult.details.failed > 0 ? "amber" : "green"}>
                  {importResult.message}
                </Alert>

                {importResult.details?.errors && importResult.details.errors.length > 0 && (
                  <div className="mt-4 max-h-40 overflow-y-auto">
                    <Typography variant="small" color="red" className="font-semibold" placeholder={undefined}>
                      錯誤詳情:
                    </Typography>
                    <ul className="list-disc pl-5 text-sm text-red-500">
                      {importResult.details.errors.map((error, index) => (
                        <li key={index}>
                          第 {error.row} 行 (學號: {error.student_id}): {error.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // 獲取確認按鈕文字
  const getConfirmButtonText = () => {
    if (isSubmitting) return '處理中...';

    switch (openDialog) {
      case 'add':
        return '確認新增';
      case 'changePassword':
        return '確認修改';
      case 'changeName':
        return '確認修改';
      case 'bulkImport':
        return '確認導入';
      default:
        return '確認';
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <Card placeholder={undefined}>
        <CardBody placeholder={undefined}>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                className="bg-green-500 hover:bg-green-600"
                placeholder={undefined}
                onClick={() => openDialogHandler('add')}
              >
                新增學生
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
                placeholder={undefined}
                onClick={() => openDialogHandler('bulkImport')}
              >
                批量新增學生
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Input
                label="搜尋學生"
                icon={<MagnifyingGlassIcon className="h-5 w-5"/>}
                className="min-w-[200px]"
                crossOrigin={undefined}
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </CardBody>
      </Card>
      <Card placeholder={undefined}>
        <CardBody placeholder={undefined}>
          <Typography variant="h5" className="mb-4 text-gray-800" placeholder={undefined}>
            學生名單 - {currentClassName}
          </Typography>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
              <tr className="border-b border-gray-200 text-center">
                <th className="p-3 font-semibold">姓名</th>
                <th className="p-3 font-semibold">學號</th>
                <th className="p-3 font-semibold">啟用狀態</th>
                <th className="p-3 font-semibold">操作</th>
              </tr>
              </thead>
              <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.student_id} className="border-b border-gray-100 hover:bg-gray-50 text-center">
                  <td className="p-3">{student.name}</td>
                  <td className="p-3">{student.student_id}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-sm text-xs font-semibold ${student.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {student.is_active ? '啟用' : '停用'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="text"
                        size="sm"
                        color='light-green'
                        placeholder={undefined}
                        onClick={() => openDialogHandler('changePassword', student)}
                      >
                        修改密碼
                      </Button>
                      <Button
                        variant="text"
                        size="sm"
                        color='light-green'
                        placeholder={undefined}
                        onClick={() => openDialogHandler('changeName', student)}
                      >
                        修改姓名
                      </Button>
                      <Button
                        variant="text"
                        size="sm"
                        color='light-green'
                        placeholder={undefined}
                        onClick={() => handleToggleActive(student)}
                      >
                        {student.is_active ? '停用' : '啟用'}
                      </Button>
                      {
                        currentClassName !== 'teacher' && (
                          <Button variant="text" size="sm" className="text-orange-500" placeholder={undefined}>
                            作業狀況
                          </Button>
                        )
                      }
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              {searchQuery ? '沒有符合搜尋條件的學生' : '尚無學生資料'}
            </div>
          )}
        </CardBody>
      </Card>

      {/* 共用對話框 */}
      <Dialog
        open={openDialog !== null}
        handler={closeDialogHandler}
        placeholder={undefined}
        size={openDialog === 'bulkImport' ? 'md' : 'sm'}
      >
        <DialogHeader placeholder={undefined}>{getDialogTitle()}</DialogHeader>
        <DialogBody placeholder={undefined}>
          {renderDialogContent()}
          {error && (
            <div className="text-red-500 text-sm mt-4">{error}</div>
          )}
        </DialogBody>
        <DialogFooter placeholder={undefined}>
          <Button
            variant="text"
            color="red"
            onClick={closeDialogHandler}
            className="mr-2"
            placeholder={undefined}
            disabled={isSubmitting}
          >
            {importResult ? '關閉' : '取消'}
          </Button>
          {!importResult && (
            <Button
              color="green"
              onClick={handleSubmit}
              placeholder={undefined}
              disabled={isSubmitting}
            >
              {getConfirmButtonText()}
            </Button>
          )}
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default StudentListComponent;
