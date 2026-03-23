import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { DrawerMenu } from '@/components/dashboard/DrawerMenu';
import { Brand } from '@/constants/theme';

/**
 * PDF Bölüm 3.3 — Üst menü (hamburger / drawer) + Premium öğeleri.
 * Başlık ve menü butonu alt sekmelerde (Tabs header).
 */
export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={({ navigation }) => <DrawerMenu onClose={() => navigation.closeDrawer()} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: { width: 300 },
          drawerActiveTintColor: Brand.purple,
          drawerInactiveTintColor: '#64748b',
        }}>
        <Drawer.Screen name="(tabs)" />
      </Drawer>
    </GestureHandlerRootView>
  );
}
