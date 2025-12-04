'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { useConnection } from 'wagmi'; 

export default function Home() {
  const { address } = useConnection();
  return (
    <div >
      <ConnectButton />
      {address && <div>Address: {address}</div>}
    </div>
  );
}
