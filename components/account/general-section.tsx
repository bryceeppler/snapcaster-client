'use client';

import type React from 'react';

import { ProfileSection } from '@/components/account/profile-section';
import { TwoFactorSection } from '@/components/account/two-factor-section';

export function GeneralSection() {
  return (
    <>
      <ProfileSection />
      <TwoFactorSection />
    </>
  );
}
