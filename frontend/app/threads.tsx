import { useMemo, useState } from 'react';
import { Text, View, StyleSheet, TextInput, FlatList, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getThreadsBySystem } from '../src/data/threads';
import { useTheme, type AppColors } from './_layout';

export default function ThreadsList() {
  const { system } = useLocalSearchParams<{ system: 'unified' | 'metric' | 'npt' | 'nptf' | 'bspp' | 'bspt' }>();
  const router = useRouter();
  const { colors: c } = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);
  const [query, setQuery] = useState('');
  const sys = system === 'metric' ? 'metric'
    : system === 'npt' ? 'npt'
    : system === 'nptf' ? 'nptf'
    : system === 'bspp' ? 'bspp'
    : system === 'bspt' ? 'bspt'
    : 'unified';

  const all = useMemo(() => getThreadsBySystem(sys), [sys]);

  const filtered = useMemo(() => {
    if (!query.trim()) return all;
    const q = query.toLowerCase().replace(/\s+/g, '');
    return all.filter((t) => {
      const lab = t.label.toLowerCase().replace(/\s+/g, '');
      return lab.includes(q) || t.series.toLowerCase().includes(q);
    });
  }, [all, query]);

  const titleMap = {
    unified: { title: 'UNIFIED THREADS', sub: 'INCH · ASME B1.1', screen: 'Unified', placeholder: 'Search e.g. 1/4-20, #6, UNF' },
    metric:  { title: 'METRIC THREADS',  sub: 'MM · ISO 261/262', screen: 'Metric',  placeholder: 'Search e.g. M6, 1.5, Fine' },
    npt:     { title: 'NPT THREADS',     sub: 'PIPE · ASME B1.20.1', screen: 'NPT',  placeholder: 'Search e.g. 1/4, 3/8, 1/2' },
    nptf:    { title: 'NPTF THREADS',    sub: 'DRYSEAL · ASME B1.20.3', screen: 'NPTF', placeholder: 'Search e.g. 1/4, 3/8, 1/2' },
    bspp:    { title: 'BSPP THREADS',    sub: 'BRITISH PIPE · ISO 228 (G)', screen: 'BSPP', placeholder: 'Search e.g. G 1/4, G 1/2' },
    bspt:    { title: 'BSPT THREADS',    sub: 'BRITISH PIPE · ISO 7-1 (R)', screen: 'BSPT', placeholder: 'Search e.g. R 1/4, R 1/2' },
  } as const;
  const headerTitle = titleMap[sys].title;
  const headerSub = titleMap[sys].sub;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: titleMap[sys].screen }} />

      <View style={styles.headerBlock}>
        <Text style={styles.kicker}>{headerSub}</Text>
        <Text style={styles.title}>{headerTitle}</Text>
        <Text style={styles.count}>{filtered.length} of {all.length} sizes</Text>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={c.muted} style={styles.searchIcon} />
        <TextInput
          testID="search-input"
          placeholder={sys === 'unified' ? 'Search e.g. 1/4-20, #6, UNF' : 'Search e.g. M6, 1.5, Fine'}
          placeholderTextColor={c.dim}
          value={query}
          onChangeText={setQuery}
          style={styles.search}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <Pressable testID="clear-search" onPress={() => setQuery('')} style={styles.clearBtn} hitSlop={10}>
            <Ionicons name="close-circle" size={20} color={c.muted} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => (
          <Pressable
            testID={`thread-list-item-${item.id}`}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={() => router.push({ pathname: '/spec', params: { id: item.id } })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.label}</Text>
              <View style={styles.rowMeta}>
                <Text style={styles.rowMetaText}>{item.series}</Text>
                <View style={styles.dot} />
                <Text style={styles.rowMetaText}>
                  {sys === 'metric' ? `${item.pitch.toFixed(2)} mm pitch` : `${item.tpi} TPI`}
                </Text>
                <View style={styles.dot} />
                <Text style={styles.rowMetaText}>
                  {sys === 'metric' ? `Ø ${item.diameter} mm` : `Ø ${item.diameter.toFixed(4)}"`}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={c.primary} />
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search" size={32} color={c.dim} />
            <Text style={styles.emptyText}>No threads match "{query}"</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function makeStyles(c: AppColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    headerBlock: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
    kicker: { color: c.primary, fontSize: 11, letterSpacing: 1.5, fontWeight: '700' },
    title: { color: c.text, fontSize: 26, fontWeight: '800', letterSpacing: 0.5, marginTop: 4 },
    count: { color: c.muted, fontSize: 12, marginTop: 4, fontFamily: 'monospace' },
    searchWrap: { paddingHorizontal: 20, marginTop: 12, marginBottom: 8, position: 'relative' },
    searchIcon: { position: 'absolute', left: 32, top: 18, zIndex: 2 },
    search: {
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 6,
      paddingLeft: 44,
      paddingRight: 44,
      height: 56,
      color: c.text,
      fontSize: 16,
      fontFamily: 'monospace',
    },
    clearBtn: { position: 'absolute', right: 30, top: 18 },
    sep: { height: 1, backgroundColor: c.border },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      minHeight: 72,
    },
    rowPressed: { backgroundColor: c.surface },
    rowTitle: { color: c.text, fontSize: 18, fontWeight: '700', fontFamily: 'monospace' },
    rowMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8, flexWrap: 'wrap' },
    rowMetaText: { color: c.muted, fontSize: 12, fontFamily: 'monospace' },
    dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: c.dim },
    empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
    emptyText: { color: c.muted, fontSize: 14 },
  });
}
