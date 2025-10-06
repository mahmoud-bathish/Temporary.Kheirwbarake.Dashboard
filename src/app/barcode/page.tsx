'use client';

import { useState } from 'react';

export default function BarcodePage() {
  const [barcode, setBarcode] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleReview = async () => {
    if (!barcode) return;
    try {
      setIsLoading(true);
      console.log('[Barcode] calling endpoint:', '/api/getItemBarcode');
      const res = await fetch('/api/getItemBarcode', {
        method: 'POST',
        headers: {
          'accept': 'application/json, text/plain, */*',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            barcode: { _eq: barcode },
            active: { _eq: true },
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const found = Array.isArray(data) && data.length > 0;
      if (found) {
        setModalMessage('يبدو أن الباركود صحيح. جرّب مرة أخرى على الويبسايت، وإذا استمرت المشكلة يرجى التواصل مع محمود.');
      } else {
        // Fallback to KBBarcode list
        console.log('[Barcode] calling endpoint:', '/api/kb-barcodes');
        const kbRes = await fetch('/api/kb-barcodes', { cache: 'no-store' });
        if (!kbRes.ok) throw new Error(`KB HTTP ${kbRes.status}`);
        const kbData = await kbRes.json();
        const items = Array.isArray(kbData?.ItemFile) ? kbData.ItemFile : [];
        console.log('[Barcode] Input barcode:', barcode);
        const matches = items.filter((it: any) => it.itemid === barcode);
        console.log('[Barcode] KB items count:', items.length);
        console.log('[Barcode] KB items:', items);
        console.log('[Barcode] KB matches count:', matches.length);
        console.log('[Barcode] KB matches:', matches);
        if (matches.length > 0) {
          const header = `${matches.length} اصناف معرفين في النظام الداخلي (يرجي المراجعة):`;
          const humanReadable = matches
            .map((m: any) => `- رقم الصنف: ${m.itemid}\n- باركود: ${m.barcodeitemid}`)
            .join('\n\n');
          let message = `${header}\n\n${humanReadable}`;

          // Call first endpoint again for each barcodeitemid to validate and build reprint notes
          const recheckPromises = matches.map(async (m: any) => {
            try {
              const followRes = await fetch('/api/getItemBarcode', {
                method: 'POST',
                headers: {
                  'accept': 'application/json, text/plain, */*',
                  'content-type': 'application/json',
                },
                body: JSON.stringify({
                  query: {
                    barcode: { _eq: m.barcodeitemid },
                    active: { _eq: true },
                  },
                }),
              });
              if (!followRes.ok) return null;
              const followData = await followRes.json();
              if (Array.isArray(followData) && followData.length > 0) {
                return followData.map((fd: any) => `يحتاج لاعادة طباعة الباركود\nرمز الصنف:${fd.itemId}\nالباركود الموجود على الموقع: ${fd.barcode}`);
              }
              return null;
            } catch {
              return null;
            }
          });

          const recheckResults = await Promise.all(recheckPromises);
          const flatMessages = (recheckResults.filter(Boolean).flat() as string[]);
          if (flatMessages.length > 0) {
            message += `\n------------------------------\n${flatMessages.join('\n------------------------------\n')}`;
          }

          setModalMessage(message);
        } else {
          setModalMessage(`هذا الباركود ${barcode} غير موجود على الموقع ولم يرجع من النظام الداخلي.`);
        }
      }
      setModalOpen(true);
    } catch (e) {
      setModalMessage('حدث خطأ أثناء التحقق. يرجى المحاولة مجدداً.');
      setModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      const title = `نتيجة التحقق - الباركود: ${barcode}`;
      const full = `${title}\n\n${modalMessage}`;
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // no-op
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">تحقق من الباركود</h1>
        <p className="text-gray-600">أدخل رقم الباركود يدوياً.</p>
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col gap-4">
          <label htmlFor="barcode-input" className="text-sm font-medium text-gray-700">رقم الباركود</label>
          <input
            id="barcode-input"
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل الباركود"
            dir="ltr"
          />
          <div>
            <button
              onClick={handleReview}
              disabled={!barcode || isLoading}
              className={`px-4 py-2 rounded-md text-sm cursor-pointer ${(!barcode || isLoading) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
            >
              {isLoading ? 'جاري التحقق...' : `مراجعة ${barcode ? `(${barcode})` : ''}`}
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-[90%] max-w-none rounded-lg shadow p-5 text-right">
            <h2 className="text-lg font-semibold mb-3">نتيجة التحقق - الباركود: {barcode}</h2>
            <pre className="whitespace-pre-wrap break-words text-gray-700 mb-5">{modalMessage}</pre>
            <div className="flex justify-start gap-3">
              <button
                className={`px-4 py-2 rounded-md text-sm cursor-pointer ${copied ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                onClick={handleCopy}
              >
                {copied ? 'تم النسخ' : 'نسخ'}
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 cursor-pointer"
                onClick={() => setModalOpen(false)}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


