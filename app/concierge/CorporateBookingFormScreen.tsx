import React, { useState } from 'react';
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
import { createSpecialBookingRequest } from '../../src/services/api';
import PrimaryButton from '../../components/buttons/PrimaryButton';

const BACKGROUND_COLOR = '#0A1628';
const INPUT_BG = '#111D2E';
const ACCENT_COLOR = '#5684C4';
const BORDER_RADIUS = 12;

interface CorporateBookingFormScreenProps {
  navigation: any;
}

const EVENT_TYPES = ['Team Dinner', 'Client Entertainment', 'Corporate Event', 'Conference', 'Other'];
const BUDGET_RANGES = ['Flexible', '1000-5000 AED', '5000-10000 AED', '10000-25000 AED', '25000+ AED'];

export default function CorporateBookingFormScreen({ navigation }: CorporateBookingFormScreenProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [eventType, setEventType] = useState<string | null>(null);
  const [showEventTypePicker, setShowEventTypePicker] = useState(false);
  const [attendees, setAttendees] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [budgetRange, setBudgetRange] = useState<string | null>(null);
  const [showBudgetPicker, setShowBudgetPicker] = useState(false);
  const [contactName, setContactName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [requirements, setRequirements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!eventType || !attendees || !selectedDate || !companyName || !contactName || !email || !phone) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createSpecialBookingRequest({
        user_id: '',
        request_type: 'corporate',
        event_date: selectedDate?.toISOString(),
        guest_count: parseInt(attendees),
        budget: budgetRange || undefined,
        details: {
          company_name: companyName,
          event_type: eventType,
          contact_name: contactName,
          email: email,
          phone: phone,
          requirements: requirements,
        },
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      Alert.alert(
        'Inquiry Submitted',
        'Your corporate booking inquiry has been submitted. Our team will reach out with options shortly.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit inquiry');
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
          <Text style={styles.headerTitle}>Corporate Booking</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.form}>
          {/* Event Type */}
          <View style={styles.field}>
            <Text style={styles.label}>Event Type *</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowEventTypePicker(true)}
            >
              <Text style={eventType ? styles.inputText : styles.inputPlaceholder}>
                {eventType || 'Select event type'}
              </Text>
              <ChevronDown size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Number of Attendees */}
          <View style={styles.field}>
            <Text style={styles.label}>Number of Attendees *</Text>
            <TextInput
              style={styles.textInput}
              value={attendees}
              onChangeText={setAttendees}
              placeholder="Enter number of attendees"
              placeholderTextColor="#6B7280"
              keyboardType="number-pad"
            />
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

          {/* Company Name */}
          <View style={styles.field}>
            <Text style={styles.label}>Company Name *</Text>
            <TextInput
              style={styles.textInput}
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="Enter company name"
              placeholderTextColor="#6B7280"
            />
          </View>

          {/* Budget Range */}
          <View style={styles.field}>
            <Text style={styles.label}>Budget Range</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowBudgetPicker(true)}
            >
              <Text style={budgetRange ? styles.inputText : styles.inputPlaceholder}>
                {budgetRange || 'Select budget range'}
              </Text>
              <ChevronDown size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Contact Name */}
          <View style={styles.field}>
            <Text style={styles.label}>Contact Name *</Text>
            <TextInput
              style={styles.textInput}
              value={contactName}
              onChangeText={setContactName}
              placeholder="Enter contact name"
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

          {/* Requirements */}
          <View style={styles.field}>
            <Text style={styles.label}>Requirements</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={requirements}
              onChangeText={setRequirements}
              placeholder="Any specific requirements?"
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
          title={isSubmitting ? 'SUBMITTING...' : 'SUBMIT INQUIRY'}
          onPress={handleSubmit}
          disabled={isSubmitting || !eventType || !attendees || !selectedDate || !companyName || !contactName || !email || !phone}
        />
      </View>

      {/* Event Type Picker Modal */}
      <Modal visible={showEventTypePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Event Type</Text>
              <TouchableOpacity onPress={() => setShowEventTypePicker(false)}>
                <Text style={styles.modalClose}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {EVENT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.modalItem}
                  onPress={() => {
                    setEventType(type);
                    setShowEventTypePicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{type}</Text>
                  {eventType === type && (
                    <Text style={styles.modalItemCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal */}
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

      {/* Budget Picker Modal */}
      <Modal visible={showBudgetPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Budget Range</Text>
              <TouchableOpacity onPress={() => setShowBudgetPicker(false)}>
                <Text style={styles.modalClose}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {BUDGET_RANGES.map((range) => (
                <TouchableOpacity
                  key={range}
                  style={styles.modalItem}
                  onPress={() => {
                    setBudgetRange(range);
                    setShowBudgetPicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{range}</Text>
                  {budgetRange === range && (
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
