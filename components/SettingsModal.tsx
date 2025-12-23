
import React, { useState } from 'react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [studentText, setStudentText] = useState(settings.students.join('\n'));
  const [timer, setTimer] = useState(settings.timer);

  const handleSave = () => {
    const studentList = studentText.split('\n').map(s => s.trim()).filter(s => s !== '');
    onSave({
      students: studentList,
      timer: timer
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-4 border-yellow-400 overflow-hidden bounce-in flex flex-col max-h-[90vh]">
        <div className="bg-yellow-400 p-4 flex justify-between items-center shrink-0">
          <h2 className="text-2xl font-bold text-blue-800">⚙️ Cài Đặt Lớp Học</h2>
          <button onClick={onClose} className="text-blue-800 text-2xl hover:scale-110 transition-transform">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <label className="block text-blue-800 font-bold mb-2">Danh sách học sinh (Mỗi tên 1 dòng):</label>
            <textarea
              className="w-full h-48 p-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 outline-none"
              value={studentText}
              onChange={(e) => setStudentText(e.target.value)}
              placeholder="Nguyễn Văn A\nTrần Thị B..."
            />
          </div>

          <div>
            <label className="block text-blue-800 font-bold mb-2">Thời gian đếm ngược (giây):</label>
            <input
              type="number"
              className="w-full p-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 outline-none"
              value={timer}
              onChange={(e) => setTimer(Number(e.target.value))}
              min="5"
              max="120"
            />
          </div>
        </div>

        <div className="p-6 pt-0 shrink-0">
          <button
            onClick={handleSave}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all text-xl"
          >
            Lưu Thay Đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
