// app/map/components/documents/DocumentList.tsx
'use client'

import { DocumentWithCategory } from '@/app/types/document';
import DocumentCard from './DocumentCard'

interface DocumentListProps {
  documents: DocumentWithCategory[];
  selectedCategory: number | null;
}

export default function DocumentList({ documents, selectedCategory }: DocumentListProps) {
  const filteredDocuments = selectedCategory 
    ? documents.filter(doc => doc.categoryId === selectedCategory)
    : documents;

  if (filteredDocuments.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg text-center">
        <p className="text-gray-500">ไม่พบเอกสารในหมวดหมู่ที่เลือก</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg space-y-4">
      <h3 className="text-sm font-semibold">เอกสารทั้งหมด ({filteredDocuments.length})</h3>
      <div className="space-y-4">
        {filteredDocuments.map(doc => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>
    </div>
  )
}