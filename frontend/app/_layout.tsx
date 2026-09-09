import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import {
  Text, View, StyleSheet, Pressable, ScrollView, TextInput,
} from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export const DEFAULT_COLORS = {
  bg: '#0A0A0A',
  surface: '#171717',
  surfaceElevated: '#262626',
  border: 'rgba(255,255,255,0.12)',
  primary: '#FFB000',
  onPrimary: '#0A0A0A',
  text: '#F3F4F6',
  muted: '#9CA3AF',
  dim: '#6B7280',
  success: '#00E676',
  danger: '#FF3B30',
};

export type AppColors = typeof DEFAULT_COLORS;

const THEME_KEY = 'thread-master-colors';

const PRESETS: { id: string; name: string; colors: AppColors }[] = [
  { id: 'shop', name: 'Shop Floor', colors: { ...DEFAULT_COLORS } },
  {
    id: 'highvis',
    name: 'High Vis',
    colors: {
      ...DEFAULT_COLORS,
      bg: '#000000',
      surface: '#111111',
      surfaceElevated: '#1F1F1F',
      primary: '#FFD60A',
      onPrimary: '#000000',
    },
  },
  {
    id: 'steel',
    name: 'Steel',
    colors: {
      ...DEFAULT_COLORS,
      bg: '#0B1220',
      surface: '#152033',
      surfaceElevated: '#1E2E48',
      border: 'rgba(160,190,255,0.16)',
      primary: '#4DA3FF',
      onPrimary: '#041018',
      text: '#E8F1FF',
      muted: '#93A4C0',
      dim: '#6B7A94',
    },
  },
  {
    id: 'daylight',
    name: 'Daylight',
    colors: {
      bg: '#F3F0E8',
      surface: '#FFFFFF',
      surfaceElevated: '#E7E2D6',
      border: 'rgba(0,0,0,0.12)',
      primary: '#C47B00',
      onPrimary: '#FFFFFF',
      text: '#1A1A1A',
      muted: '#5C5C5C',
      dim: '#7A7A7A',
      success: '#008A45',
      danger: '#C41E3A',
    },
  },
];

const ACCENT_SWATCHES = ['#FFB000', '#FFD60A', '#FF3B30', '#4DA3FF', '#00E676', '#F97316', '#14B8A8', '#E879F9'];

function loadColors(): AppColors {
  try {
    const raw = globalThis.localStorage?.getItem(THEME_KEY);
    if (!raw) return { ...DEFAULT_COLORS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_COLORS, ...parsed };
  } catch {
    return { ...DEFAULT_COLORS };
  }
}

function saveColors(c: AppColors) {
  try {
    globalThis.localStorage?.setItem(THEME_KEY, JSON.stringify(c));
  } catch {
    /* native session-only */
  }
}

function isLightHex(hex: string) {
  const n = String(hex || '').replace('#', '');
  if (n.length !== 6) return false;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

type ThemeValue = {
  colors: AppColors;
  setColors: (c: AppColors) => void;
  patchColor: (key: keyof AppColors, value: string) => void;
  resetColors: () => void;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
};

const ThemeContext = createContext<ThemeValue>({
  colors: DEFAULT_COLORS,
  setColors: () => {},
  patchColor: () => {},
  resetColors: () => {},
  settingsOpen: false,
  openSettings: () => {},
  closeSettings: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function RootLayout() {
  const [colors, setColorsState] = useState<AppColors>(DEFAULT_COLORS);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setColorsState(loadColors());
  }, []);

  const setColors = useCallback((c: AppColors) => {
    setColorsState(c);
    saveColors(c);
  }, []);

  const patchColor = useCallback((key: keyof AppColors, value: string) => {
    setColorsState((prev) => {
      const next = { ...prev, [key]: value };
      saveColors(next);
      return next;
    });
  }, []);

  const resetColors = useCallback(() => {
    const next = { ...DEFAULT_COLORS };
    setColorsState(next);
    saveColors(next);
  }, []);

  const value = useMemo<ThemeValue>(() => ({
    colors,
    setColors,
    patchColor,
    resetColors,
    settingsOpen,
    openSettings: () => setSettingsOpen(true),
    closeSettings: () => setSettingsOpen(false),
  }), [colors, setColors, patchColor, resetColors, settingsOpen]);

  return (
    <ThemeContext.Provider value={value}>
      <SafeAreaProvider>
        <StatusBar style={isLightHex(colors.bg) ? 'dark' : 'light'} />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.bg },
            headerTintColor: colors.text,
            headerTitleStyle: { color: colors.text, fontWeight: '700' },
            contentStyle: { backgroundColor: colors.bg },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="threads" options={{ title: 'Select Thread' }} />
          <Stack.Screen name="pipe" options={{ title: 'Pipe Threads' }} />
          <Stack.Screen name="spec" options={{ title: 'Thread Spec' }} />
        </Stack>
        {settingsOpen ? <SettingsOverlay /> : null}
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}

const COLOR_FIELDS: { key: keyof AppColors; label: string }[] = [
  { key: 'bg', label: 'Background' },
  { key: 'surface', label: 'Cards / Surface' },
  { key: 'primary', label: 'Accent' },
  { key: 'text', label: 'Primary Text' },
  { key: 'muted', label: 'Secondary Text' },
];

function SettingsOverlay() {
  const { colors: c, setColors, patchColor, resetColors, closeSettings } = useTheme();
  const styles = useMemo(() => makeSettingsStyles(c), [c]);

  return (
    <View style={styles.overlay} testID="settings-screen">
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable
            testID="settings-back"
            onPress={closeSettings}
            style={styles.backBtn}
            hitSlop={8}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={26} color={c.text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.kicker}>APPEARANCE</Text>
            <Text style={styles.title}>Settings</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.section}>Theme</Text>
          <View style={styles.presetGrid}>
            {PRESETS.map((p) => {
              const active = colorsMatch(c, p.colors);
              return (
                <Pressable
                  key={p.id}
                  testID={`theme-preset-${p.id}`}
                  onPress={() => setColors({ ...p.colors })}
                  style={[styles.presetCard, active && styles.presetCardActive]}
                >
                  <View style={styles.swatchRow}>
                    <View style={[styles.miniSwatch, { backgroundColor: p.colors.bg, borderColor: p.colors.border }]} />
                    <View style={[styles.miniSwatch, { backgroundColor: p.colors.surface }]} />
                    <View style={[styles.miniSwatch, { backgroundColor: p.colors.primary }]} />
                    <View style={[styles.miniSwatch, { backgroundColor: p.colors.text }]} />
                  </View>
                  <Text style={[styles.presetName, active && { color: c.primary }]}>{p.name}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.section}>Custom Colors</Text>
          <View style={styles.card}>
            {COLOR_FIELDS.map((f, i) => (
              <View key={f.key}>
                {i > 0 ? <View style={styles.divider} /> : null}
                <ColorField
                  label={f.label}
                  value={c[f.key]}
                  testID={`color-${f.key}`}
                  onChange={(v) => patchColor(f.key, v)}
                />
              </View>
            ))}
          </View>

          <Text style={styles.subLabel}>ACCENT SWATCHES</Text>
          <View style={styles.accentRow}>
            {ACCENT_SWATCHES.map((hex) => (
              <Pressable
                key={hex}
                testID={`accent-swatch-${hex}`}
                onPress={() => patchColor('primary', hex)}
                style={[
                  styles.accentDot,
                  { backgroundColor: hex },
                  c.primary.toUpperCase() === hex.toUpperCase() && styles.accentDotActive,
                ]}
              />
            ))}
          </View>

          <Pressable testID="reset-colors" onPress={resetColors} style={styles.resetBtn}>
            <Ionicons name="refresh" size={16} color={c.primary} />
            <Text style={styles.resetText}>Reset to Shop Floor</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ColorField({
  label, value, onChange, testID,
}: {
  label: string; value: string; onChange: (v: string) => void; testID: string;
}) {
  const { colors: c } = useTheme();
  const styles = useMemo(() => makeSettingsStyles(c), [c]);
  const [draft, setDraft] = useState(value);
  useEffect(() => { setDraft(value); }, [value]);

  const apply = (raw: string) => {
    setDraft(raw);
    const v = raw.trim();
    if (/^#([0-9A-Fa-f]{6})$/.test(v) || /^rgba?\(/.test(v)) onChange(v);
  };

  return (
    <View style={styles.colorRow}>
      <View style={[styles.colorSwatch, { backgroundColor: value, borderColor: c.border }]} />
      <View style={{ flex: 1 }}>
        <Text style={styles.colorLabel}>{label}</Text>
        <TextInput
          testID={testID}
          value={draft}
          onChangeText={apply}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder="#000000"
          placeholderTextColor={c.dim}
          style={styles.hexInput}
        />
      </View>
    </View>
  );
}

function colorsMatch(a: AppColors, b: AppColors) {
  return a.bg === b.bg && a.surface === b.surface && a.primary === b.primary && a.text === b.text;
}

function makeSettingsStyles(c: AppColors) {
  return StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: c.bg,
      zIndex: 50,
    },
    container: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingTop: 8,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
      gap: 4,
    },
    backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    kicker: { color: c.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
    title: { color: c.text, fontSize: 22, fontWeight: '800', marginTop: 2 },
    scroll: { padding: 20, paddingBottom: 40, gap: 8 },
    section: {
      color: c.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5,
      marginTop: 16, marginBottom: 10, textTransform: 'uppercase',
    },
    presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    presetCard: {
      width: '48%',
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 6,
      padding: 12,
      minHeight: 88,
    },
    presetCardActive: { borderColor: c.primary, borderBottomWidth: 2, backgroundColor: c.surfaceElevated },
    swatchRow: { flexDirection: 'row', gap: 6, marginBottom: 10 },
    miniSwatch: { width: 18, height: 18, borderRadius: 3, borderWidth: 1, borderColor: c.border },
    presetName: { color: c.text, fontSize: 13, fontWeight: '700' },
    card: {
      backgroundColor: c.surface, borderWidth: 1, borderColor: c.border,
      borderRadius: 6, padding: 14,
    },
    divider: { height: 1, backgroundColor: c.border, marginVertical: 6 },
    colorRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
    colorSwatch: { width: 36, height: 36, borderRadius: 4, borderWidth: 1 },
    colorLabel: { color: c.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
    hexInput: {
      color: c.text, fontFamily: 'monospace', fontSize: 16, fontWeight: '700',
      marginTop: 2, padding: 0,
    },
    subLabel: { color: c.muted, fontSize: 11, letterSpacing: 1.2, fontWeight: '700', marginTop: 18, marginBottom: 8 },
    accentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    accentDot: {
      width: 36, height: 36, borderRadius: 4, borderWidth: 2, borderColor: 'transparent',
    },
    accentDotActive: { borderColor: c.text },
    resetBtn: {
      marginTop: 28, minHeight: 56, borderWidth: 1, borderColor: c.border, borderRadius: 4,
      backgroundColor: c.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    },
    resetText: { color: c.primary, fontWeight: '700', letterSpacing: 1, fontSize: 13 },
  });
}
