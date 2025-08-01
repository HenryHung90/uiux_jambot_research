import React from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";

interface Unit {
  name: string;
  materials: string[];
  assignments: string[];
}

interface UnitMaterialAssignmentProps {
  units: Unit[];
}

const SemesterUnitsComponent = (props: UnitMaterialAssignmentProps) => {
  const {units} = props
  return (
    <div className="space-y-4 animate-fadeIn">
      {units.map((unit, index) => (
        <Card key={index} className="shadow-md" placeholder={undefined}>
          <CardBody placeholder={undefined}>
            <Typography variant="h5" className="mb-4 text-blue-700 border-b-2 border-blue-200 pb-2"
                        placeholder={undefined}>
              {unit.name}
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 教材區塊 */}
              <div>
                <Typography variant="h6" className="mb-3 text-green-600 font-semibold" placeholder={undefined}>
                  📚 已提供教材
                </Typography>
                {unit.materials.length > 0 ? (
                  <div className="space-y-2">
                    {unit.materials.map((material, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                        <span className="text-sm">{idx + 1}. {material}</span>
                        <Button variant="text" size="sm" className="text-blue-500 p-0.5 text-xs" placeholder={undefined}>
                          教材連結
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">尚無教材</div>
                )}
                <Button variant="text" size="sm" className="text-green-600 mt-2" placeholder={undefined}>
                  + 新增教材
                </Button>
              </div>

              {/* 作業區塊 */}
              <div>
                <Typography variant="h6" className="mb-3 text-orange-600 font-semibold" placeholder={undefined}>
                  📝 單元作業
                </Typography>
                {unit.assignments.length > 0 ? (
                  <div className="space-y-2">
                    {unit.assignments.map((assignment, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                        <span className="text-sm">{idx + 1}. {assignment}</span>
                        <Button variant="text" size="sm" className="text-blue-500 p-0.5 text-xs" placeholder={undefined}>
                          作業內容
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">尚無作業</div>
                )}
                <Button variant="text" size="sm" className="text-orange-600 mt-2" placeholder={undefined}>
                  + 新增作業
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}

      {/* 新增單元按鈕 */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
            placeholder={undefined}>
        <CardBody className="text-center py-8" placeholder={undefined}>
          <Button variant="text" className="text-blue-500" placeholder={undefined}>
            + 新增單元
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default SemesterUnitsComponent;