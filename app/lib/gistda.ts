// app/lib/gistda.ts
import axios from 'axios'

interface GistdaAddress {
  geocode: number;
  province: string;
  district: string;
  subdistrict: string;
}

export async function getLocationAddress(lat: number, lng: number): Promise<GistdaAddress> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GISTDA_API_KEY
    // แก้ไข URL และ parameters ให้ถูกต้องตามเอกสาร API
    const url = 'https://api.sphere.gistda.or.th/services/geo/address'
    
    // Add debug logs
    console.log('Making request with params:', {
      lat,
      lng,
      apiKey: apiKey?.substring(0, 8) + '...' // แสดงบางส่วนของ API key เพื่อความปลอดภัย
    })

    const response = await axios.get(url, {
      params: {
        lat: lat.toFixed(6),    // ส่งค่าพิกัดแบบมีทศนิยม 6 ตำแหน่ง
        lon: lng.toFixed(6),    // ใช้ lon แทน lng ตามที่ API ต้องการ
        local: 't',             // ต้องการภาษาไทย
        key: apiKey             // API key จาก environment variable
      },
      headers: {
        'Accept': 'application/json'
      }
    })

    console.log('GISTDA API Response:', response.data)

    // ตรวจสอบข้อมูลที่ได้รับ
    if (!response.data || !response.data.province) {
      throw new Error('Invalid response from GISTDA API')
    }

    return {
      geocode: response.data.geocode || 0,
      province: response.data.province,
      district: response.data.district,
      subdistrict: response.data.subdistrict
    }

  } catch (error) {
    console.error('GISTDA API Error:', error)
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data)
      console.error('Request config:', error.config)
    }
    throw new Error('ไม่สามารถดึงข้อมูลที่อยู่ได้')
  }
}