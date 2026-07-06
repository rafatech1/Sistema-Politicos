import { Suspense } from 'react';
import { getCachedSiteSettings } from '@/lib/services/site-settings.cached';
import { LoginForm } from './login-form';

export default async function LoginPage() {
  const settings = await getCachedSiteSettings();

  return (
    <Suspense>
      <LoginForm candidateName={settings.candidateName} logoUrl={settings.logoUrl} />
    </Suspense>
  );
}
