import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { getVenues } from '../../src/services/api';
import type { Venue } from '../../src/types/database';
import PrimaryButton from '../../components/buttons/PrimaryButton';

const BACKGROUND_COLOR = '#0A1628';
const INPUT_BG = '#111D2E';
const ACCENT_COLOR = '#5684C4';
const BORDER_RADIUS = 12;

interface ExperienceFormScreenProps {
  navigation: any;
}

const EXPERIENCE_TYPES = ['Yacht', 'Beach Club', 'Nightclub', 'Event Tickets'];

export default function ExperienceFormScreen({ navigation }: ExperienceFormScreenProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [experienceType, setExperienceType] = useState<string | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [showVenuePicker, setShowVenuePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [groupSize, setGroupSize] = useState('');
  const [leadName, setLeadName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [preferences, setPreferences] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingVenues, setIsLoadingVenues] = useState(false);

  const showVenueField = experienceType === 'Beach Club';

  useEffect(() => {
    if (showVenueField) {
      const fetchVenues = async () => {
        setIsLoadingVenues(true);
        const result = await getVenues({ type: 'beach_club' });
        if (result.venues) {
          setVenues(result.venues);
        }
        setIsLoadingVenues(false);
      };
      fetchVenues();
    }
  }, [showVenueField]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatDateForAPI = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    if (!experienceType || !selectedDate || !groupSize || !leadName || !email || !phone) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (showVenueField && !selectedVenue) {
      Alert.alert('Missing Information', 'Please select a beach club.');
      return;
    }

    setIsSubmitting(true);
    try {
      // For now, we'll save to a requests table or escalate
      // This will be handled by the API function
      const requestData = {
        type: 'experience',
        experience_type: experienceType,
        venue_id: selectedVenue?.id || null,
        date: formatDateForAPI(selectedDate),
        group_size: parseInt(groupSize),
        lead_name: leadName,
        email,
        phone,
        preferences: preferences || null,
        escalated: ['Yacht', 'Nightclub', 'Event Tickets'].includes(experienceType),
      };

      // TODO: Create API function for experience requests
      // For now, show success and navigate back
      Alert.alert(
        'Request Submitted',
        experienceType === 'Beach Club'
          ? 'Your beach club booking request has been submitted. We\'ll confirm shortly.'
          : 'Your request has been escalated to our team. We\'ll contact you shortly.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Date picker
  const today = new Date();
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const isPastDate = (day: number) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return checkDate < today;
  };

  const handleDateSelect = (day: number) => {
    if (isPastDate(day)) return;
    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    setShowDatePicker(false);
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book an Experience</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.form}>
          {/* Experience Type */}
          <View style={styles.field}>
            <Text style={styles.label}>Experience Type *</Text>
            <View style={styles.buttonRow}>
              {EXPERIENCE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    experienceType === type && styles.typeButtonSelected,
                  ]}
                  onPress={() => setExperienceType(type)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      experienceType === type && styles.typeButtonTextSelected,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Venue (only for Beach Club) */}
          {showVenueField && (
            <View style={styles.field}>
              <Text style={styles.label}>Beach Club *</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowVenuePicker(true)}
              >
                <Text style={selectedVenue ? styles.inputText : styles.inputPlaceholder}>
                  {selectedVenue ? selectedVenue.name : 'Select beach club'}
                </Text>
                <ChevronDown size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* Date */}
          <View style={styles.field}>
            <Text style={styles.label}>Date *</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={selectedDate ? styles.inputText : styles.inputPlaceholder}>
                {selectedDate ? formatDate(selectedDate) : 'Select date'}
              </Text>
              <ChevronDown size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Group Size */}
          <View style={styles.field}>
            <Text style={styles.label}>Group Size *</Text>
            <TextInput
              style={styles.textInput}
              value={groupSize}
              onChangeText={setGroupSize}
              placeholder="Enter number of guests"
              placeholderTextColor="#6B7280"
              keyboardType="number-pad"
            />
          </View>

          {/* Lead Name */}
          <View style={styles.field}>
            <Text style={styles.label}>Lead Name *</Text>
            <TextInput
              style={styles.textInput}
              value={leadName}
              onChangeText={setLeadName}
              placeholder="Enter name"
              placeholderTextColor="#6B7280"
            />
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone */}
          <View style={styles.field}>
            <Text style={styles.label}>Phone *</Text>
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone"
              placeholderTextColor="#6B7280"
              keyboardType="phone-pad"
            />
          </View>

          {/* Preferences */}
          <View style={styles.field}>
            <Text style={styles.label}>Preferences/Requests</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={preferences}
              onChangeText={setPreferences}
              placeholder="Any preferences or special requests?"
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomButton, { paddingBottom: insets.bottom + 16 }]}>
        <PrimaryButton
          title={isSubmitting ? 'SUBMITTING...' : 'REQUEST EXPERIENCE'}
          onPress={handleSubmit}
          disabled={isSubmitting || !experienceType || !selectedDate || !groupSize}
        />
      </View>

      {/* Venue Picker Modal */}
      <Modal visible={showVenuePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Beach Club</Text>
              <TouchableOpacity onPress={() => setShowVenuePicker(false)}>
                <Text style={styles.modalClose}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {isLoadingVenues ? (
                <ActivityIndicator color={ACCENT_COLOR} style={styles.loader} />
              ) : (
                venues.map((venue) => (
                  <TouchableOpacity
                    key={venue.id}
                    style={styles.modalItem}
                    onPress={() => {
                      setSelectedVenue(venue);
                      setShowVenuePicker(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{venue.name}</Text>
                    {selectedVenue?.id === venue.id && (
                      <Text style={styles.modalItemCheck}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal - same as ReservationFormScreen */}
      <Modal visible={showDatePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => {
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
              }}>
                <Text style={styles.modalNav}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              <TouchableOpacity onPress={() => {
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
              }}>
                <Text style={styles.modalNav}>›</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.calendar}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <Text key={day} style={styles.calendarHeader}>{day}</Text>
              ))}
              {days.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.calendarDay,
                    day && isPastDate(day) && styles.calendarDayDisabled,
                    day && selectedDate && new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getTime() === selectedDate.getTime() && styles.calendarDaySelected,
                  ]}
                  onPress={() => day && handleDateSelect(day)}
                  disabled={!day || isPastDate(day)}
                >
                  {day && <Text style={styles.calendarDayText}>{day}</Text>}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.modalDone}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.modalDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  form: {
    padding: 16,
    paddingBottom: 100,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: INPUT_BG,
    borderRadius: BORDER_RADIUS,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  inputPlaceholder: {
    fontSize: 16,
    color: '#6B7280',
  },
  textInput: {
    backgroundColor: INPUT_BG,
    borderRadius: BORDER_RADIUS,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: INPUT_BG,
    borderRadius: BORDER_RADIUS,
    padding: 16,
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: ACCENT_COLOR,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  typeButtonTextSelected: {
    color: '#FFFFFF',
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: BACKGROUND_COLOR,
    borderTopWidth: 1,
    borderTopColor: '#1A2332',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: INPUT_BG,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2332',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalClose: {
    fontSize: 16,
    color: ACCENT_COLOR,
    fontWeight: '500',
  },
  modalNav: {
    fontSize: 24,
    color: ACCENT_COLOR,
    fontWeight: '600',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2332',
  },
  modalItemText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalItemCheck: {
    fontSize: 18,
    color: ACCENT_COLOR,
  },
  modalDone: {
    padding: 16,
    alignItems: 'center',
  },
  modalDoneText: {
    fontSize: 16,
    color: ACCENT_COLOR,
    fontWeight: '600',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  calendarHeader: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  calendarDayDisabled: {
    opacity: 0.3,
  },
  calendarDaySelected: {
    backgroundColor: ACCENT_COLOR,
    borderRadius: BORDER_RADIUS,
  },
  calendarDayText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  loader: {
    padding: 40,
  },
});
