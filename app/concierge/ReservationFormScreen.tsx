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
import { ChevronLeft, ChevronDown, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { getVenues, createBooking } from '../../src/services/api';
import type { Venue } from '../../src/types/database';
import PrimaryButton from '../../components/buttons/PrimaryButton';

const BACKGROUND_COLOR = '#0A1628';
const INPUT_BG = '#111D2E';
const ACCENT_COLOR = '#5684C4';
const BORDER_RADIUS = 12;

interface ReservationFormScreenProps {
  navigation: any;
  route?: any;
}

const TIME_SLOTS = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00',
];

export default function ReservationFormScreen({ navigation, route }: ReservationFormScreenProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const preFilledVenue = route?.params?.venue as Venue | undefined;

  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(preFilledVenue || null);
  const [showVenuePicker, setShowVenuePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [groupSize, setGroupSize] = useState<number | null>(null);
  const [leadName, setLeadName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      setIsLoadingVenues(true);
      const result = await getVenues();
      if (result.venues) {
        setVenues(result.venues);
      }
      setIsLoadingVenues(false);
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
    // Convert "12:00" to "12:00 PM" format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleSubmit = async () => {
    if (!selectedVenue || !selectedDate || !selectedTime || !groupSize) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingData = {
        venue_id: selectedVenue.id,
        booking_date: formatDateForAPI(selectedDate),
        booking_time: formatTimeForAPI(selectedTime),
        party_size: groupSize,
        special_requests: specialRequests || undefined,
      };

      const result = await createBooking(bookingData);
      if (result.error) {
        Alert.alert('Error', result.error);
      } else {
        navigation.navigate('BookingSubmitted', {
          booking: result.booking,
          venue: selectedVenue,
        });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create reservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Date picker calendar
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#FFFFFF" strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Make a Reservation</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.form}>
          {/* Venue Dropdown */}
          <View style={styles.field}>
            <Text style={styles.label}>Venue *</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowVenuePicker(true)}
            >
              <Text style={selectedVenue ? styles.inputText : styles.inputPlaceholder}>
                {selectedVenue ? selectedVenue.name : 'Select venue'}
              </Text>
              <ChevronDown size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Date Picker */}
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

          {/* Time Picker */}
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

          {/* Group Size */}
          <View style={styles.field}>
            <Text style={styles.label}>Group Size *</Text>
            <View style={styles.groupSizeRow}>
              {[1, 2, 3, 4, 5].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.groupSizeButton,
                    groupSize === size && styles.groupSizeButtonSelected,
                  ]}
                  onPress={() => setGroupSize(size)}
                >
                  <Text
                    style={[
                      styles.groupSizeText,
                      groupSize === size && styles.groupSizeTextSelected,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={[styles.groupSizeRow, { marginTop: 8 }]}>
              {[6, 7, 8, 9].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.groupSizeButton,
                    groupSize === size && styles.groupSizeButtonSelected,
                  ]}
                  onPress={() => setGroupSize(size)}
                >
                  <Text
                    style={[
                      styles.groupSizeText,
                      groupSize === size && styles.groupSizeTextSelected,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.groupSizeButton,
                  groupSize && groupSize >= 10 && styles.groupSizeButtonSelected,
                ]}
                onPress={() => setGroupSize(10)}
              >
                <Text
                  style={[
                    styles.groupSizeText,
                    groupSize && groupSize >= 10 && styles.groupSizeTextSelected,
                  ]}
                >
                  10+
                </Text>
              </TouchableOpacity>
            </View>
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

          {/* Special Requests */}
          <View style={styles.field}>
            <Text style={styles.label}>Special Requests (Optional)</Text>
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

      {/* Submit Button */}
      <View style={[styles.bottomButton, { paddingBottom: insets.bottom + 16 }]}>
        <PrimaryButton
          title={isSubmitting ? 'SUBMITTING...' : 'REQUEST RESERVATION'}
          onPress={handleSubmit}
          disabled={isSubmitting || !selectedVenue || !selectedDate || !selectedTime || !groupSize}
        />
      </View>

      {/* Venue Picker Modal */}
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

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerContent}>
            {/* Calendar Card */}
            <View style={styles.calendarCard}>
              {/* Month Header */}
              <View style={styles.calendarMonthHeader}>
                <TouchableOpacity 
                  style={styles.calendarNavButton}
                  onPress={() => {
                    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
                  }}
                >
                  <ChevronLeft size={20} color="#FFFFFF" strokeWidth={1.5} />
                </TouchableOpacity>
                <Text style={styles.calendarMonthText}>
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Text>
                <TouchableOpacity 
                  style={styles.calendarNavButton}
                  onPress={() => {
                    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
                  }}
                >
                  <ChevronRight size={20} color="#FFFFFF" strokeWidth={1.5} />
                </TouchableOpacity>
              </View>

              {/* Days of Week */}
              <View style={styles.calendarDaysOfWeek}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <View key={day} style={styles.calendarDayOfWeek}>
                    <Text style={styles.calendarDayOfWeekText}>{day}</Text>
                  </View>
                ))}
              </View>

              {/* Calendar Grid */}
              <View style={styles.calendarGrid}>
                {days.map((day, index) => {
                  const isDisabled = day ? isPastDate(day) : true;
                  const isSelected = day && selectedDate && 
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).getTime() === selectedDate.getTime();
                  const isCurrentDay = day && 
                    new Date().getDate() === day && 
                    new Date().getMonth() === currentMonth.getMonth() && 
                    new Date().getFullYear() === currentMonth.getFullYear();
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.calendarDayCell,
                        isCurrentDay && !isSelected && styles.calendarDayToday,
                        isSelected && styles.calendarDaySelected,
                      ]}
                      onPress={() => day && handleDateSelect(day)}
                      disabled={!day || isDisabled}
                    >
                      {day && (
                        <Text style={[
                          styles.calendarDayText,
                          isDisabled && styles.calendarDayTextDisabled,
                          isSelected && styles.calendarDayTextSelected,
                        ]}>
                          {day}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Done Button */}
            <TouchableOpacity
              style={styles.calendarDoneButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.calendarDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
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
  groupSizeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  groupSizeButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: INPUT_BG,
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupSizeButtonSelected: {
    backgroundColor: ACCENT_COLOR,
  },
  groupSizeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  groupSizeTextSelected: {
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
  datePickerContent: {
    backgroundColor: INPUT_BG,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  calendarCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 20,
  },
  calendarMonthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarNavButton: {
    padding: 8,
  },
  calendarMonthText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  calendarDaysOfWeek: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  calendarDayOfWeek: {
    flex: 1,
    alignItems: 'center',
  },
  calendarDayOfWeekText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  calendarDayToday: {
    borderWidth: 1.5,
    borderColor: 'rgba(86,132,196,0.5)',
    borderRadius: 10,
  },
  calendarDaySelected: {
    backgroundColor: ACCENT_COLOR,
    borderRadius: 10,
  },
  calendarDayText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  calendarDayTextDisabled: {
    color: 'rgba(255,255,255,0.2)',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  calendarDoneButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  calendarDoneText: {
    fontSize: 16,
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
  loader: {
    padding: 40,
  },
});
