import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { LoadingSpinner } from "../loading-spinner";
import { PlusCircle, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Availability = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

const daysOfWeek = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export function ProfessionalProfile() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );

  const updateUserProfile = useMutation(api.users.updateUserProfile);

  const [specialization, setSpecialization] = useState<string>(
    userData?.specialization || "",
  );
  const [professionalLicense, setProfessionalLicense] = useState<string>(
    userData?.professionalLicense || "",
  );
  const [availability, setAvailability] = useState<Availability[]>(
    userData?.availability || [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Novos estados para adicionar disponibilidade
  const [newDay, setNewDay] = useState<number>(1); // Segunda-feira por padrão
  const [newStartTime, setNewStartTime] = useState<string>("08:00");
  const [newEndTime, setNewEndTime] = useState<string>("17:00");

  // Atualizar estados quando os dados do usuário são carregados
  useState(() => {
    if (userData) {
      setSpecialization(userData.specialization || "");
      setProfessionalLicense(userData.professionalLicense || "");
      setAvailability(userData.availability || []);
    }
  });

  const handleAddAvailability = () => {
    // Verificar se já existe disponibilidade para este dia
    const existingDay = availability.find((a) => a.dayOfWeek === newDay);
    if (existingDay) {
      // Substituir a disponibilidade existente
      setAvailability(
        availability.map((a) =>
          a.dayOfWeek === newDay
            ? {
                dayOfWeek: newDay,
                startTime: newStartTime,
                endTime: newEndTime,
              }
            : a,
        ),
      );
    } else {
      // Adicionar nova disponibilidade
      setAvailability([
        ...availability,
        { dayOfWeek: newDay, startTime: newStartTime, endTime: newEndTime },
      ]);
    }
  };

  const handleRemoveAvailability = (dayOfWeek: number) => {
    setAvailability(availability.filter((a) => a.dayOfWeek !== dayOfWeek));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateUserProfile({
        userType: "professional",
        specialization,
        professionalLicense,
        availability,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#1D1D1F]">
          Perfil Profissional
        </h2>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="border-[#0066CC] text-[#0066CC] hover:bg-[#F5F5F7]"
          >
            Editar Perfil
          </Button>
        ) : null}
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-[#86868B]">Nome</h3>
                <p className="text-[#1D1D1F]">
                  {userData.name || "Não informado"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#86868B]">Email</h3>
                <p className="text-[#1D1D1F]">
                  {userData.email || "Não informado"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Informações Profissionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-[#86868B]">
                  Especialização
                </h3>
                <p className="text-[#1D1D1F]">
                  {userData.specialization || "Não informada"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#86868B]">
                  Registro Profissional
                </h3>
                <p className="text-[#1D1D1F]">
                  {userData.professionalLicense || "Não informado"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Disponibilidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userData.availability && userData.availability.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#F5F5F7]">
                        <th className="text-left py-2 px-4 text-sm font-medium text-[#86868B]">
                          Dia
                        </th>
                        <th className="text-left py-2 px-4 text-sm font-medium text-[#86868B]">
                          Horário
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.availability
                        .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                        .map((slot, index) => (
                          <tr
                            key={index}
                            className="border-b border-[#F5F5F7] last:border-0"
                          >
                            <td className="py-3 px-4">
                              {daysOfWeek[slot.dayOfWeek]}
                            </td>
                            <td className="py-3 px-4">
                              {slot.startTime} - {slot.endTime}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[#86868B]">
                  Nenhuma disponibilidade registrada.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Informações Profissionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="specialization">Especialização</Label>
                <Input
                  id="specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="Ex: Cardiologia, Clínica Geral, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">Registro Profissional</Label>
                <Input
                  id="license"
                  value={professionalLicense}
                  onChange={(e) => setProfessionalLicense(e.target.value)}
                  placeholder="Ex: CRM, COREN, etc."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Disponibilidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#F5F5F7]">
                      <th className="text-left py-2 px-4 text-sm font-medium text-[#86868B]">
                        Dia
                      </th>
                      <th className="text-left py-2 px-4 text-sm font-medium text-[#86868B]">
                        Horário
                      </th>
                      <th className="text-right py-2 px-4 text-sm font-medium text-[#86868B]">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {availability
                      .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                      .map((slot, index) => (
                        <tr
                          key={index}
                          className="border-b border-[#F5F5F7] last:border-0"
                        >
                          <td className="py-3 px-4">
                            {daysOfWeek[slot.dayOfWeek]}
                          </td>
                          <td className="py-3 px-4">
                            {slot.startTime} - {slot.endTime}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveAvailability(slot.dayOfWeek)
                              }
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="day">Dia da Semana</Label>
                  <Select
                    value={newDay.toString()}
                    onValueChange={(value) => setNewDay(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Horário Inicial</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Horário Final</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleAddAvailability}
                  variant="outline"
                  className="border-[#0066CC] text-[#0066CC] hover:bg-[#F5F5F7]"
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Adicionar
                  Disponibilidade
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="border-gray-300"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0066CC] hover:bg-[#0077ED] text-white"
            >
              {isSubmitting ? <LoadingSpinner /> : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
