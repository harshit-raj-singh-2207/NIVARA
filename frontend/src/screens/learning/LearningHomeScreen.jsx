import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FeatureScreen, { SectionTitle } from '../../components/common/FeatureScreen';
import ProgressBar from '../../components/learning/ProgressBar';
import useLearningStore from '../../store/learningStore';
import { LEARNING_ROUTES as R } from '../../constants/routes';
import { useTheme } from '../../theme';

const LINKS = [
  { title: 'Learning topics', sub: 'Choose something to learn', route: R.TOPICS, mark: '01' },
  { title: 'AI tutor', sub: 'Ask for a patient explanation', route: R.TUTOR, mark: '02' },
  { title: 'Reminders', sub: 'Prepare for what comes next', route: R.REMINDERS, mark: '03' },
];

export default function LearningHomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { routines, progressPercentage, fetchRoutines } = useLearningStore();
  useEffect(() => { fetchRoutines().catch(() => {}); }, []);
  const { colors, borderRadius } = theme;
  const routine = routines[0];
  const nextTask = routine?.tasks?.find((task) => !(task.steps || []).every((step) => step.completed));
  return <FeatureScreen navigation={navigation} title="Good morning" subtitle="Here is a calm, clear plan for your day.">
    <Text style={[styles.eyebrow, { color: colors.primary }]}>CURRENT ROUTINE</Text>
    <TouchableOpacity accessibilityRole="button" onPress={() => navigation.navigate(R.ROUTINES)} style={[styles.featured, { backgroundColor: colors.primary, borderRadius: borderRadius.xl }]}>
      <Text style={styles.featuredTitle}>{routine?.title || 'Your routine is ready'}</Text>
      <Text style={[styles.featuredMeta, { color: colors.primaryLight }]}>{progressPercentage}% complete</Text>
      <ProgressBar progress={progressPercentage / 100} color={colors.secondary} style={styles.progress} />
      <Text style={styles.openLabel}>Continue routine  →</Text>
    </TouchableOpacity>

    {nextTask ? <View style={[styles.nextTask, { backgroundColor: colors.surfaceSubtle, borderRadius: borderRadius.lg }]}><View style={[styles.taskMarker, { backgroundColor: colors.secondaryLight }]}><Text style={{ color: colors.text, fontWeight: '800' }}>NEXT</Text></View><View style={styles.taskCopy}><Text style={[styles.taskTitle, { color: colors.text }]}>{nextTask.title}</Text><Text style={[styles.taskMeta, { color: colors.textSecondary }]}>{nextTask.time || 'Continue when you are ready'}</Text></View></View> : null}

    <SectionTitle>Learn and prepare</SectionTitle>
    <View style={styles.links}>{LINKS.map((item) => <TouchableOpacity accessibilityRole="button" key={item.route} onPress={() => navigation.navigate(item.route)} style={[styles.link, { borderBottomColor: colors.border }]}><Text style={[styles.number, { color: colors.accent }]}>{item.mark}</Text><View style={styles.linkCopy}><Text style={[styles.linkTitle, { color: colors.text }]}>{item.title}</Text><Text style={[styles.linkSub, { color: colors.textSecondary }]}>{item.sub}</Text></View><Text style={[styles.arrow, { color: colors.primary }]}>→</Text></TouchableOpacity>)}</View>
  </FeatureScreen>;
}

const styles = StyleSheet.create({ eyebrow:{fontSize:12,fontWeight:'800',letterSpacing:1.3,marginBottom:10},featured:{padding:24,minHeight:210,justifyContent:'center'},featuredTitle:{color:'#FFFFFF',fontSize:28,lineHeight:35,fontWeight:'800',letterSpacing:-0.5},featuredMeta:{fontSize:15,marginTop:8},progress:{marginTop:22},openLabel:{color:'#FFFFFF',fontSize:16,fontWeight:'700',marginTop:20},nextTask:{padding:16,marginTop:14,flexDirection:'row',alignItems:'center'},taskMarker:{width:52,height:52,borderRadius:15,alignItems:'center',justifyContent:'center'},taskCopy:{marginLeft:14,flex:1},taskTitle:{fontSize:17,fontWeight:'700'},taskMeta:{fontSize:14,marginTop:3},links:{backgroundColor:'transparent'},link:{minHeight:82,borderBottomWidth:1,flexDirection:'row',alignItems:'center'},number:{fontSize:13,fontWeight:'800',width:38},linkCopy:{flex:1},linkTitle:{fontSize:18,fontWeight:'700'},linkSub:{fontSize:14,marginTop:4},arrow:{fontSize:22,fontWeight:'600'} });
