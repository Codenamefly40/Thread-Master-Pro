import { useMemo } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, type AppColors } from './_layout';

const PIPE_OPTIONS = [
  { id: 'npt',  title: 'NPT',  kicker: 'PIPE · ASME B1.20.1',     desc: 'Tapered National Pipe Thread',     range: '1/16 to 1"' },
  { id: 'nptf', title: 'NPTF', kicker: 'DRYSEAL · ASME B1.20.3',  desc: 'Sealing pipe thread (no sealant)', range: '1/16 to 1"' },
  { id: 'bspp', title: 'BSPP', kicker: 'BRITISH PIPE · ISO 228 (G)', desc: 'Parallel pipe thread (G)',      range: 'G 1/16 to G 1' },
  { id: 'bspt', title: 'BSPT', kicker: 'BRITISH PIPE · ISO 7-1 (R)', desc: 'Tapered pipe thread (R)',       range: 'R 1/16 to R 1' },
];

export default function PipeSelector() {
  const router = useRouter();
  const { colors: c } = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: 'Pipe Threads' }} />
      <View style={styles.body}>
        <Text style={styles.kicker}>SELECT PIPE STANDARD</Text>
        <Text style={styles.h1}>Pipe Threads</Text>
        <Text style={styles.subtitle}>
          Choose the pipe-thread standard you're working with. All four are available offline.
        </Text>

        <View style={styles.grid}>
          {PIPE_OPTIONS.map((opt) => (
            <Pressable
              key={opt.id}
              testID={`pipe-select-${opt.id}`}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => router.push({ pathname: '/threads', params: { system: opt.id } })}
            >
              <Text style={styles.cardKicker}>{opt.kicker}</Text>
              <Text style={styles.cardTitle}>{opt.title}</Text>
              <Text style={styles.cardDesc}>{opt.desc}</Text>
              <Text style={styles.cardRange}>{opt.range}</Text>
              <Ionicons name="chevron-forward" size={22} color={c.primary} style={styles.chevron} />
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    body: { flex: 1, padding: 20, gap: 12 },
    kicker: { color: c.primary, fontSize: 11, letterSpacing: 1.5, fontWeight: '700', marginTop: 8 },
    h1: { color: c.text, fontSize: 30, fontWeight: '800', letterSpacing: -0.5, marginTop: 4 },
    subtitle: { color: c.muted, fontSize: 13, lineHeight: 19, marginBottom: 12 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    card: {
      width: '48%',
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 6,
      padding: 16,
      minHeight: 160,
      justifyContent: 'flex-start',
    },
    cardPressed: { backgroundColor: c.surfaceElevated, borderColor: c.primary },
    cardKicker: { color: c.primary, fontSize: 9, letterSpacing: 1.2, fontWeight: '700' },
    cardTitle: { color: c.text, fontSize: 26, fontWeight: '800', letterSpacing: 1, marginTop: 8 },
    cardDesc: { color: c.text, fontSize: 12, marginTop: 8, lineHeight: 16 },
    cardRange: { color: c.muted, fontSize: 11, fontFamily: 'monospace', marginTop: 8 },
    chevron: { position: 'absolute', right: 12, bottom: 12 },
  });
}
