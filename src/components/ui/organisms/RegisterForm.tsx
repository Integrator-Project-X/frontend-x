"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { Button } from "@/src/components/ui/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/atoms/card";
import { Input } from "@/src/components/ui/atoms/input";
import { Label } from "@/src/components/ui/atoms/label";
import { Alert, AlertDescription } from "@/src/components/ui/atoms/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/atoms/tabs";

export default function RegisterForm() {
  const router = useRouter();

  const [role, setRole] = useState<"owner" | "vet">("owner");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const payload =
      role === "vet"
        ? { role, name, email, clinicName, password }
        : { role, name, email, password };

    const r = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!r.ok) {
      const data = await r.json().catch(() => null);
      setError(data?.message ?? "Register failed");
      return;
    }

    router.push("/login");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Create account</CardTitle>
        <CardDescription>Register to start using VetConnect.</CardDescription>
      </CardHeader>

      <form onSubmit={submit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={role} onValueChange={(v) => setRole(v as "owner" | "vet")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="owner">Pet Owner</TabsTrigger>
              <TabsTrigger value="vet">Veterinarian</TabsTrigger>
            </TabsList>

            <TabsContent value="owner" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name-owner">Full name</Label>
                <Input
                  id="name-owner"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="vet" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name-vet">Full name</Label>
                <Input
                  id="name-vet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Jane Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinic">Clinic name</Label>
                <Input
                  id="clinic"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  placeholder="Happy Paws Clinic"
                  required
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Mock register for now. Later we’ll connect to backend + DB.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
