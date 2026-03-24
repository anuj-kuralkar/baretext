export type SendOtpEmailFormState = {
  inputs: { email: string };
  errors: { email?: string[] };
  success: boolean;
};

export type VerifyOtpEmailFormState = {
  inputs: { otp: string };
  errors: { otp?: string[] };
};
