import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    tokenIdentifier: v.string(),
    userType: v.optional(v.string()), // "patient" ou "professional"
    // Campos específicos para pacientes
    medicalHistory: v.optional(v.string()),
    allergies: v.optional(v.array(v.string())),
    birthDate: v.optional(v.string()),
    // Campos específicos para profissionais
    specialization: v.optional(v.string()),
    professionalLicense: v.optional(v.string()),
    availability: v.optional(
      v.array(
        v.object({
          dayOfWeek: v.number(),
          startTime: v.string(),
          endTime: v.string(),
        }),
      ),
    ),
  }).index("by_token", ["tokenIdentifier"]),

  healthMetrics: defineTable({
    userId: v.id("users"),
    type: v.string(), // "bloodPressure", "glucose", "heartRate"
    value: v.number(),
    unit: v.string(), // "mmHg", "mg/dL", "bpm"
    timestamp: v.number(),
    isAbnormal: v.boolean(),
    notes: v.optional(v.string()),
    systolic: v.optional(v.number()), // Para pressão arterial
    diastolic: v.optional(v.number()), // Para pressão arterial
  }).index("by_user", ["userId"]),

  appointments: defineTable({
    patientId: v.id("users"),
    professionalId: v.id("users"),
    date: v.string(),
    time: v.string(),
    status: v.string(), // "scheduled", "confirmed", "canceled", "completed"
    notes: v.optional(v.string()),
    reminderSent: v.boolean(),
    type: v.optional(v.string()), // "presencial", "telemedicina"
    location: v.optional(v.string()),
  })
    .index("by_patient", ["patientId"])
    .index("by_professional", ["professionalId"]),

  messages: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),
    content: v.string(),
    timestamp: v.number(),
    read: v.boolean(),
    attachmentUrl: v.optional(v.string()),
  })
    .index("by_sender", ["senderId"])
    .index("by_receiver", ["receiverId"])
    .index("by_conversation", ["senderId", "receiverId"]),
});
