import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line, Text } from '@react-three/drei';
import * as THREE from 'three';

const RIVER_WIDTH = 200;
const RIVER_HALF = 4;
const BANK_Z = 5.1;
const START_X = -5;
const METERS_TO_WORLD = 0.04;
const BOAT_Y = 0.38;
const VECTOR_SCALE = 0.22;
const ANIMATION_SECONDS = 8;

const rad = (degrees) => (degrees * Math.PI) / 180;
const deg = (radians) => (radians * 180) / Math.PI;
const add = (a, b) => a.map((value, i) => value + b[i]);
const formatSigned = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(1)} m`;

function VectorArrow({ start, direction, color, label }) {
  const ref = useRef();
  const vector = useMemo(() => new THREE.Vector3(...direction), [direction]);
  const length = vector.length();

  useEffect(() => {
    if (!ref.current || length < 0.001) return;
    ref.current.position.set(...start);
    ref.current.setDirection(vector.normalize());
    ref.current.setLength(length, Math.min(0.32, length * 0.28), Math.min(0.18, length * 0.16));
  }, [length, start, vector]);

  if (length < 0.001) return null;

  const labelPosition = [
    start[0] + direction[0] * 0.5,
    start[1] + 0.35,
    start[2] + direction[2] * 0.5,
  ];

  return (
    <>
      <arrowHelper
        ref={ref}
        args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, color, 0.25, 0.14]}
      />
      <Text position={labelPosition} fontSize={0.25} color={color}>
        {label}
      </Text>
    </>
  );
}

function RiverFlow({ speed }) {
  const flow = useRef();

  useFrame((_, dt) => {
    if (!flow.current) return;
    flow.current.position.x = (flow.current.position.x + speed * dt * 0.35) % 2;
  });

  return (
    <group ref={flow}>
      {Array.from({ length: 7 }).map((_, row) => (
        Array.from({ length: 14 }).map((__, column) => {
          const x = column * 2 - 14;
          const z = row * 1.05 - 3.2;
          return (
            <Line
              key={`${row}-${column}`}
              points={[[x, 0.07, z], [x + 0.75, 0.07, z]]}
              color={speed > 0 ? '#3ba9c4' : '#226579'}
              lineWidth={1}
              transparent
              opacity={0.48}
            />
          );
        })
      ))}
    </group>
  );
}

function Marker({ position, color, label }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.25, 0.34, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      <Line points={[[-0.46, 0.02, 0], [0.46, 0.02, 0]]} color={color} lineWidth={1.5} />
      <Line points={[[0, 0.02, -0.46], [0, 0.02, 0.46]]} color={color} lineWidth={1.5} />
      <Text position={[0, 0.18, 0.62]} fontSize={0.23} color={color}>
        {label}
      </Text>
    </group>
  );
}

export default function RiverBoat({ params }) {
  const {
    boatSpeed = 4,
    riverSpeed = 2.4,
    angle = 0,
    showBoth = true,
  } = params;
  const theta = rad(angle);
  const safeAcrossSpeed = Math.max(boatSpeed * Math.cos(theta), 0.001);
  const acrossSpeed = boatSpeed * Math.cos(theta);
  const downstreamSpeed = riverSpeed - boatSpeed * Math.sin(theta);
  const crossingTime = RIVER_WIDTH / safeAcrossSpeed;
  const ownDrift = downstreamSpeed * crossingTime;
  const shortestTime = RIVER_WIDTH / boatSpeed;
  const shortestTimeDrift = (riverSpeed * RIVER_WIDTH) / boatSpeed;
  const canReachTarget = riverSpeed < boatSpeed;
  const requiredAngle = canReachTarget ? deg(Math.asin(riverSpeed / boatSpeed)) : null;
  const shortestPathTime = canReachTarget
    ? RIVER_WIDTH / Math.sqrt(Math.max(boatSpeed ** 2 - riverSpeed ** 2, 0.0001))
    : null;
  const minimumDriftAngle = !canReachTarget ? deg(Math.asin(boatSpeed / riverSpeed)) : null;
  const minimumDrift = !canReachTarget
    ? (RIVER_WIDTH * Math.sqrt(riverSpeed ** 2 - boatSpeed ** 2)) / boatSpeed
    : null;

  // The x direction is compressed only for the display so even a very fast
  // current stays visible. The river width and all readouts remain physical.
  const maxDisplayDrift = Math.max(
    Math.abs(shortestTimeDrift),
    Math.abs(ownDrift),
    Math.abs(minimumDrift ?? 0),
    RIVER_WIDTH * 0.6,
  ) * METERS_TO_WORLD;
  const xFit = Math.min(1, 9 / Math.max(maxDisplayDrift, 8));
  const xWorld = (meters) => meters * METERS_TO_WORLD * xFit;
  const zWorld = (meters) => meters * METERS_TO_WORLD;
  const startGround = [START_X, 0.08, -RIVER_HALF];
  const targetGround = [START_X, 0.08, RIVER_HALF];

  const pointAt = (time, y = BOAT_Y) => [
    START_X + xWorld(downstreamSpeed * time),
    y,
    -RIVER_HALF + zWorld(acrossSpeed * time),
  ];

  const shortestTimeLanding = [
    START_X + xWorld(shortestTimeDrift),
    0.1,
    RIVER_HALF,
  ];
  const minDriftLanding = [
    START_X + xWorld(minimumDrift ?? shortestTimeDrift),
    0.1,
    RIVER_HALF,
  ];

  const [clock, setClock] = useState(0);
  const [trail, setTrail] = useState([startGround]);
  const [prediction, setPrediction] = useState(null);
  const boat = useRef();
  const simulationTime = useRef(0);
  const trailTimer = useRef(0);
  const settingsKey = `${boatSpeed}|${riverSpeed}|${angle}`;
  const previousSettings = useRef(settingsKey);
  const displayTime = Math.min(clock, crossingTime);
  const livePoint = pointAt(displayTime);
  const arrowStart = [livePoint[0], 0.85, livePoint[2]];
  const blueVector = [
    -Math.sin(theta) * boatSpeed * VECTOR_SCALE * xFit,
    0,
    Math.cos(theta) * boatSpeed * VECTOR_SCALE,
  ];
  const yellowVector = [riverSpeed * VECTOR_SCALE * xFit, 0, 0];
  const resultantVector = [
    downstreamSpeed * VECTOR_SCALE * xFit,
    0,
    acrossSpeed * VECTOR_SCALE,
  ];
  const yellowStart = add(arrowStart, blueVector);

  const ownTrail = [];
  for (let i = 0; i <= 48; i += 1) {
    ownTrail.push(pointAt((crossingTime * i) / 48, 0.09));
  }

  useFrame((_, dt) => {
    if (previousSettings.current !== settingsKey) {
      previousSettings.current = settingsKey;
      simulationTime.current = 0;
      trailTimer.current = 0;
      setClock(0);
      setTrail([startGround]);
      return;
    }

    simulationTime.current += (dt * crossingTime) / ANIMATION_SECONDS;
    if (simulationTime.current >= crossingTime) {
      simulationTime.current = 0;
      setTrail([startGround]);
    } else {
      const currentPoint = pointAt(simulationTime.current, 0.09);
      trailTimer.current += dt;
      if (trailTimer.current > 0.06) {
        trailTimer.current = 0;
        setTrail((previous) => [...previous.slice(-180), currentPoint]);
      }
    }

    const currentBoatPoint = pointAt(simulationTime.current);
    if (boat.current) boat.current.position.set(...currentBoatPoint);
    setClock((previous) => {
      const next = simulationTime.current;
      return Math.abs(next - previous) > 0.06 ? next : previous;
    });
  });

  const answer = prediction === 'no'
    ? 'ঠিক! স্রোত পারাপারের সময় বদলায় না। / Correct! The current does not change crossing time.'
    : prediction === 'yes'
      ? 'আবার ভাবো: t = d / v_b — এখানে v_r নেই। / Try again: t = d / v_b has no v_r.'
      : null;

  return (
    <group>
      {/* River, banks and moving current marks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, RIVER_WIDTH * METERS_TO_WORLD]} />
        <meshStandardMaterial color="#0b4860" roughness={0.72} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.16, -BANK_Z]}>
        <boxGeometry args={[26, 0.32, 2.2]} />
        <meshStandardMaterial color="#295c42" roughness={0.95} />
      </mesh>
      <mesh position={[0, -0.16, BANK_Z]}>
        <boxGeometry args={[26, 0.32, 2.2]} />
        <meshStandardMaterial color="#295c42" roughness={0.95} />
      </mesh>
      <RiverFlow speed={riverSpeed} />
      <Text position={[-10.8, 0.2, -5.35]} fontSize={0.24} color="#9bd4a8">
        START BANK
      </Text>
      <Text position={[-10.8, 0.2, 5.35]} fontSize={0.24} color="#9bd4a8">
        FAR BANK
      </Text>
      <Marker position={[START_X, 0.1, -RIVER_HALF]} color="#f8fafc" label="start" />
      <Marker position={targetGround} color="#22c55e" label="target" />

      {/* The two reference routes */}
      {showBoth && (
        <>
          <Line
            points={[startGround, shortestTimeLanding]}
            color="#ef4444"
            lineWidth={2}
            dashed
            dashSize={0.28}
            gapSize={0.16}
          />
          <Marker position={shortestTimeLanding} color="#ef4444" label="t min" />
          <Line
            points={[startGround, canReachTarget ? targetGround : minDriftLanding]}
            color={canReachTarget ? '#22c55e' : '#64748b'}
            lineWidth={2}
            dashed
            dashSize={canReachTarget ? 0.28 : 0.16}
            gapSize={canReachTarget ? 0.16 : 0.3}
          />
          {canReachTarget ? (
            <Marker position={targetGround} color="#22c55e" label="zero drift" />
          ) : (
            <Marker position={minDriftLanding} color="#64748b" label="best possible" />
          )}
        </>
      )}

      {/* Student-controlled solid trail and boat */}
      {trail.length > 1 && <Line points={trail} color="#f8fafc" lineWidth={2.5} />}
      {!showBoth && <Line points={ownTrail} color="#334155" lineWidth={1} dashed dashSize={0.15} gapSize={0.2} />}
      <group ref={boat} position={pointAt(0)}>
        <group rotation={[0, -theta, 0]}>
          <mesh scale={[0.42, 0.2, 0.82]}>
            <sphereGeometry args={[1, 24, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.28} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.18, -0.06]}>
            <boxGeometry args={[0.34, 0.18, 0.42]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.72]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.28, 0.52, 4]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* Head-to-tail velocity triangle: blue boat, yellow current, red resultant */}
      <VectorArrow start={arrowStart} direction={blueVector} color="#38bdf8" label="v_b" />
      <VectorArrow start={yellowStart} direction={yellowVector} color="#facc15" label="v_r" />
      <VectorArrow start={arrowStart} direction={resultantVector} color="#ef4444" label="v" />

      <Html position={[0, 3.35, 0]} center>
        <div className="river-hud" onPointerDown={(event) => event.stopPropagation()}>
          <div className="river-hud-title">নদী ও নৌকা <span>· River &amp; Boat</span></div>
          <div className="river-readout">
            <div><span>সময় / Time</span><b>{displayTime.toFixed(1)} s</b></div>
            <div><span>সরণ / Drift</span><b>{formatSigned(ownDrift)}</b></div>
            <div><span>θ প্রয়োজন / Needed</span><b>{requiredAngle == null ? '—' : `${requiredAngle.toFixed(1)}°`}</b></div>
          </div>
          <div className={`river-status ${canReachTarget ? '' : 'warning'}`}>
            {canReachTarget
              ? `Shortest path: ${shortestPathTime.toFixed(1)} s · t min: ${shortestTime.toFixed(1)} s`
              : `শূন্য সরণ অসম্ভব — v_r > v_b · min drift angle ${minimumDriftAngle.toFixed(1)}°`}
          </div>
        </div>
      </Html>

      <Html position={[0, 1.15, -5.0]} center>
        <div className="river-predict" onPointerDown={(event) => event.stopPropagation()}>
          <strong>প্রশ্ন <span>/ Predict</span></strong>
          <p>স্রোতের বেগ বাড়ালে নদী পার হতে কি বেশি সময় লাগবে?</p>
          <small>Does a faster current make crossing take longer?</small>
          {!prediction && (
            <div className="river-answer-buttons">
              <button type="button" onClick={() => setPrediction('yes')}>হ্যাঁ · Yes</button>
              <button type="button" onClick={() => setPrediction('no')}>না · No</button>
            </div>
          )}
          {answer && <div className={`river-answer ${prediction === 'no' ? 'correct' : ''}`}>{answer}</div>}
        </div>
      </Html>
    </group>
  );
}
