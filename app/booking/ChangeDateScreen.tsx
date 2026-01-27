import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';
import { ChevronLeft, ChevronRight } from '../../components/icons/AppIcons';
import PrimaryButton from '../../components/buttons/PrimaryButton';

interface ChangeDateScreenProps {
  navigation: any;
  route: any;
}

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function ChangeDateScreen({ navigation, route }: ChangeDateScreenProps) {
  const booking = route.params?.booking || { date: 'Saturday, 15 February' };
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isPastDate = (day: number) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const handleDateSelect = (day: number) => {
    if (isPastDate(day)) return;
    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + (direction === 'next' ? 1 : -1), 1));
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change Date</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Current Date */}
        <Text style={styles.currentDate}>Current: {booking.date}</Text>

        {/* Calendar */}
        <View style={styles.calendar}>
          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={() => changeMonth('prev')}>
              <ChevronLeft size={20} color={TextColors.primary} strokeWidth={1.5} />
            </TouchableOpacity>
            <Text style={styles.monthText}>
              {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            <TouchableOpacity onPress={() => changeMonth('next')}>
              <ChevronRight size={20} color={TextColors.primary} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>

          <View style={styles.daysOfWeek}>
            {DAYS_OF_WEEK.map((day) => (
              <View key={day} style={styles.dayOfWeek}>
                <Text style={styles.dayOfWeekText}>{day}</Text>
              </View>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {days.map((day, index) => {
              if (day === null) {
                return <View key={index} style={styles.dayCell} />;
              }
              const past = isPastDate(day);
              const selected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth();
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    selected && styles.selectedCell,
                  ]}
                  onPress={() => handleDateSelect(day)}
                  disabled={past}
                >
                  <Text
                    style={[
                      styles.dayText,
                      past && styles.pastDayText,
                      selected && styles.selectedDayText,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Warning */}
        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            Date changes must be requested 48+ hours before.
          </Text>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomButtonContainer}>
        <PrimaryButton
          title="SUBMIT REQUEST"
          onPress={() => {
            if (selectedDate) {
              // Handle date change request
              navigation.goBack();
            }
          }}
          disabled={!selectedDate}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BackgroundColors.primary,
  },
  content: {
    flex: 1,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  backArrow: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.xl,
    fontWeight: '300',
  },
  headerTitle: {
    flex: 1,
    color: TextColors.primary,
    fontSize: Typography.fontSize.xl,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  currentDate: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.xl * 2,
  },
  calendar: {
    marginBottom: Spacing.xl,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  monthArrow: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.lg,
    padding: Spacing.sm,
  },
  monthText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
  },
  daysOfWeek: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  dayOfWeek: {
    flex: 1,
    alignItems: 'center',
  },
  dayOfWeekText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.xs,
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  selectedCell: {
    backgroundColor: AccentColors.primary,
    borderRadius: BorderRadius.base,
  },
  dayText: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.base,
  },
  pastDayText: {
    color: TextColors.tertiary,
    opacity: 0.5,
  },
  selectedDayText: {
    color: BrandColors.black,
    fontWeight: '600',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: BorderRadius.base,
    padding: Spacing.base,
    marginBottom: Spacing.xl * 2,
  },
  warningIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  warningText: {
    flex: 1,
    color: TextColors.secondary,
    fontSize: Typography.fontSize.sm,
    lineHeight: 20,
  },
  bottomButtonContainer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: AccentColors.border,
    backgroundColor: BackgroundColors.primary,
  },
});
