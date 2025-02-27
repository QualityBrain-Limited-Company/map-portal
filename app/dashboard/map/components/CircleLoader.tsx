// app/dashboard/map/components/CircleLoader.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface CircleLoaderProps {
  size?: string;
  thickness?: string;
  color?: string;
  duration?: number;
  message?: string;
  containerClassName?: string;
}

export default function CircleLoader({
  size = '60px',
  thickness = '6px',
  color = '#F97316', // สีส้ม (orange-500)
  duration = 1,
  message,
  containerClassName = "h-full w-full flex items-center justify-center"
}: CircleLoaderProps) {
  return (
    <div className={containerClassName}>
      <div className="flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            duration,
            repeat: Infinity, 
            ease: "linear"
          }}
          style={{
            width: size,
            height: size,
            border: `${thickness} solid transparent`,
            borderTopColor: color,
            borderRadius: '50%'
          }}
        />
        
        {message && (
          <p className="mt-4 text-slate-600">{message}</p>
        )}
      </div>
    </div>
  );
}