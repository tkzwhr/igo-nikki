import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import 'antd/dist/reset.css';

import AuthProvider from '@/AuthProvider';
import useRouter from '@/hooks/router';

function Main() {
  const router = useRouter();

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

const rootContainer = document.getElementById('root');
const root = createRoot(rootContainer!);
root.render(<Main />);
