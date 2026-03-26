export type LoginWithEmailFormState = {
  inputs: { email: string; otp?: string };
  errors: { email?: string[]; otp?: string[] };
  success: boolean;
};
