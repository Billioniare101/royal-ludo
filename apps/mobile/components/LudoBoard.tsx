import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { Player } from '@/contexts/GameContext';

type ColorKey = 'ruby' | 'sapphire' | 'emerald' | 'gold';

const PALETTE: Record<ColorKey, {
  deep: string;
  surface: string;
  bright: string;
  highlight: string;
  ink: string;
}> = {
  ruby: {
    deep: '#8F1D2C',
    surface: '#D8323E',
    bright: '#FF6A62',
    highlight: '#FFB3A5',
    ink: '#6F101E',
  },
  sapphire: {
    deep: '#1553A0',
    surface: '#2780D7',
    bright: '#6BC2FF',
    highlight: '#C3EDFF',
    ink: '#103E7A',
  },
  emerald: {
    deep: '#087B49',
    surface: '#18B964',
    bright: '#68E994',
    highlight: '#C4FFCF',
    ink: '#075B39',
  },
  gold: {
    deep: '#B77A00',
    surface: '#F0B918',
    bright: '#FFE27A',
    highlight: '#FFF5BD',
    ink: '#815000',
  },
};

const HOME_LAYOUT: Record<ColorKey, {
  left: `${number}%`;
  top: `${number}%`;
  color: ColorKey;
}> = {
  ruby: { left: '0%', top: '0%', color: 'ruby' },
  gold: { left: '60%', top: '0%', color: 'gold' },
  emerald: { left: '0%', top: '60%', color: 'emerald' },
  sapphire: { left: '60%', top: '60%', color: 'sapphire' },
};

const HOME_KEYS: ColorKey[] = ['ruby', 'gold', 'emerald', 'sapphire'];
const SAFE_CELLS = new Set(['6-2', '2-8', '8-12', '12-6', '6-12', '12-8', '8-2', '2-6']);
const START_CELLS: Record<string, ColorKey> = {
  '7-1': 'emerald',
  '1-7': 'ruby',
  '7-13': 'sapphire',
  '13-7': 'gold',
};

function isHomeCell(row: number, column: number) {
  return (
    (row < 6 && column < 6) ||
    (row < 6 && column > 8) ||
    (row > 8 && column < 6) ||
    (row > 8 && column > 8)
  );
}

function isCenterCell(row: number, column: number) {
  return row >= 6 && row <= 8 && column >= 6 && column <= 8;
}

function cellColor(row: number, column: number): ColorKey | null {
  if (column === 7 && row >= 1 && row <= 5) return 'ruby';
  if (row === 7 && column >= 9 && column <= 13) return 'sapphire';
  if (column === 7 && row >= 9 && row <= 13) return 'gold';
  if (row === 7 && column >= 1 && column <= 5) return 'emerald';
  return null;
}

function Pawn({
  color,
  faded,
  progress,
}: {
  color: ColorKey;
  faded: boolean;
  progress: number;
}) {
  const palette = PALETTE[color];

  return (
    <View style={[styles.pawn, faded && styles.pawnFaded]}>
      <View style={[styles.pawnShadow, { backgroundColor: palette.ink }]} />
      <View style={[styles.pawnFoot, { backgroundColor: palette.deep, borderColor: palette.highlight }]}>
        <LinearGradient
          colors={[palette.bright, palette.surface, palette.deep]}
          style={styles.pawnBody}
        >
          <View style={[styles.pawnHead, { backgroundColor: palette.bright, borderColor: palette.highlight }]}>
            <View style={[styles.pawnGlint, { backgroundColor: palette.highlight }]} />
          </View>
          <View style={[styles.pawnCollar, { backgroundColor: palette.surface, borderColor: palette.highlight }]} />
        </LinearGradient>
      </View>
      {progress > 0 ? (
        <Text style={[styles.pawnProgress, { color: palette.highlight }]}>{progress}</Text>
      ) : null}
    </View>
  );
}

function HomeZone({
  color,
  player,
}: {
  color: ColorKey;
  player?: Player;
}) {
  const palette = PALETTE[color];
  const layout = HOME_LAYOUT[color];

  return (
    <View
      style={[
        styles.homeZone,
        { left: layout.left, top: layout.top, backgroundColor: palette.surface },
      ]}
    >
      <LinearGradient
        colors={[palette.bright, palette.surface, palette.deep]}
        style={[styles.homeInset, { borderColor: palette.highlight }]}
      >
        <View style={[styles.homeInner, { backgroundColor: palette.deep, borderColor: palette.bright }]}>
          <View style={styles.pawnGrid}>
            {[0, 1, 2, 3].map((index) => (
              <Pawn
                key={`${color}-${index}`}
                color={color}
                faded={!player}
                progress={index === 0 ? player?.progress ?? 0 : 0}
              />
            ))}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

function BoardCell({ row, column }: { row: number; column: number }) {
  const laneColor = cellColor(row, column);
  const safe = SAFE_CELLS.has(`${row}-${column}`);
  const startColor = START_CELLS[`${row}-${column}`];
  const routeColor = laneColor ? PALETTE[laneColor] : null;

  return (
    <View
      style={[
        styles.cell,
        { left: `${(column / 15) * 100}%`, top: `${(row / 15) * 100}%` },
        routeColor
          ? { backgroundColor: routeColor.surface, borderColor: routeColor.deep }
          : styles.creamCell,
      ]}
    >
      {safe ? (
        <Feather name="star" size={7} color={routeColor?.ink ?? '#8B6C43'} />
      ) : startColor ? (
        <View style={[styles.startMark, { backgroundColor: PALETTE[startColor].surface, borderColor: PALETTE[startColor].deep }]} />
      ) : null}
    </View>
  );
}

function FinishLane() {
  return (
    <View style={styles.finishWrap}>
      <View style={styles.finishBorder}>
        <View style={styles.finishSurface}>
          <View style={styles.finishSvg}>
            <View style={styles.triangleTop} />
            <View style={styles.triangleRight} />
            <View style={styles.triangleBottom} />
            <View style={styles.triangleLeft} />
            <LinearGradient colors={['#FFE59B', '#B77812', '#71450A']} style={styles.finishCrown}>
              <Feather name="award" size={13} color="#FFF3C4" />
            </LinearGradient>
          </View>
        </View>
      </View>
    </View>
  );
}

export function LudoBoard({ players }: { players: Player[] }) {
  return (
    <View style={styles.boardOuter}>
      <View style={styles.boardRim}>
        <LinearGradient colors={['#5B351B', '#2A150D', '#72431D']} style={styles.board}>
          <View style={styles.boardSheen} />
          {HOME_KEYS.map((color) => (
            <HomeZone key={color} color={color} player={players.find((player) => player.color === color)} />
          ))}
          <View style={styles.route}>
            {Array.from({ length: 225 }, (_, index) => {
              const row = Math.floor(index / 15);
              const column = index % 15;
              if (isHomeCell(row, column) || isCenterCell(row, column)) return null;
              return <BoardCell key={`${row}-${column}`} row={row} column={column} />;
            })}
          </View>
          <FinishLane />
          <View style={styles.innerFrame} pointerEvents="none" />
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boardOuter: {
    width: '100%',
    aspectRatio: 1,
    padding: 4,
    borderRadius: 15,
    backgroundColor: '#1A0D0A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.65,
    shadowRadius: 16,
    elevation: 14,
  },
  boardRim: {
    flex: 1,
    padding: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D19A4E',
    backgroundColor: '#6C3B1A',
  },
  board: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#F1C06C',
  },
  boardSheen: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.16,
    borderWidth: 5,
    borderColor: '#FFE4A2',
    borderRadius: 7,
  },
  innerFrame: {
    ...StyleSheet.absoluteFillObject,
    margin: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,230,168,0.34)',
    borderRadius: 5,
  },
  homeZone: {
    position: 'absolute',
    width: '40%',
    height: '40%',
    padding: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,247,205,0.7)',
  },
  homeInset: {
    flex: 1,
    padding: 5,
    borderRadius: 9,
    borderWidth: 1,
    shadowColor: '#2A1306',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  homeInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
  },
  pawnGrid: {
    width: '78%',
    height: '78%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pawn: {
    width: '38%',
    height: '38%',
    margin: '4%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  pawnFaded: {
    opacity: 0.52,
  },
  pawnShadow: {
    position: 'absolute',
    bottom: 0,
    width: '82%',
    height: '25%',
    borderRadius: 999,
    opacity: 0.55,
  },
  pawnFoot: {
    width: '88%',
    height: '58%',
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scaleX: 1.08 }],
  },
  pawnBody: {
    width: '88%',
    height: '170%',
    bottom: '42%',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.38)',
  },
  pawnHead: {
    width: '58%',
    aspectRatio: 1,
    marginTop: '11%',
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pawnGlint: {
    width: '32%',
    aspectRatio: 1,
    borderRadius: 999,
    opacity: 0.7,
  },
  pawnCollar: {
    position: 'absolute',
    bottom: '14%',
    width: '78%',
    height: '14%',
    borderRadius: 999,
    borderWidth: 1,
  },
  pawnProgress: {
    position: 'absolute',
    top: -2,
    right: -1,
    fontSize: 7,
    fontWeight: '900',
    textShadowColor: '#32160B',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  route: {
    ...StyleSheet.absoluteFillObject,
  },
  cell: {
    position: 'absolute',
    width: `${100 / 15}%`,
    height: `${100 / 15}%`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.65,
    borderColor: '#B6A78C',
    backgroundColor: '#F8F1DF',
  },
  creamCell: {
    backgroundColor: '#F7F0DE',
    borderColor: '#AFA083',
  },
  startMark: {
    width: '62%',
    height: '62%',
    borderRadius: 999,
    borderWidth: 1,
    opacity: 0.95,
  },
  finishWrap: {
    position: 'absolute',
    left: '40%',
    top: '40%',
    width: '20%',
    height: '20%',
    padding: 2,
    backgroundColor: '#F4E7C7',
  },
  finishBorder: {
    flex: 1,
    padding: 1,
    backgroundColor: '#B08B52',
  },
  finishSurface: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#F9F1DD',
  },
  finishSvg: {
    flex: 1,
    position: 'relative',
  },
  triangleTop: {
    position: 'absolute',
    width: 0,
    height: 0,
    left: '25%',
    top: 0,
    borderLeftWidth: 25,
    borderRightWidth: 25,
    borderTopWidth: 0,
    borderBottomWidth: 25,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: PALETTE.ruby.surface,
  },
  triangleRight: {
    position: 'absolute',
    width: 0,
    height: 0,
    right: 0,
    top: '25%',
    borderTopWidth: 25,
    borderBottomWidth: 25,
    borderLeftWidth: 0,
    borderRightWidth: 25,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: PALETTE.sapphire.surface,
  },
  triangleBottom: {
    position: 'absolute',
    width: 0,
    height: 0,
    left: '25%',
    bottom: 0,
    borderLeftWidth: 25,
    borderRightWidth: 25,
    borderTopWidth: 25,
    borderBottomWidth: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: PALETTE.gold.surface,
  },
  triangleLeft: {
    position: 'absolute',
    width: 0,
    height: 0,
    left: 0,
    top: '25%',
    borderTopWidth: 25,
    borderBottomWidth: 25,
    borderLeftWidth: 25,
    borderRightWidth: 0,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: PALETTE.emerald.surface,
  },
  finishCrown: {
    position: 'absolute',
    left: '31%',
    top: '31%',
    width: '38%',
    height: '38%',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFEAB1',
  },
});