'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/constants/routes';

const inscriptionSchema = z
  .object({
    prenom: z.string().min(1, 'Le prénom est requis'),
    nom: z.string().min(1, 'Le nom est requis'),
    email: z.string().min(1, "L'email est requis").email('Email invalide'),
    telephone: z.string().optional(),
    role: z.enum(['citoyen', 'artisan']),
    password: z.string().min(6, 'Au moins 6 caractères'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

type InscriptionFormValues = z.infer<typeof inscriptionSchema>;

const inputClass =
  'w-full h-10 pl-9 pr-3 border rounded-md text-sm outline-none transition-colors border-stone-300 focus:ring-1 focus:ring-stone-900 focus:border-stone-900';
const inputErrorClass =
  'w-full h-10 pl-9 pr-3 border rounded-md text-sm outline-none transition-colors border-error-400 focus:ring-1 focus:ring-error-500';

export default function InscriptionPage() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InscriptionFormValues>({
    resolver: zodResolver(inscriptionSchema),
    defaultValues: { role: 'citoyen' },
  });

  const role = watch('role');

  const onSubmit = async (data: InscriptionFormValues) => {
    setFormError('');
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone || undefined,
        role: data.role,
      });
      router.push(ROUTES.DASHBOARD);
    } catch {
      setFormError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <>
      <h1 className="text-xl font-semibold text-stone-900 text-center mb-6">Créer un compte</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {formError && (
          <div className="bg-error-50 text-error-700 text-sm px-3.5 py-2.5 rounded-md border border-error-200">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="prenom" className="block text-sm font-medium text-stone-800 mb-1.5">
              Prénom
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                id="prenom"
                {...register('prenom')}
                placeholder="Prénom"
                className={errors.prenom ? inputErrorClass : inputClass}
              />
            </div>
            {errors.prenom && <p className="text-xs text-error-600 mt-1">{errors.prenom.message}</p>}
          </div>
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-stone-800 mb-1.5">
              Nom
            </label>
            <input
              id="nom"
              {...register('nom')}
              placeholder="Nom"
              className={(errors.nom ? inputErrorClass : inputClass).replace('pl-9', 'pl-3')}
            />
            {errors.nom && <p className="text-xs text-error-600 mt-1">{errors.nom.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-800 mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              id="email"
              type="email"
              {...register('email')}
              placeholder="votre@email.com"
              className={errors.email ? inputErrorClass : inputClass}
            />
          </div>
          {errors.email && <p className="text-xs text-error-600 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="telephone" className="block text-sm font-medium text-stone-800 mb-1.5">
            Téléphone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              id="telephone"
              type="tel"
              {...register('telephone')}
              placeholder="+226 XX XX XX XX"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-800 mb-2">Je suis</label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setValue('role', 'citoyen')}
              className={`p-3.5 border rounded-md text-center transition-colors ${
                role === 'citoyen' ? 'border-stone-900 bg-stone-50' : 'border-stone-300 hover:border-stone-400'
              }`}
            >
              <div className="text-xl mb-1">🔍</div>
              <div className="text-sm font-medium text-stone-900">Citoyen</div>
              <div className="text-xs text-stone-500 mt-0.5">Je cherche un artisan</div>
            </button>
            <button
              type="button"
              onClick={() => setValue('role', 'artisan')}
              className={`p-3.5 border rounded-md text-center transition-colors ${
                role === 'artisan' ? 'border-stone-900 bg-stone-50' : 'border-stone-300 hover:border-stone-400'
              }`}
            >
              <div className="text-xl mb-1">🔧</div>
              <div className="text-sm font-medium text-stone-900">Artisan</div>
              <div className="text-xs text-stone-500 mt-0.5">Je propose mes services</div>
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-800 mb-1.5">
            Mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="••••••••"
              className={(errors.password ? inputErrorClass : inputClass).replace('pr-3', 'pr-10')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-error-600 mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-800 mb-1.5">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder="••••••••"
              className={(errors.confirmPassword ? inputErrorClass : inputClass).replace('pr-3', 'pr-10')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-error-600 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-medium rounded-md text-sm transition-colors flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Inscription en cours...' : 'Créer mon compte'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-stone-600">
          Déjà un compte ?{' '}
          <Link href={ROUTES.CONNEXION} className="text-stone-900 font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </>
  );
}
