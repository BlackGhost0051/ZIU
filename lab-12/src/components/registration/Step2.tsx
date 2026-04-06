import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2Schema, Step2Data } from '../../schemas/registration/step2Schema';

interface Step2Props {
  onComplete: (data: Step2Data) => void;
  onBack: () => void;
  initialData?: Step2Data;
}

const availableCategories = [
  'Technologia',
  'Sport',
  'Kultura',
  'Nauka',
  'Biznes',
  'Rozrywka',
];

export function Step2({ onComplete, onBack, initialData }: Step2Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    watch,
    setValue,
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: initialData || {
      categories: [],
      notifications: {
        email: false,
        push: false,
      },
      newsletter: false,
    },
  });

  const selectedCategories = watch('categories') || [];

  const onSubmit = (data: Step2Data) => {
    onComplete(data);
  };

  const handleCategoryToggle = (category: string) => {
    const currentCategories = selectedCategories;
    const index = currentCategories.indexOf(category);

    if (index !== -1) {
      setValue('categories', currentCategories.filter(c => c !== category), {
        shouldValidate: true,
      });
    } else {
      setValue('categories', [...currentCategories, category], {
        shouldValidate: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-3">
            Wybierz kategorie zainteresowań <span className="text-red-600" aria-label="wymagane">*</span>
          </legend>
          <div className="space-y-2">
            {availableCategories.map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <div key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category}`}
                    checked={isSelected}
                    onChange={() => handleCategoryToggle(category)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    aria-label={`Kategoria: ${category}`}
                  />
                  <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                    {category}
                  </label>
                </div>
              );
            })}
          </div>
          {errors.categories && (
            <span role="alert" className="text-red-600 text-sm mt-2 block">
              {errors.categories.message}
            </span>
          )}
        </fieldset>
      </div>

      <div>
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-3">
            Powiadomienia
          </legend>
          <div className="space-y-2">
            <div className="flex items-center">
              <Controller
                name="notifications.email"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="notif-email"
                    aria-label="Powiadomienia e-mail"
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
              <label htmlFor="notif-email" className="ml-2 text-sm text-gray-700">
                Powiadomienia e-mail
              </label>
            </div>

            <div className="flex items-center">
              <Controller
                name="notifications.push"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="notif-push"
                    aria-label="Powiadomienia push"
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
              <label htmlFor="notif-push" className="ml-2 text-sm text-gray-700">
                Powiadomienia push
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      <div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="newsletter"
            aria-label="Zapisz się do newslettera"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            {...register('newsletter')}
          />
          <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
            Zapisz się do newslettera (opcjonalne)
          </label>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:outline-none"
        >
          Wstecz
        </button>
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
