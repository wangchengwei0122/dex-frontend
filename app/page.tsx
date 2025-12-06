'use client';


import { useConnection } from 'wagmi'; 

export default function Home() {
  const { address } = useConnection();
  console.log(address);
  return (
    <div >
      {/* <ConnectButton />
      {address && <div>Address: {address}</div>} */}
    </div>
  );
}
