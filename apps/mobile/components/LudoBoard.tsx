import { StyleSheet, Text, View } from 'react-native';
import { Player } from '@/contexts/GameContext';

const PALETTE = {
  ruby: '#E65B61',
  sapphire: '#477DDE',
  emerald: '#46B890',
  gold: '#E3B34D',
} as const;

const positions = [
  { left: '14%', top: '14%' },
  { right: '14%', top: '14%' },
  { right: '14%', bottom: '14%' },
  { left: '14%', bottom: '14%' },
] as const;

export function LudoBoard({ players }: { players: Player[] }) {
  return (
    <View style={styles.board}>
      <View style={[styles.home, styles.rubyHome]} />
      <View style={[styles.home, styles.sapphireHome]} />
      <View style={[styles.home, styles.emeraldHome]} />
      <View style={[styles.home, styles.goldHome]} />
      <View style={styles.grid}>
        {Array.from({ length: 81 }, (_, index) => (
          <View
            key={index}
            style={[
              styles.cell,
              index % 10 === 0 || index % 13 === 0 ? styles.pathCell : undefined,
            ]}
          />
        ))}
      </View>
      <View style={styles.centre}>
        <View style={[styles.centreSlice, { backgroundColor: PALETTE.ruby }]} />
        <View style={[styles.centreSlice, { backgroundColor: PALETTE.sapphire }]} />
        <View style={[styles.centreSlice, { backgroundColor: PALETTE.emerald }]} />
        <View style={[styles.centreSlice, { backgroundColor: PALETTE.gold }]} />
      </View>
      {players.map((player, index) => (
        <View
          key={player.color}
          style={[
            styles.pawn,
            positions[index],
            { borderColor: PALETTE[player.color], shadowColor: PALETTE[player.color] },
          ]}
        >
          <View style={[styles.pawnCore, { backgroundColor: PALETTE[player.color] }]} />
          <Text style={styles.pawnProgress}>{player.progress}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 28,
    backgroundColor: '#F7F0DD',
    overflow: 'hidden',
    borderWidth: 7,
    borderColor: '#253550',
    position: 'relative',
  },
  home: { width: '42%', height: '42%', position: 'absolute', borderRadius: 28, opacity: 0.95 },
  rubyHome: { left: 0, top: 0, backgroundColor: '#F3B9B9' },
  sapphireHome: { right: 0, top: 0, backgroundColor: '#B9CEF7' },
  emeraldHome: { right: 0, bottom: 0, backgroundColor: '#B9E6D4' },
  goldHome: { left: 0, bottom: 0, backgroundColor: '#F5DF9F' },
  grid: {
    position: 'absolute',
    left: '29%',
    top: '29%',
    width: '42%',
    height: '42%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FEFCF3',
  },
  cell: { width: '11.11%', height: '11.11%', borderWidth: 0.5, borderColor: '#D6CEBC' },
  pathCell: { backgroundColor: '#D7E0E7' },
  centre: {
    position: 'absolute',
    left: '39.5%',
    top: '39.5%',
    width: '21%',
    height: '21%',
    borderRadius: 999,
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 3,
    borderColor: '#F7F0DD',
  },
  centreSlice: { width: '50%', height: '50%' },
  pawn: {
    width: 54,
    height: 54,
    borderWidth: 2,
    borderRadius: 27,
    backgroundColor: '#FFFCF4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    position: 'absolute',
  },
  pawnCore: { width: 22, height: 22, borderRadius: 11 },
  pawnProgress: { color: '#26344D', fontSize: 10, fontWeight: '800', marginTop: 1 },
});