import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import { formatDate } from "../../lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Calendar, Clock, MapPin, Video } from "lucide-react";

type Appointment = {
  _id: string;
  professionalId: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  type?: string;
  location?: string;
};

type Professional = {
  _id: string;
  name: string;
  specialization?: string;
};

type AppointmentListProps = {
  appointments: Appointment[];
  professionals: Professional[];
};

export function AppointmentList({
  appointments,
  professionals,
}: AppointmentListProps) {
  const updateAppointmentStatus = useMutation(
    api.appointments.updateAppointmentStatus,
  );

  const getProfessionalName = (professionalId: string) => {
    const professional = professionals.find((p) => p._id === professionalId);
    return professional ? professional.name : "Profissional não encontrado";
  };

  const getProfessionalSpecialization = (professionalId: string) => {
    const professional = professionals.find((p) => p._id === professionalId);
    return professional?.specialization || "";
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await updateAppointmentStatus({
        appointmentId,
        status: "canceled",
      });
    } catch (error) {
      console.error("Erro ao cancelar consulta:", error);
    }
  };

  // Ordenar consultas por data e hora (mais próximas primeiro)
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  // Filtrar consultas futuras (status "scheduled" ou "confirmed")
  const upcomingAppointments = sortedAppointments.filter(
    (appointment) =>
      appointment.status === "scheduled" || appointment.status === "confirmed",
  );

  // Filtrar consultas passadas ou canceladas
  const pastAppointments = sortedAppointments.filter(
    (appointment) =>
      appointment.status === "completed" || appointment.status === "canceled",
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
            Agendada
          </span>
        );
      case "confirmed":
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
            Confirmada
          </span>
        );
      case "canceled":
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
            Cancelada
          </span>
        );
      case "completed":
        return (
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
            Concluída
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
            {status}
          </span>
        );
    }
  };

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#86868B]">Você não possui consultas agendadas.</p>
        <p className="text-sm text-[#86868B] mt-2">
          Clique em "Agendar Consulta" para marcar uma nova consulta.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {upcomingAppointments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Próximas Consultas</h3>
          <div className="grid grid-cols-1 gap-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="border border-[#E5E5EA] rounded-lg p-4 bg-white"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <h4 className="font-medium text-[#1D1D1F]">
                      {getProfessionalName(appointment.professionalId)}
                    </h4>
                    <p className="text-sm text-[#86868B]">
                      {getProfessionalSpecialization(
                        appointment.professionalId,
                      )}
                    </p>
                    <div className="flex items-center mt-2">
                      <Calendar className="h-4 w-4 text-[#86868B] mr-1" />
                      <span className="text-sm">
                        {new Date(appointment.date).toLocaleDateString("pt-BR")}
                      </span>
                      <Clock className="h-4 w-4 text-[#86868B] ml-3 mr-1" />
                      <span className="text-sm">{appointment.time}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      {appointment.type === "presencial" ? (
                        <>
                          <MapPin className="h-4 w-4 text-[#86868B] mr-1" />
                          <span className="text-sm">
                            {appointment.location}
                          </span>
                        </>
                      ) : (
                        <>
                          <Video className="h-4 w-4 text-[#86868B] mr-1" />
                          <span className="text-sm">Telemedicina</span>
                        </>
                      )}
                    </div>
                    {appointment.notes && (
                      <p className="text-sm text-[#86868B] mt-2">
                        <span className="font-medium">Observações:</span>{" "}
                        {appointment.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <div>{getStatusBadge(appointment.status)}</div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          Cancelar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancelar Consulta</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja cancelar esta consulta? Esta
                            ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Voltar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleCancelAppointment(appointment._id)
                            }
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Sim, cancelar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pastAppointments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Histórico de Consultas</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F5F5F7]">
                  <th className="text-left py-2 px-4 text-sm font-medium text-[#86868B]">
                    Profissional
                  </th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-[#86868B]">
                    Data
                  </th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-[#86868B]">
                    Horário
                  </th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-[#86868B]">
                    Tipo
                  </th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-[#86868B]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {pastAppointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className="border-b border-[#F5F5F7] last:border-0"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">
                          {getProfessionalName(appointment.professionalId)}
                        </p>
                        <p className="text-xs text-[#86868B]">
                          {getProfessionalSpecialization(
                            appointment.professionalId,
                          )}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(appointment.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 px-4">{appointment.time}</td>
                    <td className="py-3 px-4">
                      {appointment.type === "presencial"
                        ? "Presencial"
                        : "Telemedicina"}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(appointment.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
