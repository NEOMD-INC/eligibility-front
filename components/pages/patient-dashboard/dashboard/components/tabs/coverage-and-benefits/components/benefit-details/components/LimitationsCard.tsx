type Props = {
  coverageLevel?: string[]
  serviceLevelDates?: {
    addedDate?: string
    admissionBegin?: string
    serviceEndDate?: string
    admissionEnd?: string
  }
}

export default function LimitationsCard({ coverageLevel, serviceLevelDates }: Props) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gray-100 px-6 py-3 border-b border-gray-300">
        <h3 className="text-sm font-semibold text-gray-800">Limitations</h3>
      </div>
      <div className="p-6">
        {coverageLevel && coverageLevel.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-800 mb-3">Coverage Level</p>
            <ul className="space-y-2">
              {coverageLevel.map((level, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {level}
                </li>
              ))}
            </ul>
          </div>
        )}

        {serviceLevelDates && (
          <div>
            <p className="text-xs font-semibold text-gray-800 mb-3">Service level Dates</p>
            <table className="w-full text-xs border-collapse border border-gray-300">
              <tbody>
                {serviceLevelDates.addedDate && (
                  <tr className="border-b border-gray-300">
                    <td className="text-gray-700 font-semibold py-2 px-3 align-top w-32 border-r border-gray-300 bg-gray-50">
                      Added Date
                    </td>
                    <td className="text-gray-900 py-2 px-3">{serviceLevelDates.addedDate}</td>
                  </tr>
                )}
                {serviceLevelDates.admissionBegin && (
                  <tr className="border-b border-gray-300">
                    <td className="text-gray-700 font-semibold py-2 px-3 align-top w-32 border-r border-gray-300 bg-gray-50">
                      Admission Begin
                    </td>
                    <td className="text-gray-900 py-2 px-3">{serviceLevelDates.admissionBegin}</td>
                  </tr>
                )}
                {serviceLevelDates.serviceEndDate && (
                  <tr className="border-b border-gray-300">
                    <td className="text-gray-700 font-semibold py-2 px-3 align-top w-32 border-r border-gray-300 bg-gray-50">
                      Service End Date
                    </td>
                    <td className="text-gray-900 py-2 px-3">{serviceLevelDates.serviceEndDate}</td>
                  </tr>
                )}
                {serviceLevelDates.admissionEnd && (
                  <tr>
                    <td className="text-gray-700 font-semibold py-2 px-3 align-top w-32 border-r border-gray-300 bg-gray-50">
                      Admission End
                    </td>
                    <td className="text-gray-900 py-2 px-3">{serviceLevelDates.admissionEnd}</td>
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
