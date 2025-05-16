import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Obter todas as métricas de saúde de um usuário
export const getHealthMetricsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Não autenticado");
    }

    return await ctx.db
      .query("healthMetrics")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Obter métricas de saúde recentes de um usuário por tipo
export const getRecentHealthMetricsByType = query({
  args: { userId: v.id("users"), type: v.string(), limit: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Não autenticado");
    }

    return await ctx.db
      .query("healthMetrics")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("type"), args.type))
      .order("desc")
      .take(args.limit);
  },
});

// Adicionar uma nova métrica de saúde
export const addHealthMetric = mutation({
  args: {
    type: v.string(),
    value: v.number(),
    unit: v.string(),
    notes: v.optional(v.string()),
    systolic: v.optional(v.number()),
    diastolic: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
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

    // Verificar se o valor é anormal
    let isAbnormal = false;

    if (args.type === "bloodPressure" && args.systolic && args.diastolic) {
      // Pressão arterial anormal: sistólica > 140 ou < 90, diastólica > 90 ou < 60
      isAbnormal =
        args.systolic > 140 ||
        args.systolic < 90 ||
        args.diastolic > 90 ||
        args.diastolic < 60;
    } else if (args.type === "glucose") {
      // Glicemia anormal: > 180 mg/dL ou < 70 mg/dL
      isAbnormal = args.value > 180 || args.value < 70;
    } else if (args.type === "heartRate") {
      // Frequência cardíaca anormal: > 100 bpm ou < 60 bpm
      isAbnormal = args.value > 100 || args.value < 60;
    }

    // Criar a nova métrica de saúde
    return await ctx.db.insert("healthMetrics", {
      userId: user._id,
      type: args.type,
      value: args.value,
      unit: args.unit,
      timestamp: Date.now(),
      isAbnormal,
      notes: args.notes,
      systolic: args.systolic,
      diastolic: args.diastolic,
    });
  },
});

// Obter alertas de métricas anormais
export const getAbnormalMetrics = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Não autenticado");
    }

    return await ctx.db
      .query("healthMetrics")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isAbnormal"), true))
      .order("desc")
      .collect();
  },
});
