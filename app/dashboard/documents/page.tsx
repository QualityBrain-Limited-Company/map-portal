// app/dashboard/documents/page.tsx
import prisma from "@/app/lib/db";
import DocumentList from "../components/documents/DocumentList";
import { DocumentWithCategory } from "@/app/types/document";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { deleteFile } from "@/app/lib/upload";

export default async function DocumentsPage() {
  // ดึงข้อมูลจาก database ในระดับ server component
  let documents: DocumentWithCategory[] = [];
  try {
    documents = await prisma.document.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }) as DocumentWithCategory[];
  } catch (error) {
    console.error("Error fetching documents:", error);
    // กรณีเกิดข้อผิดพลาดจะใช้ array ว่าง
  }

  // แปลงข้อมูลวันที่ให้เป็น string เพื่อส่งไปยัง client component
  const serializedDocuments = documents.map((doc) => ({
    ...doc,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  }));

  // Server Action สำหรับการลบเอกสาร
  async function deleteDocument(id: string) {
    "use server";
    try {
      // ดึงข้อมูลเอกสารที่จะลบเพื่อเก็บข้อมูล path ไฟล์
      const document = await prisma.document.findUnique({
        where: { id: parseInt(id) },
        select: { filePath: true, coverImage: true }
      });

      if (!document) {
        return { success: false, error: "ไม่พบเอกสารที่ต้องการลบ" };
      }

      // ลบเอกสารจากฐานข้อมูล
      await prisma.document.delete({
        where: { id: parseInt(id) },
      });

      // ลบไฟล์เอกสารและรูปภาพที่เกี่ยวข้อง
      try {
        if (document.filePath) {
          await deleteFile(document.filePath);
        }
        if (document.coverImage) {
          await deleteFile(document.coverImage);
        }
      } catch (fileError) {
        console.error('Error deleting files:', fileError);
        // ไม่ throw error ในกรณีนี้ เพราะข้อมูลในฐานข้อมูลถูกลบไปแล้ว
      }

      // revalidate เพื่อให้หน้าเว็บแสดงข้อมูลล่าสุด
      revalidatePath("/dashboard/documents");
      return { success: true };
    } catch (error) {
      console.error("Error deleting document:", error);
      return { success: false, error: "ไม่สามารถลบเอกสารได้" };
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">เอกสารทั้งหมด</h1>
            <p className="text-gray-600 mt-1">
              จัดการเอกสารและข้อมูลในระบบ
            </p>
          </div>
          <Link
            href="/dashboard/documents/new"
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors w-full sm:w-auto justify-center sm:justify-start"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            เพิ่มเอกสารใหม่
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-gray-500">เอกสารทั้งหมด</div>
            <div className="text-2xl font-semibold">{documents.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-gray-500">เอกสารที่เผยแพร่</div>
            <div className="text-2xl font-semibold">
              {documents.filter(doc => doc.isPublished).length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-gray-500">เอกสารที่ไม่เผยแพร่</div>
            <div className="text-2xl font-semibold">
              {documents.filter(doc => !doc.isPublished).length}
            </div>
          </div>
        </div>
      </div>

      {/* Document List Section */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        {serializedDocuments.length > 0 ? (
          <DocumentList 
            documents={serializedDocuments} 
            deleteAction={deleteDocument}
          />
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">ยังไม่มีเอกสารในระบบ</p>
            <Link
              href="/dashboard/documents/new"
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              เพิ่มเอกสารใหม่
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ทำให้เว็บไซต์โหลดข้อมูลใหม่เสมอ ไม่ใช้ cache
export const dynamic = "force-dynamic";