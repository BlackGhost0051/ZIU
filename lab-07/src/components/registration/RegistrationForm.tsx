import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step1Data } from '../../schemas/registration/step1Schema';
import { Step2Data } from '../../schemas/registration/step2Schema';
import { Step3Data } from '../../schemas/registration/step3Schema';
import { registerUser, RegistrationError } from '../../utils/registration/api';

type FormStep = 1 | 2 | 3;

interface RegistrationFormData {
  step1?: Step1Data;
  step2?: Step2Data;
  step3?: Step3Data;
}

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState<RegistrationFormData>({});
  const [serverError, setServerError] = useState<string | undefined>();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, [currentStep]);

  const [step1SetError, setStep1SetError] = useState<any>(null);

  const handleStep1Complete = (data: Step1Data, setError: any) => {
    setFormData((prev) => ({ ...prev, step1: data }));
    setStep1SetError(() => setError);
    setCurrentStep(2);
    setServerError(undefined);
  };

  const handleStep2Complete = (data: Step2Data) => {
    setFormData((prev) => ({ ...prev, step2: data }));
    setCurrentStep(3);
  };

  const handleStep3Submit = async (data: Step3Data, setError: any) => {
    setFormData((prev) => ({ ...prev, step3: data }));
    setServerError(undefined);

    if (!formData.step1 || !formData.step2) {
      setServerError('Brak danych z poprzednich kroków');
      return;
    }

    try {
      await registerUser(formData.step1, formData.step2);
      alert('Rejestracja zakończona pomyślnie! Witamy!');
      setFormData({});
      setCurrentStep(1);
    } catch (error) {
      if (error instanceof RegistrationError) {
        if (error.status === 409) {
          if (step1SetError) {
            step1SetError('email', {
              type: 'server',
              message: 'Ten adres e-mail jest już zarejestrowany',
            });
          }
          setCurrentStep(1);
        } else if (error.status === 500) {
          setError('root.serverError', {
            type: 'server',
            message: 'Błąd serwera, spróbuj ponownie później'
          });
        }
      } else {
        setError('root.serverError', {
          type: 'server',
          message: 'Wystąpił nieoczekiwany błąd'
        });
      }
    }
  };

  const goToStep = (step: FormStep) => {
    setCurrentStep(step);
    setServerError(undefined);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Krok 1: Dane osobowe';
      case 2:
        return 'Krok 2: Preferencje';
      case 3:
        return 'Krok 3: Podsumowanie i potwierdzenie';
    }
  };

  return (
    <main
      aria-label="Formularz rejestracji"
      className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            ← Powrót do aplikacji Todo
          </Link>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <nav aria-label="Postęp rejestracji" className="mb-8">
            <ol className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <li
                  key={step}
                  className={`flex items-center ${step < 3 ? 'flex-1' : ''}`}
                  aria-current={currentStep === step ? 'step' : undefined}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep === step
                        ? 'border-blue-600 bg-blue-600 text-white font-semibold'
                        : currentStep > step
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-gray-300 bg-white text-gray-500'
                    }`}
                  >
                    {currentStep > step ? '✓' : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > step ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-gray-900 mb-6 focus:outline-none">
            {getStepTitle()}
          </h2>

          {serverError && currentStep === 1 && (
            <div role="alert" className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {serverError}
            </div>
          )}

          {currentStep === 1 && (
            <Step1 onComplete={handleStep1Complete} initialData={formData.step1} />
          )}

          {currentStep === 2 && (
            <Step2
              onComplete={handleStep2Complete}
              onBack={() => goToStep(1)}
              initialData={formData.step2}
            />
          )}

          {currentStep === 3 && (
            <Step3
              onSubmit={handleStep3Submit}
              onBack={() => goToStep(2)}
              step1Data={formData.step1}
              step2Data={formData.step2}
              serverError={serverError}
            />
          )}
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          <span aria-label="wymagane">*</span> Pola wymagane
        </p>
      </div>
    </main>
  );
}
