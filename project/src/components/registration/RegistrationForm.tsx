import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step1Data } from '../../schemas/registration/step1Schema';
import { Step2Data } from '../../schemas/registration/step2Schema';
import { Step3Data } from '../../schemas/registration/step3Schema';
import { registerUser, RegistrationError } from '../../utils/registration/api';
import { trackFormStepNext, trackFormAbandon, trackFormSubmit } from '../../utils/analytics';

type FormStep = 1 | 2 | 3;

interface RegistrationFormData {
  step1?: Step1Data;
  step2?: Step2Data;
  step3?: Step3Data;
}

const STEP_LABELS = ['Dane osobowe', 'Preferencje', 'Potwierdzenie'];

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
    trackFormStepNext(1);
    setCurrentStep(2);
    setServerError(undefined);
  };

  const handleStep2Complete = (data: Step2Data) => {
    setFormData((prev) => ({ ...prev, step2: data }));
    trackFormStepNext(2);
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
      trackFormSubmit(3);
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

  const goToStep = (step: FormStep, trigger: 'back_btn' | 'cancel_btn' = 'back_btn') => {
    if (step < currentStep) {
      trackFormAbandon(currentStep, trigger);
    }
    setCurrentStep(step);
    setServerError(undefined);
  };

  const TOTAL_STEPS = 3;
  const progressPct = Math.round(((currentStep - 1) / TOTAL_STEPS) * 100);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      aria-label="Formularz rejestracji"
      className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
      style={{ outline: 'none' }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            onClick={() => trackFormAbandon(currentStep, 'navigation')}
          >
            ← Powrót do aplikacji
          </Link>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* Iteracja C2 — czytelny progress bar z opisem kroków i procentem ukończenia.
              Uzasadnienie: drop-off 1→2 = −34%, dane wskazują że użytkownicy nie wiedzą
              ile kroków pozostało. Widoczny postęp redukuje porzucanie formularza. */}
          <nav aria-label="Postęp rejestracji" className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Krok {currentStep} z {TOTAL_STEPS}: <strong>{STEP_LABELS[currentStep - 1]}</strong>
              </span>
              <span className="text-sm text-gray-500" aria-live="polite">
                {progressPct === 0 ? 'Zaczynamy!' : `${progressPct}% ukończono`}
              </span>
            </div>
            <div
              className="w-full bg-gray-200 rounded-full h-2"
              role="progressbar"
              aria-valuenow={currentStep}
              aria-valuemin={1}
              aria-valuemax={TOTAL_STEPS}
              aria-label={`Krok ${currentStep} z ${TOTAL_STEPS}`}
            >
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
              />
            </div>
            <ol className="flex items-center justify-between mt-3">
              {STEP_LABELS.map((label, idx) => {
                const step = idx + 1;
                return (
                  <li
                    key={step}
                    className={`flex items-center ${idx < STEP_LABELS.length - 1 ? 'flex-1' : ''}`}
                    aria-current={currentStep === step ? 'step' : undefined}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm ${
                          currentStep === step
                            ? 'border-blue-600 bg-blue-600 text-white font-semibold'
                            : currentStep > step
                            ? 'border-green-600 bg-green-600 text-white'
                            : 'border-gray-300 bg-white text-gray-400'
                        }`}
                      >
                        {currentStep > step ? '✓' : step}
                      </div>
                      <span
                        className={`text-xs mt-1 text-center ${
                          currentStep === step ? 'text-blue-600 font-medium' : 'text-gray-400'
                        }`}
                        style={{ maxWidth: 72 }}
                      >
                        {label}
                      </span>
                    </div>
                    {idx < STEP_LABELS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 mb-5 ${
                          currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-gray-900 mb-6 focus:outline-none">
            Krok {currentStep}: {STEP_LABELS[currentStep - 1]}
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
              onBack={() => goToStep(1, 'back_btn')}
              initialData={formData.step2}
            />
          )}

          {currentStep === 3 && (
            <Step3
              onSubmit={handleStep3Submit}
              onBack={() => goToStep(2, 'back_btn')}
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
