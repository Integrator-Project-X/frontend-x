export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type VerificationClinic = {
  id: string;
  clinicName: string;
  email: string;
  city: string;
  submittedAt: string; // "YYYY-MM-DD"
  status: VerificationStatus;

  // flags / checks (MVP)
  docsProvided: boolean;
  locationProvided: boolean;

  // Visibilidad pública en el marketplace
  visibilityEnabled: boolean;
};
