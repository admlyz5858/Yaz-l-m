import * as Network from 'expo-network';

import { syncExamCalendarIfPossible } from '@/lib/syncExamCalendar';
import { useAuthStore } from '@/store/authStore';
import { useDashboardStore } from '@/store/dashboardStore';
import { useOnboardingStore } from '@/store/onboardingStore';

export type BootstrapResult = {
  isConnected: boolean;
  hasValidToken: boolean;
  onboardingCompleted: boolean;
};

/**
 * Splash ekranında: config/token ve bağlantı kontrolü (mimari taslak Bölüm 2.1).
 */
export async function runBootstrap(): Promise<BootstrapResult> {
  await Promise.all([
    useAuthStore.persist.rehydrate(),
    useOnboardingStore.persist.rehydrate(),
    useDashboardStore.persist.rehydrate(),
  ]);

  const network = await Network.getNetworkStateAsync();
  const isConnected = Boolean(network.isConnected && network.isInternetReachable !== false);

  const token = useAuthStore.getState().token;
  const hasValidToken = Boolean(token && token.length > 0);
  const onboardingCompleted = useOnboardingStore.getState().completed;

  if (isConnected) {
    void syncExamCalendarIfPossible().catch(() => {});
  }

  return { isConnected, hasValidToken, onboardingCompleted };
}
