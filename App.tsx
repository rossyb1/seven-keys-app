import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BackgroundColors, AccentColors } from './constants/brand';
import { useAppFonts } from './hooks/useAppFonts';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import SplashScreen from './app/SplashScreen';
import InviteCodeScreen from './app/InviteCodeScreen';
import AuthMethodScreen from './app/AuthMethodScreen';
import CompleteProfileScreen from './app/CompleteProfileScreen';
import SignUpScreen from './app/SignUpScreen';
import CitySelectionScreen from './app/CitySelectionScreen';
import AgeGroupScreen from './app/AgeGroupScreen';
import PermissionsScreen from './app/PermissionsScreen';
import MainTabs from './app/MainTabs';
import VenueDetailScreen from './app/screens/VenueDetailScreen';
import CategoryVenuesScreen from './app/screens/CategoryVenuesScreen';
import ExperiencesListScreen from './app/screens/ExperiencesListScreen';
import YachtsListScreen from './app/screens/YachtsListScreen';
import YachtDetailScreen from './app/screens/YachtDetailScreen';
import VillasListScreen from './app/screens/VillasListScreen';
import VillaDetailScreen from './app/screens/VillaDetailScreen';
import DesertExperiencesListScreen from './app/screens/DesertExperiencesListScreen';
import ChauffeurListScreen from './app/screens/ChauffeurListScreen';
import PrivateJetListScreen from './app/screens/PrivateJetListScreen';
import SelectDateScreen from './app/booking/SelectDateScreen';
import SelectTimeScreen from './app/booking/SelectTimeScreen';
import PartySizeScreen from './app/booking/PartySizeScreen';
import TablePreferenceScreen from './app/booking/TablePreferenceScreen';
import SpecialRequestsScreen from './app/booking/SpecialRequestsScreen';
import ReviewBookingScreen from './app/booking/ReviewBookingScreen';
import BookingSubmittedScreen from './app/booking/BookingSubmittedScreen';
import RunningLateScreen from './app/booking/RunningLateScreen';
import CancelBookingScreen from './app/booking/CancelBookingScreen';
import BookingDetailScreen from './app/screens/BookingDetailScreen';
import BookingsScreen from './app/screens/BookingsScreen';
import SevenKCardScreen from './app/screens/SevenKCardScreen';
import PersonalDetailsScreen from './app/settings/PersonalDetailsScreen';
import PreferredCitiesScreen from './app/settings/PreferredCitiesScreen';
import NotificationSettingsScreen from './app/settings/NotificationSettingsScreen';
import PointsHistoryScreen from './app/settings/PointsHistoryScreen';
import PaymentMethodsScreen from './app/settings/PaymentMethodsScreen';
import FAQsScreen from './app/settings/FAQsScreen';
import MessageConciergeScreen from './app/screens/MessageConciergeScreen';
import ChangeTimeScreen from './app/booking/ChangeTimeScreen';
import ChangeDateScreen from './app/booking/ChangeDateScreen';
import AddGuestsScreen from './app/booking/AddGuestsScreen';
import WelcomeHomeScreen from './src/screens/main/WelcomeHomeScreen';
import VenueTypeSelectionScreen from './app/concierge/VenueTypeSelectionScreen';
import ReservationFormScreen from './app/concierge/ReservationFormScreen';
import ExperienceTypeSelectionScreen from './app/concierge/ExperienceTypeSelectionScreen';
import ExperienceFormScreen from './app/concierge/ExperienceFormScreen';
import GroupBookingFormScreen from './app/concierge/GroupBookingFormScreen';
import RecommendationsScreen from './app/concierge/RecommendationsScreen';
import CorporateBookingFormScreen from './app/concierge/CorporateBookingFormScreen';

const Stack = createNativeStackNavigator();

// Auth Stack - for unauthenticated users
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: BackgroundColors.primary,
        },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="InviteCode" component={InviteCodeScreen} />
      <Stack.Screen name="AuthMethod" component={AuthMethodScreen} />
      <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

// App Stack - for authenticated users
function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: BackgroundColors.primary,
        },
      }}
      initialRouteName="WelcomeHome"
    >
      <Stack.Screen name="WelcomeHome" component={WelcomeHomeScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="CategoryVenues" component={CategoryVenuesScreen} />
      <Stack.Screen name="VenueDetail" component={VenueDetailScreen} />
      <Stack.Screen name="ExperiencesList" component={ExperiencesListScreen} />
      <Stack.Screen name="YachtsList" component={YachtsListScreen} />
      <Stack.Screen name="YachtDetail" component={YachtDetailScreen} />
      <Stack.Screen name="VillasList" component={VillasListScreen} />
      <Stack.Screen name="VillaDetail" component={VillaDetailScreen} />
      <Stack.Screen name="DesertExperiencesList" component={DesertExperiencesListScreen} />
      <Stack.Screen name="ChauffeurList" component={ChauffeurListScreen} />
      <Stack.Screen name="PrivateJetList" component={PrivateJetListScreen} />
      <Stack.Screen name="SelectDate" component={SelectDateScreen} />
      <Stack.Screen name="SelectTime" component={SelectTimeScreen} />
      <Stack.Screen name="PartySize" component={PartySizeScreen} />
      <Stack.Screen name="TablePreference" component={TablePreferenceScreen} />
      <Stack.Screen name="SpecialRequests" component={SpecialRequestsScreen} />
      <Stack.Screen name="ReviewBooking" component={ReviewBookingScreen} />
      <Stack.Screen name="BookingSubmitted" component={BookingSubmittedScreen} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <Stack.Screen name="RunningLate" component={RunningLateScreen} />
      <Stack.Screen name="CancelBooking" component={CancelBookingScreen} />
      <Stack.Screen name="SevenKCard" component={SevenKCardScreen} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
      <Stack.Screen name="PreferredCities" component={PreferredCitiesScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="PointsHistory" component={PointsHistoryScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="FAQs" component={FAQsScreen} />
      <Stack.Screen name="MessageConcierge" component={MessageConciergeScreen} />
      <Stack.Screen name="ChangeTime" component={ChangeTimeScreen} />
      <Stack.Screen name="ChangeDate" component={ChangeDateScreen} />
      <Stack.Screen name="AddGuests" component={AddGuestsScreen} />
      <Stack.Screen name="VenueTypeSelection" component={VenueTypeSelectionScreen} />
      <Stack.Screen name="ReservationForm" component={ReservationFormScreen} />
      <Stack.Screen name="ExperienceTypeSelection" component={ExperienceTypeSelectionScreen} />
      <Stack.Screen name="ExperienceForm" component={ExperienceFormScreen} />
      <Stack.Screen name="GroupBookingForm" component={GroupBookingFormScreen} />
      <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
      <Stack.Screen name="CorporateBookingForm" component={CorporateBookingFormScreen} />
      <Stack.Screen name="MyBookings" component={BookingsScreen} />
    </Stack.Navigator>
  );
}

// Onboarding Stack - for authenticated users who haven't completed onboarding
function OnboardingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: BackgroundColors.primary,
        },
      }}
      initialRouteName="CitySelection"
    >
      <Stack.Screen name="CitySelection" component={CitySelectionScreen} />
      <Stack.Screen name="AgeGroup" component={AgeGroupScreen} />
      <Stack.Screen name="Permissions" component={PermissionsScreen} />
    </Stack.Navigator>
  );
}

// Root Navigator - conditionally renders based on auth status
function RootNavigator() {
  const { isAuthenticated, isLoading, needsOnboarding, user } = useAuth();

  // Log every render to debug
  console.log('🧭 [RootNavigator] Render:', { 
    isLoading, 
    isAuthenticated, 
    needsOnboarding, 
    hasUser: !!user,
    userId: user?.id 
  });

  // Show loading while checking auth status
  if (isLoading) {
    console.log('🧭 [RootNavigator] → Showing LOADING');
    return (
      <View style={{ flex: 1, backgroundColor: BackgroundColors.primary, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={AccentColors.primary} size="large" />
      </View>
    );
  }

  // Show appropriate stack based on authentication and onboarding status
  if (needsOnboarding) {
    console.log('🧭 [RootNavigator] → Showing ONBOARDING');
    return <OnboardingStack />;
  }
  
  if (isAuthenticated) {
    console.log('🧭 [RootNavigator] → Showing APP');
    return <AppStack />;
  }
  
  console.log('🧭 [RootNavigator] → Showing AUTH');
  return <AuthStack />;
}

export default function App() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: BackgroundColors.primary, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={AccentColors.primary} size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
