import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/atoms/card";

type Props = {
    tips?: string[];
};

export default function VetQuickTipsCard({
    tips = [
        "Confirm today’s appointments early to reduce cancellations.",
        "Keep your schedule updated to avoid overbooking.",
        "Complete diagnoses right after the consultation when possible.",
    ],
}: Props) {
    return (
        <Card className="border-amber-200 bg-amber-50/60">
            <CardHeader>
                <CardTitle className="text-lg">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-700">
                {tips.map((t) => (
                    <p key={t}>• {t}</p>
                ))}
            </CardContent>
        </Card>
    );
}
