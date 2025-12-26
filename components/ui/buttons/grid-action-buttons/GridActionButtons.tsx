import { Eye, FilePenLine, RotateCw, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React, { Suspense } from 'react'

export interface GridActionButtonsProps {
  data: Record<string, any>
  from?: string
  editBtnPath?: string
  showBtnPath?: string
  deleteResourceId?: (id: string | number) => void
  retryResourceId?: (id: string | number) => void
  showIdDispatch?: (id: string | number | null) => void
  editIdDispatch?: (id: string | number | null) => void
  editDrawerId?: string
  showDrawerId?: string
  viewPermission?: boolean
  updatePermission?: boolean
  deletePermission?: boolean
  retryPermission?: boolean
  isUser?: boolean
  isPending?: boolean
}

const GridActionButtons: React.FC<GridActionButtonsProps> = ({
  data,
  from = 'uuid',
  editBtnPath,
  showBtnPath,
  deleteResourceId,
  retryResourceId,
  showIdDispatch,
  editIdDispatch,
  editDrawerId,
  showDrawerId,
  viewPermission,
  updatePermission,
  deletePermission,
  retryPermission,
  isUser,
  isPending,
}) => {
  const handleShowClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!showBtnPath) e.preventDefault()
    editIdDispatch && editIdDispatch(null)
    showIdDispatch && showIdDispatch(data[from])
    const el = document.getElementById('kt_insurancedetail')
    const Drawer = window.KTDrawer
    if (el && Drawer) {
      const inst = Drawer.getInstance(el) || Drawer.createInstance(el)
      inst.show()
    }
  }

  const handleEditClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!editBtnPath) e.preventDefault()
    showIdDispatch && showIdDispatch(null)
    editIdDispatch && editIdDispatch(data[from])
    const el = document.getElementById('kt_insurance')
    const Drawer = window.KTDrawer
    if (el && Drawer) {
      const inst = Drawer.getInstance(el) || Drawer.createInstance(el)
      inst.show()
    }
  }

  const PendingSpinner = () => (
    <div
      className="flex items-center justify-center w-8 h-8 rounded-md bg-yellow-500 mr-2"
      title="Pending"
    >
      <div className="relative w-4 h-4">
        <div className="absolute top-0 left-0 w-full h-full border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )

  return (
    <Suspense fallback={<div className="text-gray-500 text-sm">Loading...</div>}>
      <div
        id="event_trigger"
        className="flex flex-row flex-nowrap items-center justify-start min-w-max"
      >
        {isPending && <PendingSpinner />}
        {retryPermission && (
          <button
            type="button"
            style={{ cursor: 'pointer', backgroundColor: '#3b82f6' }}
            onClick={() => {
              if (typeof retryResourceId === 'function') {
                retryResourceId(data[from])
              }
            }}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition mr-2"
            title="Retry"
          >
            <RotateCw size={18} />
          </button>
        )}

        {viewPermission && (
          <Link
            href={showBtnPath || '#'}
            id={showBtnPath ? undefined : showDrawerId}
            onClick={!isUser ? handleShowClick : undefined}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-sky-500 hover:bg-sky-600 text-white transition mr-2"
            title="View"
          >
            <Eye size={18} />
          </Link>
        )}

        {updatePermission && (
          <Link
            href={editBtnPath || '#'}
            id={editBtnPath ? undefined : editDrawerId}
            onClick={handleEditClick}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-green-500 hover:bg-green-600 text-white transition mr-2"
            title="Edit"
          >
            <FilePenLine size={18} />
          </Link>
        )}

        {deletePermission && (
          <button
            type="button"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              const oldModal = document.getElementById('kt_modal_1')
              if (oldModal) oldModal.classList.remove('hidden')

              if (typeof deleteResourceId === 'function') {
                deleteResourceId(data[from])
              }
            }}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-red-500 hover:bg-red-600 text-white transition mr-3"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </Suspense>
  )
}

export default React.memo(GridActionButtons)
