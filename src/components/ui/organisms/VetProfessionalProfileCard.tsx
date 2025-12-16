import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/atoms/card";
import { Button } from "@/src/components/ui/atoms/button";
import { InfoField } from "@/src/components/ui/molecules/info-field";
import type { UserMe } from "@/src/types/users.types";

type Props = {
    profile: UserMe;
    email?: string;
    clinicName?: string;
    professionalLicense?: string;
};

export default function VetProfessionalProfileCard({
    profile,
    email,
    clinicName,
    professionalLicense,
}: Props) {
    return (
        <Card className="border-slate-200 bg-white lg:col-span-2">
            <CardHeader>
                <CardTitle className="text-lg">My Professional Profile</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <InfoField label="Name" value={profile?.full_name} />
                    <InfoField label="Email" value={email} />
                    <InfoField label="Clinic Name" value={clinicName} />
                    <InfoField label="Professional License" value={professionalLicense} />
                    <InfoField label="Clinic Address" value={profile?.address} className="md:col-span-2" />
                </div>

                <div className="pt-2">
                    <Button type="button" variant="secondary" disabled>
                        Edit Profile
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
