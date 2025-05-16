import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Obter todas as mensagens de uma conversa
export const getConversationMessages = query({
  args: { userId1: v.id("users"), userId2: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Não autenticado");
    }

    // Obter mensagens enviadas de userId1 para userId2
    const sentMessages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", args.userId1).eq("receiverId", args.userId2),
      )
      .collect();

    // Obter mensagens enviadas de userId2 para userId1
    const receivedMessages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", args.userId2).eq("receiverId", args.userId1),
      )
      .collect();

    // Combinar e ordenar todas as mensagens por timestamp
    return [...sentMessages, ...receivedMessages].sort(
      (a, b) => a.timestamp - b.timestamp,
    );
  },
});

// Obter todas as conversas de um usuário
export const getUserConversations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Não autenticado");
    }

    // Obter o usuário atual
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Obter mensagens enviadas pelo usuário
    const sentMessages = await ctx.db
      .query("messages")
      .withIndex("by_sender", (q) => q.eq("senderId", user._id))
      .collect();

    // Obter mensagens recebidas pelo usuário
    const receivedMessages = await ctx.db
      .query("messages")
      .withIndex("by_receiver", (q) => q.eq("receiverId", user._id))
      .collect();

    // Extrair IDs únicos de usuários com quem o usuário atual conversou
    const conversationUserIds = new Set();
    sentMessages.forEach((msg) => conversationUserIds.add(msg.receiverId));
    receivedMessages.forEach((msg) => conversationUserIds.add(msg.senderId));

    // Obter detalhes dos usuários
    const conversationUsers = await Promise.all(
      Array.from(conversationUserIds).map(async (userId) => {
        return await ctx.db.get(userId as any);
      }),
    );

    return conversationUsers;
  },
});

// Enviar uma nova mensagem
export const sendMessage = mutation({
  args: {
    receiverId: v.id("users"),
    content: v.string(),
    attachmentUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Não autenticado");
    }

    // Obter o usuário atual (remetente)
    const sender = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!sender) {
      throw new Error("Usuário não encontrado");
    }

    // Verificar se o destinatário existe
    const receiver = await ctx.db.get(args.receiverId);
    if (!receiver) {
      throw new Error("Destinatário não encontrado");
    }

    // Criar a mensagem
    return await ctx.db.insert("messages", {
      senderId: sender._id,
      receiverId: args.receiverId,
      content: args.content,
      timestamp: Date.now(),
      read: false,
      attachmentUrl: args.attachmentUrl,
    });
  },
});

// Marcar mensagens como lidas
export const markMessagesAsRead = mutation({
  args: {
    senderId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Não autenticado");
    }

    // Obter o usuário atual (destinatário)
    const receiver = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!receiver) {
      throw new Error("Usuário não encontrado");
    }

    // Obter todas as mensagens não lidas do remetente para o destinatário
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", args.senderId).eq("receiverId", receiver._id),
      )
      .filter((q) => q.eq(q.field("read"), false))
      .collect();

    // Marcar todas as mensagens como lidas
    await Promise.all(
      unreadMessages.map(async (message) => {
        await ctx.db.patch(message._id, { read: true });
      }),
    );

    return { success: true, count: unreadMessages.length };
  },
});
