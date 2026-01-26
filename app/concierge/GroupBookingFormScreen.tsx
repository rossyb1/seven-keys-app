import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
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

interface GroupBookingFormScreenProps {
  navigation: any;
}

const OCCASIONS = ['Birthday', 'Corporate', 'Celebration', 'Other'];
const BUDGET_OPTIONS = ['No budget', '500-1000 AED', '1000-2000 AED', '2000+ AED'];

export default function GroupBookingFormScreen({ navigation }: GroupBookingFormScreenProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [groupSize, setGroupSize] = useState('');
  const [occasion, setOccasion] = useState<string | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [showVenuePicker, setShowVenuePicker] = useState(false);
  const [needRecommendations, setNeedRecommendations] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [leadName, setLeadName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [budget, setBudget] = useState<string | null>(null);
  const [showBudgetPicker, setShowBudgetPicker] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVenues = async () => {
      const result = await getVenues();
      if (result.venues) {
        setVenues(result.venues);
      }
    };
    fetchVenues();
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatDateForAPI = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTimeForAPI = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const TIME_SLOTS = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00',
  ];

  const handleSubmit = async () => {
    if (!groupSize || parseInt(groupSize) < 10) {
      Alert.alert('Invalid Group Size', 'Group bookings require a minimum of 10 guests.');
      return;
    }
    if (!occasion || !selectedDate || !selectedTime || !leadName || !email || !phone) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Create API function for group bookings
      // All group bookings escalate to human
      Alert.alert(
        'Request Submitted',
        'Your group booking request has been submitted. Our team will coordinate with the venue and get back to you shortly.',
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
          <Text style={styles.headerTitle}>Group Booking</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.form}>
          {/* Group Size */}
          <View style={styles.field}>
            <Text style={styles.label}>Group Size * (Minimum 10)</Text>
            <TextInput
              style={styles.textInput}
              value={groupSize}
              onChangeText={setGroupSize}
              placeholder="Enter number of guests"
              placeholderTextColor="#6B7280"
              keyboardType="number-pad"
            />
          </View>

          {/* Occasion */}
          <View style={styles.field}>
            <Text style={styles.label}>Occasion *</Text>
            <View style={styles.buttonRow}>
              {OCCASIONS.map((occ) => (
                <TouchableOpacity
                  key={occ}
                  style={[
                    styles.typeButton,
                    occasion === occ && styles.typeButtonSelected,
                  ]}
                  onPress={() => setOccasion(occ)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      occasion === occ && styles.typeButtonTextSelected,
                    ]}
                  >
                    {occ}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Venue Preference */}
          <View style={styles.field}>
            <Text style={styles.label}>Venue Preference</Text>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => {
                setNeedRecommendations(!needRecommendations);
                if (!needRecommendations) setSelectedVenue(null);
              }}
            >
              <View style={[styles.checkbox, needRecommendations && styles.checkboxChecked]}>
                {needRecommendations && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Need recommendations</Text>
            </TouchableOpacity>
            {!needRecommendations && (
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowVenuePicker(true)}
              >
                <Text style={selectedVenue ? styles.inputText : styles.inputPlaceholder}>
                  {selectedVenue ? selectedVenue.name : 'Select venue'}
                </Text>
                <ChevronDown size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>

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

          {/* Time */}
          <View style={styles.field}>
            <Text style={styles.label}>Time *</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={selectedTime ? styles.inputText : styles.inputPlaceholder}>
                {selectedTime ? formatTimeForAPI(selectedTime) : 'Select time'}
              </Text>
              <ChevronDown size={20} color="#FFFFFF" />
            </TouchableOpacity>
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

          {/* Budget */}
          <View style={styles.field}>
            <Text style={styles.label}>Budget per Person (Optional)</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowBudgetPicker(true)}
            >
              <Text style={budget ? styles.inputText : styles.inputPlaceholder}>
                {budget || 'Select budget'}
              </Text>
              <ChevronDown size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Special Requests */}
          <View style={styles.field}>
            <Text style={styles.label}>Special Requests</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={specialRequests}
              onChangeText={setSpecialRequests}
              placeholder="Any special requests?"
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
          title={isSubmitting ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
          onPress={handleSubmit}
          disabled={isSubmitting || !groupSize || parseInt(groupSize) < 10 || !occasion || !selectedDate || !selectedTime}
        />
      </View>

      {/* Modals - similar to ReservationFormScreen */}
      <Modal visible={showVenuePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Venue</Text>
              <TouchableOpacity onPress={() => setShowVenuePicker(false)}>
                <Text style={styles.modalClose}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {venues.map((venue) => (
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
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

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

      <Modal visible={showTimePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Time</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <Text style={styles.modalClose}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {TIME_SLOTS.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedTime(time);
                    setShowTimePicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{formatTimeForAPI(time)}</Text>
                  {selectedTime === time && (
                    <Text style={styles.modalItemCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={showBudgetPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Budget</Text>
              <TouchableOpacity onPress={() => setShowBudgetPicker(false)}>
                <Text style={styles.modalClose}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {BUDGET_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.modalItem}
                  onPress={() => {
                    setBudget(option);
                    setShowBudgetPicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{option}</Text>
                  {budget === option && (
                    <Text style={styles.modalItemCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: ACCENT_COLOR,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: ACCENT_COLOR,
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  checkboxLabel: {
    fontSize: 16,
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
});
