import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FeatureScreen, { SectionTitle } from '../../components/common/FeatureScreen';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import SpeechButton from '../../components/communication/SpeechButton';
import communicationApi from '../../services/api/communicationApi';
import { useTheme } from '../../theme';

export default function QuickCommunicationScreen({ navigation }) {
  const { theme } = useTheme();
  const [phrases, setPhrases] = useState([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { colors, borderRadius } = theme;
  const load = async () => { setLoading(true); setError(''); try { setPhrases(await communicationApi.getQuickPhrases()); } catch (err) { setError(err.message || 'Could not load quick messages.'); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  return <FeatureScreen navigation={navigation} title="Say it quickly" subtitle="Choose one message. It is ready to speak immediately.">
    {loading ? <Loading message="Loading quick messages..." /> : error ? <EmptyState title="Could not load quick messages" description={error} actionTitle="Retry" onActionPress={load} /> : phrases.length === 0 ? <EmptyState title="No quick messages available" description="Try again in a moment." actionTitle="Retry" onActionPress={load} /> : <>
      <View style={styles.primaryGrid}>{phrases.slice(0, 3).map((item) => <TouchableOpacity key={item.id} accessibilityRole="button" accessibilityHint="Select this phrase to speak" onPress={() => setSelected(item.text)} style={[styles.primaryButton, { backgroundColor: colors.primary, borderRadius: borderRadius.xl }]}><Text style={[styles.mark, { color: colors.primaryLight }]}>{item.icon || '!'}</Text><Text style={styles.primaryText}>{item.text}</Text></TouchableOpacity>)}</View>
      {phrases.length > 3 ? <><SectionTitle>More messages</SectionTitle>{phrases.slice(3).map((item) => <TouchableOpacity key={item.id} accessibilityRole="button" onPress={() => setSelected(item.text)} style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.primary, borderRadius: borderRadius.lg }]}><Text style={[styles.secondaryMark, { color: colors.primary }]}>{item.icon}</Text><Text style={[styles.secondaryText, { color: colors.text }]}>{item.text}</Text></TouchableOpacity>)}</> : null}
      {selected ? <View style={[styles.speakBar, { backgroundColor: colors.surfaceSubtle, borderRadius: borderRadius.lg }]}><Text accessibilityLiveRegion="polite" style={[styles.selectedText, { color: colors.text }]}>{selected}</Text><SpeechButton text={selected} size="large" /></View> : null}
    </>}
  </FeatureScreen>;
}

const styles = StyleSheet.create({ primaryGrid:{gap:12},primaryButton:{minHeight:108,padding:20,flexDirection:'row',alignItems:'center'},mark:{fontSize:34,fontWeight:'800',width:54},primaryText:{color:'#FFFFFF',fontSize:23,fontWeight:'800',letterSpacing:-0.3},secondaryButton:{minHeight:66,paddingHorizontal:18,borderWidth:1,marginBottom:10,flexDirection:'row',alignItems:'center'},secondaryMark:{fontSize:22,fontWeight:'700',width:38},secondaryText:{fontSize:17,fontWeight:'700'},speakBar:{marginTop:24,padding:18,gap:14},selectedText:{fontSize:19,fontWeight:'700'} });
