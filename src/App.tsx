/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Zap, Check } from 'lucide-react';

export default function App() {
  const [totalQty, setTotalQty] = useState<string>('');
  const [totalBoxes, setTotalBoxes] = useState<string>('');
  const [airBoxes, setAirBoxes] = useState<string>('');
  const [seaBoxes, setSeaBoxes] = useState<string>('');
  const [pasteValue, setPasteValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedTotal, setCopiedTotal] = useState(false);
  const [pastePlaceholder, setPastePlaceholder] = useState('Paste Row (Accepts Tabs or Multiple Spaces)');

  const cleanNum = (str: string) => str.replace(/[^0-9.]/g, '');

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // Prevent default to control the input value purely via state
    e.preventDefault();
    const text = e.clipboardData.getData('Text');
    
    // Split by any combination of whitespace (spaces, tabs, newlines)
    const values = text.trim().split(/\s+/);

    if (values[0]) setTotalQty(cleanNum(values[0]));
    if (values[1]) setTotalBoxes(cleanNum(values[1]));
    if (values[2]) setAirBoxes(cleanNum(values[2]));
    if (values[3]) setSeaBoxes(cleanNum(values[3]));

    setPastePlaceholder('Data Loaded! Paste Next...');
  };

  const tQty = parseFloat(totalQty) || 0;
  const tBoxes = parseFloat(totalBoxes) || 0;
  const aBoxes = parseFloat(airBoxes) || 0;
  const sBoxes = parseFloat(seaBoxes) || 0;

  const perBoxQty = tBoxes > 0 ? tQty / tBoxes : 0;
  const airQtyResult = perBoxQty * aBoxes;
  const seaQtyResult = perBoxQty * sBoxes;

  const format = (num: number) => Number.isInteger(num) ? num.toString() : num.toFixed(2);

  const formattedAirQty = format(airQtyResult);
  const formattedSeaQty = format(seaQtyResult);

  const handleCopy = () => {
    const textToCopy = `${formattedAirQty}\t${formattedSeaQty}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleCopyTotal = async () => {
    const totalToCopy = format(tQty * tBoxes);
    const htmlToCopy = `<span style="font-family: Calibri, sans-serif; font-size: 12pt;"><b>${totalToCopy}</b></span>`;
    
    try {
      const clipboardItem = new ClipboardItem({
        'text/plain': new Blob([totalToCopy], { type: 'text/plain' }),
        'text/html': new Blob([htmlToCopy], { type: 'text/html' })
      });
      await navigator.clipboard.write([clipboardItem]);
      setCopiedTotal(true);
      setTimeout(() => setCopiedTotal(false), 1500);
    } catch (err) {
      // Fallback for browsers that don't support rich text clipboard
      navigator.clipboard.writeText(totalToCopy).then(() => {
        setCopiedTotal(true);
        setTimeout(() => setCopiedTotal(false), 1500);
      });
    }
  };

  const clearAll = () => {
    setTotalQty('');
    setTotalBoxes('');
    setAirBoxes('');
    setSeaBoxes('');
    setPasteValue('');
    setPastePlaceholder('Paste Row (Accepts Tabs or Multiple Spaces)');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="max-w-lg w-full bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100">
        <h3 className="text-2xl font-bold text-center text-slate-900 mb-6">
          Auto Calculator
          <span className="block text-sm font-medium text-slate-500 mt-1">(Smart Space Fix)</span>
        </h3>

        {/* Magic Paste Section */}
        <div className="bg-amber-50 border-2 border-dashed border-amber-400 p-5 rounded-xl mb-8 text-center transition-colors hover:bg-amber-100/50">
          <label className="font-bold text-amber-800 flex items-center justify-center gap-2 mb-3">
            <Zap className="w-5 h-5 fill-amber-500 text-amber-500" />
            Excel Row Yahan Paste Karein
            <Zap className="w-5 h-5 fill-amber-500 text-amber-500" />
          </label>
          <input
            type="text"
            value={pasteValue}
            onChange={(e) => setPasteValue(e.target.value)}
            onPaste={handlePaste}
            placeholder={pastePlaceholder}
            autoComplete="off"
            className="w-full sm:w-11/12 p-3 border border-amber-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white placeholder-amber-400/70 transition-all font-medium text-amber-900"
          />
          <div className="text-xs text-amber-700/70 mt-3 font-medium">
            Order: Total Qty &rarr; Total Boxes &rarr; Air Count &rarr; Sea Count
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
            <label className="font-semibold text-slate-600 text-sm pl-2">1. Total Quantity:</label>
            <input
              type="number"
              value={totalQty}
              onChange={(e) => setTotalQty(e.target.value)}
              className="w-1/3 sm:w-32 p-2 border border-slate-200 rounded-md text-base text-center font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
            <label className="font-semibold text-slate-600 text-sm pl-2">2. Total Boxes:</label>
            <input
              type="number"
              value={totalBoxes}
              onChange={(e) => setTotalBoxes(e.target.value)}
              className="w-1/3 sm:w-32 p-2 border border-slate-200 rounded-md text-base text-center font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex justify-between items-center bg-purple-50 p-2 rounded-lg border border-purple-100 shadow-sm mt-2">
            <label className="font-semibold text-purple-700 text-sm pl-2">Total (Qty &times; Boxes):</label>
            <div className="w-1/3 sm:w-auto flex items-center justify-end gap-1.5">
              <div className="w-full sm:w-32 border border-purple-200 rounded-md text-base text-center py-1.5 font-bold bg-white text-purple-800 font-mono">
                {format(tQty * tBoxes)}
              </div>
              <button
                onClick={handleCopyTotal}
                disabled={copiedTotal}
                className={`flex-shrink-0 p-1.5 sm:p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                  copiedTotal 
                    ? 'text-emerald-600 bg-emerald-100 border border-emerald-200' 
                    : 'text-purple-600 hover:bg-purple-100 border border-transparent shadow-sm bg-white'
                }`}
                title="Copy Total"
              >
                {copiedTotal ? <Check className="w-4 h-4 sm:w-4 sm:h-4" /> : <Copy className="w-4 h-4 sm:w-4 sm:h-4" />}
              </button>
            </div>
          </div>
          
          <div className="h-px bg-slate-200 my-6"></div>

          <div className="flex justify-between items-center bg-red-50/50 p-2 rounded-lg border border-red-100">
            <label className="font-semibold text-red-600 text-sm pl-2">3. Air Boxes Count:</label>
            <input
              type="number"
              value={airBoxes}
              onChange={(e) => setAirBoxes(e.target.value)}
              className="w-1/3 sm:w-32 p-2 border border-red-200 rounded-md text-base text-center font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-red-700"
            />
          </div>
          <div className="flex justify-between items-center bg-blue-50/50 p-2 rounded-lg border border-blue-100">
            <label className="font-semibold text-blue-600 text-sm pl-2">4. Sea Boxes Count:</label>
            <input
              type="number"
              value={seaBoxes}
              onChange={(e) => setSeaBoxes(e.target.value)}
              className="w-1/3 sm:w-32 p-2 border border-blue-200 rounded-md text-base text-center font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-blue-700"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-emerald-50 p-4 sm:p-5 mt-8 rounded-xl border border-emerald-200 shadow-sm">
          <div className="flex justify-between items-center mb-3 text-lg sm:text-xl font-bold text-red-600">
            <span>AIR QTY:</span>
            <span className="font-mono bg-white px-3 py-1 rounded-md shadow-sm border border-red-100">{formattedAirQty}</span>
          </div>
          <div className="flex justify-between items-center text-lg sm:text-xl font-bold text-blue-600">
            <span>SEA QTY:</span>
            <span className="font-mono bg-white px-3 py-1 rounded-md shadow-sm border border-blue-100">{formattedSeaQty}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8">
          <button
            onClick={handleCopy}
            disabled={copied}
            className={`w-full py-3.5 sm:py-4 flex items-center justify-center gap-2 rounded-xl text-white font-bold text-base sm:text-lg transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/30 ${
              copied 
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25' 
                : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 shadow-lg shadow-blue-600/30 active:translate-y-0'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                COPIED!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 sm:w-6 sm:h-6" />
                Copy Result for Excel
              </>
            )}
          </button>
          
          <div className="flex justify-center mt-5">
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer focus:outline-none"
            >
              <RefreshCw className="w-4 h-4" />
              Clear All Fields
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
