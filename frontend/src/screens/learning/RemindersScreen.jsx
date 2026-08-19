import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import FeatureScreen, { SectionTitle } from '../../components/common/FeatureScreen';
import AppButton from '../../components/common/AppButton';
import AppCard from '../../components/common/AppCard';
import AppInput from '../../components/common/AppInput';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import ReminderCard from '../../components/learning/ReminderCard';
import learningApi from '../../services/api/learningApi';
import { useTheme } from '../../theme';

const localDateTimeParts = (date = new Date(Date.now() + 60 * 60 * 1000)) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  const value = local.toISOString();
  return { date: value.slice(0, 10), time: value.slice(11, 16) };
};

export default function RemindersScreen({ navigation }) {
  const { theme } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const initialSchedule = localDateTimeParts();
  const [scheduledDate, setScheduledDate] = useState(initialSchedule.date);
  const [scheduledTime, setScheduledTime] = useState(initialSchedule.time);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await learningApi.getReminders());
    } catch (err) {
      setError(err.message || 'Could not load reminders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const createReminder = async () => {
    const cleanTitle = title.trim();
    const date = new Date(`${scheduledDate}T${scheduledTime}`);
    if (cleanTitle.length < 2) {
      setFormError('Enter a reminder title with at least 2 characters.');
      return;
    }
    if (Number.isNaN(date.getTime())) {
      setFormError('Choose a valid reminder date and time.');
      return;
    }
    if (date.getTime() <= Date.now()) {
      setFormError('Choose a future date and time.');
      return;
    }

    setSaving(true);
    setFormError('');
    try {
      const reminder = await learningApi.createReminder({
        title: cleanTitle,
        description: description.trim(),
        scheduled_at: date.toISOString(),
      });
      setItems((current) => [...current, reminder].sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)));
      setTitle('');
      setDescription('');
      const nextSchedule = localDateTimeParts();
      setScheduledDate(nextSchedule.date);
      setScheduledTime(nextSchedule.time);
    } catch (err) {
      setFormError(err.message || 'Could not create the reminder.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <FeatureScreen navigation={navigation} title="Reminders" subtitle="Know what is coming next">
      <SectionTitle>Add a reminder</SectionTitle>
      <AppCard style={{ marginBottom: 20 }}>
        <AppInput
          label="Reminder title"
          placeholder="Example: Start morning routine"
          value={title}
          onChangeText={setTitle}
          autoCapitalize="sentences"
          maxLength={120}
        />
        <AppInput
          label="Description (optional)"
          placeholder="What should happen?"
          value={description}
          onChangeText={setDescription}
          autoCapitalize="sentences"
          maxLength={500}
          multiline
          numberOfLines={2}
        />
        <Text style={[styles.pickerLabel, { color: theme.colors.text }]}>Date and time</Text>
        {Platform.OS === 'web' ? (
          <View style={styles.pickerRow}>
            <View style={styles.pickerColumn}>
              <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>Date</Text>
              {React.createElement('input', {
                type: 'date',
                value: scheduledDate,
                min: localDateTimeParts(new Date()).date,
                onChange: (event) => setScheduledDate(event.target.value),
                'aria-label': 'Reminder date',
                style: webPickerStyle(theme),
              })}
            </View>
            <View style={styles.pickerColumn}>
              <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>Time</Text>
              {React.createElement('input', {
                type: 'time',
                value: scheduledTime,
                onChange: (event) => setScheduledTime(event.target.value),
                'aria-label': 'Reminder time',
                style: webPickerStyle(theme),
              })}
            </View>
          </View>
        ) : (
          <View style={styles.pickerRow}>
            <AppInput label="Date" value={scheduledDate} onChangeText={setScheduledDate} placeholder="YYYY-MM-DD" style={styles.pickerColumn} />
            <AppInput label="Time" value={scheduledTime} onChangeText={setScheduledTime} placeholder="HH:MM" style={styles.pickerColumn} />
          </View>
        )}
        <Text style={[styles.hint, { color: theme.colors.textMuted }]}>Choose a future date and time.</Text>
        {formError ? <Text accessibilityRole="alert" style={{ color: theme.colors.status.error, marginBottom: 12 }}>{formError}</Text> : null}
        <AppButton title="Add Reminder" onPress={createReminder} loading={saving} disabled={saving} />
      </AppCard>

      <SectionTitle>Upcoming and completed</SectionTitle>
      {loading ? (
        <Loading message="Loading reminders..." />
      ) : error ? (
        <EmptyState title="Could not load reminders" description={error} actionTitle="Retry" onActionPress={load} />
      ) : items.length === 0 ? (
        <EmptyState title="No reminders yet" description="Add your first reminder above." />
      ) : (
        items.map((item) => <ReminderCard key={item.id} reminder={item} />)
      )}
    </FeatureScreen>
  );
}

const webPickerStyle = (theme) => ({
  width: '100%',
  minHeight: 48,
  boxSizing: 'border-box',
  padding: '10px 12px',
  fontSize: 16,
  color: theme.colors.text,
  backgroundColor: theme.colors.inputBackground,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.borderRadius.md,
  colorScheme: theme.dark ? 'dark' : 'light',
});

const styles = StyleSheet.create({
  pickerLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  pickerRow: { flexDirection: 'row', gap: 12, marginBottom: 6 },
  pickerColumn: { flex: 1 },
  fieldLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  hint: { fontSize: 12, marginBottom: 16 },
});
