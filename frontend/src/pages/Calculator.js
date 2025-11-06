// frontend/src/pages/Calculator.js
import React, { useState } from 'react';

const calcLogistics = (volume, coeff) => {
  if (volume >= 1) {
    const roundedVolume = Math.ceil(volume);
    const base = 0.46 * coeff;
    const additional = (roundedVolume - 1) * (0.14 * coeff);
    return base + additional;
  } else if (volume > 0.8) return 0.32 * coeff;
  else if (volume > 0.6) return 0.30 * coeff;
  else if (volume > 0.4) return 0.29 * coeff;
  else if (volume > 0.2) return 0.26 * coeff;
  else if (volume >= 0.001) return 0.23 * coeff;
  else return 0;
};

const format = (n) => {
  return isFinite(n) ? n.toFixed(2) : "—";
};

const Calculator = () => {
  const [inputs, setInputs] = useState({
    purchase: 835,
    profit: 230,
    len: 30,
    wid: 28,
    hei: 9,
    commission: 25,
    acquiring: 3,
    tax: 8,
    adsPct: 10,
    logiCoeff: 400,
    returnCost: 50,
    buyout: 90,
    storage: 12,
  });

  const [results, setResults] = useState({
    volume: "—",
    logistics: "—",
    logisticsTotal: "—",
    clientPrice: "—",
    adsVal: "—",
    commissionVal: "—",
    acquiringVal: "—",
    taxVal: "—",
    storageVal: "—",
    finalCost: "—",
    profitVal: "—",
    margin: "—",
  });

  const [adsWarning, setAdsWarning] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Number(value);
    setInputs(prev => ({
      ...prev,
      [name]: isNaN(numericValue) ? 0 : numericValue
    }));
    e.target.value = isNaN(numericValue) ? "0" : String(numericValue);
  };

  const performCalculation = () => {
    const { purchase, profit, len, wid, hei, commission, acquiring, tax, logiCoeff, returnCost, buyout, storage } = inputs;
    let { adsPct } = inputs;

    let warningText = "";
    if (adsPct > 59.99) {
      adsPct = 59.99;
      warningText = "⚠️ Фига ты Маркетолог! Пересчитай рекламу)))";
    }
    setAdsWarning(warningText);

    const volumeLiters = (len * wid * hei) / 1000;
    const logistics = calcLogistics(volumeLiters, logiCoeff);
    const logisticsTotal = (logistics + (1 - buyout / 100) * returnCost) / (buyout / 100);
    const baseCost = purchase + logisticsTotal + storage;

    const p = (commission + acquiring + tax) / 100;
    const k = adsPct / 100;
    const totalPerc = p + k;
    if (1 - totalPerc <= 0) {
      setResults(prev => ({
        ...prev,
        clientPrice: "Ошибка: проценты >= 100%",
        volume: format(volumeLiters),
        logistics: format(logistics),
        logisticsTotal: format(logisticsTotal),
      }));
      return;
    }
    const clientPrice = (baseCost + profit) / (1 - totalPerc);
    const adsRub = clientPrice * k;
    const commRub = clientPrice * commission / 100;
    const acqRub = clientPrice * acquiring / 100;
    const taxRub = clientPrice * tax / 100;
    const finalCost = baseCost + commRub + acqRub + taxRub + adsRub;
    const pureProfit = clientPrice - finalCost;
    const marginPct = (pureProfit / clientPrice) * 100;

    setResults({
      volume: format(volumeLiters),
      logistics: format(logistics),
      logisticsTotal: format(logisticsTotal),
      clientPrice: format(clientPrice),
      adsVal: format(adsRub),
      commissionVal: format(commRub),
      acquiringVal: format(acqRub),
      taxVal: format(taxRub),
      storageVal: format(storage),
      finalCost: format(finalCost),
      profitVal: format(pureProfit),
      margin: format(marginPct),
    });
  };

  const handleCalculateClick = (e) => {
    e.preventDefault();
    performCalculation();
  };

  const handleResetClick = () => {
    setInputs({
      purchase: 0,
      profit: 0,
      len: 0,
      wid: 0,
      hei: 0,
      commission: 0,
      acquiring: 0,
      tax: 0,
      adsPct: 0,
      logiCoeff: 0,
      returnCost: 0,
      buyout: 0,
      storage: 0,
    });
    setResults({
      volume: "—",
      logistics: "—",
      logisticsTotal: "—",
      clientPrice: "—",
      adsVal: "—",
      commissionVal: "—",
      acquiringVal: "—",
      taxVal: "—",
      storageVal: "—",
      finalCost: "—",
      profitVal: "—",
      margin: "—",
    });
    setAdsWarning("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-wb-accent-alt">Калькулятор юнит-экономики</h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* --- Левая колонка: ввод --- */}
        <div className="bg-wb-box p-6 rounded-xl shadow-lg w-full md:w-1/2">
          <h3 className="text-xl mb-4 text-wb-accent-alt">Ввод данных</h3>

          {/* --- блоки ввода --- */}
          {/* ... (оставляем без изменений, как у тебя) ... */}

          <div className="flex gap-4">
            <button
              onClick={handleCalculateClick}
              className="flex-1 px-4 py-2 bg-wb-accent text-white font-semibold rounded-lg shadow-md hover:bg-[#8a3fd9] focus:outline-none focus:ring-2 focus:ring-wb-accent focus:ring-opacity-50 transition duration-300"
            >
              Рассчитать
            </button>
            <button
              onClick={handleResetClick}
              className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
            >
              Сбросить
            </button>
          </div>
        </div>

        {/* --- Правая колонка: результаты --- */}
        <div className="bg-wb-box p-6 rounded-xl shadow-lg w-full md:w-1/2">
          <h3 className="text-xl mb-4 text-wb-accent-alt">Результаты</h3>

          {/* --- Главные результаты --- */}
          <div className="mb-4 p-4 rounded-lg bg-[#1f1f27] border border-wb-accent/40 shadow-inner text-center">
            <div className="mb-2">
              <span className="block text-sm text-gray-400">Цена клиента, ₽</span>
              <span className="text-3xl font-bold text-wb-accent-alt">{results.clientPrice}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-400">Прибыль (на ед.), ₽</span>
              <span className="text-2xl font-bold text-green-400">{results.profitVal}</span>
            </div>
          </div>

          {/* --- Остальные результаты --- */}
          <div className="space-y-2">
            <div className="flex justify-between border-b border-gray-700 pb-1">
              <span>Объём (л):</span>
              <span className="text-wb-accent-alt font-medium">{results.volume}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-1">
              <span>Логистика, ₽:</span>
              <span className="text-wb-accent-alt font-medium">{results.logistics}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-1">
              <span>Логистика итого, ₽:</span>
              <span className="text-wb-accent-alt font-medium">{results.logisticsTotal}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-1">
              <span>Реклама, ₽:</span>
              <span className="text-wb-accent-alt font-medium">{results.adsVal}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-1">
              <span>Комиссия WB, ₽:</span>
              <span className="text-wb-accent-alt font-medium">{results.commissionVal}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-1">
              <span>Эквайринг, ₽:</span>
              <span className="text-wb-accent-alt font-medium">{results.acquiringVal}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-1">
              <span>Налог, ₽:</span>
              <span className="text-wb-accent-alt font-medium">{results.taxVal}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-1">
              <span>Хранение, ₽:</span>
              <span className="text-wb-accent-alt font-medium">{results.storageVal}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-1">
              <span>Финальная себестоимость, ₽:</span>
              <span className="text-wb-accent-alt font-medium">{results.finalCost}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-1">
              <span>Маржинальность, %:</span>
              <span className="text-wb-accent-alt font-medium">{results.margin}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
