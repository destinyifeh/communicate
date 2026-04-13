import { useCallback, useEffect, useRef, useState } from 'react';
import { Device, Call, TwilioError } from '@twilio/voice-sdk';
import { voiceService } from '@/services/voice.service';
import { toast } from 'sonner';

export type CallStatus = 'idle' | 'connecting' | 'ringing' | 'connected' | 'on_hold' | 'disconnected';
export type CallDirection = 'inbound' | 'outbound';

export interface ActiveCall {
  sid?: string;
  direction: CallDirection;
  status: CallStatus;
  from: string;
  to: string;
  startTime?: Date;
  duration: number;
  isMuted: boolean;
  isSpeakerOn: boolean;
}

export interface IncomingCallInfo {
  from: string;
  to: string;
  callSid: string;
}

interface UseTwilioVoiceReturn {
  // State
  isReady: boolean;
  isInitializing: boolean;
  activeCall: ActiveCall | null;
  incomingCall: IncomingCallInfo | null;
  error: string | null;
  businessPhoneNumber: string | null;
  businessName: string | null;

  // Actions
  initialize: () => Promise<void>;
  makeCall: (to: string) => Promise<void>;
  acceptCall: () => void;
  rejectCall: () => void;
  hangUp: () => void;
  toggleMute: () => void;
  toggleHold: () => void;
  toggleSpeaker: () => void;
  setVolume: (volume: number) => void;
  sendDigits: (digits: string) => void;
}

export function useTwilioVoice(): UseTwilioVoiceReturn {
  const deviceRef = useRef<Device | null>(null);
  const callRef = useRef<Call | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentCallSidRef = useRef<string | null>(null);
  const callDurationRef = useRef<number>(0);
  const callToNumberRef = useRef<string | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCallInfo | null>(null);
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Start duration timer
  const startDurationTimer = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
    callDurationRef.current = 0;
    durationIntervalRef.current = setInterval(() => {
      callDurationRef.current += 1;
      setActiveCall((prev) =>
        prev ? { ...prev, duration: prev.duration + 1 } : null
      );
    }, 1000);
  }, []);

  // Stop duration timer
  const stopDurationTimer = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, []);

  // Setup call event handlers
  const setupCallHandlers = useCallback(
    (call: Call, direction: CallDirection) => {
      call.on('accept', () => {
        const realCallSid = call.parameters.CallSid;
        const tempCallSid = currentCallSidRef.current;

        console.log('[accept] Real CallSid:', realCallSid, 'Temp CallSid:', tempCallSid);

        // Update the call SID in the database if we have a real one from Twilio
        if (realCallSid && tempCallSid?.startsWith('browser_')) {
          // Update the backend with the real CallSid (this updates the externalId)
          voiceService.updateCallStatus({
            callSid: tempCallSid,
            status: 'connected',
          }).catch(err => console.error('Failed to update call status:', err));
        }

        // Keep using the temp callSid for database lookups since that's what's stored
        // Don't update currentCallSidRef to the real one
        // currentCallSidRef.current = callSid || currentCallSidRef.current;

        setActiveCall((prev) => {
          if (prev) {
            return { ...prev, status: 'connected', startTime: new Date(), sid: realCallSid || prev.sid };
          }
          return {
            sid: realCallSid,
            direction,
            status: 'connected',
            from: call.parameters.From || '',
            to: call.parameters.To || '',
            startTime: new Date(),
            duration: 0,
            isMuted: false,
            isSpeakerOn: true,
          };
        });
        startDurationTimer();
        toast.success('Call connected');
      });

      call.on('ringing', () => {
        setActiveCall((prev) =>
          prev ? { ...prev, status: 'ringing' } : null
        );
      });

      call.on('disconnect', () => {
        const callSidToUpdate = currentCallSidRef.current;
        const durationToSave = callDurationRef.current;

        console.log('[disconnect] Saving call - callSid:', callSidToUpdate, 'duration:', durationToSave);

        // Log call completion to backend
        if (callSidToUpdate) {
          voiceService.updateCallStatus({
            callSid: callSidToUpdate,
            status: 'completed',
            duration: durationToSave,
          }).then(() => {
            console.log('[disconnect] Call status updated successfully');
            toast.success(`Call saved (${durationToSave}s)`);
          }).catch(err => {
            console.error('[disconnect] Failed to update call status:', err);
            toast.error('Failed to save call duration');
          });
        }
        stopDurationTimer();
        callDurationRef.current = 0;
        setActiveCall(null);
        setIncomingCall(null);
        callRef.current = null;
        currentCallSidRef.current = null;
        callToNumberRef.current = null;
        toast.info('Call ended');
      });

      call.on('cancel', () => {
        stopDurationTimer();
        setActiveCall(null);
        setIncomingCall(null);
        callRef.current = null;
        toast.info('Call cancelled');
      });

      call.on('reject', () => {
        stopDurationTimer();
        setActiveCall(null);
        setIncomingCall(null);
        callRef.current = null;
      });

      call.on('error', (callError: TwilioError.TwilioError) => {
        console.error('Call error:', callError);
        stopDurationTimer();
        setActiveCall(null);
        setError(callError.message);
        toast.error(`Call error: ${callError.message}`);
      });

      call.on('mute', (isMuted: boolean) => {
        setActiveCall((prev) => (prev ? { ...prev, isMuted } : null));
      });
    },
    [startDurationTimer, stopDurationTimer]
  );

  // Initialize the Twilio Device
  const initialize = useCallback(async () => {
    if (isInitializing || isReady) return;

    setIsInitializing(true);
    setError(null);

    try {
      // Get access token from backend
      const response = await voiceService.getAccessToken();

      if (!response.data) {
        // Don't show error toast for failed token fetch - just run in mock mode
        console.log('Voice token not available, running in mock mode');
        setIsReady(true);
        setIsInitializing(false);
        return;
      }

      const { token, identity, phoneNumber, businessName: bName } = response.data;

      // Store business info
      if (phoneNumber) setBusinessPhoneNumber(phoneNumber);
      if (bName) setBusinessName(bName);

      // Check if token is mock
      if (token.startsWith('mock_token_')) {
        console.log('Running in mock mode - voice calling simulated');
        setIsReady(true);
        setIsInitializing(false);
        return;
      }

      console.log('Creating Twilio Device with token length:', token.length);

      // Create and setup the Device
      const device = new Device(token, {
        codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
        allowIncomingWhileBusy: false,
        logLevel: 'debug', // Enable debug logging
      });

      // Device event handlers
      device.on('registered', () => {
        console.log('Twilio Device registered');
        setIsReady(true);
      });

      device.on('unregistered', () => {
        console.log('Twilio Device unregistered');
        setIsReady(false);
      });

      device.on('error', (deviceError: TwilioError.TwilioError) => {
        console.error('Twilio Device error:', {
          code: deviceError.code,
          message: deviceError.message,
          causes: deviceError.causes,
          solutions: deviceError.solutions,
        });
        setError(deviceError.message);
        toast.error(`Voice Error: ${deviceError.code} - ${deviceError.message}`);
      });

      // Handle incoming calls
      device.on('incoming', (call: Call) => {
        console.log('Incoming call from:', call.parameters.From);
        callRef.current = call;

        setIncomingCall({
          from: call.parameters.From || 'Unknown',
          to: call.parameters.To || '',
          callSid: call.parameters.CallSid || '',
        });

        setActiveCall({
          sid: call.parameters.CallSid,
          direction: 'inbound',
          status: 'ringing',
          from: call.parameters.From || 'Unknown',
          to: call.parameters.To || '',
          duration: 0,
          isMuted: false,
          isSpeakerOn: true,
        });

        setupCallHandlers(call, 'inbound');
      });

      device.on('tokenWillExpire', async () => {
        console.log('Token will expire, refreshing...');
        try {
          const newTokenResponse = await voiceService.getAccessToken();
          if (newTokenResponse.data) {
            device.updateToken(newTokenResponse.data.token);
          }
        } catch (err) {
          console.error('Failed to refresh token:', err);
        }
      });

      // Register the device
      await device.register();
      deviceRef.current = device;

      console.log('Twilio Voice initialized for identity:', identity);
    } catch (err) {
      // Don't show error for voice initialization - just run in mock mode silently
      console.log('Voice initialization failed, running in mock mode:', err);
      setIsReady(true); // Allow mock mode to work
    } finally {
      setIsInitializing(false);
    }
  }, [isInitializing, isReady, setupCallHandlers]);

  // Make an outbound call
  const makeCall = useCallback(
    async (to: string) => {
      if (!deviceRef.current && !isReady) {
        toast.error('Voice device not ready');
        return;
      }

      // If running in mock mode
      if (!deviceRef.current) {
        console.log('[MOCK] Making call to:', to);

        // Log the mock call to backend
        const tempCallSid = `browser_${Date.now()}`;
        currentCallSidRef.current = tempCallSid;
        callToNumberRef.current = to;
        console.log('[MOCK] Set currentCallSidRef to:', tempCallSid);

        voiceService.logCall({
          to,
          callSid: tempCallSid,
        }).then(() => {
          console.log('[MOCK] Call logged successfully, callSid:', tempCallSid);
        }).catch(err => console.error('[MOCK] Failed to log call:', err));

        setActiveCall({
          sid: tempCallSid,
          direction: 'outbound',
          status: 'connecting',
          from: 'You',
          to,
          duration: 0,
          isMuted: false,
          isSpeakerOn: true,
        });

        // Simulate connection
        setTimeout(() => {
          setActiveCall((prev) =>
            prev ? { ...prev, status: 'ringing' } : null
          );
        }, 500);

        setTimeout(() => {
          setActiveCall((prev) => {
            if (prev) {
              return { ...prev, status: 'connected', startTime: new Date() };
            }
            return null;
          });
          startDurationTimer();
          toast.success('Call connected');
        }, 2000);

        return;
      }

      try {
        setActiveCall({
          direction: 'outbound',
          status: 'connecting',
          from: 'You',
          to,
          duration: 0,
          isMuted: false,
          isSpeakerOn: true,
        });

        const call = await deviceRef.current.connect({
          params: {
            To: to,
          },
        });

        callRef.current = call;

        // Log the outbound call to backend immediately with a temp ID
        // The CallSid will be updated when the call connects
        const tempCallSid = `browser_${Date.now()}`;
        currentCallSidRef.current = tempCallSid;

        voiceService.logCall({
          to,
          callSid: tempCallSid,
        }).then(() => {
          console.log('Call logged successfully');
        }).catch(err => console.error('Failed to log call:', err));

        setupCallHandlers(call, 'outbound');

        toast.success(`Calling ${to}...`);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to make call';
        console.error('Make call error:', err);
        setActiveCall(null);
        toast.error(message);
      }
    },
    [isReady, setupCallHandlers, startDurationTimer]
  );

  // Accept incoming call
  const acceptCall = useCallback(() => {
    if (callRef.current) {
      callRef.current.accept();
      setIncomingCall(null);
    } else if (activeCall?.status === 'ringing' && !deviceRef.current) {
      // Mock mode
      setActiveCall((prev) => {
        if (prev) {
          return { ...prev, status: 'connected', startTime: new Date() };
        }
        return null;
      });
      setIncomingCall(null);
      startDurationTimer();
      toast.success('Call connected');
    }
  }, [activeCall, startDurationTimer]);

  // Reject incoming call
  const rejectCall = useCallback(() => {
    if (callRef.current) {
      callRef.current.reject();
    }
    stopDurationTimer();
    setActiveCall(null);
    setIncomingCall(null);
    callRef.current = null;
  }, [stopDurationTimer]);

  // Hang up active call
  const hangUp = useCallback(async () => {
    const callSidToUpdate = currentCallSidRef.current;
    const durationToSave = callDurationRef.current;
    const hasRealCall = !!callRef.current;
    const hasDevice = !!deviceRef.current;

    console.log('[hangUp] State:', {
      callSid: callSidToUpdate,
      duration: durationToSave,
      hasRealCall,
      hasDevice,
    });

    if (callRef.current) {
      // Real Twilio call - just disconnect
      // The disconnect event handler will save duration and do cleanup
      console.log('[hangUp] Disconnecting real Twilio call...');
      callRef.current.disconnect();
      // DON'T clear refs here - let the disconnect event handler do it
      // Otherwise there's a race condition where refs are null before disconnect fires
    } else if (callSidToUpdate) {
      // Mock mode - manually update call status since disconnect event won't fire
      console.log('[hangUp] Mock mode - updating call status...');
      try {
        const response = await voiceService.updateCallStatus({
          callSid: callSidToUpdate,
          status: 'completed',
          duration: durationToSave,
        });
        console.log('[hangUp] Call status update SUCCESS:', response);
        toast.success('Call duration saved');
      } catch (err) {
        console.error('[hangUp] Failed to update call status:', err);
        toast.error('Failed to save call duration');
      }
      // Clean up for mock mode only
      stopDurationTimer();
      callDurationRef.current = 0;
      currentCallSidRef.current = null;
      callToNumberRef.current = null;
      setActiveCall(null);
      setIncomingCall(null);
      callRef.current = null;
    } else {
      console.log('[hangUp] No callSid to update');
      // Still clean up UI state
      stopDurationTimer();
      callDurationRef.current = 0;
      setActiveCall(null);
      setIncomingCall(null);
    }
  }, [stopDurationTimer]);

  // Toggle mute - mutes the microphone (local audio)
  const toggleMute = useCallback(() => {
    if (callRef.current) {
      const isMuted = callRef.current.isMuted();
      callRef.current.mute(!isMuted);
      setActiveCall((prev) => (prev ? { ...prev, isMuted: !isMuted } : null));
      toast.info(!isMuted ? 'Microphone muted' : 'Microphone unmuted');
      console.log('Mute toggled:', !isMuted);
    } else if (activeCall) {
      // Mock mode
      const newMutedState = !activeCall.isMuted;
      setActiveCall((prev) =>
        prev ? { ...prev, isMuted: newMutedState } : null
      );
      toast.info(newMutedState ? 'Microphone muted' : 'Microphone unmuted');
    }
  }, [activeCall]);

  // Toggle hold - puts the call on hold (mutes both directions and plays hold music if configured)
  const toggleHold = useCallback(() => {
    const isCurrentlyOnHold = activeCall?.status === 'on_hold';

    if (callRef.current) {
      // Mute the call when on hold
      callRef.current.mute(!isCurrentlyOnHold);

      // Update status to reflect hold state
      setActiveCall((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: isCurrentlyOnHold ? 'connected' : 'on_hold',
          isMuted: !isCurrentlyOnHold,
        };
      });

      toast.info(isCurrentlyOnHold ? 'Call resumed' : 'Call on hold');
      console.log('Hold toggled:', !isCurrentlyOnHold);
    } else if (activeCall) {
      // Mock mode
      const newStatus = isCurrentlyOnHold ? 'connected' : 'on_hold';
      setActiveCall((prev) =>
        prev ? { ...prev, status: newStatus, isMuted: newStatus === 'on_hold' } : null
      );
      toast.info(newStatus === 'on_hold' ? 'Call on hold' : 'Call resumed');
    }
  }, [activeCall]);

  // Toggle speaker - controls the audio output (mute/unmute incoming audio)
  const toggleSpeaker = useCallback(() => {
    const currentSpeakerState = activeCall?.isSpeakerOn ?? true;
    const newSpeakerState = !currentSpeakerState;

    // For Twilio Voice SDK, we control speaker through the audio elements it creates
    // or by adjusting the audio output. The SDK creates audio elements dynamically.
    try {
      // Find Twilio's audio elements (they have specific attributes)
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach((audio) => {
        if (newSpeakerState) {
          audio.muted = false;
          audio.volume = 1.0;
        } else {
          audio.muted = true;
        }
      });
      console.log('Speaker toggled:', newSpeakerState, 'Audio elements found:', audioElements.length);
    } catch (err) {
      console.error('Failed to toggle speaker:', err);
    }

    setActiveCall((prev) =>
      prev ? { ...prev, isSpeakerOn: newSpeakerState } : null
    );
    toast.info(newSpeakerState ? 'Speaker on' : 'Speaker off');
  }, [activeCall]);

  // Set volume (0.0 to 1.0)
  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));

    try {
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach((audio) => {
        audio.volume = clampedVolume;
        audio.muted = clampedVolume === 0;
      });
      console.log('Volume set to:', clampedVolume);
    } catch (err) {
      console.error('Failed to set volume:', err);
    }

    setActiveCall((prev) =>
      prev ? { ...prev, isSpeakerOn: clampedVolume > 0 } : null
    );
  }, []);

  // Send DTMF digits
  const sendDigits = useCallback((digits: string) => {
    if (callRef.current) {
      callRef.current.sendDigits(digits);
      console.log('DTMF sent:', digits);
    } else {
      // In mock mode, just log it
      console.log('[MOCK] Sending DTMF:', digits);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDurationTimer();
      if (callRef.current) {
        callRef.current.disconnect();
      }
      if (deviceRef.current) {
        deviceRef.current.destroy();
      }
    };
  }, [stopDurationTimer]);

  return {
    isReady,
    isInitializing,
    activeCall,
    incomingCall,
    error,
    businessPhoneNumber,
    businessName,
    initialize,
    makeCall,
    acceptCall,
    rejectCall,
    hangUp,
    toggleMute,
    toggleHold,
    toggleSpeaker,
    setVolume,
    sendDigits,
  };
}
