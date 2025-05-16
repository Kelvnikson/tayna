import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { LoadingSpinner } from "../loading-spinner";
import { Badge } from "../ui/badge";
import { PlusCircle, X } from "lucide-react";

export function PatientProfile() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );

  const updateUserProfile = useMutation(api.users.updateUserProfile);

  const [medicalHistory, setMedicalHistory] = useState<string>(
    userData?.medicalHistory || "",
  );
  const [newAllergy, setNewAllergy] = useState<string>("");
  const [allergies, setAllergies] = useState<string[]>(
    userData?.allergies || [],
  );
  const [birthDate, setBirthDate] = useState<string>(userData?.birthDate || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Atualizar estados quando os dados do usuário são carregados
  useState(() => {
    if (userData) {
      setMedicalHistory(userData.medicalHistory || "");
      setAllergies(userData.allergies || []);
      setBirthDate(userData.birthDate || "");
    }
  });

  const handleAddAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    setAllergies(allergies.filter((a) => a !== allergy));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateUserProfile({
        userType: "patient",
        medicalHistory,
        allergies,
        birthDate,
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
          Perfil do Paciente
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
              <div>
                <h3 className="text-sm font-medium text-[#86868B]">
                  Data de Nascimento
                </h3>
                <p className="text-[#1D1D1F]">
                  {userData.birthDate || "Não informada"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Histórico Médico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#1D1D1F] whitespace-pre-wrap">
                {userData.medicalHistory ||
                  "Nenhum histórico médico registrado."}
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Alergias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userData.allergies && userData.allergies.length > 0 ? (
                  userData.allergies.map((allergy, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {allergy}
                    </Badge>
                  ))
                ) : (
                  <p className="text-[#86868B]">Nenhuma alergia registrada.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Histórico Médico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                placeholder="Descreva seu histórico médico, condições pré-existentes, cirurgias, etc."
                rows={5}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Alergias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {allergies.map((allergy, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {allergy}
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergy(allergy)}
                      className="ml-2 text-[#86868B] hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Adicionar alergia"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddAllergy}
                  variant="outline"
                  className="border-[#0066CC] text-[#0066CC] hover:bg-[#F5F5F7]"
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Adicionar
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
