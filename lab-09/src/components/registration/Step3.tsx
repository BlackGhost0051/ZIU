import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step3Schema, Step3Data } from '../../schemas/registration/step3Schema';
import { Step1Data } from '../../schemas/registration/step1Schema';
import { Step2Data } from '../../schemas/registration/step2Schema';

interface Step3Props {
  onSubmit: (data: Step3Data, setError: any) => Promise<void>;
  onBack: () => void;
  step1Data?: Step1Data;
  step2Data?: Step2Data;
  serverError?: string;
}

export function Step3({ onSubmit, onBack, step1Data, step2Data, serverError }: Step3Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    mode: 'onBlur',
    defaultValues: {
      rodoConsent: false,
    },
  });

  const handleFormSubmit = async (data: Step3Data) => {
    await onSubmit(data, setError);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Podsumowanie danych</h3>

        {step1Data && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Dane osobowe</h4>
            <dl className="space-y-1 text-sm">
              <div className="flex">
                <dt className="font-medium text-gray-600 w-32">Imię:</dt>
                <dd className="text-gray-900">{step1Data.firstName}</dd>
              </div>
              <div className="flex">
                <dt className="font-medium text-gray-600 w-32">Nazwisko:</dt>
                <dd className="text-gray-900">{step1Data.lastName}</dd>
              </div>
              <div className="flex">
                <dt className="font-medium text-gray-600 w-32">E-mail:</dt>
                <dd className="text-gray-900">{step1Data.email}</dd>
              </div>
              <div className="flex">
                <dt className="font-medium text-gray-600 w-32">Hasło:</dt>
                <dd className="text-gray-900">••••••••</dd>
              </div>
            </dl>
          </div>
        )}

        {step2Data && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Preferencje</h4>
            <dl className="space-y-1 text-sm">
              <div className="flex">
                <dt className="font-medium text-gray-600 w-32">Kategorie:</dt>
                <dd className="text-gray-900">{step2Data.categories.join(', ')}</dd>
              </div>
              <div className="flex">
                <dt className="font-medium text-gray-600 w-32">E-mail:</dt>
                <dd className="text-gray-900">{step2Data.notifications.email ? 'Tak' : 'Nie'}</dd>
              </div>
              <div className="flex">
                <dt className="font-medium text-gray-600 w-32">Push:</dt>
                <dd className="text-gray-900">{step2Data.notifications.push ? 'Tak' : 'Nie'}</dd>
              </div>
              <div className="flex">
                <dt className="font-medium text-gray-600 w-32">Newsletter:</dt>
                <dd className="text-gray-900">{step2Data.newsletter ? 'Tak' : 'Nie'}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <div className="flex items-start">
            <input
              type="checkbox"
              id="rodoConsent"
              aria-required="true"
              aria-invalid={!!errors.rodoConsent}
              aria-describedby={errors.rodoConsent ? 'rodo-err' : 'rodo-desc'}
              className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              {...register('rodoConsent')}
            />
            <label htmlFor="rodoConsent" className="ml-2 text-sm text-gray-700">
              <span className="text-red-600" aria-label="wymagane">*</span> Akceptuję warunki przetwarzania danych osobowych zgodnie z RODO
            </label>
          </div>
          <span id="rodo-desc" className="text-xs text-gray-500 mt-1 block ml-6">
            Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z ustawą o ochronie danych osobowych w związku z utworzeniem konta.
          </span>
          {errors.rodoConsent && (
            <span id="rodo-err" role="alert" className="text-red-600 text-sm mt-1 block ml-6">
              {errors.rodoConsent.message}
            </span>
          )}
        </div>

        {(serverError || errors.root?.serverError) && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {serverError || errors.root?.serverError?.message}
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:opacity-50"
          >
            Wstecz
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Rejestrowanie...' : 'Zarejestruj się'}
          </button>
        </div>
      </form>
    </div>
  );
}
