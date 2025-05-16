import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { useState, useEffect, useRef } from "react";
import { LoadingSpinner } from "../loading-spinner";
import { formatDate } from "../../lib/utils";
import { Send, Paperclip, Lock } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function ChatInterface() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState<string>("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const conversations = useQuery(api.messages.getUserConversations);
  const messages = useQuery(
    api.messages.getConversationMessages,
    userData?._id && selectedUserId
      ? { userId1: userData._id, userId2: selectedUserId }
      : "skip",
  );

  const sendMessage = useMutation(api.messages.sendMessage);
  const markMessagesAsRead = useMutation(api.messages.markMessagesAsRead);

  // Rolar para o final quando novas mensagens chegarem
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  // Marcar mensagens como lidas quando o usuário seleciona uma conversa
  useEffect(() => {
    if (selectedUserId && userData?._id) {
      markMessagesAsRead({ senderId: selectedUserId }).catch(console.error);
    }
  }, [selectedUserId, userData?._id, markMessagesAsRead]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedUserId) return;

    try {
      await sendMessage({
        receiverId: selectedUserId,
        content: messageText,
      });
      setMessageText("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#1D1D1F]">Chat Seguro</h2>
        <div className="flex items-center text-sm text-green-600">
          <Lock className="h-4 w-4 mr-1" />
          Criptografado
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
        {/* Lista de Conversas */}
        <Card className="md:col-span-1 h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Conversas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[530px] pr-4">
              {conversations && conversations.length > 0 ? (
                <div className="space-y-1 p-2">
                  {conversations.map((contact) => (
                    <Button
                      key={contact._id}
                      variant="ghost"
                      className={`w-full justify-start px-2 py-2 h-auto ${selectedUserId === contact._id ? "bg-[#F5F5F7]" : ""}`}
                      onClick={() => setSelectedUserId(contact._id)}
                    >
                      <div className="flex items-center w-full">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={contact.image || undefined} />
                          <AvatarFallback>
                            {getInitials(contact.name || "Usuário")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-medium text-sm">{contact.name}</p>
                          <p className="text-xs text-[#86868B] truncate">
                            {contact.userType === "professional"
                              ? contact.specialization
                              : "Paciente"}
                          </p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-[#86868B]">
                  <p>Nenhuma conversa encontrada.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Área de Chat */}
        <Card className="md:col-span-3 h-full flex flex-col">
          {selectedUserId ? (
            <>
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-lg font-medium">
                  {conversations?.find((c) => c._id === selectedUserId)?.name ||
                    "Chat"}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 flex flex-col">
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                  {messages && messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const isCurrentUser = message.senderId === userData._id;
                        return (
                          <div
                            key={message._id}
                            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                isCurrentUser
                                  ? "bg-[#0066CC] text-white"
                                  : "bg-[#F5F5F7] text-[#1D1D1F]"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${isCurrentUser ? "text-blue-100" : "text-[#86868B]"}`}
                              >
                                {formatDate(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-[#86868B]">
                      <p>Nenhuma mensagem. Comece a conversar!</p>
                    </div>
                  )}
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="border-[#0066CC] text-[#0066CC] hover:bg-[#F5F5F7]"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      onClick={handleSendMessage}
                      className="bg-[#0066CC] hover:bg-[#0077ED] text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-[#86868B]">
              <div className="text-center">
                <p>Selecione uma conversa para começar a trocar mensagens.</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
