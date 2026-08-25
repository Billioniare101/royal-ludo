import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LudoBoard } from '@/components/LudoBoard';
import { useGame } from '@/contexts/GameContext';
import { useColors } from '@/hooks/useColors';

const colorByName = { Ruby: '#E65B61', Sapphire: '#477DDE', Emerald: '#46B890', Gold: '#E3B34D' };

export default function PlayScreen() {
  const colors = useColors();
  const { players, currentTurn, lastRoll, status, winner, rollDice, startMatch } = useGame();
  const activePlayer = players[currentTurn];

  if (status === 'waiting') {
    return (
      <LinearGradient colors={['#111B31', '#0A1020']} style={styles.emptyPage}>
        <View style={[styles.crownMark, { backgroundColor: colors.primary }]}>
          <Feather name="award" size={32} color={colors.primaryForeground} />
        </View>
        <Text style={styles.emptyOverline}>ROYAL LUDO</Text>
        <Text style={styles.emptyTitle}>A kingdom is waiting for its players.</Text>
        <Text style={styles.emptyCopy}>Set the table for a two-player duel or a four-player family match.</Text>
        <Pressable testID="quick-start" onPress={() => startMatch(4)} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
          <Text style={styles.primaryButtonText}>Start a grand table</Text>
          <Feather name="arrow-right" size={19} color="#172139" />
        </Pressable>
      </LinearGradient>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.page, { backgroundColor: colors.background }]}>
      <View style={styles.topline}>
        <View>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>ROYAL LUDO</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>The board is yours</Text>
        </View>
        <View style={[styles.live, { backgroundColor: colors.secondary }]}>
          <View style={styles.liveDot} />
          <Text style={[styles.liveText, { color: colors.mutedForeground }]}>LOCAL</Text>
        </View>
      </View>
      <LudoBoard players={players} />
      <View style={[styles.turnCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.turnMark, { backgroundColor: colorByName[activePlayer.name as keyof typeof colorByName] }]}>
          <Text style={styles.turnMarkText}>{activePlayer.name.slice(0, 1)}</Text>
        </View>
        <View style={styles.turnCopy}>
          <Text style={[styles.turnOverline, { color: colors.mutedForeground }]}>{winner ? 'MATCH COMPLETE' : 'YOUR TURN'}</Text>
          <Text style={[styles.turnTitle, { color: colors.foreground }]}>{winner ? `${winner} takes the crown` : `${activePlayer.name}, make your move`}</Text>
        </View>
        <View style={[styles.die, { borderColor: colors.border }]}>
          <Text style={[styles.dieValue, { color: colors.primary }]}>{lastRoll ?? '–'}</Text>
        </View>
      </View>
      <Pressable testID="roll-dice" disabled={!!winner} onPress={rollDice} style={({ pressed }) => [styles.rollButton, { backgroundColor: winner ? colors.secondary : colors.primary }, pressed && !winner && styles.pressed]}>
        <Feather name={winner ? 'award' : 'rotate-cw'} size={21} color={winner ? colors.mutedForeground : colors.primaryForeground} />
        <Text style={[styles.rollText, { color: winner ? colors.mutedForeground : colors.primaryForeground }]}>{winner ? 'Crown claimed' : 'Roll the royal dice'}</Text>
      </Pressable>
      <View style={styles.legend}>
        {players.map((player, index) => (
          <View key={player.color} style={[styles.legendItem, index === currentTurn && !winner && { backgroundColor: colors.secondary }]}>
            <View style={[styles.legendDot, { backgroundColor: colorByName[player.name as keyof typeof colorByName] }]} />
            <Text style={[styles.legendName, { color: colors.foreground }]}>{player.name}</Text>
            <Text style={[styles.legendSteps, { color: colors.mutedForeground }]}>{player.progress}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  emptyPage: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  crownMark: { width: 70, height: 70, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  emptyOverline: { color: '#E3B34D', fontSize: 11, letterSpacing: 2.5, fontWeight: '800' },
  emptyTitle: { color: '#F9F5E9', fontSize: 33, lineHeight: 39, fontWeight: '800', textAlign: 'center', letterSpacing: -0.8, marginTop: 10 },
  emptyCopy: { color: '#B9C6DC', textAlign: 'center', fontSize: 15, lineHeight: 22, marginTop: 13, maxWidth: 300 },
  primaryButton: { backgroundColor: '#E3B34D', paddingHorizontal: 20, height: 54, borderRadius: 17, marginTop: 29, flexDirection: 'row', gap: 12, alignItems: 'center' },
  primaryButtonText: { color: '#172139', fontWeight: '800', fontSize: 15 },
  page: { flexGrow: 1, padding: 20, paddingTop: 29, paddingBottom: 116, gap: 16 },
  topline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { fontSize: 10, letterSpacing: 2.1, fontWeight: '800' },
  title: { fontSize: 25, lineHeight: 29, fontWeight: '800', letterSpacing: -0.7, marginTop: 5 },
  live: { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#46B890' },
  liveText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  turnCard: { minHeight: 85, borderWidth: 1, borderRadius: 22, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12 },
  turnMark: { width: 48, height: 48, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  turnMarkText: { color: '#FFF8EB', fontSize: 21, fontWeight: '900' },
  turnCopy: { flex: 1 },
  turnOverline: { fontSize: 10, fontWeight: '800', letterSpacing: 1.25 },
  turnTitle: { marginTop: 3, fontSize: 16, fontWeight: '800' },
  die: { borderWidth: 1, width: 45, height: 45, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  dieValue: { fontWeight: '900', fontSize: 23 },
  rollButton: { height: 58, borderRadius: 19, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 11 },
  rollText: { fontWeight: '800', fontSize: 16 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  legendItem: { width: '48.8%', borderRadius: 14, flexDirection: 'row', alignItems: 'center', minHeight: 42, paddingHorizontal: 11, gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendName: { fontSize: 12, fontWeight: '700', flex: 1 },
  legendSteps: { fontSize: 12, fontWeight: '800' },
  pressed: { opacity: 0.77, transform: [{ scale: 0.98 }] },
});
