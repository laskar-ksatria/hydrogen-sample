import {type LoaderFunctionArgs, Outlet, redirect} from 'react-router';

export const loader = async (args: LoaderFunctionArgs) => {
  console.log(
    'OKE ============================================================================================================ >',
  );
  return redirect('/');
  //   return {message: 'HELLO'};
};
