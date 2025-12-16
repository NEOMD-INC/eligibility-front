type Props = {
  title: string
  value: string
  used: number
  total: number
  footer?: string
  additionalInfo?: {
    timePeriod?: string
    notes?: string
  }
}

export default function ProgressCard({ title, value, used, total, footer, additionalInfo }: Props) {
  const percentage = Math.min(Math.round((used / total) * 100), 100)
  const remaining = total - used

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gray-100 px-6 py-3 border-b border-gray-300">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-6">
        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr>
              <td className="text-gray-700 font-semibold py-2 pr-4 align-top w-32">Individual</td>
              <td className="text-gray-900 py-2">
                <div className="text-lg font-bold mb-3">{value}</div>
              </td>
            </tr>
            <tr>
              <td className="text-gray-700 font-semibold py-2 pr-4 align-top w-32"></td>
              <td className="text-gray-900 py-2">
                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-700">
                    ${used.toLocaleString()} used of ${total.toLocaleString()}
                  </p>
                </div>
              </td>
            </tr>
            {footer && (
              <tr>
                <td className="text-gray-700 font-semibold py-2 pr-4 align-top w-32"></td>
                <td className="text-gray-600 py-2 text-xs">{footer}</td>
              </tr>
            )}
          </tbody>
        </table>

        {additionalInfo && (additionalInfo.timePeriod || additionalInfo.notes) && (
          <div className="mt-5 pt-4 border-t border-gray-300">
            <p className="text-xs font-semibold text-gray-800 mb-3">Additional Information</p>
            <table className="w-full text-xs border-collapse border border-gray-300">
              <tbody>
                {additionalInfo.timePeriod && (
                  <tr className="border-b border-gray-300">
                    <td className="text-gray-700 font-semibold py-2 px-3 align-top w-32 border-r border-gray-300 bg-gray-50">
                      Time Period
                    </td>
                    <td className="text-gray-900 py-2 px-3">{additionalInfo.timePeriod}</td>
                  </tr>
                )}
                {additionalInfo.notes && (
                  <tr>
                    <td className="text-gray-700 font-semibold py-2 px-3 align-top w-32 border-r border-gray-300 bg-gray-50">
                      Notes
                    </td>
                    <td className="text-gray-900 py-2 px-3">{additionalInfo.notes}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
