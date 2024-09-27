"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { confirmSignUp, signIn, signUp } from "aws-amplify/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const AUTH_STEPS = ["login", "register"] as const;
type Step = (typeof AUTH_STEPS)[number];
const OTP_LENGTH = 6;

export default function LoginRegister() {
  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn({
        username: email,
        password,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp({ username: email, password });
      setShowOtp(true);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
      });
    }
  };

  const handleConfirmRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: otp,
      });
      setStep("login");
      setShowOtp(false);
      toast({
        title: "Registration Successful!",
        description: `Account with email ${email} has been registered`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-gray-100 to-gray-200">
      <Link
        href="/"
        className="flex w-[350px] mb-2 md:me-12 md:w-[80%] md:max-w-[450px] text-gray-400 cursor-pointer hover:underline underline-offset-2"
      >
        <ChevronLeft className="mr-2" /> Back to home
      </Link>
      <Card className="w-[350px] md:w-[80%] md:max-w-[450px]">
        <CardHeader>
          <CardTitle>Welcome to Acme Inc.</CardTitle>
          <CardDescription>
            Login or create an account to get started.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs
            defaultValue={AUTH_STEPS["0"]}
            value={step}
            onValueChange={(step) => setStep(step as Step)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value={AUTH_STEPS["0"]}>
              <form onSubmit={handleLogin}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button className="w-full mt-4" type="submit">
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value={AUTH_STEPS["1"]}>
              <form
                onSubmit={showOtp ? handleConfirmRegistration : handleRegister}
              >
                <div className="grid w-full items-center gap-4">
                  {showOtp ? (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="otp">OTP</Label>
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                      >
                        <InputOTPGroup>
                          {Array.from({ length: OTP_LENGTH }).map(
                            (_, index) => (
                              <InputOTPSlot key={index} index={index} />
                            )
                          )}
                        </InputOTPGroup>
                      </InputOTP>
                      <p className="text-xs text-muted-foreground">
                        An OTP was sent to {email}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="register-password">Password</Label>
                        <Input
                          id="register-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}
                </div>

                <Button className="w-full mt-4" type="submit">
                  Register
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Acme Inc. - Your Personal Note-Taking Solution
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
