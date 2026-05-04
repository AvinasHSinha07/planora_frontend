import axiosInstance from "./axiosInstance";

export type TChatMessage = {
  role: 'user' | 'model';
  parts: string;
};

export const ChatServices = {
  sendMessage: async (message: string, history: TChatMessage[]) => {
    const { data } = await axiosInstance.post("/ai/chat", { message, history });
    return { reply: data.data };
  }
};
