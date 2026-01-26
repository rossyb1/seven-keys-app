import { useFonts } from 'expo-font';

export function useAppFonts() {
  const [fontsLoaded] = useFonts({
    'BrittiSans-Light': require('../fonts/BrittiSansTrial-Light-BF6757bfd494951.otf'),
    'BrittiSans-Regular': require('../fonts/BrittiSansTrial-Regular-BF6757bfd47ffbf.otf'),
    'BrittiSans-Semibold': require('../fonts/BrittiSansTrial-Semibold-BF6757bfd443a8a.otf'),
    'BrittiSans-Bold': require('../fonts/BrittiSansTrial-Bold-BF6757bfd4a96ed.otf'),
  });

  return fontsLoaded;
}
