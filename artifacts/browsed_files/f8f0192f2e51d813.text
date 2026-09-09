import { useMemo, useState } from 'react';
import {
  Text, View, StyleSheet, ScrollView, Pressable, TextInput,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getThreadById } from '../src/data/threads';
import {
  basicDimensions, classLimits, classesFor, tapDrill, bestWireSize,
  minWireSize, maxWireSize, threeWireM, closestDrill, fmtIn, fmtMm, INCH_TO_MM,
} from '../src/utils/calculations';

const PERCENTS = [50, 55, 60, 65, 70, 75];

export default function SpecScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const thread = useMemo(() => (id ? getThreadById(id) : null), [id]);

  const [threadType, setThreadType] = useState<'external' | 'internal'>('external');
  const [cls, setCls] = useState<string>('2A');
  const [percent, setPercent] = useState<number>(75);
  const [tapType, setTapType] = useState<'cutting' | 'forming'>('cutting');
  const [wireInput, setWireInput] = useState<string>('');

  if (!thread) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <View style={{ padding: 24 }}>
          <Text style={styles.body}>Thread not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Simplified pipe-thread view (NPT or NPTF — no class system)
  if (thread.system === 'npt' || thread.system === 'nptf') {
    const npt = thread as any;
    const isNPTF = thread.system === 'nptf';
    const standardLabel = isNPTF ? 'DRYSEAL · ASME B1.20.3' : 'PIPE · ASME B1.20.1';
    const tapDrillLabel = isNPTF ? 'NPTF DRYSEAL TAP DRILL' : 'STANDARD NPT TAP DRILL';
    const tapDrillFooter = isNPTF
      ? 'Per ASME B1.20.3 (Dryseal) — for sealing pipe joints without thread sealant.'
      : 'Per ASME B1.20.1 — without reamer, for general-purpose threading.';
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Stack.Screen options={{ title: thread.label }} />
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.titleBlock}>
            <Text style={styles.kicker}>{standardLabel} · TAPERED</Text>
            <Text style={styles.title}>{thread.label}</Text>
            <View style={styles.titleMeta}>
              <MetaItem label="OD" value={`${thread.diameter.toFixed(4)} in`} />
              <MetaItem label="TPI" value={`${thread.tpi}`} />
              <MetaItem label="PITCH" value={`${thread.pitch.toFixed(4)} in`} />
            </View>
          </View>

          <SectionLabel text="Specifications" />
          <View style={styles.specCard}>
            <SpecRow label="Outside Dia (OD)" v={thread.diameter} fmt={(n) => fmtIn(n, 4)}
              alt={fmtMm(thread.diameter * INCH_TO_MM, 3)} unit="in" altUnit="mm" />
            <Divider />
            <SpecRow label="Threads / Inch" v={thread.tpi} fmt={(n) => n.toString()}
              alt="—" unit="TPI" altUnit="" />
            <SpecRow label="Pitch" v={thread.pitch} fmt={(n) => fmtIn(n, 4)}
              alt={fmtMm(thread.pitch * INCH_TO_MM, 3)} unit="in" altUnit="mm" />
            <Divider />
            <SpecRow label="Taper" v={0.0625} fmt={() => '1:16 (0.0625"/in)'}
              alt="3/4 in/ft" unit="" altUnit="" />
            <Divider />
            <SpecRow
              label={isNPTF ? 'Tap Drill (NPTF)' : 'Tap Drill (NPT)'}
              v={npt.tapDrill.size} fmt={(n) => fmtIn(n, 4)}
              alt={`${npt.tapDrill.name}`} unit="in" altUnit=""
              highlight
            />
          </View>

          <SectionLabel text="Engagement Lengths" />
          <View style={styles.specCard}>
            <View style={styles.engRow}>
              <Text style={styles.engLabel}>L1 — Hand-Tight Engagement</Text>
              <Text style={styles.engValue}>{npt.L1.toFixed(4)} <Text style={styles.engUnit}>in</Text></Text>
            </View>
            <Text style={styles.engHint}>
              Distance the external thread enters the internal thread by hand.
            </Text>
            <Divider />
            <View style={styles.engRow}>
              <Text style={styles.engLabel}>L2 — Effective Thread Length</Text>
              <Text style={styles.engValue}>{npt.L2.toFixed(4)} <Text style={styles.engUnit}>in</Text></Text>
            </View>
            <Text style={styles.engHint}>
              Total length of usable, fully-formed external thread.
            </Text>
          </View>

          <SectionLabel text="Tap Drill (Internal Thread)" />
          <View style={styles.specCard}>
            <View style={styles.resultBox} testID="npt-tap-drill">
              <Text style={styles.resultLabel}>{tapDrillLabel}</Text>
              <Text style={styles.resultValue}>
                {npt.tapDrill.size.toFixed(4)} <Text style={styles.resultUnit}>in</Text>
              </Text>
              <View style={styles.closestRow}>
                <Ionicons name="checkmark-circle" size={16} color="#00E676" />
                <Text style={styles.closestText}>
                  Drill name: <Text style={styles.closestStrong}>{npt.tapDrill.name}</Text>
                </Text>
              </View>
              <Text style={styles.resultFooter}>{tapDrillFooter}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // BSPP / BSPT — British Standard Pipe (parallel & taper) per ISO 228 / ISO 7-1
  if (thread.system === 'bspp' || thread.system === 'bspt') {
    const bsp = thread as any;
    const isTaper = thread.system === 'bspt';
    const standardLabel = isTaper ? 'BRITISH PIPE · ISO 7-1 (R)' : 'BRITISH PIPE · ISO 228 (G)';
    const titleSub = isTaper ? 'TAPERED' : 'PARALLEL';
    const tapDrillFooter = isTaper
      ? 'Per ISO 7-1 — for tapered pipe joints sealed with thread compound or PTFE.'
      : 'Per ISO 228 — for parallel pipe joints sealed with bonded washer / O-ring.';
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Stack.Screen options={{ title: thread.label }} />
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.titleBlock}>
            <Text style={styles.kicker}>{standardLabel} · {titleSub}</Text>
            <Text style={styles.title}>{thread.label}</Text>
            <View style={styles.titleMeta}>
              <MetaItem label="OD" value={`${bsp.diameterMm.toFixed(3)} mm`} />
              <MetaItem label="TPI" value={`${thread.tpi}`} />
              <MetaItem label="PITCH" value={`${bsp.pitchMm.toFixed(3)} mm`} />
            </View>
          </View>

          <SectionLabel text="Specifications" />
          <View style={styles.specCard}>
            <SpecRow label="Outside Dia (OD)" v={bsp.diameterMm} fmt={(n) => fmtMm(n, 3)}
              alt={fmtIn(thread.diameter, 4)} unit="mm" altUnit="in" />
            <Divider />
            <SpecRow label="Threads / Inch" v={thread.tpi} fmt={(n) => n.toString()}
              alt="—" unit="TPI" altUnit="" />
            <SpecRow label="Pitch" v={bsp.pitchMm} fmt={(n) => fmtMm(n, 3)}
              alt={fmtIn(thread.pitch, 4)} unit="mm" altUnit="in" />
            {isTaper && (
              <>
                <Divider />
                <SpecRow label="Taper" v={0.0625} fmt={() => '1:16 (0.0625"/in)'}
                  alt="3/4 in/ft" unit="" altUnit="" />
              </>
            )}
            <Divider />
            <SpecRow label="Thread Form" v={0} fmt={() => '55° Whitworth'}
              alt="rounded crests/roots" unit="" altUnit="" />
          </View>

          <SectionLabel text="Tap Drill (Internal Thread)" />
          <View style={styles.specCard}>
            <View style={styles.resultBox} testID="bsp-tap-drill">
              <Text style={styles.resultLabel}>STANDARD TAP DRILL</Text>
              <Text style={styles.resultValue}>
                {bsp.tapDrill.sizeMm.toFixed(2)} <Text style={styles.resultUnit}>mm</Text>
              </Text>
              <Text style={styles.resultAlt}>
                {bsp.tapDrill.size.toFixed(4)} in
              </Text>
              <View style={styles.closestRow}>
                <Ionicons name="checkmark-circle" size={16} color="#00E676" />
                <Text style={styles.closestText}>
                  Drill name: <Text style={styles.closestStrong}>{bsp.tapDrill.name}</Text>
                </Text>
              </View>
              <Text style={styles.resultFooter}>{tapDrillFooter}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const isUnified = thread.system === 'unified';
  const D = thread.diameter;
  const P = thread.pitch;
  const basics = basicDimensions(D, P);
  const limits = classLimits(thread, cls);

  // Switching thread type resets class to default
  const switchType = (t: 'external' | 'internal') => {
    setThreadType(t);
    setCls(t === 'external' ? '2A' : '2B');
  };

  // Tap drill calculation
  const tapDrillDia = tapDrill(D, P, percent, tapType);
  const closestUnif = isUnified ? closestDrill(tapDrillDia) : null;

  // 3-wire calc - use class pitch dia max as E (for 2A this is at allowance line)
  const E = limits.kind === 'external' ? limits.pdMax : limits.pdMin;
  const bestW = bestWireSize(P);
  const minW = minWireSize(P);
  const maxW = maxWireSize(P);
  const parsedW = parseFloat(wireInput);
  const wireEntered = isFinite(parsedW) && parsedW > 0;
  const usedW = wireEntered ? parsedW : bestW;
  const wireOutOfRange = wireEntered && (usedW < minW || usedW > maxW);
  // For metric, wire input might be in mm; treat consistent with thread system unit
  const measureMax = limits.kind === 'external'
    ? threeWireM(limits.pdMax, usedW, P)
    : threeWireM(limits.pdMin, usedW, P);
  const measureMin = limits.kind === 'external'
    ? threeWireM(limits.pdMin, usedW, P)
    : null;

  const unitLabel = isUnified ? 'in' : 'mm';
  const fmt = isUnified ? (v: number) => fmtIn(v, 4) : (v: number) => fmtMm(v, 3);
  const altUnit = isUnified ? 'mm' : 'in';
  const fmtAlt = isUnified
    ? (v: number) => fmtMm(v * INCH_TO_MM, 3)
    : (v: number) => fmtIn(v / INCH_TO_MM, 4);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ title: thread.label }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Title block */}
          <View style={styles.titleBlock}>
            <Text style={styles.kicker}>
              {isUnified ? 'INCH · ASME B1.1' : 'MM · ISO 261/262'} · {thread.series}
            </Text>
            <Text style={styles.title}>{thread.label}</Text>
            <View style={styles.titleMeta}>
              <MetaItem label="MAJOR Ø" value={`${fmt(D)} ${unitLabel}`} />
              <MetaItem label={isUnified ? 'TPI' : 'PITCH'} value={isUnified ? `${thread.tpi}` : `${P % 1 === 0 ? P.toFixed(1) : P} mm`} />
              <MetaItem label={isUnified ? 'PITCH' : 'TPI'} value={isUnified ? `${fmt(P)} in` : `${thread.tpi.toFixed(2)}`} />
            </View>
          </View>

          {/* Internal / External toggle */}
          <SectionLabel text="Thread Type" />
          <View style={styles.segment}>
            <SegBtn
              testID="type-external"
              active={threadType === 'external'}
              label="EXTERNAL"
              icon="arrow-up-outline"
              onPress={() => switchType('external')}
            />
            <SegBtn
              testID="type-internal"
              active={threadType === 'internal'}
              label="INTERNAL"
              icon="arrow-down-outline"
              onPress={() => switchType('internal')}
            />
          </View>

          {/* Class selector */}
          <SectionLabel text="Class of Fit" />
          <View style={styles.segmentSm}>
            {classesFor(threadType).map((c) => (
              <SegBtn
                key={c}
                testID={`class-${c}`}
                active={cls === c}
                label={c}
                onPress={() => setCls(c)}
                small
              />
            ))}
          </View>
          <Text style={styles.hint}>
            {classDescription(cls)}
          </Text>

          {/* Spec table */}
          <SectionLabel text="Dimensions" />
          <View style={styles.specCard}>
            {limits.kind === 'external' ? (
              <>
                <SpecRow label="Major Dia (Max)" v={limits.majorMax} fmt={fmt} alt={fmtAlt(limits.majorMax)} altUnit={altUnit} unit={unitLabel} />
                <SpecRow label="Major Dia (Min)" v={limits.majorMin} fmt={fmt} alt={fmtAlt(limits.majorMin)} altUnit={altUnit} unit={unitLabel} />
                <Divider />
                <SpecRow label="Pitch Dia (Max)" v={limits.pdMax} fmt={fmt} alt={fmtAlt(limits.pdMax)} altUnit={altUnit} unit={unitLabel} highlight />
                <SpecRow label="Pitch Dia (Min)" v={limits.pdMin} fmt={fmt} alt={fmtAlt(limits.pdMin)} altUnit={altUnit} unit={unitLabel} highlight />
                <Divider />
                <SpecRow label="Minor Dia (Max)" v={limits.minorMax} fmt={fmt} alt={fmtAlt(limits.minorMax)} altUnit={altUnit} unit={unitLabel} />
                <SpecRow label="Allowance" v={limits.allowance} fmt={fmt} alt={fmtAlt(limits.allowance)} altUnit={altUnit} unit={unitLabel} />
                <SpecRow label="PD Tolerance" v={limits.pdTol} fmt={fmt} alt={fmtAlt(limits.pdTol)} altUnit={altUnit} unit={unitLabel} />
              </>
            ) : (
              <>
                <SpecRow label="Minor Dia (Min)" v={limits.minorMin} fmt={fmt} alt={fmtAlt(limits.minorMin)} altUnit={altUnit} unit={unitLabel} />
                <SpecRow label="Minor Dia (Max)" v={limits.minorMax} fmt={fmt} alt={fmtAlt(limits.minorMax)} altUnit={altUnit} unit={unitLabel} />
                <Divider />
                <SpecRow label="Pitch Dia (Min)" v={limits.pdMin} fmt={fmt} alt={fmtAlt(limits.pdMin)} altUnit={altUnit} unit={unitLabel} highlight />
                <SpecRow label="Pitch Dia (Max)" v={limits.pdMax} fmt={fmt} alt={fmtAlt(limits.pdMax)} altUnit={altUnit} unit={unitLabel} highlight />
                <Divider />
                <SpecRow label="Major Dia (Min)" v={limits.majorMin} fmt={fmt} alt={fmtAlt(limits.majorMin)} altUnit={altUnit} unit={unitLabel} />
                <SpecRow label="PD Tolerance" v={limits.pdTol} fmt={fmt} alt={fmtAlt(limits.pdTol)} altUnit={altUnit} unit={unitLabel} />
                <SpecRow label="Minor Tolerance" v={limits.minorTol} fmt={fmt} alt={fmtAlt(limits.minorTol)} altUnit={altUnit} unit={unitLabel} />
              </>
            )}
          </View>

          <View style={styles.basicsRow}>
            <BasicTile label="Basic Pitch" value={fmt(basics.basicPitch)} unit={unitLabel} />
            <BasicTile label="Basic Minor" value={fmt(basics.basicMinor)} unit={unitLabel} />
          </View>

          {/* INTERNAL: Tap drill calculator */}
          {threadType === 'internal' && (
            <>
              <SectionLabel text="Tap Drill Calculator" />
              <View style={styles.specCard}>
                <Text style={styles.subLabel}>TAP TYPE</Text>
                <View style={styles.segmentSm}>
                  <SegBtn testID="tap-cutting" active={tapType === 'cutting'} label="CUTTING TAP" onPress={() => setTapType('cutting')} small />
                  <SegBtn testID="tap-forming" active={tapType === 'forming'} label="FORMING TAP" onPress={() => setTapType('forming')} small />
                </View>

                <Text style={[styles.subLabel, { marginTop: 18 }]}>% OF THREAD ENGAGEMENT</Text>
                <View style={styles.percentRow}>
                  {PERCENTS.map((p) => (
                    <Pressable
                      key={p}
                      testID={`percent-${p}`}
                      onPress={() => setPercent(p)}
                      style={[styles.pctBtn, percent === p && styles.pctBtnActive]}
                    >
                      <Text style={[styles.pctTxt, percent === p && styles.pctTxtActive]}>{p}%</Text>
                    </Pressable>
                  ))}
                </View>

                <View style={styles.resultBox} testID="tap-drill-result">
                  <Text style={styles.resultLabel}>RECOMMENDED DRILL Ø</Text>
                  <Text style={styles.resultValue}>
                    {fmt(tapDrillDia)} <Text style={styles.resultUnit}>{unitLabel}</Text>
                  </Text>
                  <Text style={styles.resultAlt}>
                    {fmtAlt(tapDrillDia)} {altUnit}
                  </Text>
                  {closestUnif && (
                    <View style={styles.closestRow}>
                      <Ionicons name="checkmark-circle" size={16} color="#00E676" />
                      <Text style={styles.closestText}>
                        Closest standard drill:{' '}
                        <Text style={styles.closestStrong}>{closestUnif.name}</Text>{' '}
                        ({closestUnif.size.toFixed(4)}&quot;)
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </>
          )}

          {/* EXTERNAL: 3-wire calculator */}
          {threadType === 'external' && (
            <>
              <SectionLabel text="3-Wire Measurement" />
              <View style={styles.specCard}>
                <Text style={styles.formulaText}>
                  M = E + 3W − 1.5155 × P    (60° threads)
                </Text>

                <View style={styles.wireRow}>
                  <View style={styles.wireBlock}>
                    <Text style={styles.subLabel}>BEST WIRE Ø</Text>
                    <Text style={styles.bestWire}>{fmt(bestW)}</Text>
                    <Text style={styles.bestWireAlt}>{fmtAlt(bestW)} {altUnit}</Text>
                  </View>
                  <View style={styles.wireBlock}>
                    <Text style={styles.subLabel}>YOUR WIRE Ø ({unitLabel})</Text>
                    <TextInput
                      testID="wire-input"
                      value={wireInput}
                      onChangeText={setWireInput}
                      placeholder={fmt(bestW)}
                      placeholderTextColor="#6B7280"
                      keyboardType="decimal-pad"
                      style={[styles.wireInput, wireOutOfRange && styles.wireInputError]}
                    />
                  </View>
                </View>

                <View style={styles.rangeBox} testID="wire-range">
                  <View style={styles.rangeRow}>
                    <Text style={styles.rangeLabel}>ACCEPTABLE RANGE</Text>
                    <Text style={styles.rangeFormula}>0.560·P  →  0.900·P</Text>
                  </View>
                  <View style={styles.rangeValuesRow}>
                    <View style={styles.rangeCol}>
                      <Text style={styles.rangeColLabel}>MIN</Text>
                      <Text style={styles.rangeColValue}>{fmt(minW)}</Text>
                      <Text style={styles.rangeColAlt}>{fmtAlt(minW)} {altUnit}</Text>
                    </View>
                    <View style={styles.rangeCol}>
                      <Text style={styles.rangeColLabel}>BEST</Text>
                      <Text style={[styles.rangeColValue, { color: '#FFB000' }]}>{fmt(bestW)}</Text>
                      <Text style={styles.rangeColAlt}>{fmtAlt(bestW)} {altUnit}</Text>
                    </View>
                    <View style={styles.rangeCol}>
                      <Text style={styles.rangeColLabel}>MAX</Text>
                      <Text style={styles.rangeColValue}>{fmt(maxW)}</Text>
                      <Text style={styles.rangeColAlt}>{fmtAlt(maxW)} {altUnit}</Text>
                    </View>
                  </View>
                  {wireOutOfRange && (
                    <View style={styles.warnRow} testID="wire-warning">
                      <Ionicons name="warning" size={14} color="#FF3B30" />
                      <Text style={styles.warnText}>
                        Wire Ø {fmt(usedW)} {unitLabel} is outside the acceptable range.
                      </Text>
                    </View>
                  )}
                </View>

                <Pressable
                  testID="use-best-wire"
                  onPress={() => setWireInput(fmt(bestW))}
                  style={styles.linkBtn}
                >
                  <Ionicons name="arrow-back" size={14} color="#FFB000" />
                  <Text style={styles.linkText}>Use best wire size</Text>
                </Pressable>

                <View style={styles.resultBox} testID="three-wire-result">
                  <Text style={styles.resultLabel}>MEASUREMENT OVER WIRES (M)</Text>
                  <View style={styles.measureRange}>
                    <View style={styles.measureCol}>
                      <Text style={styles.measureMini}>MAX (GO PD)</Text>
                      <Text style={styles.measureValue}>{fmt(measureMax)}</Text>
                      <Text style={styles.measureAlt}>{fmtAlt(measureMax)} {altUnit}</Text>
                    </View>
                    {measureMin !== null && (
                      <View style={styles.measureCol}>
                        <Text style={styles.measureMini}>MIN (NOT GO)</Text>
                        <Text style={styles.measureValue}>{fmt(measureMin)}</Text>
                        <Text style={styles.measureAlt}>{fmtAlt(measureMin)} {altUnit}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.resultFooter}>
                    Using wire Ø {fmt(usedW)} {unitLabel} · pitch {fmt(P)} {unitLabel}
                  </Text>
                </View>
              </View>
            </>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function classDescription(cls: string) {
  const map: Record<string, string> = {
    '1A': 'Loose fit, easy assembly. Generous tolerance.',
    '2A': 'General-purpose external. Standard commercial fastener fit.',
    '3A': 'Close fit, no allowance. Precision applications.',
    '1B': 'Loose fit internal. Easy assembly with damage / dirt.',
    '2B': 'General-purpose internal. Standard commercial nut fit.',
    '3B': 'Close fit internal. Precision / aerospace applications.',
  };
  return map[cls] ?? '';
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function SectionLabel({ text }: { text: string }) {
  return <Text style={styles.sectionLabel}>{text}</Text>;
}

function SegBtn({
  active, label, icon, onPress, small, testID,
}: {
  active: boolean; label: string; icon?: any; onPress: () => void; small?: boolean; testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={[
        styles.segBtn,
        small && styles.segBtnSm,
        active && styles.segBtnActive,
      ]}
    >
      {icon ? <Ionicons name={icon} size={16} color={active ? '#FFB000' : '#9CA3AF'} /> : null}
      <Text style={[styles.segLabel, active && styles.segLabelActive, small && { fontSize: 13 }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function SpecRow({
  label, v, fmt, alt, unit, altUnit, highlight,
}: {
  label: string; v: number; fmt: (n: number) => string; alt: string; unit: string; altUnit: string; highlight?: boolean;
}) {
  return (
    <View style={styles.specRow}>
      <Text style={styles.specRowLabel}>{label}</Text>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.specRowValue, highlight && styles.specRowValueHi]}>
          {fmt(v)} <Text style={styles.specRowUnit}>{unit}</Text>
        </Text>
        <Text style={styles.specRowAlt}>{alt} {altUnit}</Text>
      </View>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function BasicTile({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <View style={styles.basicTile}>
      <Text style={styles.basicLabel}>{label}</Text>
      <Text style={styles.basicValue}>{value}</Text>
      <Text style={styles.basicUnit}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  scroll: { padding: 20, gap: 8 },
  body: { color: '#F3F4F6' },

  titleBlock: { paddingBottom: 8 },
  kicker: { color: '#FFB000', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  title: { color: '#F3F4F6', fontSize: 28, fontWeight: '800', fontFamily: 'monospace', marginTop: 6 },
  titleMeta: { flexDirection: 'row', gap: 12, marginTop: 14 },
  metaItem: {
    flex: 1, backgroundColor: '#171717', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 4, paddingVertical: 10, paddingHorizontal: 12,
  },
  metaLabel: { color: '#9CA3AF', fontSize: 10, letterSpacing: 1, fontWeight: '700' },
  metaValue: { color: '#F3F4F6', fontSize: 14, fontFamily: 'monospace', marginTop: 4, fontWeight: '700' },

  sectionLabel: {
    color: '#9CA3AF', fontSize: 12, fontWeight: '700', letterSpacing: 1.5,
    marginTop: 24, marginBottom: 10, textTransform: 'uppercase',
  },
  hint: { color: '#9CA3AF', fontSize: 12, marginTop: 8, fontStyle: 'italic' },

  segment: { flexDirection: 'row', gap: 10 },
  segmentSm: { flexDirection: 'row', gap: 8 },
  segBtn: {
    flex: 1, minHeight: 56, backgroundColor: '#171717',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 4,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6,
  },
  segBtnSm: { minHeight: 48 },
  segBtnActive: { backgroundColor: '#262626', borderColor: '#FFB000', borderBottomWidth: 2 },
  segLabel: { color: '#9CA3AF', fontWeight: '700', letterSpacing: 1, fontSize: 14 },
  segLabelActive: { color: '#FFB000' },

  specCard: {
    backgroundColor: '#171717', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 6, padding: 16,
  },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  specRowLabel: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
  specRowValue: { color: '#F3F4F6', fontSize: 17, fontFamily: 'monospace', fontWeight: '700' },
  specRowValueHi: { color: '#FFB000' },
  specRowUnit: { color: '#6B7280', fontSize: 12 },
  specRowAlt: { color: '#6B7280', fontSize: 11, fontFamily: 'monospace', marginTop: 2 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 4 },

  basicsRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  basicTile: {
    flex: 1, backgroundColor: '#171717', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 4, padding: 14,
  },
  basicLabel: { color: '#9CA3AF', fontSize: 10, letterSpacing: 1.2, fontWeight: '700' },
  basicValue: { color: '#F3F4F6', fontSize: 18, fontFamily: 'monospace', fontWeight: '700', marginTop: 6 },
  basicUnit: { color: '#6B7280', fontSize: 11, marginTop: 2 },

  subLabel: { color: '#9CA3AF', fontSize: 11, letterSpacing: 1.2, fontWeight: '700', marginBottom: 8 },

  percentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pctBtn: {
    flexBasis: '15%', flexGrow: 1, minHeight: 48, backgroundColor: '#0A0A0A',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 4,
    alignItems: 'center', justifyContent: 'center',
  },
  pctBtnActive: { backgroundColor: '#FFB000', borderColor: '#FFB000' },
  pctTxt: { color: '#9CA3AF', fontWeight: '800', fontSize: 14 },
  pctTxtActive: { color: '#0A0A0A' },

  resultBox: {
    marginTop: 18, backgroundColor: '#0A0A0A', borderLeftWidth: 3, borderLeftColor: '#FFB000',
    padding: 14, borderRadius: 4,
  },
  resultLabel: { color: '#9CA3AF', fontSize: 10, letterSpacing: 1.5, fontWeight: '700' },
  resultValue: { color: '#FFB000', fontSize: 32, fontFamily: 'monospace', fontWeight: '800', marginTop: 6 },
  resultUnit: { fontSize: 14, color: '#9CA3AF' },
  resultAlt: { color: '#6B7280', fontSize: 13, fontFamily: 'monospace', marginTop: 4 },
  resultFooter: { color: '#6B7280', fontSize: 11, fontFamily: 'monospace', marginTop: 12 },

  closestRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  closestText: { color: '#9CA3AF', fontSize: 12 },
  closestStrong: { color: '#00E676', fontWeight: '800', fontFamily: 'monospace' },

  formulaText: {
    color: '#9CA3AF', fontSize: 12, fontFamily: 'monospace', marginBottom: 14,
    backgroundColor: '#0A0A0A', padding: 10, borderRadius: 4,
  },
  wireRow: { flexDirection: 'row', gap: 12 },
  wireBlock: { flex: 1 },
  bestWire: { color: '#FFB000', fontSize: 22, fontFamily: 'monospace', fontWeight: '800' },
  bestWireAlt: { color: '#6B7280', fontSize: 11, fontFamily: 'monospace', marginTop: 2 },
  wireInput: {
    backgroundColor: '#0A0A0A', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 4, paddingHorizontal: 12, height: 48, color: '#F3F4F6',
    fontFamily: 'monospace', fontSize: 18, fontWeight: '700',
  },
  wireInputError: { borderColor: '#FF3B30' },
  rangeBox: {
    marginTop: 14, backgroundColor: '#0A0A0A', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)', borderRadius: 4, padding: 12,
  },
  rangeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  rangeLabel: { color: '#9CA3AF', fontSize: 10, letterSpacing: 1.2, fontWeight: '700' },
  rangeFormula: { color: '#6B7280', fontSize: 11, fontFamily: 'monospace' },
  rangeValuesRow: { flexDirection: 'row', gap: 8 },
  rangeCol: {
    flex: 1, backgroundColor: '#171717', borderRadius: 4,
    paddingVertical: 8, paddingHorizontal: 6, alignItems: 'center',
  },
  rangeColLabel: { color: '#9CA3AF', fontSize: 9, letterSpacing: 1, fontWeight: '700' },
  rangeColValue: { color: '#F3F4F6', fontSize: 14, fontFamily: 'monospace', fontWeight: '700', marginTop: 4 },
  rangeColAlt: { color: '#6B7280', fontSize: 10, fontFamily: 'monospace', marginTop: 1 },
  warnRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  warnText: { color: '#FF3B30', fontSize: 12, fontWeight: '600' },
  linkBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, alignSelf: 'flex-end' },
  linkText: { color: '#FFB000', fontSize: 12, fontWeight: '700' },

  measureRange: { flexDirection: 'row', gap: 16, marginTop: 8 },
  measureCol: { flex: 1 },
  measureMini: { color: '#9CA3AF', fontSize: 10, letterSpacing: 1, fontWeight: '700' },
  measureValue: { color: '#FFB000', fontSize: 22, fontFamily: 'monospace', fontWeight: '800', marginTop: 4 },
  measureAlt: { color: '#6B7280', fontSize: 11, fontFamily: 'monospace', marginTop: 2 },

  engRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  engLabel: { color: '#F3F4F6', fontSize: 13, fontWeight: '600', flex: 1 },
  engValue: { color: '#FFB000', fontSize: 18, fontFamily: 'monospace', fontWeight: '700' },
  engUnit: { color: '#6B7280', fontSize: 12 },
  engHint: { color: '#9CA3AF', fontSize: 11, fontStyle: 'italic', marginTop: 4, marginBottom: 6 },
});
