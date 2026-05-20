import { Step1Data } from '../../schemas/registration/step1Schema';
import { Step2Data } from '../../schemas/registration/step2Schema';

export interface RegistrationPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  categories: string[];
  notifications: {
    email: boolean;
    push: boolean;
  };
  newsletter?: boolean;
}

export class RegistrationError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'RegistrationError';
  }
}

export async function registerUser(
  step1: Step1Data,
  step2: Step2Data
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (step1.email === 'test@example.com') {
    throw new RegistrationError('Ten adres e-mail jest już zarejestrowany', 409);
  }

  if (Math.random() < 0.1) {
    throw new RegistrationError('Błąd serwera, spróbuj ponownie później', 500);
  }

  const payload: RegistrationPayload = {
    firstName: step1.firstName,
    lastName: step1.lastName,
    email: step1.email,
    password: step1.password,
    categories: step2.categories,
    notifications: step2.notifications,
    newsletter: step2.newsletter,
  };

  console.log('Registration successful:', payload);
}
