import { Text, View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoBox}>
            <Ionicons name="construct" size={22} color="#0A0A0A" />
          </View>
          <View>
            <Text style={styles.brandTitle}>THREAD MASTER</Text>
            <Text style={styles.brandSub}>MACHINIST EDITION · v2.0</Text>
          </View>
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
                <Ionicons name="chevron-forward" size={28} color="#FFB000" />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>OFFLINE · NO ACCOUNT REQUIRED</Text>
      </View>
    </SafeAreaView>
  );
}

function FeatureCell({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.featCell}>
      <Ionicons name={icon} size={20} color="#FFB000" />
      <Text style={styles.featLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: {
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoBox: { width: 40, height: 40, backgroundColor: '#FFB000', alignItems: 'center', justifyContent: 'center', borderRadius: 4 },
  brandTitle: { color: '#F3F4F6', fontSize: 16, fontWeight: '800', letterSpacing: 2 },
  brandSub: { color: '#9CA3AF', fontSize: 11, letterSpacing: 1.5, marginTop: 2 },
  body: { padding: 20, gap: 14, paddingBottom: 32 },
  scroll: { flex: 1 },
  h1: { color: '#F3F4F6', fontSize: 32, fontWeight: '800', letterSpacing: -0.5, marginTop: 8 },
  subtitle: { color: '#9CA3AF', fontSize: 14, lineHeight: 20, marginBottom: 8 },
  cardStack: { gap: 14 },
  card: {
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 6,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 130,
  },
  cardPressed: { backgroundColor: '#262626', borderColor: '#FFB000' },
  iconCol: {
    width: 56, height: 56, borderRadius: 4,
    backgroundColor: 'rgba(255,176,0,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,176,0,0.25)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 16,
  },
  cardCenter: { flex: 1, gap: 3 },
  cardKicker: { color: '#FFB000', fontSize: 10, letterSpacing: 1.4, fontWeight: '700' },
  cardTitle: { color: '#F3F4F6', fontSize: 26, fontWeight: '800', letterSpacing: 1, marginTop: 4 },
  cardDesc: { color: '#F3F4F6', fontSize: 13, marginTop: 4 },
  cardRange: { color: '#9CA3AF', fontSize: 12, fontFamily: 'monospace', marginTop: 2 },
  cardArrow: { paddingLeft: 8 },
  featureRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  featCell: {
    flex: 1, backgroundColor: '#171717',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 4,
    paddingVertical: 14, alignItems: 'center', gap: 6,
  },
  featLabel: { color: '#9CA3AF', fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  footer: { paddingVertical: 12, alignItems: 'center' },
  footerText: { color: '#6B7280', fontSize: 11, letterSpacing: 1.5, fontWeight: '600' },
});
