// app/utils/colorGenerator.ts
// ชุดสีที่มีความนิยมและทันสมัย

const COLOR_PALETTE = [
    '#3B82F6', // blue-500 (Modern blue)
    '#9333EA', // purple-500 (Modern purple)
    '#10B981', // emerald-500 (Fresh green)
    '#F59E0B', // yellow-400 (Bright yellow)
    '#EC4899', // pink-500 (Vibrant pink)
    '#6B7280', // gray-600 (Neutral gray)
    '#D1D5DB', // gray-300 (Light gray)
    '#F43F5E', // rose-500 (Modern rose)
    '#6366F1', // indigo-500 (Elegant indigo)
    '#34D399', // teal-400 (Calming teal)
    '#EAB308', // amber-500 (Amber yellow)
    '#F97316', // orange-600 (Vivid orange)
    '#EF4444', // red-500 (Bright red)
    '#8B5CF6', // violet-500 (Vibrant violet)
    '#3B82F6', // sky-500 (Sky blue)
    '#F472B6', // pink-400 (Soft pink)
  ];
  
  export interface CategoryColorScheme {
    id: number;
    primary: string;
    light: string;
    dark: string;
    text: string;
  }
  
  /**
   * สร้างสีสำหรับหมวดหมู่โดยอัตโนมัติจาก ID
   * @param id ID ของหมวดหมู่
   * @returns ชุดสีสำหรับหมวดหมู่
   */
  export function getCategoryColor(id: number): CategoryColorScheme {
    // กำหนดสีจาก COLOR_PALETTE ตาม ID (วนกลับเมื่อ ID มากกว่าจำนวนสีที่มี)
    const colorIndex = (id - 1) % COLOR_PALETTE.length;
    const primary = COLOR_PALETTE[colorIndex];
    
    // สร้างสีอ่อนและสีเข้มโดยอัตโนมัติ
    return {
      id,
      primary,
      light: `${primary}20`, // เพิ่มความโปร่งใส 20%
      dark: primary,
      text: primary,
    };
  }
  
  /**
   * สร้างสีสำหรับหมวดหมู่โดยอัตโนมัติจากชื่อ (ใช้ในกรณีที่ไม่มี ID)
   * @param name ชื่อของหมวดหมู่
   * @returns ชุดสีสำหรับหมวดหมู่
   */
  export function generateColorByName(name: string): CategoryColorScheme {
    // คำนวณค่า hash จากชื่อ
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // ใช้ค่า hash เพื่อเลือกสีจาก COLOR_PALETTE
    const colorIndex = Math.abs(hash) % COLOR_PALETTE.length;
    const primary = COLOR_PALETTE[colorIndex];
    
    return {
      id: colorIndex + 1,
      primary,
      light: `${primary}20`,
      dark: primary,
      text: primary,
    };
  }
  
  // app/utils/colorGenerator.ts
  
  export const THAILAND_BOUNDS = {
    center: [13.736717, 100.523186] as [number, number], 
    zoom: 6,
    minZoom: 5,
    maxZoom: 18,
    bounds: [
      [6.0, 97.0] as [number, number], 
      [20.0, 106.5] as [number, number], 
    ] as [[number, number], [number, number]], 
  };
  