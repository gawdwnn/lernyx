'use client';

import { FormGenerator } from '@/components/global/form-generator';
import { Loader } from '@/components/forms/loader';
import { Button } from '@/components/ui/button';
import { useAuthSignIn } from '@/hooks/use-auth';

export type AuthFormProps = {
  id: string;
  type: 'email' | 'text' | 'password';
  inputType: 'select' | 'input';
  options?: { value: string; label: string; id: string }[];
  label?: string;
  placeholder: string;
  name: string;
};

export const SIGN_IN_FORM: AuthFormProps[] = [
  {
    id: '1',
    inputType: 'input',
    placeholder: 'Email',
    name: 'email',
    type: 'email',
  },
  {
    id: '4',
    inputType: 'input',
    placeholder: 'Password',
    name: 'password',
    type: 'password',
  },
];

type Props = {};

const SignInForm = (props: Props) => {
  const { isPending, onAuthenticateUser, register, errors } = useAuthSignIn();

  return (
    <form className="flex flex-col gap-3 mt-10" onSubmit={onAuthenticateUser}>
      {SIGN_IN_FORM.map((field) => (
        <FormGenerator
          {...field}
          key={field.id}
          register={register}
          errors={errors}
        />
      ))}
      <Button type="submit" className="rounded-2xl">
        <Loader loading={isPending}>Sign In with Email</Loader>
      </Button>
    </form>
  );
};

export default SignInForm;
