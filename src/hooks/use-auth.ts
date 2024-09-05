import { useSignIn, useSignUp } from '@clerk/nextjs';
import { OAuthStrategy } from '@clerk/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { onSignUpUser } from '@/actions/auth';

export const SignInSchema = z.object({
  email: z.string().email('You must give a valid email'),
  password: z
    .string()
    .min(8, { message: 'Your password must be atleast 8 characters long' })
    .max(64, {
      message: 'Your password can not be longer then 64 characters long',
    })
    .refine(
      (value) => /^[a-zA-Z0-9_.-]*$/.test(value ?? ''),
      'password should contain only alphabets and numbers'
    ),
});

export const SignUpSchema = z.object({
  firstname: z
    .string()
    .min(3, { message: 'first name must be atleast 3 characters' }),
  lastname: z
    .string()
    .min(3, { message: 'last name must be atleast 3 characters' }),
  email: z.string().email('You must give a valid email'),
  password: z
    .string()
    .min(8, { message: 'Your password must be atleast 8 characters long' })
    .max(64, {
      message: 'Your password can not be longer then 64 characters long',
    })
    .refine(
      (value) => /^[a-zA-Z0-9_.-]*$/.test(value ?? ''),
      'password should contain only alphabets and numbers'
    ),
});

export const useAuthSignIn = () => {
  const { isLoaded, setActive, signIn } = useSignIn();
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    mode: 'onBlur',
  });
  const router = useRouter();

  const onClerkAuth = async (email: string, password: string) => {
    if (!isLoaded)
      return toast('Error', {
        description: 'Oops! something went wrong',
      });
    try {
      const authenticated = await signIn.create({
        identifier: email,
        password: password,
      });

      if (authenticated.status === 'complete') {
        reset();
        await setActive({ session: authenticated.createdSessionId });
        toast('Success', {
          description: 'Welcome back!',
        });
        router.push('/callback/sign-in');
      }
    } catch (error: any) {
      console.log({
        code: error.errors[0].code,
        message: error.errors[0].message,
      });
      toast('Error', {
        description: error.errors[0].message,
      });
    }
  };

  const { mutate: InitiateLoginFlow, isPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      onClerkAuth(email, password),
  });

  const onAuthenticateUser = handleSubmit(async (values) => {
    InitiateLoginFlow({ email: values.email, password: values.password });
  });

  return {
    onAuthenticateUser,
    isPending,
    register,
    errors,
  };
};

export const useAuthSignUp = () => {
  const { setActive, isLoaded, signUp } = useSignUp();
  const [creating, setCreating] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    getValues,
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    mode: 'onBlur',
  });

  const router = useRouter();

  const onGenerateCode = async (email: string, password: string) => {
    if (!isLoaded)
      return toast('Error', {
        description: 'Oops! Try again',
      });
    try {
      if (email && password) {
        await signUp.create({
          emailAddress: getValues('email'),
          password: getValues('password'),
        });

        await signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        });

        setVerifying(true);
      } else {
        return toast('Error', {
          description: 'No fields must be empty',
        });
      }
    } catch (error: any) {
      console.log({
        code: error.errors[0].code,
        message: error.errors[0].message,
      });
      toast('Error', {
        description: error.errors[0].message,
      });
    }
  };

  const onInitiateUserRegistration = handleSubmit(async (values) => {
    if (!isLoaded)
      return toast('Error', {
        description: 'Oops! Try again',
      });

    try {
      setCreating(true);
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status !== 'complete') {
        return toast('Error', {
          description: 'Oops! something went wrong, status in complete',
        });
      }

      if (completeSignUp.status === 'complete') {
        if (!signUp.createdUserId) return;
        const user = await onSignUpUser({
          firstname: values.firstname,
          lastname: values.lastname,
          clerkId: signUp.createdUserId,
          image: '',
        });

        reset();

        if (user.status === 200) {
          toast('Success', {
            description: user.message,
          });
          await setActive({
            session: completeSignUp.createdSessionId,
          });
          router.push(`/group/create`);
        }

        if (user.status !== 200) {
          toast('Error', {
            description: user.message + 'action failed',
          });
          router.refresh;
        }

        setCreating(false);
        setVerifying(false);
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (error: any) {
      console.log({
        code: error.errors[0].code,
        message: error.errors[0].message,
      });
      toast('Error', {
        description: error.errors[0].message,
      });
    }
  });

  return {
    register,
    errors,
    onGenerateCode,
    onInitiateUserRegistration,
    verifying,
    creating,
    code,
    setCode,
    getValues,
  };
};

export const useGoogleAuth = () => {
  const { signIn, isLoaded: LoadedSignIn } = useSignIn();
  const { signUp, isLoaded: LoadedSignUp } = useSignUp();

  const signInWith = (strategy: OAuthStrategy) => {
    if (!LoadedSignIn) return;
    try {
      return signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: '/callback',
        redirectUrlComplete: '/callback/sign-in',
      });
    } catch (error: any) {
      console.log({
        code: error.errors[0].code,
        message: error.errors[0].message,
      });
      toast('Error', {
        description: error.errors[0].message,
      });
    }
  };

  const signUpWith = (strategy: OAuthStrategy) => {
    if (!LoadedSignUp) return;
    try {
      return signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: '/callback',
        redirectUrlComplete: '/callback/complete',
      });
    } catch (error: any) {
      console.log({
        code: error.errors[0].code,
        message: error.errors[0].message,
      });
      toast('Error', {
        description: error.errors[0].message,
      });
    }
  };

  return { signUpWith, signInWith };
};
