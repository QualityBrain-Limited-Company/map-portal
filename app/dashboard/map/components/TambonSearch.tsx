"use client";

import { useState, useMemo, ChangeEvent } from "react";
import tambonData from "@/app/data/tambon.json"; // path ที่อ้างไปยังไฟล์ tambon.json
import { LocationData } from "@/app/types/document";
import { toast } from "react-hot-toast";

interface TambonSearchProps {
  onSelectLocation: (location: LocationData) => void;
}

/**
 * คอมโพเนนต์สำหรับค้นหาตำบล (ใช้ข้อมูลจาก tambon.json)
 * เมื่อเลือกผลลัพธ์จะเรียก reverse-geocode แล้วส่งข้อมูลกลับไปยัง parent
 */
export default function TambonSearch({ onSelectLocation }: TambonSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // เตรียมข้อมูลตำบลทั้งหมดจาก tambon.json
  // tambonData.data เป็น array ของทุกตำบล (ดูตัวอย่างใน tambon.json)
  // เช่น { TAMBON_T, AMPHOE_T, CHANGWAT_T, LAT, LONG, ... }
  const allTambons = tambonData.data;

  // ฟังก์ชัน filter รายการตาม searchTerm
  const filteredTambons = useMemo(() => {
    if (!searchTerm) return [];

    // ทำเป็นตัวพิมพ์เล็กเพื่อเทียบได้ง่าย
    const lowerTerm = searchTerm.toLowerCase();

    // กรองเฉพาะข้อมูลที่ชื่อ ตำบล/อำเภอ/จังหวัด มีคำที่สอดคล้อง
    return allTambons.filter((item) => {
      const tambonName = item.TAMBON_T?.toLowerCase() || "";
      const amphoeName = item.AMPHOE_T?.toLowerCase() || "";
      const changwatName = item.CHANGWAT_T?.toLowerCase() || "";
      return (
        tambonName.includes(lowerTerm) ||
        amphoeName.includes(lowerTerm) ||
        changwatName.includes(lowerTerm)
      );
    });
  }, [searchTerm, allTambons]);

  // เมื่อผู้ใช้พิมพ์ใน input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // เมื่อคลิกรายการใด ๆ ใน list
  const handleSelectTambon = async (item: any) => {
    const lat = item.LAT;
    const lng = item.LONG;

    try {
      // แจ้งเตือนว่ากำลังโหลด
      setIsLoading(true);
      toast.loading("กำลังดึงข้อมูลที่อยู่...", { id: "location-fetch" });

      // เรียก reverse-geocode ด้วย lat,lng ของตำบลที่เลือก
      const response = await fetch(
        `/api/gistda/reverse-geocode?lat=${lat}&lng=${lng}`
      );
      if (!response.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลที่อยู่ได้");
      }

      const addressData = await response.json();
      toast.dismiss("location-fetch");
      toast.success("ดึงข้อมูลสำเร็จ");

      // ส่งข้อมูลตำแหน่งกลับไปยัง parent
      onSelectLocation({
        lat,
        lng,
        province: addressData.province,
        amphoe: addressData.district,
        district: addressData.subdistrict,
        geocode: addressData.geocode || 0,
      });

      // เคลียร์ search
      setSearchTerm("");
    } catch (error) {
      console.error(error);
      toast.dismiss("location-fetch");
      toast.error("ไม่สามารถดึงข้อมูลที่อยู่ได้ กรุณาลองใหม่");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-sm">
      {/* ช่องค้นหา */}
      <input
        type="text"
        className="w-full px-4 py-2 border rounded-md"
        placeholder="ค้นหาตำบล, อำเภอ หรือจังหวัด..."
        value={searchTerm}
        onChange={handleInputChange}
      />

      {/* แสดงรายการที่กรองได้ (ถ้าพิมพ์ >= 1 ตัวอักษร) */}
      {searchTerm && filteredTambons.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
          {filteredTambons.map((item, index) => (
            <li
              key={`${item.TAMBON_T}-${index}`}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectTambon(item)}
            >
              {/* แสดงชื่อ ตำบล / อำเภอ / จังหวัด */}
              <span className="font-medium text-gray-700">
                {item.TAMBON_T || "ไม่ทราบชื่อตำบล"}
              </span>
              {item.AMPHOE_T && (
                <span className="text-gray-600">, {item.AMPHOE_T}</span>
              )}
              {item.CHANGWAT_T && (
                <span className="text-gray-500">, {item.CHANGWAT_T}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* กรณีค้นหาแล้วไม่เจอตำบล */}
      {searchTerm && filteredTambons.length === 0 && !isLoading && (
        <div className="absolute z-10 w-full bg-white border rounded-md mt-1 p-3 text-gray-500">
          ไม่พบข้อมูล
        </div>
      )}
    </div>
  );
}
