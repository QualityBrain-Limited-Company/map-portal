"use client";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  ChangeEvent,
  useRef,
} from "react";
import { useMap } from "react-leaflet";
import tambonData from "@/app/data/tambon.json";
// ต้องติดตั้ง leaflet ให้เรียบร้อยแล้ว
import L from "leaflet";

export default function TambonSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null); // ref สำหรับ container

  // ดึง map instance เพื่อใช้คำสั่ง zoom
  const map = useMap();

  // เตรียมข้อมูลตำบลทั้งหมดจาก tambon.json
  const allTambons = tambonData.data;

  // เมื่อ component mount ให้ disable click propagation บน container
  useEffect(() => {
    if (containerRef.current) {
      // ปิดการกระจายอีเวนต์ click และ scroll จาก container นี้
      L.DomEvent.disableClickPropagation(containerRef.current);
      L.DomEvent.disableScrollPropagation(containerRef.current);
    }
  }, []);

  // Debounce effect: อัปเดต debouncedSearchTerm หลังจาก searchTerm คงที่ 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // ฟังก์ชัน filter รายการตาม debouncedSearchTerm
  const filteredTambons = useMemo(() => {
    if (!debouncedSearchTerm) return [];

    const lowerTerm = debouncedSearchTerm.toLowerCase();
    return allTambons.filter((item: any) => {
      const tambonName = item.TAMBON_T?.toLowerCase() || "";
      const amphoeName = item.AMPHOE_T?.toLowerCase() || "";
      const changwatName = item.CHANGWAT_T?.toLowerCase() || "";
      return (
        tambonName.includes(lowerTerm) ||
        amphoeName.includes(lowerTerm) ||
        changwatName.includes(lowerTerm)
      );
    });
  }, [debouncedSearchTerm, allTambons]);

  // handleInputChange
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // เมื่อคลิกรายการตำบลใน list -> ซูมแผนที่ไปตำแหน่งนั้น
  const handleSelectTambon = useCallback(
    (item: any) => {
      const lat = item.LAT;
      const lng = item.LONG;

      // กำหนดระดับซูมตามต้องการ เช่น 14
      map.setView([lat, lng], 14);

      // เคลียร์ช่อง search
      setSearchTerm("");
      setDebouncedSearchTerm("");
    },
    [map]
  );

  return (
    <div
      ref={containerRef} // ครอบด้วย div ที่เราจะ disable propagation
      className="relative w-full max-w-sm"
    >
      {/* ช่องค้นหา */}
      <input
        type="text"
        className="w-full px-4 py-2 border rounded-md"
        placeholder="ค้นหาตำบล, อำเภอ หรือจังหวัด..."
        value={searchTerm}
        onChange={handleInputChange}
      />

      {/* แสดงรายการที่กรองได้ (ถ้ามีค่าใน debouncedSearchTerm) */}
      {debouncedSearchTerm && filteredTambons.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
          {filteredTambons.map((item: any, index: number) => (
            <li
              key={`${item.TAMBON_T}-${index}`}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectTambon(item)}
            >
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
      {debouncedSearchTerm && filteredTambons.length === 0 && (
        <div className="absolute z-10 w-full bg-white border rounded-md mt-1 p-3 text-gray-500">
          ไม่พบข้อมูล
        </div>
      )}
    </div>
  );
}
