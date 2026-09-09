import { Text, View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, type AppColors } from './_layout';

const SYSTEMS = [
  {
    id: 'unified',
    kicker: 'INCH · ASME B1.1',
    title: 'UNIFIED',
    desc: 'UNC · UNF · UNEF · UNS',
    range: '#0-80 to 1"-8',
    route: { pathname: '/threads', params: { system: 'unified' } },
    icon: 'resize' as const,
  },
  {
    id: 'metric',
    kicker: 'MM · ISO 261/262',
    title: 'METRIC',
    desc: 'Coarse · Fine · Extra Fine · Super Fine',
    range: 'M1 to M25',
    route: { pathname: '/threads', params: { system: 'metric' } },
    icon: 'magnet' as const,
  },
  {
    id: 'pipe',
    kicker: 'PIPE · ASME · ISO',
    title: 'PIPE',
    desc: 'NPT · NPTF · BSPP · BSPT',
    range: '1/16" to 1" / G · R',
    route: { pathname: '/pipe' },
    icon: 'git-branch' as const,
  },
];

export default function Home() {
  const router = useRouter();
  const { colors: c, openSettings } = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoBox}>
            <Ionicons name="construct" size={22} color={c.onPrimary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.brandTitle}>THREAD MASTER</Text>
            <Text style={styles.brandSub}>MACHINIST EDITION · v2.0</Text>
          </View>
          <Pressable
            testID="settings-button"
            onPress={openSettings}
            style={styles.gearBtn}
            hitSlop={8}
            accessibilityLabel="Settings"
          >
            <Ionicons name="settings-outline" size={24} color={c.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.h1}>Select System</Text>
        <Text style={styles.subtitle}>
          Choose a thread system. All specs are computed per ASME B1.1 / ISO 261 / ASME B1.20.1.
        </Text>

        <View style={styles.cardStack}>
          {SYSTEMS.map((sys) => (
            <Pressable
              key={sys.id}
              testID={`system-select-${sys.id}`}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => router.push(sys.route as any)}
            >
              <View style={styles.cardCenter}>
                <Text style={styles.cardKicker}>{sys.kicker}</Text>
                <Text style={styles.cardTitle}>{sys.title}</Text>
                <Text style={styles.cardDesc}>{sys.desc}</Text>
                <Text style={styles.cardRange}>{sys.range}</Text>
              </View>
              <View style={styles.cardArrow}>
                <Ionicons name="chevron-forward" size={28} color={c.primary} />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: {
      paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16,
      borderBottomWidth: 1, borderBottomColor: c.border,
    },
    brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    logoBox: { width: 40, height: 40, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center', borderRadius: 4 },
    brandTitle: { color: c.text, fontSize: 16, fontWeight: '800', letterSpacing: 2 },
    brandSub: { color: c.muted, fontSize: 11, letterSpacing: 1.5, marginTop: 2 },
    gearBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    body: { padding: 20, gap: 14, paddingBottom: 32 },
    scroll: { flex: 1 },
    h1: { color: c.text, fontSize: 32, fontWeight: '800', letterSpacing: -0.5, marginTop: 8 },
    subtitle: { color: c.muted, fontSize: 14, lineHeight: 20, marginBottom: 8 },
    cardStack: { gap: 14 },
    card: {
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 6,
      padding: 18,
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 130,
    },
    cardPressed: { backgroundColor: c.surfaceElevated, borderColor: c.primary },
    iconCol: {
      width: 56, height: 56, borderRadius: 4,
      backgroundColor: c.surfaceElevated,
      borderWidth: 1, borderColor: c.primary,
      alignItems: 'center', justifyContent: 'center',
      marginRight: 16,
    },
    cardCenter: { flex: 1, gap: 3 },
    cardKicker: { color: c.primary, fontSize: 10, letterSpacing: 1.4, fontWeight: '700' },
    cardTitle: { color: c.text, fontSize: 26, fontWeight: '800', letterSpacing: 1, marginTop: 4 },
    cardDesc: { color: c.text, fontSize: 13, marginTop: 4 },
    cardRange: { color: c.muted, fontSize: 12, fontFamily: 'monospace', marginTop: 2 },
    cardArrow: { paddingLeft: 8 },
    featureRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
    featCell: {
      flex: 1, backgroundColor: c.surface,
      borderWidth: 1, borderColor: c.border, borderRadius: 4,
      paddingVertical: 14, alignItems: 'center', gap: 6,
    },
    featLabel: { color: c.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  });
}
