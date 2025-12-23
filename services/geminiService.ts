
import { GoogleGenAI, Type } from "@google/genai";
import { GameType } from "../types";

export async function analyzeAndGenerateGame(rawData: string) {
  // Always create a new instance right before the call to ensure the latest API Key is used
  const ai = new GoogleGenAI({   apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  
  const prompt = `
    VAI TRÒ: Bạn là sự kết hợp của Chuyên gia Lập trình Web, Chuyên gia Giáo dục Tiểu học, Chuyên gia Ngôn ngữ Tiếng Việt và Thiết kế Game UI/UX cho trẻ em.

    NHIỆM VỤ: Phân tích DỮ LIỆU THÔ bên dưới và chọn 1 loại game phù hợp nhất theo logic:
    1. RUNG_CHUONG_VANG: Nếu dữ liệu có dạng câu hỏi trắc nghiệm (Có câu hỏi + Các phương án A, B, C, D + Đáp án đúng).
    2. MEMORY: Nếu dữ liệu là các cặp đôi giống nhau hoặc cặp "Từ vựng - Hình ảnh/Định nghĩa" (Số lượng < 12 cặp).
    3. MATCHING: Nếu dữ liệu là hai danh sách cần ghép đôi với nhau.
    4. BUBBLE_POP: Nếu dữ liệu là một yêu cầu tìm kiếm trong một tập hợp.
    5. WHATS_IN_BOX: Nếu dữ liệu là một danh sách các câu hỏi mở.
    6. GUESS_IMAGE: Nếu dữ liệu mô tả hình ảnh và yêu cầu đoán từ khóa.

    YÊU CẦU ĐẶC BIỆT:
    - Nếu là RUNG_CHUONG_VANG, hãy tạo một ngân hàng câu hỏi gồm đúng 50 câu (nếu dữ liệu thô ít hơn, hãy tự sáng tạo thêm các câu hỏi liên quan cùng chủ đề để đủ 50 câu). Mỗi câu hỏi phải có 4 đáp án A, B, C, D.
    - Nội dung phải phù hợp với học sinh tiểu học, ngôn ngữ trong sáng, dễ hiểu.
    - Cung cấp phần giải thích ngắn gọn cho mỗi câu trả lời đúng.

    DỮ LIỆU THÔ:
    ${rawData}

    YÊU CẦU ĐẦU RA: Trả về JSON với cấu trúc:
    {
      "type": "RUNG_CHUONG_VANG" | "MEMORY" | "MATCHING" | "BUBBLE_POP" | "WHATS_IN_BOX" | "GUESS_IMAGE",
      "title": "Tiêu đề trò chơi sinh động",
      "reason": "Lý do chọn game này dựa trên dữ liệu",
      "items": [
        // Đối với RUNG_CHUONG_VANG: { "id": "uuid", "text": "Câu hỏi?", "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"], "answer": "Nội dung đáp án đúng", "explanation": "Giải thích vì sao đúng..." }
        // Đối với MEMORY/MATCHING: { "id": "uuid", "left": "Từ/Vế 1", "right": "Định nghĩa/Vế 2" }
        // Đối với BUBBLE_POP: { "id": "uuid", "text": "Từ", "isCorrect": true/false }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
  model: "gemini-1.5-flash", // Dùng model này sẽ nhanh và ổn định hơn
  contents: prompt,
  config: {
    responseMimeType: "application/json",
  },
});

    const data = JSON.parse(response.text || "{}");
    return data;
  } catch (error: any) {
    console.error("Error generating game:", error);
    // If the key is missing or invalid, re-trigger the selection flow
    if (error.message?.includes("Requested entity was not found") || error.message?.includes("API key")) {
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
      }
    }
    throw error;
  }
}
