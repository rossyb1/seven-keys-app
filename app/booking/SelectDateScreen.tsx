import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandColors, BackgroundColors, TextColors, AccentColors, Spacing, Typography, BorderRadius } from '../../constants/brand';
import { ChevronLeft, ChevronRight } from '../../components/icons/AppIcons';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import type { Venue } from '../../src/types/database';

interface SelectDateScreenProps {
  navigation: any;
  route: any;
}

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function SelectDateScreen({ navigation, route }: SelectDateScreenProps) {
  const insets = useSafeAreaInsets();
  const venue = route.params?.venue as Venue | undefined;

  if (!venue) {
    navigation.goBack();
    return null;
  }

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

  const isToday = (day: number) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    return (
      checkDate.getDate() === today.getDate() &&
      checkDate.getMonth() === today.getMonth() &&
      checkDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return (
      selectedDate.getDate() === checkDate.getDate() &&
      selectedDate.getMonth() === checkDate.getMonth() &&
      selectedDate.getFullYear() === checkDate.getFullYear()
    );
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color={TextColors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Date</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Venue Info */}
        <View style={styles.venueInfo}>
          <Text style={styles.venueName}>{venue.name}</Text>
          <Text style={styles.venueType}>
            {venue.type === 'restaurant' ? 'Restaurant' :
             venue.type === 'beach_club' ? 'Beach Club' :
             venue.type === 'nightclub' ? 'Nightclub' :
             venue.type === 'event' ? 'Event' : venue.type}
          </Text>
        </View>

        {/* Calendar */}
        <View style={styles.calendar}>
          {/* Month Header */}
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

          {/* Days of Week */}
          <View style={styles.daysOfWeek}>
            {DAYS_OF_WEEK.map((day) => (
              <View key={day} style={styles.dayOfWeek}>
                <Text style={styles.dayOfWeekText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {days.map((day, index) => {
              if (day === null) {
                return <View key={index} style={styles.dayCell} />;
              }
              const past = isPastDate(day);
              const today = isToday(day);
              const selected = isSelected(day);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    today && !selected && styles.todayCell,
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

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <Text style={styles.legendDot}>●</Text>
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={styles.legendCircle}>○</Text>
            <Text style={styles.legendText}>Limited</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={styles.legendDash}>-</Text>
            <Text style={styles.legendText}>Closed</Text>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.bottomButtonContainer, { paddingBottom: insets.bottom + Spacing.base }]}>
        <PrimaryButton
          title="CONTINUE"
          onPress={() => {
            if (selectedDate) {
              // Ensure venue is passed as a clean object
              navigation.navigate('SelectTime', {
                venue: { ...venue },
                selectedDate: selectedDate.toISOString(),
              });
            }
          }}
          disabled={!selectedDate}
        />
      </View>
    </SafeAreaView>
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
  venueInfo: {
    marginBottom: Spacing.xl * 2,
  },
  venueName: {
    color: TextColors.primary,
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    marginBottom: Spacing.xs / 2,
  },
  venueType: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
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
  todayCell: {
    borderWidth: 1,
    borderColor: AccentColors.primary,
    borderRadius: BorderRadius.base,
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
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.xl * 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    color: AccentColors.primary,
    fontSize: Typography.fontSize.base,
  },
  legendCircle: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.base,
  },
  legendDash: {
    color: TextColors.tertiary,
    fontSize: Typography.fontSize.base,
  },
  legendText: {
    color: TextColors.secondary,
    fontSize: Typography.fontSize.xs,
  },
  bottomButtonContainer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: AccentColors.border,
    backgroundColor: BackgroundColors.primary,
  },
});
