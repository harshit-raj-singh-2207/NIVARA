import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FeatureScreen, { SectionTitle } from '../../components/common/FeatureScreen';
import AppButton from '../../components/common/AppButton';
import EmptyState from '../../components/common/EmptyState';
import Loading from '../../components/common/Loading';
import SpeechButton from '../../components/communication/SpeechButton';
import communicationApi from '../../services/api/communicationApi';
import { useTheme } from '../../theme';

export default function AACScreen({ navigation }) {
  const { theme } = useTheme();
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [selected, setSelected] = useState([]);
  const [sentence, setSentence] = useState('');
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState('');
  const { colors, borderRadius, typography } = theme;

  const load = async () => {
    setLoading(true); setError('');
    try { const data = await communicationApi.getAACCategories(); setCategories(data); setCategoryId((current) => current || data[0]?.id || ''); }
    catch (err) { setError(err.message || 'Could not load AAC phrases.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const choosePhrase = async (phrase) => {
    if (building) return;
    const next = [...selected, phrase];
    setSelected(next);
    setSentence(next.map((item) => item.text).join(' '));
    setBuilding(true); setError('');
    try { const result = await communicationApi.generateAACSentence(next.map((item) => item.id)); setSentence(result.sentence); }
    catch (err) { setSelected(selected); setSentence(selected.map((item) => item.text).join(' ')); setError(err.message || 'Could not build the message.'); }
    finally { setBuilding(false); }
  };

  const clear = () => { setSelected([]); setSentence(''); setError(''); };
  const category = categories.find((item) => item.id === categoryId);
  return <FeatureScreen navigation={navigation} title="What do you want to say?" subtitle="Build a message with large, easy-to-reach words.">
    <View style={[styles.messagePanel, { backgroundColor: colors.primary, borderRadius: borderRadius.xl }]}>
      <Text style={[styles.eyebrow, { color: colors.primaryLight }]}>YOUR MESSAGE</Text>
      <Text accessibilityLiveRegion="polite" style={styles.sentence}>{sentence || 'Tap a word below to begin.'}</Text>
      <View style={styles.actions}><SpeechButton text={sentence} size="large" /><AppButton title="Clear" variant="secondary" fullWidth={false} disabled={!sentence || building} onPress={clear} /></View>
    </View>
    {error ? <Text accessibilityRole="alert" style={{ color: colors.status.error, marginTop: 12 }}>{error}</Text> : null}
    {loading ? <Loading message="Loading AAC phrases..." /> : categories.length === 0 ? <EmptyState title="No AAC phrases available" description="Try again to load your communication choices." actionTitle="Retry" onActionPress={load} /> : <>
      <SectionTitle>Choose a category</SectionTitle>
      <View style={styles.categories}>{categories.map((item) => { const active = categoryId === item.id; return <TouchableOpacity accessibilityRole="tab" accessibilityState={{ selected: active }} key={item.id} onPress={() => setCategoryId(item.id)} style={[styles.category, { backgroundColor: active ? colors.primaryLight : colors.surface, borderColor: active ? colors.primary : colors.border, borderRadius: borderRadius.md }]}><Text style={{ color: colors.text, fontWeight: active ? typography.weights.bold : typography.weights.medium }}>{item.label}</Text></TouchableOpacity>; })}</View>
      <SectionTitle>{category?.label || ''}</SectionTitle>
      {category?.phrases?.length ? <View style={styles.grid}>{category.phrases.map((phrase) => <TouchableOpacity disabled={building} accessibilityRole="button" accessibilityHint={`Add ${phrase.text} to message`} key={phrase.id} onPress={() => choosePhrase(phrase)} style={[styles.tile, { backgroundColor: colors.surface, borderColor: categoryId === 'emergency' ? colors.status.error : colors.border, borderRadius: borderRadius.lg, opacity: building ? 0.7 : 1 }]}><View style={[styles.letter, { backgroundColor: categoryId === 'emergency' ? colors.status.errorBackground : colors.surfaceSubtle }]}><Text style={[styles.letterText, { color: categoryId === 'emergency' ? colors.status.error : colors.primary }]}>{phrase.icon || phrase.label.slice(0, 1)}</Text></View><Text style={[styles.tileText, { color: colors.text }]}>{phrase.label}</Text></TouchableOpacity>)}</View> : <EmptyState title="No phrases in this category" description="Choose another category." />}
    </>}
  </FeatureScreen>;
}

const styles = StyleSheet.create({ messagePanel:{padding:24,minHeight:190,justifyContent:'space-between'},eyebrow:{fontSize:12,fontWeight:'800',letterSpacing:1.2},sentence:{color:'#FFFFFF',fontSize:26,lineHeight:36,fontWeight:'700',marginVertical:16},actions:{flexDirection:'row',gap:10,alignItems:'center'},categories:{flexDirection:'row',flexWrap:'wrap',gap:8},category:{minHeight:48,paddingHorizontal:16,borderWidth:1,justifyContent:'center'},grid:{flexDirection:'row',flexWrap:'wrap',gap:12},tile:{flexGrow:1,flexBasis:145,minHeight:132,borderWidth:1,alignItems:'center',justifyContent:'center',padding:16},letter:{width:48,height:48,borderRadius:15,alignItems:'center',justifyContent:'center'},letterText:{fontSize:24,fontWeight:'800'},tileText:{fontSize:18,lineHeight:24,fontWeight:'700',marginTop:12,textAlign:'center'} });
