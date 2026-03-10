import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ChatSendInput } from "@shared/routes";

export function useChatList() {
  return useQuery({
    queryKey: [api.chat.list.path],
    queryFn: async () => {
      const res = await fetch(api.chat.list.path, { credentials: "include" });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch chat history");
      return api.chat.list.responses[200].parse(await res.json());
    },
  });
}

export function useSendChatMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ChatSendInput) => {
      const res = await fetch(api.chat.send.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to send message");
      return api.chat.send.responses[200].parse(await res.json());
    },
    onMutate: async (newMessage) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: [api.chat.list.path] });
      const previousMessages = queryClient.getQueryData<any[]>([api.chat.list.path]);
      
      if (previousMessages) {
        queryClient.setQueryData([api.chat.list.path], [
          ...previousMessages,
          { id: Date.now(), role: 'user', content: newMessage.message, createdAt: new Date().toISOString() }
        ]);
      }
      return { previousMessages };
    },
    onError: (err, newMessage, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData([api.chat.list.path], context.previousMessages);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [api.chat.list.path] });
    },
  });
}
