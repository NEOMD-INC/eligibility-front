import { themeColors } from '@/theme'

import { Props } from './types/types'

export default function LimitationsCard({ coverageLevel, serviceLevelDates }: Props) {
  return (
    <div
      className="bg-white border rounded-lg shadow-sm overflow-hidden"
      style={{ borderColor: themeColors.border.default }}
    >
      <div
        className="px-6 py-3 border-b"
        style={{ backgroundColor: themeColors.gray[100], borderColor: themeColors.border.default }}
      >
        <h3 className="text-sm font-semibold" style={{ color: themeColors.text.secondary }}>
          Limitations
        </h3>
      </div>
      <div className="p-6">
        {coverageLevel && coverageLevel.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold mb-3" style={{ color: themeColors.text.secondary }}>
              Coverage Level
            </p>
            <ul className="space-y-2">
              {coverageLevel.map((level, index) => (
                <li key={index} className="text-sm" style={{ color: themeColors.gray[700] }}>
                  {level}
                </li>
              ))}
            </ul>
          </div>
        )}

        {serviceLevelDates && (
          <div>
            <p className="text-xs font-semibold mb-3" style={{ color: themeColors.text.secondary }}>
              Service level Dates
            </p>
            <table
              className="w-full text-xs border-collapse border"
              style={{ borderColor: themeColors.border.default }}
            >
              <tbody>
                {serviceLevelDates.addedDate && (
                  <tr className="border-b" style={{ borderColor: themeColors.border.default }}>
                    <td
                      className="font-semibold py-2 px-3 align-top w-32 border-r"
                      style={{
                        color: themeColors.gray[700],
                        borderColor: themeColors.border.default,
                        backgroundColor: themeColors.gray[50],
                      }}
                    >
                      Added Date
                    </td>
                    <td className="py-2 px-3" style={{ color: themeColors.text.primary }}>
                      {serviceLevelDates.addedDate}
                    </td>
                  </tr>
                )}
                {serviceLevelDates.admissionBegin && (
                  <tr className="border-b" style={{ borderColor: themeColors.border.default }}>
                    <td
                      className="font-semibold py-2 px-3 align-top w-32 border-r"
                      style={{
                        color: themeColors.gray[700],
                        borderColor: themeColors.border.default,
                        backgroundColor: themeColors.gray[50],
                      }}
                    >
                      Admission Begin
                    </td>
                    <td className="py-2 px-3" style={{ color: themeColors.text.primary }}>
                      {serviceLevelDates.admissionBegin}
                    </td>
                  </tr>
                )}
                {serviceLevelDates.serviceEndDate && (
                  <tr className="border-b" style={{ borderColor: themeColors.border.default }}>
                    <td
                      className="font-semibold py-2 px-3 align-top w-32 border-r"
                      style={{
                        color: themeColors.gray[700],
                        borderColor: themeColors.border.default,
                        backgroundColor: themeColors.gray[50],
                      }}
                    >
                      Service End Date
                    </td>
                    <td className="py-2 px-3" style={{ color: themeColors.text.primary }}>
                      {serviceLevelDates.serviceEndDate}
                    </td>
                  </tr>
                )}
                {serviceLevelDates.admissionEnd && (
                  <tr>
                    <td
                      className="font-semibold py-2 px-3 align-top w-32 border-r"
                      style={{
                        color: themeColors.gray[700],
                        borderColor: themeColors.border.default,
                        backgroundColor: themeColors.gray[50],
                      }}
                    >
                      Admission End
                    </td>
                    <td className="py-2 px-3" style={{ color: themeColors.text.primary }}>
                      {serviceLevelDates.admissionEnd}
                    </td>
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
