import React, { Dispatch, SetStateAction } from 'react';
import './SignUpPage.scss';
import InputBar from '../InputBar/InputBar';

type SignUpPageProps = {
  email: string,
  setEmail: Dispatch<SetStateAction<string>>,
  submit: () => void
}

const SignUpPage = ({email, setEmail, submit}: SignUpPageProps) => {

  return (
    <div className="SignUpPage">
      <div className="sign-up-body">
        <div className="unsucceeded">
          <InputBar placeholder="Email..." data={email} setter={setEmail} onReturn={submit}/>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
