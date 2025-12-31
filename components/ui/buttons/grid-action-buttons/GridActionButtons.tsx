import { Eye, FilePenLine, RotateCw, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React, { Suspense } from 'react'

import { themeColors } from '@/theme'
import { GridActionButtonsProps } from '@/types/ui/buttons'

const PendingSpinner = () => (
  <div
    className="flex items-center justify-center w-8 h-8 rounded-md mr-2"
    style={{ backgroundColor: '#eab308' }}
    title="Pending"
  >
    <div className="relative w-4 h-4">
      <div className="absolute top-0 left-0 w-full h-full border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
)

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

  return (
    <Suspense
      fallback={
        <div className="text-sm" style={{ color: themeColors.text.muted }}>
          Loading...
        </div>
      }
    >
      <div
        id="event_trigger"
        className="flex flex-row flex-nowrap items-center justify-start min-w-max"
      >
        {isPending && <PendingSpinner />}
        {retryPermission && (
          <button
            type="button"
            onClick={() => {
              if (typeof retryResourceId === 'function') {
                retryResourceId(data[from])
              }
            }}
            className="flex items-center justify-center w-8 h-8 rounded-md text-white transition mr-2"
            style={{ backgroundColor: themeColors.blue[600], cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.blue[700])}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.blue[600])}
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
            className="flex items-center justify-center w-8 h-8 rounded-md text-white transition mr-2"
            style={{ backgroundColor: '#0ea5e9' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0284c7')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0ea5e9')}
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
            className="flex items-center justify-center w-8 h-8 rounded-md text-white transition mr-2"
            style={{ backgroundColor: '#22c55e' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#16a34a')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#22c55e')}
            title="Edit"
          >
            <FilePenLine size={18} />
          </Link>
        )}

        {deletePermission && (
          <button
            type="button"
            onClick={() => {
              const oldModal = document.getElementById('kt_modal_1')
              if (oldModal) oldModal.classList.remove('hidden')

              if (typeof deleteResourceId === 'function') {
                deleteResourceId(data[from])
              }
            }}
            className="flex items-center justify-center w-8 h-8 rounded-md text-white transition mr-3"
            style={{ backgroundColor: themeColors.red[600], cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.red[700])}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.red[600])}
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
