import React from 'react';
import { Typography, Button } from "@material-tailwind/react";
import { Material } from "../../../store/hooks/useStudentClass";

interface UnitMaterialsSectionProps {
  materials: Material[];
  onViewMaterial: (material: Material) => void;
}

const UnitMaterialsSection: React.FC<UnitMaterialsSectionProps> = ({
  materials,
  onViewMaterial
}) => {
  const truncateText = (text: string, maxLength: number = 30) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const extractFileName = (filePath: string) => {
    if (!filePath) return '';
    const parts = filePath.split('/');
    return parts[parts.length - 1] || parts[5] || filePath;
  };

  return (
    <div>
      <Typography variant="h6" className="mb-3 text-green-600 font-semibold" placeholder={undefined}>
        📚 已提供教材
      </Typography>
      {materials.length > 0 ? (
        <div className="space-y-2">
          {materials.map((material, idx) =>
            (material.content_url || material.content_file) && (
              <div key={idx} className="flex items-center justify-between p-2 bg-green-50 rounded">
                <div className="flex items-center gap-2">
                  <Button
                    variant="text"
                    size="sm"
                    className="w-4/10 text-blue-500 p-0.5 text-xs underline"
                    onClick={() => onViewMaterial(material)}
                    placeholder={undefined}
                  >
                    {material.content_url ? '查看連結' : '下載檔案'}
                  </Button>
                  <span className='w-72 text-sm whitespace-nowrap overflow-hidden truncate'>
                    {material.content_url ? truncateText(material.content_url) : extractFileName(material.content_file)}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="text-gray-400 text-sm">尚無教材</div>
      )}
    </div>
  );
};

export default UnitMaterialsSection;

