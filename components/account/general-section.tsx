'use client';

import type React from 'react';
import { ProfileSection } from '@/components/account/profile-section';
import { AppearanceSection } from '@/components/account/appearance-section';

export function GeneralSection() {
  return (
    <>
      <ProfileSection />
      <AppearanceSection />
    </>
  );
}
