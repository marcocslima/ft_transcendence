import React from 'react';
import SVG, { Circle, Rect, Line, Text } from 'react-svg-draw';
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';
import {
  MatchPadles,
  Ball,
  MatchScores,
  MatchLevel,
} from 'interfaces/gameInterfaces/interfaces';

interface CourtProps {
  roomId: string;
  matchBall: Ball;
  matchPadles: MatchPadles;
  matchScores: MatchScores;
  matchLevel: MatchLevel;
  onSendKey: (type: string, key: string) => void;
  onSendLevel: (level: number) => void;
}

const courtDimensions = { width: 580, height: 320 };

const courtCollorOptions = [
  { label: 'preta', value: 'rgb(0, 0, 0)' },
  { label: 'verde', value: 'rgb(0, 100, 0)' },
  { label: 'azul', value: 'rgb(18, 10, 143)' },
];

const levelMatchOptions = [
  { label: 'fácil', value: 1 },
  { label: 'médio', value: 1.5 },
  { label: 'difícil', value: 2 },
];

const Court: React.FC<CourtProps> = ({
  matchBall,
  matchPadles,
  matchScores,
  matchLevel,
  onSendKey,
  onSendLevel,
}) => {
  const [ball, setBall] = React.useState<Ball>();
  const [padles, setPadles] = React.useState<MatchPadles>();
  const [scores, setScores] = React.useState<MatchScores>();
  const [courtCollor, setCourtCollor] = React.useState<string>('rgb(0, 0, 0)');
  const [levelMatch, setLevelMatch] = React.useState<number>(1);
  // const [selectedLevel, setselectedLevel] = React.useState<MatchLevel>();

  const onChangeCollor = ({ target: { value } }: RadioChangeEvent) => {
    setCourtCollor(value);
  };

  const onChangeLevel = ({ target: { value } }: RadioChangeEvent) => {
    setLevelMatch(value);
  };

  React.useEffect(() => {
    onSendLevel(levelMatch);
  }, [levelMatch]);

  React.useEffect(() => {
    setBall(matchBall);
  }, [matchBall]);

  React.useEffect(() => {
    setPadles(matchPadles);
  }, [matchPadles]);

  React.useEffect(() => {
    setScores(matchScores);
  }, [matchScores]);

  React.useEffect(() => {
    // setselectedLevel(matchLevel);
    console.log(matchLevel);
  }, [matchLevel]);

  React.useEffect(() => {
    const sendKeyEvent = (e: any) => {
      const { key, type } = e;

      switch (key) {
        case 'ArrowUp':
        case 'ArrowDown':
          onSendKey(type, key);
          e.preventDefault();
          break;
      }
    };

    document.addEventListener('keydown', sendKeyEvent);
    document.addEventListener('keyup', sendKeyEvent);

    return () => {
      document.removeEventListener('keydown', sendKeyEvent);
      document.removeEventListener('keyup', sendKeyEvent);
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <SVG
        width={courtDimensions.width.toString()}
        height={courtDimensions.height.toString()}
      >
        <Rect
          x="0"
          y="0"
          width={courtDimensions.width.toString()}
          height={courtDimensions.height.toString()}
          style={{ fill: courtCollor }}
        />
        <Rect
          x="5"
          y={padles?.player1.y ? padles?.player1.y.toString() : '135'}
          width="5"
          height="50"
          style={{ fill: 'rgb(255, 255, 255)' }}
        />
        <Rect
          x={(courtDimensions.width - 10).toString()}
          y={padles?.player2.y ? padles?.player2.y.toString() : '135'}
          width="5"
          height="50"
          style={{ fill: 'rgb(255, 255, 255)' }}
        />
        <Line
          x1={(courtDimensions.width / 2).toString()}
          y1="0"
          x2={(courtDimensions.width / 2).toString()}
          y2={courtDimensions.height.toString()}
          strokeDasharray="5,5"
          strokeWidth="5"
          style={{ stroke: 'rgba(255, 255, 255, 0.5)' }}
        />
        <Text
          x={(courtDimensions.width / 2 - 20).toString()}
          y="45"
          style={{
            direction: 'rtl',
            fill: 'rgba(255, 255, 255, 0.7)',
            fontSize: '50px',
          }}
        >
          {scores?.score1}
        </Text>
        <Text
          x={(courtDimensions.width / 2 + 20).toString()}
          y="45"
          style={{
            fill: 'rgba(255, 255, 255, 0.7)',
            fontSize: '50px',
          }}
        >
          {scores?.score2}
        </Text>
        {ball && (
          <Circle
            cx={ball?.x?.toString() ?? '0'}
            cy={ball?.y?.toString() ?? '0'}
            r={ball?.width?.toString() ?? '0'}
            style={{ fill: '#fff' }}
          />
        )}
      </SVG>
      <div style={{ marginTop: '10px' }}>
        <h3>...escolha a cor da quadra...</h3>
      </div>
      <div style={{ marginTop: '5px' }}>
        <Radio.Group
          options={courtCollorOptions}
          onChange={onChangeCollor}
          value={courtCollor}
          optionType="button"
          buttonStyle="solid"
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <h3>...escolha o nível do jogo...</h3>
      </div>
      <div style={{ marginTop: '5px' }}>
        <Radio.Group
          options={levelMatchOptions}
          onChange={onChangeLevel}
          value={levelMatch}
          optionType="button"
          buttonStyle="solid"
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <h3>... Nível do jogo = {levelMatch.toString()} ...</h3>
      </div>
    </div>
  );
};

export default Court;
