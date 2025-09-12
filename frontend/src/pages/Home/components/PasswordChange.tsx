import React, {useState} from "react";
import {useSelector} from "react-redux";
import {API_changeStudentPassword} from "../../../utils/API/API_student";
import {Req_changePassword} from "../../../utils/API/interface";

interface PasswordChangeProps {
  open: boolean;
  onClose: () => void;
}

const PasswordChangeComponent: React.FC<PasswordChangeProps> = ({open, onClose}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const {studentId} = useSelector((state: any) => state.userInfo);

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("請填寫所有欄位");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("新密碼與確認密碼不一致");
      return;
    }
    setChangingPassword(true);
    try {
      // 準備請求數據
      const passwordData: Req_changePassword = {
        old_password: oldPassword,
        new_password: newPassword
      };

      // 發送密碼更改請求
      const response = await API_changeStudentPassword(studentId, passwordData);

      console.log(response)

      setPasswordSuccess("密碼修改成功");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        onClose()
      }, 1000);
    } catch (error) {
      setPasswordError("密碼修改失敗，請檢查舊密碼是否正確");
    } finally {
      setChangingPassword(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">修改密碼</h2>
        <input
          type="password"
          placeholder="舊密碼"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="新密碼"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="確認新密碼"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        {passwordError && <div className="text-red-500 mb-2">{passwordError}</div>}
        {passwordSuccess && <div className="text-green-500 mb-2">{passwordSuccess}</div>}
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
            disabled={changingPassword}
          >
            取消
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleChangePassword}
            disabled={changingPassword}
          >
            {changingPassword ? "修改中..." : "確認修改"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeComponent;
