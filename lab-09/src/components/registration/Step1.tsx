import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, Step1Data } from '../../schemas/registration/step1Schema';
import { getPasswordStrength, getPasswordStrengthColor } from '../../utils/registration/passwordStrength';

interface Step1Props {
  onComplete: (data: Step1Data, setError?: any) => void;
  initialData?: Step1Data;
}

export function Step1({ onComplete, initialData }: Step1Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password');
  const passwordStrength = getPasswordStrength(passwordValue || '');
  const strengthColor = getPasswordStrengthColor(passwordStrength);

  const onSubmit = (data: Step1Data) => {
    onComplete(data, setError);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
          Imię <span className="text-red-600" aria-label="wymagane">*</span>
        </label>
        <input
          id="firstName"
          type="text"
          aria-required="true"
          aria-invalid={!!errors.firstName}
          aria-describedby={errors.firstName ? 'firstName-err' : undefined}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.firstName ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('firstName')}
        />
        {errors.firstName && (
          <span id="firstName-err" role="alert" className="text-red-600 text-sm mt-1 block">
            {errors.firstName.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
          Nazwisko <span className="text-red-600" aria-label="wymagane">*</span>
        </label>
        <input
          id="lastName"
          type="text"
          aria-required="true"
          aria-invalid={!!errors.lastName}
          aria-describedby={errors.lastName ? 'lastName-err' : undefined}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.lastName ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('lastName')}
        />
        {errors.lastName && (
          <span id="lastName-err" role="alert" className="text-red-600 text-sm mt-1 block">
            {errors.lastName.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          E-mail <span className="text-red-600" aria-label="wymagane">*</span>
        </label>
        <input
          id="email"
          type="email"
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-err' : undefined}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('email')}
        />
        {errors.email && (
          <span id="email-err" role="alert" className="text-red-600 text-sm mt-1 block">
            {errors.email.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Hasło <span className="text-red-600" aria-label="wymagane">*</span>
        </label>
        <input
          id="password"
          type="password"
          aria-required="true"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-err' : 'password-hint'}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('password')}
        />
        <span id="password-hint" aria-live="polite" className={`text-sm mt-1 block ${strengthColor}`}>
          Siła hasła: <strong>{passwordStrength}</strong>
        </span>
        {errors.password && (
          <span id="password-err" role="alert" className="text-red-600 text-sm mt-1 block">
            {errors.password.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Potwierdź hasło <span className="text-red-600" aria-label="wymagane">*</span>
        </label>
        <input
          id="confirmPassword"
          type="password"
          aria-required="true"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? 'confirmPassword-err' : undefined}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
          }`}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <span id="confirmPassword-err" role="alert" className="text-red-600 text-sm mt-1 block">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Przetwarzanie...' : 'Dalej'}
        </button>
      </div>
    </form>
  );
}
