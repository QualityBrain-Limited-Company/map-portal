// app/dashboard/map/components/LocationMarker.tsx
'use client'

import { useState, useEffect } from 'react'
import { useMap, CircleMarker, Popup } from 'react-leaflet'
import { LocationData } from '@/app/types/document'
import { getLocationAddress } from '@/app/lib/gistda'
import { toast } from 'react-hot-toast'

interface LocationMarkerProps {
  onSelectLocation: (location: LocationData) => void;
}

export default function LocationMarker({ onSelectLocation }: LocationMarkerProps) {
  const [position, setPosition] = useState<[number, number] | null>(null)
  const map = useMap()

  useEffect(() => {
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng

      // ตรวจสอบพื้นที่ประเทศไทย
      if (lat < 5.613038 || lat > 20.465143 || lng < 97.343396 || lng > 105.639389) {
        toast.error('กรุณาเลือกตำแหน่งในประเทศไทย')
        return
      }

      setPosition([lat, lng])

      try {
        const address = await getLocationAddress(lat, lng)
        onSelectLocation({
          lat,
          lng,
          province: address.province,
          amphoe: address.district,
          district: address.subdistrict,
          geocode: address.geocode
        })
      } catch (error) {
        console.error('Location error:', error)
        toast.error('ไม่สามารถดึงข้อมูลที่อยู่ได้ กรุณาลองใหม่')
        setPosition(null)
      }
    })

    return () => {
      map.off('click')
    }
  }, [map, onSelectLocation])

  return position ? (
    <CircleMarker 
      center={position}
      pathOptions={{ 
        fillColor: '#f97316',
        fillOpacity: 0.7,
        color: 'white',
        weight: 2
      }}
      radius={8}
    >
      <Popup>
        <div className="text-center">
          <p>กำลังโหลดข้อมูล...</p>
          <p className="text-sm text-gray-500">
            พิกัด: {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </p>
        </div>
      </Popup>
    </CircleMarker>
  ) : null
}