'use client';

import dynamic from 'next/dynamic';

import { FormGenerator } from '@/components/global/form-generator';
import { Loader } from '@/components/forms/loader';
import { Button } from '@/components/ui/button';
import { useAuthSignUp } from '@/hooks/use-auth';
import { AuthFormProps } from './sign-in-form';

export const SIGN_UP_FORM: AuthFormProps[] = [
  {
    id: '1',
    inputType: 'input',
    placeholder: 'First name',
    name: 'firstname',
    type: 'text',
  },
  {
    id: '2',
    inputType: 'input',
    placeholder: 'Last name',
    name: 'lastname',
    type: 'text',
  },
  {
    id: '3',
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

const OtpInput = dynamic(
  () =>
    import('@/components/global/otp-input').then(
      (component) => component.default
    ),
  { ssr: false }
);

const SignUpForm = (props: Props) => {
  const {
    register,
    errors,
    verifying,
    creating,
    onGenerateCode,
    onInitiateUserRegistration,
    code,
    setCode,
    getValues,
  } = useAuthSignUp();

  return (
    <form
      onSubmit={onInitiateUserRegistration}
      className="flex flex-col gap-3 mt-10"
    >
      {verifying ? (
        <div className="flex justify-center mb-5">
          <OtpInput otp={code} setOtp={setCode} />
        </div>
      ) : (
        SIGN_UP_FORM.map((field) => (
          <FormGenerator
            {...field}
            key={field.id}
            register={register}
            errors={errors}
          />
        ))
      )}

      {verifying ? (
        <Button type="submit" className="rounded-2xl">
          <Loader loading={creating}>Sign Up with Email</Loader>
        </Button>
      ) : (
        <Button
          type="button"
          className="rounded-2xl"
          onClick={() =>
            onGenerateCode(getValues('email'), getValues('password'))
          }
        >
          <Loader loading={false}>Generate Code</Loader>
        </Button>
      )}
    </form>
  );
};

export default SignUpForm;
