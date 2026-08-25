import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import { useColors } from '@/hooks/useColors';

export default function CabinetScreen() {
  const colors = useColors();
  const { players, winner, status } = useGame();
  const totalProgress = players.reduce((sum, player) => sum + player.progress, 0);

  return (
    <ScrollView contentContainerStyle={[styles.page, { backgroundColor: colors.background }]}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>ROYAL CABINET</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>Your local record</Text>
      <View style={[styles.hero, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.heroIcon, { backgroundColor: colors.primary }]}>
          <Feather name="award" size={26} color={colors.primaryForeground} />
        </View>
        <View>
          <Text style={[styles.heroHeading, { color: colors.foreground }]}>{winner ? `${winner} reigns` : status === 'playing' ? 'Match in motion' : 'First game awaits'}</Text>
          <Text style={[styles.heroCopy, { color: colors.mutedForeground }]}>Your scores and match board are saved right here.</Text>
        </View>
      </View>
      <View style={styles.stats}>
        <View style={[styles.stat, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.statNumber, { color: colors.foreground }]}>{players.length}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>at the table</Text>
        </View>
        <View style={[styles.stat, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.statNumber, { color: colors.foreground }]}>{totalProgress}</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>spaces moved</Text>
        </View>
      </View>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Current court</Text>
      <View style={[styles.list, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {players.map((player, index) => (
          <View key={player.color} style={[styles.playerRow, index !== players.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
            <View style={[styles.playerMark, { backgroundColor: { ruby: '#E65B61', sapphire: '#477DDE', emerald: '#46B890', gold: '#E3B34D' }[player.color] }]} />
            <View style={styles.playerText}>
              <Text style={[styles.playerName, { color: colors.foreground }]}>{player.name}</Text>
              <Text style={[styles.playerMeta, { color: colors.mutedForeground }]}>Progress {player.progress} / 56</Text>
            </View>
            <Text style={[styles.playerScore, { color: colors.primary }]}>{player.score}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, padding: 22, paddingTop: 34, paddingBottom: 116, gap: 18 },
  eyebrow: { fontSize: 11, letterSpacing: 2, fontWeight: '800' },
  title: { fontSize: 29, fontWeight: '800', letterSpacing: -0.8, marginTop: -10 },
  hero: { borderWidth: 1, borderRadius: 24, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 15 },
  heroIcon: { width: 55, height: 55, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
  heroHeading: { fontWeight: '800', fontSize: 17 },
  heroCopy: { fontSize: 13, marginTop: 4, maxWidth: '82%', lineHeight: 18 },
  stats: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, padding: 18, borderRadius: 20 },
  statNumber: { fontSize: 28, fontWeight: '800' },
  statLabel: { fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginTop: 6 },
  list: { borderWidth: 1, borderRadius: 22, overflow: 'hidden' },
  playerRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 12 },
  playerMark: { width: 13, height: 13, borderRadius: 7 },
  playerText: { flex: 1 },
  playerName: { fontWeight: '800', fontSize: 15 },
  playerMeta: { fontSize: 12, marginTop: 3 },
  playerScore: { fontSize: 21, fontWeight: '800' },
});