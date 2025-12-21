import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ChartArea, FileMinus, Presentation } from "lucide-react"

const agentsList = [
  {
    name: 'Generate Presentation',
    Icon: Presentation,
  },
  {
    name: 'Generate Report',
    Icon: FileMinus,
  },
  {
    name: 'Generate Chart',
    Icon: ChartArea
  }

]

const page = () => {
  return (
    <div className="p-8 pt-6">
      <Input placeholder="Search" className="max-w-sm" />
      <div className="grid grid-cols-3 gap-6 mt-6">
        {agentsList.map(({ name, Icon }) => (
          <div key={name} className="p-8 flex items-center space-x-4 bg-gray-100 rounded-lg cursor-pointer">
            <div>
              <Icon
                // onClick={() => handleSelectOption(type)}
                className={cn(
                  'size-6 flex-none cursor-pointer rounded-full border-2 border-gray-300 bg-white p-[3px] text-black',
                  // selectedOption === type && 'bg-black text-white',
                )}
              />
            </div>
            <div className="">{name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default page