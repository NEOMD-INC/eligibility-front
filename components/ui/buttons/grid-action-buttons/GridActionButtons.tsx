import React, { Suspense } from 'react'
import Link from 'next/link'
import { Eye, FilePenLine, Trash2 } from 'lucide-react'

const GridActionButtons = ({
  data,
  from = 'uuid',

  editBtnPath,
  showBtnPath,
  deleteResourceId,

  showIdDispatch,
  editIdDispatch,

  editDrawerId,
  showDrawerId,

  viewPermission,
  updatePermission,
  deletePermission,

  isUser,
}) => {
  const handleShowClick = e => {
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

  const handleEditClick = e => {
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
    <Suspense fallback={<div className="text-gray-500 text-sm">Loading...</div>}>
      <div
        id="event_trigger"
        className="flex flex-row flex-nowrap items-center justify-start min-w-max"
      >
        {/* View */}
        {viewPermission && (
          <Link
            href={showBtnPath || '#'}
            id={showBtnPath ? undefined : showDrawerId}
            onClick={!isUser ? handleShowClick : undefined}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-sky-500 hover:bg-sky-600 text-white transition mr-2"
          >
            <Eye size={18} />
          </Link>
        )}

        {/* Edit */}
        {updatePermission && (
          <Link
            href={editBtnPath || '#'}
            id={editBtnPath ? undefined : editDrawerId}
            onClick={handleEditClick}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-green-500 hover:bg-green-600 text-white transition mr-2"
          >
            <FilePenLine size={18} />
          </Link>
        )}

        {/* Delete */}
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
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </Suspense>
  )
}

export default React.memo(GridActionButtons)
