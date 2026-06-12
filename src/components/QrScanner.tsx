import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, ClipboardPaste, QrCode, ScanLine, X } from 'lucide-react';
import type { DeliveryDraft } from '../types/types';
import { getDemoQrPayload, parseQrPayload } from '../utils/qrPayload';

interface QrScannerProps {
  onApplyDraft: (draft: DeliveryDraft) => void;
}

interface BarcodeDetectorResult {
  rawValue?: string;
}

interface BarcodeDetectorLike {
  detect: (source: HTMLVideoElement) => Promise<BarcodeDetectorResult[]>;
}

type BarcodeDetectorConstructor = new (options: { formats: string[] }) => BarcodeDetectorLike;

type WindowWithBarcodeDetector = Window &
  typeof globalThis & {
    BarcodeDetector?: BarcodeDetectorConstructor;
  };

export default function QrScanner({ onApplyDraft }: QrScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [manualPayload, setManualPayload] = useState('');
  const [scanError, setScanError] = useState('');
  const [scanStatus, setScanStatus] = useState('Camera scanner is ready on supported mobile browsers.');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const applyPayload = useCallback(
    (payload: string) => {
      try {
        const draft = parseQrPayload(payload);
        onApplyDraft(draft);
        setManualPayload('');
        setScanError('');
        setIsOpen(false);
      } catch (error) {
        setScanError(error instanceof Error ? error.message : 'Unable to read this QR payload.');
      }
    },
    [onApplyDraft]
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    let intervalId: number | undefined;
    let stream: MediaStream | undefined;
    let isClosed = false;
    let isDetecting = false;

    const startScanner = async () => {
      const BarcodeDetector = (window as WindowWithBarcodeDetector).BarcodeDetector;

      if (!BarcodeDetector) {
        setScanStatus('Camera QR detection is not available in this browser. Paste a QR payload below.');
        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        setScanStatus('Camera access is not available. Paste a QR payload below.');
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
          },
        });

        if (isClosed || !videoRef.current) return;

        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        const detector = new BarcodeDetector({ formats: ['qr_code'] });
        setScanStatus('Point the camera at a delivery QR code.');

        intervalId = window.setInterval(async () => {
          if (!videoRef.current || isDetecting) return;

          isDetecting = true;

          try {
            const results = await detector.detect(videoRef.current);
            const payload = results[0]?.rawValue;

            if (payload) {
              applyPayload(payload);
            }
          } catch {
            setScanStatus('Scanning is active. Hold the QR code steady inside the camera frame.');
          } finally {
            isDetecting = false;
          }
        }, 850);
      } catch {
        setScanStatus('Camera permission was blocked. Paste a QR payload below.');
      }
    };

    void startScanner();

    return () => {
      isClosed = true;

      if (intervalId) {
        window.clearInterval(intervalId);
      }

      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [applyPayload, isOpen]);

  return (
    <>
      <button
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-black text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-500/10"
        onClick={() => {
          setIsOpen(true);
          setScanError('');
          setScanStatus('Camera scanner is ready on supported mobile browsers.');
        }}
        type="button"
      >
        <QrCode size={18} />
        Scan QR
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[5000] flex items-end bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4">
          <div className="max-h-[96vh] w-full overflow-y-auto rounded-t-2xl border border-white/20 bg-white shadow-2xl sm:max-w-xl sm:rounded-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-red-600">
                  QR delivery intake
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-950">Scan order details</h2>
                <p className="mt-1 text-sm font-medium text-slate-600">
                  QR can contain JSON, URL params, or Name/Address/Order/Phone text.
                </p>
              </div>

              <button
                className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-4">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
                <video
                  className="aspect-[4/3] w-full bg-slate-950 object-cover"
                  muted
                  playsInline
                  ref={videoRef}
                />
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <ScanLine className="mt-0.5 shrink-0 text-slate-500" size={18} />
                <p className="text-sm font-bold leading-5 text-slate-700">{scanStatus}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-500" htmlFor="qr-payload">
                  QR payload fallback
                </label>
                <textarea
                  className="min-h-28 w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  id="qr-payload"
                  onChange={(event) => setManualPayload(event.target.value)}
                  placeholder='Example: {"name":"Asha","address":"MG Road Bengaluru","order":"Keyboard","phone":"9876543210"}'
                  value={manualPayload}
                />
              </div>

              {scanError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
                  <AlertCircle className="mt-0.5 shrink-0" size={16} />
                  {scanError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-black text-slate-800 transition hover:bg-slate-50"
                  onClick={() => setManualPayload(getDemoQrPayload())}
                  type="button"
                >
                  <ClipboardPaste size={17} />
                  Demo QR
                </button>
                <button
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-2"
                  disabled={!manualPayload.trim()}
                  onClick={() => applyPayload(manualPayload)}
                  type="button"
                >
                  <CheckCircle2 size={17} />
                  Use QR details
                </button>
              </div>

              <div className="rounded-lg bg-sky-50 p-3 text-xs font-bold leading-5 text-sky-800">
                For best mobile results, use Chrome or Edge and allow camera access. If camera scanning is
                unavailable, paste the QR text payload and continue.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
