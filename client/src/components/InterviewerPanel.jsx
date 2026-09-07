import React, { Suspense } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import {
    Volume2,
    VolumeX,
    Mic,
    MicOff,
    Sparkles,
} from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";

// =====================================================
// 3D INTERVIEWER MODEL
// =====================================================

const FACIAL_BLENDSHAPES = [
    "eyeBlinkLeft",
    "eyeLookDownLeft",
    "eyeLookInLeft",
    "eyeLookOutLeft",
    "eyeLookUpLeft",
    "eyeSquintLeft",
    "eyeWideLeft",

    "eyeBlinkRight",
    "eyeLookDownRight",
    "eyeLookInRight",
    "eyeLookOutRight",
    "eyeLookUpRight",
    "eyeSquintRight",
    "eyeWideRight",

    "jawForward",
    "jawLeft",
    "jawRight",
    "jawOpen",

    "mouthClose",
    "mouthFunnel",
    "mouthPucker",
    "mouthLeft",
    "mouthRight",
    "mouthSmileLeft",
    "mouthSmileRight",
    "mouthFrownLeft",
    "mouthFrownRight",
    "mouthDimpleLeft",
    "mouthDimpleRight",
    "mouthStretchLeft",
    "mouthStretchRight",
    "mouthRollLower",
    "mouthRollUpper",
    "mouthShrugLower",
    "mouthShrugUpper",
    "mouthPressLeft",
    "mouthPressRight",
    "mouthLowerDownLeft",
    "mouthLowerDownRight",
    "mouthUpperUpLeft",
    "mouthUpperUpRight",

    "browDownLeft",
    "browDownRight",
    "browInnerUp",
    "browOuterUpLeft",
    "browOuterUpRight",

    "cheekPuff",
    "cheekSquintLeft",
    "cheekSquintRight",

    "noseSneerLeft",
    "noseSneerRight",

    "tongueOut",
    "headRoll",
    "leftEyeRoll",
    "rightEyeRoll",
];

const InterviewerModel = ({ lipSyncRef }) => {
    const { scene } = useGLTF("/models/interviewer3.glb");

    useFrame(() => {
        const lipSync = lipSyncRef?.current;

        if (!lipSync) return;

        scene.traverse((child) => {
            if (
                !child.isMesh ||
                !child.morphTargetDictionary ||
                !child.morphTargetInfluences
            ) {
                return;
            }

            const dictionary =
                child.morphTargetDictionary;

            const influences =
                child.morphTargetInfluences;


            if (
                lipSync.active &&
                lipSync.frames?.length
            ) {

                const currentTime =
                    lipSync.audio
                        ? lipSync.audio.currentTime
                        : (
                            performance.now() -
                            lipSync.startedAt
                        ) / 1000;


                const exactFrame =
                    currentTime *
                    lipSync.frameRate;


                const frameIndex =
                    Math.floor(exactFrame);


                const nextFrameIndex =
                    Math.min(
                        frameIndex + 1,
                        lipSync.frames.length - 1
                    );


                const frame =
                    lipSync.frames[frameIndex];

                const nextFrame =
                    lipSync.frames[nextFrameIndex];


                if (frame) {

                    const interpolation =
                        exactFrame - frameIndex;


                    FACIAL_BLENDSHAPES.forEach(
                        (name, index) => {

                            const morphIndex =
                                dictionary[name];

                            if (
                                morphIndex === undefined
                            ) {
                                return;
                            }


                            const currentValue =
                                frame[index] || 0;

                            const nextValue =
                                nextFrame?.[index] ||
                                currentValue;


                            const targetValue =
                                currentValue +
                                (
                                    nextValue -
                                    currentValue
                                ) *
                                interpolation;


                            /*
                            Smooth movement.
    
                            Lower value =
                            slower/subtler movement.
                            */

                            influences[morphIndex] +=
                                (
                                    targetValue -
                                    influences[morphIndex]
                                ) * 0.35;
                        }
                    );
                }

            } else {

                /*
                Return face smoothly to neutral.
                */

                FACIAL_BLENDSHAPES.forEach(
                    (name) => {

                        const morphIndex =
                            dictionary[name];

                        if (
                            morphIndex !== undefined
                        ) {

                            influences[morphIndex] +=
                                (
                                    0 -
                                    influences[morphIndex]
                                ) * 0.15;
                        }
                    }
                );
            }
        });
    });

    return (
        <primitive
            object={scene}
            position={[0, -8, 0]}
            rotation={[-0.1, 0, 0]}
            scale={4.8}
        />
    );
};

useGLTF.preload("/models/interviewer3.glb");

// =====================================================
// INTERVIEWER PANEL
// =====================================================

const InterviewerPanel = ({
    avatar,
    lipSyncRef,
    isSpeaking,
    voiceEnabled,
    onToggleVoice,
    showAvatar,
    onToggleAvatar,
}) => {
    return (
        <div className="relative w-full h-[430px] rounded-[28px] overflow-hidden bg-[#080b10] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.25)]">

            {/* =====================================================
                BACKGROUND
            ===================================================== */}

            <div className="absolute inset-0 pointer-events-none">

                {/* Main gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#10151d] via-[#080b10] to-[#050609]" />

                {/* Green ambient glow */}
                <motion.div
                    animate={{
                        scale: isSpeaking ? [1, 1.2, 1] : 1,
                        opacity: isSpeaking ? [0.12, 0.22, 0.12] : 0.08,
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: isSpeaking ? Infinity : 0,
                    }}
                    className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-green-400 blur-[100px]"
                />

                {/* Secondary glow */}
                <div className="absolute bottom-[-180px] right-[-100px] w-[350px] h-[350px] rounded-full bg-emerald-500/10 blur-[100px]" />

                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />
            </div>

            {/* =====================================================
                TOP HEADER
            ===================================================== */}

            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-5">

                <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center">
                        <Sparkles
                            size={16}
                            className="text-green-400"
                        />
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold tracking-[0.18em] text-white/40 uppercase">
                            AI Interviewer
                        </p>

                        {/* <p className="text-sm font-medium text-white/90">
                            Your interviewer is ready
                        </p> */}
                    </div>

                </div>

                {/* Live status */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10">

                    <motion.span
                        animate={{
                            opacity: isSpeaking ? [0.4, 1, 0.4] : 1,
                            scale: isSpeaking ? [0.9, 1.15, 0.9] : 1,
                        }}
                        transition={{
                            duration: 1.2,
                            repeat: isSpeaking ? Infinity : 0,
                        }}
                        className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"
                    />

                    <span className="text-[11px] font-medium text-white/60">
                        {isSpeaking ? "LIVE" : "READY"}
                    </span>

                </div>

            </div>

            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            {showAvatar ? (

                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-8">

                    {/* Model stage */}

                    <div className="relative w-[250px] h-[250px]">

                        {/* Outer speaking glow */}

                        <motion.div
                            animate={
                                isSpeaking
                                    ? {
                                        scale: [1, 1.08, 1],
                                        opacity: [0.15, 0.32, 0.15],
                                    }
                                    : {
                                        scale: 1,
                                        opacity: 0.12,
                                    }
                            }
                            transition={{
                                duration: 2,
                                repeat: isSpeaking ? Infinity : 0,
                            }}
                            className="absolute inset-[-25px] rounded-full bg-green-400 blur-[45px]"
                        />

                        {/* Outer ring */}

                        <motion.div
                            animate={
                                isSpeaking
                                    ? {
                                        rotate: 360,
                                    }
                                    : {}
                            }
                            transition={{
                                duration: 12,
                                repeat: isSpeaking ? Infinity : 0,
                                ease: "linear",
                            }}
                            className="absolute inset-0 rounded-full border border-green-400/20"
                        />

                        {/* Model container */}
                        <div
                            className="relative w-full h-full rounded-full overflow-hidden border border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.02] shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                        >
                            <Canvas
                                camera={{
                                    position: [0, 1 , 6],
                                    fov: 15,
                                }}
                            >
                                <ambientLight intensity={2} />

                                <directionalLight
                                    position={[3, 5, 5]}
                                    intensity={3}
                                />

                                <directionalLight
                                    position={[-3, 3, 4]}
                                    intensity={2}
                                />

                                <Suspense fallback={null}>
                                    <InterviewerModel
                                        lipSyncRef={lipSyncRef}
                                    />
                                </Suspense>
                            </Canvas>

                            {/* Bottom fade */}
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                        </div>

                        {/* Speaking indicator */}

                        {isSpeaking && (
                            <motion.div
                                initial={{
                                    scale: 0,
                                    opacity: 0,
                                }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                }}
                                className="absolute right-1 bottom-4 w-11 h-11 rounded-full bg-green-500 border-[3px] border-[#080b10] flex items-center justify-center shadow-[0_0_25px_rgba(34,197,94,0.45)]"
                            >
                                <Volume2
                                    size={18}
                                    className="text-white"
                                />
                            </motion.div>
                        )}

                    </div>

                    {/* =================================================
                        AUDIO VISUALIZER
                    ================================================= */}

                    <div className="flex items-center gap-[4px] h-6 mt-1">

                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
                            (bar) => (
                                <motion.div
                                    key={bar}
                                    className="w-[3px] rounded-full bg-green-400"
                                    animate={
                                        isSpeaking
                                            ? {
                                                height: [
                                                    5,
                                                    14 + (bar % 3) * 5,
                                                    8,
                                                    18,
                                                    6,
                                                ],
                                            }
                                            : {
                                                height: 4,
                                            }
                                    }
                                    transition={{
                                        duration: 0.55,
                                        repeat: isSpeaking
                                            ? Infinity
                                            : 0,
                                        repeatType: "mirror",
                                        delay: bar * 0.06,
                                        ease: "easeInOut",
                                    }}
                                />
                            )
                        )}

                    </div>

                    {/* Name */}

                    {/* <div className=" text-center">

                        <p className="text-sm mb-9 font-semibold text-white">
                            AI Interviewer
                        </p>
                        <p className="text-xs text-white/40 mt-0.5">
                            {isSpeaking
                                ? "Speaking to you..."
                                : "Waiting for your response"}
                        </p>

                    </div> */}

                </div>

            ) : (

                /* =====================================================
                   VOICE ONLY MODE
                ===================================================== */

                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">

                    <motion.div
                        animate={
                            isSpeaking
                                ? {
                                    scale: [1, 1.05, 1],
                                    boxShadow: [
                                        "0 0 0px rgba(74,222,128,0)",
                                        "0 0 50px rgba(74,222,128,0.2)",
                                        "0 0 0px rgba(74,222,128,0)",
                                    ],
                                }
                                : {
                                    scale: 1,
                                }
                        }
                        transition={{
                            duration: 1.5,
                            repeat: isSpeaking
                                ? Infinity
                                : 0,
                        }}
                        className="w-36 h-36 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center"
                    >

                        <div className="flex items-center justify-center gap-2 h-20">

                            {[1, 2, 3, 4, 5].map(
                                (bar) => (
                                    <motion.div
                                        key={bar}
                                        className="w-2 rounded-full bg-green-400"
                                        animate={
                                            isSpeaking
                                                ? {
                                                    height: [
                                                        16,
                                                        35,
                                                        22,
                                                        48,
                                                        18,
                                                    ],
                                                }
                                                : {
                                                    height: 16,
                                                }
                                        }
                                        transition={{
                                            duration: 0.55,
                                            repeat: isSpeaking
                                                ? Infinity
                                                : 0,
                                            repeatType: "mirror",
                                            delay: bar * 0.08,
                                            ease: "easeInOut",
                                        }}
                                    />
                                )
                            )}

                        </div>

                    </motion.div>

                    <p className="mt-5 text-sm font-semibold text-white">
                        AI Interviewer
                    </p>

                    <p className="text-xs text-white/40 mt-1">
                        {isSpeaking
                            ? "Speaking..."
                            : "Voice Only Mode"}
                    </p>

                </div>

            )}

            {/* =====================================================
                BOTTOM CONTROLS
            ===================================================== */}

            <div className="absolute bottom-5 left-5 right-5 z-30 flex items-center justify-between">

                {/* Avatar toggle */}

                <button
                    type="button"
                    onClick={onToggleAvatar}
                    className="group flex items-center gap-3 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 px-3.5 py-2.5 shadow-lg hover:bg-white/[0.08] hover:border-white/20 transition-all"
                >

                    <div
                        className={`relative w-9 h-5 rounded-full transition-colors ${showAvatar
                            ? "bg-green-500"
                            : "bg-white/15"
                            }`}
                    >

                        <motion.span
                            animate={{
                                x: showAvatar ? 18 : 2,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            className="absolute top-0.5 left-0 w-4 h-4 rounded-full bg-white shadow-md"
                        />

                    </div>

                    <span className="text-xs font-medium text-white/70 group-hover:text-white transition">
                        Avatar
                    </span>

                </button>

                {/* Voice toggle */}

                <button
                    type="button"
                    onClick={onToggleVoice}
                    className="group flex items-center gap-2.5 rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 px-3.5 py-2.5 shadow-lg hover:bg-white/[0.08] hover:border-white/20 transition-all"
                >

                    {voiceEnabled ? (
                        <Volume2
                            size={15}
                            className="text-green-400"
                        />
                    ) : (
                        <VolumeX
                            size={15}
                            className="text-white/40"
                        />
                    )}

                    <span
                        className={`text-xs font-medium ${voiceEnabled
                            ? "text-green-400"
                            : "text-white/50"
                            }`}
                    >
                        Voice
                    </span>

                    <div
                        className={`relative w-9 h-5 rounded-full transition-colors ${voiceEnabled
                            ? "bg-green-500"
                            : "bg-white/15"
                            }`}
                    >

                        <motion.span
                            animate={{
                                x: voiceEnabled ? 18 : 2,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            className="absolute top-0.5 left-0 w-4 h-4 rounded-full bg-white shadow-md"
                        />

                    </div>

                </button>

            </div>

        </div>
    );
};

export default InterviewerPanel;