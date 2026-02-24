"use client"

import { useState } from 'react';
import HousePricePredictor from '@/components/HousePricePredictor';
import SplashScreen from '@/components/SplashScreen';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <main>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <HousePricePredictor />
      )}
    </main>
  );
}
