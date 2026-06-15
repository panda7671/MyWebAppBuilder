'use client'

interface DeleteConfirmModalProps {
  projectName: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmModal({
  projectName,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-base font-semibold text-gray-900 mb-2">프로젝트 삭제</h2>
        <p className="text-sm text-gray-500 mb-6">
          <span className="font-medium text-gray-700">"{projectName}"</span>을 삭제할까요?
          <br />이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}
