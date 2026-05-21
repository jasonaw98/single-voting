'use client'
import {useVisitorData} from '@fingerprint/react'

export default function Home() {
  const {isLoading, error, data, getData} = useVisitorData(
    {immediate: false}
  )

  return (
    <div>
      <button onClick={() => getData()} className='bg-blue-500 text-white p-2 rounded-md'>
        Reload data
      </button>
      <p>VisitorId: {isLoading ? 'Loading...' : data?.visitor_id}</p>
      <p>Full visitor data:</p>
      <pre>{error ? error.message : JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}