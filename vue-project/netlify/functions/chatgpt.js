import fetch from 'node-fetch'; // Node-fetch v3.3.2

// Netlify cung cấp các biến môi trường qua process.env
const API_KEY = process.env.CHATGPT_API_KEY; 
const API_URL = "https://api.openai.com/v1/chat/completions";

export async function handler(event) {
  try {
    // Parse body của request từ phía Vue gửi lên
    const body = JSON.parse(event.body);
    const userPrompt = body.prompt; // Prompt từ Vue gửi

    if (!userPrompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Prompt is required." }),
      };
    }

    // Gửi request đến GPT-4o-mini thông qua OpenAI API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Sử dụng GPT-4o-mini
        messages: [{ role: "user", content: userPrompt }], // Định dạng API
        temperature: 0.7, // Tùy chỉnh độ sáng tạo
      }),
    });

    // Kiểm tra phản hồi từ OpenAI API
    if (!response.ok) {
      const error = await response.json();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: error.message || "Error calling OpenAI API." }),
      };
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "No response from OpenAI.";

    // Gửi lại kết quả về phía Vue
    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
