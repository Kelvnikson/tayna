import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Obter todos os agendamentos de um paciente
export const getAppointmentsByPatient = query({
  args: { patientId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Não autenticado");
    }

    return await ctx.db
      .query("appointments")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .collect();
  },
});

// Obter todos os agendamentos de um profissional
export const getAppointmentsByProfessional = query({
  args: { professionalId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Não autenticado");
    }

    return await ctx.db
      .query("appointments")
      .withIndex("by_professional", (q) =>
        q.eq("professionalId", args.professionalId),
      )
      .collect();
  },
});

// Criar um novo agendamento
export const createAppointment = mutation({
  args: {
    professionalId: v.id("users"),
    date: v.string(),
    time: v.string(),
    notes: v.optional(v.string()),
    type: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Não autenticado");
    }

    // Obter o usuário atual (paciente)
    const patient = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!patient) {
      throw new Error("Usuário não encontrado");
    }

    // Verificar se o profissional existe
    const professional = await ctx.db.get(args.professionalId);
    if (!professional) {
      throw new Error("Profissional não encontrado");
    }

    // Criar o agendamento
    return await ctx.db.insert("appointments", {
      patientId: patient._id,
      professionalId: args.professionalId,
      date: args.date,
      time: args.time,
      status: "scheduled",
      notes: args.notes,
      reminderSent: false,
      type: args.type,
      location: args.location,
    });
  },
});

// Atualizar o status de um agendamento
export const updateAppointmentStatus = mutation({
  args: {
    appointmentId: v.id("appointments"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Não autenticado");
    }

    // Verificar se o agendamento existe
    const appointment = await ctx.db.get(args.appointmentId);
    if (!appointment) {
      throw new Error("Agendamento não encontrado");
    }

    // Atualizar o status do agendamento
    return await ctx.db.patch(args.appointmentId, {
      status: args.status,
    });
  },
});

// Marcar lembrete como enviado
export const markReminderSent = mutation({
  args: {
    appointmentId: v.id("appointments"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Não autenticado");
    }

    // Verificar se o agendamento existe
    const appointment = await ctx.db.get(args.appointmentId);
    if (!appointment) {
      throw new Error("Agendamento não encontrado");
    }

    // Marcar lembrete como enviado
    return await ctx.db.patch(args.appointmentId, {
      reminderSent: true,
    });
  },
});
